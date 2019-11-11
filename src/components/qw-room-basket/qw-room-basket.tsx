import {Component, Host, h, State} from '@stencil/core';
import {QwChangeRoomEvent} from '../../index';
import {
  BasketIsLoading$, BasketModel,
  BasketQuery,
  BasketService, RoomHelper,
  RoomLoaded$, RoomModel,
  RoomService, SessionHelper,
  SessionLoaded$,
  SessionService,
} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {zip} from 'rxjs';

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

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.nights = SessionHelper.getNumberOfNights(session);

      if (Object.keys(this.rooms).length) {
        return BasketService.getBasket(session);
      }

      return zip(BasketService.getBasket(session), RoomService.getRooms(session.sessionId));
    })).subscribe();

    BasketQuery.select().subscribe(basket => this.basket = basket);
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    RoomLoaded$.subscribe(res => this.rooms = res.reduce((acc, r) => ({...acc, [r.roomId]: r}), {}));
  }

  setRoomInBasket = (e: QwChangeRoomEvent) => {
    BasketService.setRoomInBasket({
      roomId: e.room.roomId,
      rateId: e.room.occupancies[0].rateId,
      occupancyId: e.room.occupancies[0].occupancyId,
      quantity: parseInt(e.quantity),
    }).subscribe();
  };

  render() {
    return (
      <Host>
        <div style={Object.keys(this.rooms).length && { 'display': 'none' }}>
          <slot name="qwRoomBasketLoading"/>
        </div>
        {this.basket && Object.keys(this.rooms) && this.basket.rooms.map(basketRoom => {
          const currentRoom = this.rooms[basketRoom.roomId];
          return currentRoom && <qw-room-list-card
              class={`${this.basketIsLoading ? 'qw-room-list-card__disabled' : ''}`}
              qwRoomListCardId={basketRoom.roomId}
              qwRoomListCardTitle={currentRoom.name}
              qwRoomListCardSquareMeter={currentRoom.surfaceArea.text}
              qwRoomListCardGuests={RoomHelper.getDefaultOccupancy(currentRoom).definition.text}
              qwRoomListCardImage={RoomHelper.getCoverImage(currentRoom).url}
              qwRoomListCardIsLoadingBasket={this.basketIsLoading}
              qwRoomListCardDescription={RoomHelper.getSummary(currentRoom).text}
              qwRoomListCardNights={this.nights}
              qwRoomListCardShowPrices={false}
              qwRoomListCardShowPrice={false}
              qwRoomListCardShowCta={false}
              qwRoomListCardBasketRoom={basketRoom}
              qwRoomListCardOnChangeRoom={(e) => this.setRoomInBasket(e)}/>
        })}
      </Host>
    );
  }

}
