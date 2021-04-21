import {Component, Host, h, State, Listen, Event, EventEmitter} from '@stencil/core';
import {
  BasketHelper,
  BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$, Language,
  RateHelper, RoomBasketOccupancy,
  SessionHelper, SessionIsLoading$, SessionLoaded$, SessionModel, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwChangeExtraEvent, QwChangeRoomEvent, QwCounterId} from '../../index';
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
  @State() insurance: any;
  @State() insuranceAmount: number;
  @State() basketIsLoading: boolean;
  @State() sessionIsLoading: boolean;
  @Event() removeInsuranceAcceptance: EventEmitter<{insurance: any, amount: number}>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.session = session;
      return BasketService.getBasket(session);
    })).subscribe();

    BasketWithPrice$.subscribe(basket => this.basket = basket);
    SessionIsLoading$.subscribe(isLoading => this.sessionIsLoading = isLoading);
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);

    this.insurance = this.getInsuranceFromLocalStorage();

    window.addEventListener('changeInsuranceAcceptance', (event: CustomEvent) => {
      this.insurance = event.detail.insurance;
      this.insuranceAmount = event.detail.amount;
    })
  }

  private getInsuranceFromLocalStorage() {
    return JSON.parse(localStorage.getItem('insurance')) || undefined;
  }

  public isLoading() {
    return this.sessionIsLoading || this.basketIsLoading;
  }

  private getTotalPrice(basketRoomOccupancy: RoomBasketOccupancy) {
    return RateHelper.multiplyMoney(basketRoomOccupancy.price.converted, basketRoomOccupancy.selectedQuantity)
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

  setExtraInBasket = (e: QwChangeExtraEvent) => {
    BasketService.setExtraInBasket({
      extraId: e.extraId,
      quantity: parseInt(e.quantity),
    }).subscribe();
  };

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    const {name, value, id} = event.detail;

    if (id === QwCounterId.QwBasketSummaryBasketRoomsCounter) {
      const basketRoom = this.basket.rooms.find(r => r.roomId === name);
      this.setRoomInBasket({quantity: value.toString(), room: basketRoom});
    } else {
      this.setExtraInBasket({quantity: value.toString(), extraId: name as number});
    }
  }

  private getMaxValue(availableQuantity: number, selectedQuantity: number) {
    const numberOfGuests = SessionHelper.getTotalGuests(this.session);
    const numberOfRooms = BasketHelper.getNumberOfRooms(this.basket);
    const numberOfRoomsStillAddable = (numberOfGuests - numberOfRooms) + selectedQuantity;
    return Math.min(availableQuantity, numberOfRoomsStillAddable);
  }

  public removeInsuranceFromStorage() {
    localStorage.removeItem('insurance');
    localStorage.removeItem('insuranceAmount');
    this.removeInsuranceAcceptance.emit({insurance: undefined, amount: 0});
    this.insurance = undefined;
  }

  render() {
    return (
      <Host class={`${!this.basket?.rooms.length ? 'qw-basket-summary--no-rooms' : ''}`}>
        <div class="qw-basket-summary__rooms">
          <div class="qw-basket-summary__room qw-basket-summary__room-header">
            <div class="qw-basket-summary__room-date">{Language.getTranslation('dates')}</div>
            <div class="qw-basket-summary__room-name">
              {Language.getTranslation('typeOf')} {Language.getTranslation('room')} / {Language.getTranslation('service')}
            </div>
            <div class="qw-basket-summary__room-rate">{Language.getTranslation('rate')}</div>
            <div class="qw-basket-summary__room-night">{Language.getTranslation('nights')}</div>
            <div class="qw-basket-summary__room-quantity">{Language.getTranslation('roomQuantity')}</div>
            <div class="qw-basket-summary__room-price">{Language.getTranslation('subtotal')}</div>
            <div class="qw-basket-summary__room-delete"/>
          </div>

          {this.basket?.rooms.map(basketRoom => {
            const occupancyId = BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
            const basketOccupancy = basketRoom.occupancies[occupancyId];
            const rateName = occupancyId && basketOccupancy.rateInformation.name;
            const rateOccupancyText = occupancyId && basketOccupancy.definition.text;
            const selectedQuantity = occupancyId && basketOccupancy.selectedQuantity;
            const availableQuantity = occupancyId && basketOccupancy.availableQuantity;
            const maxValueForCounter = this.getMaxValue(availableQuantity, selectedQuantity);
            const taxes = occupancyId && basketOccupancy.taxes;
            return (
              <div class="qw-basket-summary__room">
                <div class="qw-basket-summary__room-date">{SessionHelper.formatStayPeriod(this.session)}</div>
                <div class="qw-basket-summary__room-name">
                  <div class="qw-basket-summary__room-title">{basketRoom.name}</div>
                  <div class="qw-basket-summary__room-guests">{basketRoom.type}</div>
                </div>
                <div class="qw-basket-summary__room-rate">
                  <div class="qw-basket-summary__room-rate-name">{rateName}</div>
                  <div class="qw-basket-summary__room-rate-occupancy">{rateOccupancyText}</div>
                </div>
                <div class="qw-basket-summary__room-night">{SessionHelper.getNumberOfNights(this.session)} <span>{Language.getTranslation('nights')}</span></div>
                <div class="qw-basket-summary__room-quantity">
                  <qw-counter
                    qwCounterId={QwCounterId.QwBasketSummaryBasketRoomsCounter}
                    qwCounterDisabled={this.basketIsLoading}
                    qwCounterValue={selectedQuantity}
                    qwCounterName={basketRoom.roomId}
                    qwCounterMaxValue={maxValueForCounter}/>
                </div>
                <div class="qw-basket-summary__room-price">
                  {this.getTotalPrice(basketOccupancy)}
                  <div class="qw-basket-summary__room-taxes">
                    {RateHelper.getTaxesMessageFormatted(taxes)}
                  </div>
                </div>
                <div class="qw-basket-summary__room-delete">
                  <QwButton QwButtonLabel="" QwButtonOnClick={() => this.setRoomInBasket({quantity: '0', room: basketRoom})}/>
                </div>
              </div>
            );
          })}
          {(!this.isLoading() && !this.basket?.rooms.length) ? Language.getTranslation('noRooms') : ''}
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
                  {extra.selectedQuantity.value}
                  {/*<qw-counter
                    qwCounterId={QwCounterId.QwBasketSummaryBasketExtrasCounter}
                    qwCounterDisabled={this.basketIsLoading}
                    qwCounterValue={extra.selectedQuantity.value}
                    qwCounterName={extra.extraId}
                    qwCounterMaxValue={extra.availableQuantity}/>*/}
                </div>
                <div class="qw-basket-summary__room-price">
                  {extra.price.converted.text
                      ? RateHelper.multiplyMoney(extra.price.converted, extra.selectedQuantity.value)
                      : extra.gratuitousnessType.text}
                </div>
                <div class="qw-basket-summary__room-delete">
                  <QwButton QwButtonLabel="" QwButtonOnClick={() => this.setExtraInBasket({quantity: '0', extraId: extra.extraId})}/>
                </div>
              </div>
            );
          })}
        </div>
        {this.session && this.insurance && this.insuranceAmount !== 0 && <div class="qw-basket-summary__insurance">
          <div class="qw-basket-summary__room">
            <div class="qw-basket-summary__room-date">{SessionHelper.formatStayPeriod(this.session)}</div>
            <div class="qw-basket-summary__room-name">
              <div class="qw-basket-summary__room-title">{this.insurance.name}</div>
            </div>
            <div class="qw-basket-summary__room-rate"/>
            <div class="qw-basket-summary__room-night">{SessionHelper.getNumberOfNights(this.session)}</div>
            <div class="qw-basket-summary__room-quantity">1</div>
            <div class="qw-basket-summary__room-price">
              {this.insurance.price.converted.text}
            </div>
            <div class="qw-basket-summary__room-delete">
              <QwButton QwButtonLabel="" QwButtonOnClick={() => this.removeInsuranceFromStorage()}/>
            </div>
          </div>
        </div>}
      </Host>
    );
  }
}
