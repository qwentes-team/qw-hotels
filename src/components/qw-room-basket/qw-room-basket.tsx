import {Component, Host, h, State, Prop, Event, EventEmitter} from '@stencil/core';
import {QwChangeRoomEvent} from '../../index';
import {
  BasketHelper, BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$,
  RateHelper, RoomBasketOccupancy, RoomModel,
  SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
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
      return BasketService.getBasket(session);
    })).subscribe();

    BasketWithPrice$.subscribe(basket => this.basket = basket);
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
  }

  setRoomInBasket = (e: QwChangeRoomEvent) => {
    const occId = BasketHelper.getFirstOccupancyIdInBasketRoom(e.room);
    const {rateId, occupancyId} = e.room.occupancies[occId];

    BasketService.setRoomInBasket({
      quantity: parseInt(e.quantity),
      roomId: e.room.roomId,
      rateId,
      occupancyId,
    }).subscribe();
  };

  backToRoomList = () => {
    this.qwRoomBasketBackToRoomList.emit();
  };

  private getTotalPrice(basketRoomOccupancy: RoomBasketOccupancy) {
    return RateHelper.multiplyMoney(basketRoomOccupancy.price.converted, basketRoomOccupancy.selectedQuantity)
  }

  render() {
    return (
      <Host class={`${!this.basket ? 'qw-room-basket--loading' : 'qw-room-basket--loaded'}`}>
        <div style={this.basket && { 'display': 'none' }}>
          <slot name="qwRoomBasketLoading"/>
        </div>
        {this.basket ?
          !this.basket.rooms.length
            ? <div class="qw-room-basket__no-rooms">
              {this.qwRoomBasketBackToRoomListMessage || 'Your cart is empty.'}
              <QwButton QwButtonLabel="Back to room list" QwButtonOnClick={() => this.backToRoomList()}/>
              </div>
            : this.basket.rooms.map(basketRoom => {
              const occupancyId = BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
              return <qw-room-list-card
                class={`${this.basketIsLoading ? 'qw-room-list-card__disabled' : ''}`}
                qwRoomListCardId={basketRoom.roomId}
                qwRoomListCardTitle={basketRoom.name}
                qwRoomListCardSquareMeter={basketRoom.surfaceArea.text}
                qwRoomListCardGuests={basketRoom.defaultOccupancy.definition.text}
                qwRoomListCardImage={BasketHelper.getRoomCoverImage(basketRoom).url}
                qwRoomListCardIsLoadingBasket={this.basketIsLoading}
                qwRoomListCardShowDescription={false}
                qwRoomListCardNights={this.nights}
                qwRoomListCardShowPrices={false}
                qwRoomListCardShowPrice={false}
                qwRoomListCardPrice={this.getTotalPrice(basketRoom.occupancies[occupancyId])}
                qwRoomListCardTaxes={RateHelper.getTaxesMessageFormatted(basketRoom.occupancies[occupancyId].taxes, basketRoom.occupancies[occupancyId].selectedQuantity)}
                qwRoomListCardShowCta={false}
                qwRoomListCardShowPriceAndTaxes={true}
                qwRoomListCardShowActions={true}
                qwRoomListCardBasketRoom={basketRoom}
                qwRoomListCardOnChangeRoom={(e) => this.setRoomInBasket(e)}/>
          }) : undefined}
      </Host>
    );
  }
}
