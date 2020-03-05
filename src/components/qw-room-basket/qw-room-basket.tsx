import {Component, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {QwChangeRoomEvent} from '../../index';
import {
  BasketHelper, BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$, Language,
  RateHelper, RoomModel, SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';
import {zip} from 'rxjs/internal/observable/zip';
import {of} from 'rxjs/internal/observable/of';

@Component({
  tag: 'qw-room-basket',
  styleUrl: 'qw-room-basket.css',
  shadow: false
})
export class QwRoomBasket {
  @State() basket: BasketModel;
  @State() basketIsLoading: boolean;
  @State() rooms: {[roomId: string]: RoomModel} = {};
  @State() nights: number;
  @State() addableLeftover: number;
  @State() numberOfGuests: number = 0;
  @State() numberOfRooms: number = 0;
  @Event() qwRoomBasketBackToRoomList: EventEmitter<void>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => {
      this.nights = SessionHelper.getNumberOfNights(session);
      this.numberOfGuests = SessionHelper.getTotalGuests(session);
      this.addableLeftover = this.numberOfGuests - this.numberOfRooms;
      return zip(of(session), BasketWithPrice$);
    });

    BasketWithPrice$.subscribe(basket => {
      this.basket = basket;
      this.numberOfRooms = BasketHelper.getNumberOfRooms(basket);
      this.addableLeftover = this.numberOfGuests - this.numberOfRooms;
    });
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

  render() {
    return (
      <Host class={`${!this.basket ? 'qw-room-basket--loading' : 'qw-room-basket--loaded'}`}>
        <div style={this.basket && { 'display': 'none' }}>
          <slot name="qwRoomBasketLoading"/>
        </div>
        {this.basket ?
          !this.basket.rooms.length
            ? <div class="qw-room-basket__no-rooms">
              {Language.getTranslation('yourCartIsEmpty')}
              <QwButton
                QwButtonLabel={Language.getTranslation('backToRoomList')}
                QwButtonOnClick={() => this.backToRoomList()}/>
              </div>
            : this.basket.rooms.map(basketRoom => {
              const occupancyId = BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
              return <qw-room-list-card
                class={`${this.basketIsLoading ? 'qw-room-list-card__disabled' : ''}`}
                qwRoomListCardId={basketRoom.roomId}
                qwRoomListCardTitle={BasketHelper.getQuantityByBasketRoom(basketRoom) + ' ' + basketRoom.name}
                qwRoomListCardImage={BasketHelper.getRoomCoverImage(basketRoom).url}
                qwRoomListCardShowDescription={false}
                qwRoomListCardNights={this.nights}
                qwRoomListCardShowPrices={false}
                qwRoomListCardShowPrice={false}
                qwRoomListCardPrice={BasketHelper.getRoomTotalPrice(basketRoom)}
                qwRoomListCardTaxes={RateHelper.getTaxesMessageFormatted(basketRoom.occupancies[occupancyId].taxes)}
                qwRoomListCardShowCta={false}
                qwRoomListCardShowPriceAndTaxes={true}
                qwRoomListCardShowActions={true}
                qwRoomListCardBasketRoom={basketRoom}
                qwRoomListCardAddableLeftover={this.addableLeftover}
                qwRoomListCardOnChangeRoom={(e) => this.setRoomInBasket(e)}
                qwRoomListCardOnClickView={() => {}}/>
          }) : undefined}
      </Host>
    );
  }
}
