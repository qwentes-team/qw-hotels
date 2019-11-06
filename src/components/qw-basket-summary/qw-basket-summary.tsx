import {Component, Host, h, State} from '@stencil/core';
import {
  BasketIsLoading$,
  BasketModel,
  BasketQuery,
  BasketService, Rate, RoomLoaded$, RoomModel, RoomService, SessionHelper,
  SessionLoaded$, SessionModel,
  SessionService,
} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwSelect} from '../shared/qw-select/qw-select';
import {zip} from 'rxjs';

interface QwBasketSummaryChangeSelectEvent {
  quantity: string;
  rateId: Rate['rateId'];
  roomId: RoomModel['roomId'];
  occupancyId: number;
}

@Component({
  tag: 'qw-basket-summary',
  styleUrl: 'qw-basket-summary.css',
  shadow: false,
})
export class QwBasketSummary {
  @State() basket: BasketModel;
  @State() session: SessionModel;
  @State() rooms: {[roomId: string]: RoomModel} = {};
  @State() basketIsLoading: boolean;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.session = session;

      if (Object.keys(this.rooms).length) {
        return BasketService.getBasket(session);
      }
      return zip(BasketService.getBasket(session), RoomService.getRooms(session.sessionId));
    })).subscribe();

    BasketQuery.select().subscribe(basket => {
      this.basket = basket;
      console.log(this.basket);
    });
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    RoomLoaded$.subscribe(res => this.rooms = res.reduce((acc, r) => ({...acc, [r.roomId]: r}), {}));
  }

  changeSelect = (e: QwBasketSummaryChangeSelectEvent) => {
    console.log(e);
    BasketService.setRoomInBasket({
      roomId: e.roomId,
      rateId: e.rateId,
      occupancyId: e.occupancyId,
      quantity: parseInt(e.quantity),
    }).subscribe();
  };

  render() {
    return (
      <Host>
        <div class="qw-basket-summary__rooms">
          <div class="qw-basket-summary__room qw-basket-summary__room-header">
            <div>Dates</div>
            <div>Type of room</div>
            <div>Rate</div>
            <div>Nights</div>
            <div>Room qty.</div>
            <div>Subtotal</div>
          </div>

          {this.basket && this.basket.rooms.map(basketRoom => {
            return (
              <div class="qw-basket-summary__room">
                <div class="qw-basket-summary__room-date">{SessionHelper.formatStayPeriod(this.session)}</div>
                <div class="qw-basket-summary__room-name">
                  <div class="qw-basket-summary__room-title">{this.rooms[basketRoom.roomId] && this.rooms[basketRoom.roomId].name}</div>
                  <div
                    class="qw-basket-summary__room-guests">{this.rooms[basketRoom.roomId] && this.rooms[basketRoom.roomId].type.text}</div>
                </div>
                <div>Rate</div>
                <div>{SessionHelper.getNumberOfNights(this.session)}</div>
                <div>{
                  <QwSelect QwSelectDisabled={this.basketIsLoading} QwSelectOnChange={(e) => this.changeSelect({
                    quantity: e.target.value,
                    roomId: basketRoom.roomId,
                    rateId: basketRoom.occupancies[0].rateId,
                    occupancyId: basketRoom.occupancies[0].occupancyId,
                  })}>
                    {Array.from(Array(basketRoom.occupancies[0].availableQuantity).keys()).map(o => {
                      const value = o + 1;
                      return (
                        <option
                          value={value}
                          // @ts-ignore
                          selected={basketRoom.occupancies[0].selectedQuantity === value ? 'selected' : ''}>
                          {value}
                        </option>
                      );
                    })}
                  </QwSelect>
                }</div>
                <div>{basketRoom.occupancies[0].price.original.text}</div>
              </div>
            );
          })
          }
        </div>
      </Host>
    );
  }

}
