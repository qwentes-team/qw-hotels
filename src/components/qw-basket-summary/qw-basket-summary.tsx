import {Component, Host, h, State, Listen} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$,
  RateHelper, RoomBasketOccupancy,
  SessionHelper, SessionLoaded$, SessionModel, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwChangeExtraEvent, QwChangeRoomEvent} from '../../index';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';

enum QwCounterEventNameType {
  RoomId = 'roomId',
  ExtraId = 'extraId',
}

@Component({
  tag: 'qw-basket-summary',
  styleUrl: 'qw-basket-summary.css',
  shadow: false,
})
export class QwBasketSummary {
  @State() basket: BasketModel;
  @State() session: SessionModel;
  @State() basketIsLoading: boolean;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.session = session;
      return BasketService.getBasket(session);
    })).subscribe();

    BasketWithPrice$.subscribe(basket => this.basket = basket);
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
  }

  private getTotalPrice(basketRoomOccupancy: RoomBasketOccupancy) {
    return RateHelper.multiplyMoney(basketRoomOccupancy.price.converted, basketRoomOccupancy.selectedQuantity)
  }

  setRoomInBasket = (e: QwChangeRoomEvent) => {
    BasketService.setRoomInBasket({
      roomId: e.room.roomId,
      rateId: e.room.occupancies[0].rateId,
      occupancyId: e.room.occupancies[0].occupancyId,
      quantity: parseInt(e.quantity),
    }).subscribe();
  };

  setExtraInBasket = (e: QwChangeExtraEvent) => {
    BasketService.setExtraInBasket({
      extraId: e.extraId,
      quantity: parseInt(e.quantity),
    }).subscribe();
  };

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    const {name, value} = event.detail;
    const nameSplitted = (name as string).split(':');
    const type = nameSplitted[0];
    const id = parseInt(nameSplitted[1]);

    if (type === QwCounterEventNameType.RoomId) {
      const basketRoom = this.basket.rooms.find(r => r.roomId === id);
      this.setRoomInBasket({quantity: value.toString(), room: basketRoom});
    } else {
      this.setExtraInBasket({quantity: value.toString(), extraId: id});
    }
  }

  render() {
    return (
      <Host>
        <div class="qw-basket-summary__rooms">
          <div class="qw-basket-summary__room qw-basket-summary__room-header">
            <div class="qw-basket-summary__room-date">Dates</div>
            <div class="qw-basket-summary__room-name">Type of room/service</div>
            <div class="qw-basket-summary__room-rate">Rate</div>
            <div class="qw-basket-summary__room-night">Nights</div>
            <div class="qw-basket-summary__room-quantity">Room qty.</div>
            <div class="qw-basket-summary__room-price">Subtotal</div>
            <div class="qw-basket-summary__room-delete"/>
          </div>

          {this.basket && this.basket.rooms.map(basketRoom => {
            return (
              <div class="qw-basket-summary__room">
                <div class="qw-basket-summary__room-date">{SessionHelper.formatStayPeriod(this.session)}</div>
                <div class="qw-basket-summary__room-name">
                  <div class="qw-basket-summary__room-title">{basketRoom.name}</div>
                  <div class="qw-basket-summary__room-guests">{basketRoom.type}</div>
                </div>
                <div class="qw-basket-summary__room-rate">{basketRoom.occupancies[0].rateInformation.name}</div>
                <div class="qw-basket-summary__room-night">{SessionHelper.getNumberOfNights(this.session)}</div>
                <div class="qw-basket-summary__room-quantity">
                  <qw-counter
                    qwCounterId="qwBasketSummaryBasketRoomsCounter"
                    qwCounterDisabled={this.basketIsLoading}
                    qwCounterValue={basketRoom.occupancies[0].selectedQuantity}
                    qwCounterName={`roomId:${basketRoom.roomId}`}
                    qwCounterMaxValue={basketRoom.occupancies[0].availableQuantity}/>
                </div>
                <div class="qw-basket-summary__room-price">
                  {this.getTotalPrice(basketRoom.occupancies[0])}
                  <div class="qw-basket-summary__room-taxes">
                    {RateHelper.getTaxesMessageFormatted(basketRoom.occupancies[0].taxes, basketRoom.occupancies[0].selectedQuantity)}
                  </div>
                </div>
                <div class="qw-basket-summary__room-delete">
                  <QwButton QwButtonLabel="" QwButtonOnClick={() => this.setRoomInBasket({quantity: '0', room: basketRoom})}/>
                </div>
              </div>
            );
          })}
          {this.basket && this.basket.hotelExtras.map(extra => {
            return (
              <div class="qw-basket-summary__room qw-basket-summary__extra">
                <div class="qw-basket-summary__room-date">{SessionHelper.formatStayPeriod(this.session)}</div>
                <div class="qw-basket-summary__room-name">
                  <div class="qw-basket-summary__room-title">{extra.name}</div>
                </div>
                <div class="qw-basket-summary__room-rate"/>
                <div class="qw-basket-summary__room-night">{SessionHelper.getNumberOfNights(this.session)}</div>
                <div class="qw-basket-summary__room-quantity">
                  <qw-counter
                    qwCounterId="qwBasketSummaryBasketExtrasCounter"
                    qwCounterDisabled={this.basketIsLoading}
                    qwCounterValue={extra.selectedQuantity.value}
                    qwCounterName={`extraId:${extra.extraId}`}
                    qwCounterMaxValue={extra.availableQuantity}/>
                </div>
                <div class="qw-basket-summary__room-price">
                  {
                    extra.price.converted.text
                      ? RateHelper.multiplyMoney(extra.price.converted, extra.selectedQuantity.value)
                      : extra.gratuitousnessType.text
                  }
                </div>
                <div class="qw-basket-summary__room-delete">
                  <QwButton QwButtonLabel="" QwButtonOnClick={() => this.setExtraInBasket({quantity: '0', extraId: extra.extraId})}/>
                </div>
              </div>
            );
          })}
        </div>
      </Host>
    );
  }

}
