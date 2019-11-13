import {Component, Host, h, State} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel, BasketQuery, BasketService,
  RateHelper, RateModel, RateService, RoomLoaded$, RoomModel, RoomService,
  SessionHelper, SessionLoaded$, SessionModel, SessionService,
} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwSelect} from '../shared/qw-select/qw-select';
import {zip} from 'rxjs';
import {QwChangeRoomEvent} from '../../index';
import {QwButton} from '../shared/qw-button/qw-button';

@Component({
  tag: 'qw-basket-summary',
  styleUrl: 'qw-basket-summary.css',
  shadow: false,
})
export class QwBasketSummary {
  @State() basket: BasketModel;
  @State() session: SessionModel;
  @State() rooms: {[roomId: string]: RoomModel} = {};
  @State() rates: {[rateId: string]: RateModel} = {};
  @State() basketIsLoading: boolean;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.session = session;

      if (Object.keys(this.rooms).length) {
        return BasketService.getBasket(session);
      }

      this.getRates(session.sessionId);
      return zip(BasketService.getBasket(session), RoomService.getRooms(session.sessionId));
    })).subscribe();

    BasketQuery.select().subscribe(basket => this.basket = basket);
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    RoomLoaded$.subscribe(res => this.rooms = res.reduce((acc, r) => ({...acc, [r.roomId]: r}), {}));
  }

  private getRates(sessionId: SessionModel['sessionId']) {
    RateService.getRates(sessionId).subscribe(res => {
      this.rates = res.reduce((acc, r) => ({...acc, [r.rateId]: r}), {});
    });
  }

  setRoomInBasket = (e: QwChangeRoomEvent) => {
    BasketService.setRoomInBasket({
      roomId: e.room.roomId,
      rateId: e.room.occupancies[0].rateId,
      occupancyId: e.room.occupancies[0].occupancyId,
      quantity: parseInt(e.quantity),
    }).subscribe();
  };

  public getRateName(rateId) {
    const rateIdPart = RateHelper.getIdPartOfRateId(rateId);
    return this.rates[rateIdPart] && this.rates[rateIdPart].name;
  }

  public getRoomType(roomId) {
    return this.rooms[roomId] && this.rooms[roomId].type.text;
  }

  render() {
    return (
      <Host>
        <div class="qw-basket-summary__rooms">
          <div class="qw-basket-summary__room qw-basket-summary__room-header">
            <div class="qw-basket-summary__room-date">Dates</div>
            <div class="qw-basket-summary__room-name">Type of room</div>
            <div class="qw-basket-summary__room-rate">Rate</div>
            <div class="qw-basket-summary__room-night">Nights</div>
            <div class="qw-basket-summary__room-quantity">Room qty.</div>
            <div class="qw-basket-summary__room-price">Subtotal</div>
            <div class="qw-basket-summary__room-delete"></div>
          </div>

          {this.basket && this.basket.rooms.map(basketRoom => {
            return (
              <div class="qw-basket-summary__room">
                <div class="qw-basket-summary__room-date">{SessionHelper.formatStayPeriod(this.session)}</div>
                <div class="qw-basket-summary__room-name">
                  <div class="qw-basket-summary__room-title">{basketRoom.name}</div>
                  <div class="qw-basket-summary__room-guests">{this.getRoomType(basketRoom.roomId)}</div>
                </div>
                <div class="qw-basket-summary__room-rate">{this.getRateName(basketRoom.occupancies[0].rateId)}</div>
                <div class="qw-basket-summary__room-night">{SessionHelper.getNumberOfNights(this.session)}</div>
                <div class="qw-basket-summary__room-quantity">{
                  <QwSelect
                    QwSelectDisabled={this.basketIsLoading}
                    QwSelectOnChange={(e) => this.setRoomInBasket({quantity: e.target.value, room: basketRoom})}>
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
                <div class="qw-basket-summary__room-price">
                  {RateHelper.multiplyMoney(basketRoom.occupancies[0].price.converted, basketRoom.occupancies[0].selectedQuantity)}
                </div>
                <div class="qw-basket-summary__room-delete">
                  <QwButton QwButtonLabel="" QwButtonOnClick={() => this.setRoomInBasket({quantity: '0', room: basketRoom})}/>
                </div>
              </div>
            );
          })
          }
        </div>
      </Host>
    );
  }

}
