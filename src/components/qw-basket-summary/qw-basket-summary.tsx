import {Component, Host, h, State, Listen} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$,
  RateHelper, RoomBasketOccupancy,
  SessionHelper, SessionLoaded$, SessionModel, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwChangeRoomEvent} from '../../index';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';

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

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    const basketRoom = this.basket.rooms.find(r => r.roomId === event.detail.name);
    this.setRoomInBasket({quantity: event.detail.value.toString(), room: basketRoom});
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
                    qwCounterDisabled={this.basketIsLoading}
                    qwCounterValue={basketRoom.occupancies[0].selectedQuantity}
                    qwCounterName={basketRoom.roomId}
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
          })
          }
        </div>
      </Host>
    );
  }

}
