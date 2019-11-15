import {Component, Host, h, State, Prop, Event, EventEmitter} from '@stencil/core';
import {QwChangeRoomEvent} from '../../index';
import {
  BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$,
  RateHelper, RoomBasketOccupancy, RoomHelper, RoomLoaded$, RoomModel, RoomService,
  SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {zip} from 'rxjs';
import {QwButton} from '../shared/qw-button/qw-button';

@Component({
  tag: 'qw-room-basket',
  styleUrl: 'qw-room-basket.css',
  shadow: false
})
export class QwRoomBasket {
  @Prop() qwRoomBasketShowDescription;
  @Prop() qwRoomBasketBackToRoomListMessage: string;
  @State() basket: BasketModel;
  @State() basketIsLoading: boolean;
  @State() rooms: {[roomId: string]: RoomModel} = {};
  @State() nights: number;
  @Event() qwRoomBasketBackToRoomList: EventEmitter<void>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.nights = SessionHelper.getNumberOfNights(session);

      if (Object.keys(this.rooms).length) {
        return BasketService.getBasket(session);
      }

      return zip(BasketService.getBasket(session), RoomService.getRooms(session.sessionId));
    })).subscribe();

    BasketWithPrice$.subscribe(basket => this.basket = basket);
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    RoomLoaded$.subscribe(res => this.rooms = res.reduce((acc, r) => ({...acc, [r.roomId]: r}), {}));
  }

  private dataAreLoaded() {
    return this.basket && Object.keys(this.rooms).length;
  }

  setRoomInBasket = (e: QwChangeRoomEvent) => {
    BasketService.setRoomInBasket({
      roomId: e.room.roomId,
      rateId: e.room.occupancies[0].rateId,
      occupancyId: e.room.occupancies[0].occupancyId,
      quantity: parseInt(e.quantity),
    }).subscribe();
  };

  backToRoomList = () => {
    this.qwRoomBasketBackToRoomList.emit();
  };

  private getTotalPrice(basketRoomOccupancy: RoomBasketOccupancy) {
    return RateHelper.multiplyMoney(basketRoomOccupancy.price.converted, basketRoomOccupancy.selectedQuantity)
  }

  private getTaxes(basketRoomOccupancy: RoomBasketOccupancy) {
    const tax = RateHelper.multiplyMoney(basketRoomOccupancy.taxes.excluded.amount, basketRoomOccupancy.selectedQuantity);
    const vat = basketRoomOccupancy.taxes.excluded.details[0].name;
    return `${tax} (${vat})`;
  }

  render() {
    return (
      <Host class={`${!this.dataAreLoaded() ? 'qw-room-basket--loading' : 'qw-room-basket--loaded'}`}>
        <div style={this.dataAreLoaded() && { 'display': 'none' }}>
          <slot name="qwRoomBasketLoading"/>
        </div>
        {this.dataAreLoaded() ?
        !this.basket.rooms.length
          ? <div class="qw-room-list-card__no-rooms">
            {this.qwRoomBasketBackToRoomListMessage || 'Your cart is empty.'}
            <QwButton QwButtonLabel="Back to room list" QwButtonOnClick={() => this.backToRoomList()}/>
            </div>
          : this.basket.rooms.map(basketRoom => {
            const currentRoom = this.rooms[basketRoom.roomId];
            return currentRoom && <qw-room-list-card
              class={`${this.basketIsLoading ? 'qw-room-list-card__disabled' : ''}`}
              qwRoomListCardId={basketRoom.roomId}
              qwRoomListCardTitle={currentRoom.name}
              qwRoomListCardSquareMeter={currentRoom.surfaceArea.text}
              qwRoomListCardGuests={RoomHelper.getDefaultOccupancy(currentRoom).definition.text}
              qwRoomListCardImage={RoomHelper.getCoverImage(currentRoom).url}
              qwRoomListCardIsLoadingBasket={this.basketIsLoading}
              qwRoomListCardShowDescription={false}
              qwRoomListCardNights={this.nights}
              qwRoomListCardShowPrices={false}
              qwRoomListCardShowPrice={false}
              qwRoomListCardPrice={this.getTotalPrice(basketRoom.occupancies[0])}
              qwRoomListCardTaxes={this.getTaxes(basketRoom.occupancies[0])}
              qwRoomListCardShowCta={false}
              qwRoomListCardShowPriceAndTaxes={true}
              qwRoomListCardBasketRoom={basketRoom}
              qwRoomListCardOnChangeRoom={(e) => this.setRoomInBasket(e)}/>
        }) : undefined}
      </Host>
    );
  }
}
