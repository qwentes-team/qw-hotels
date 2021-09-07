import { Component, Host, h, State, Listen, Event, EventEmitter } from '@stencil/core';
import {
  BasketHelper,
  BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$, DateUtil, ExtraBasketModel, Language,
  RateHelper, RoomBasketOccupancy,
  SessionHelper, SessionIsLoading$, SessionLoaded$, SessionModel, SessionService,
} from '@qwentes/booking-state-manager';
import { switchMap } from 'rxjs/operators';
import {QwChangeExtraEvent, QwChangeRoomEvent, QwCounterId} from '../../index';
import { QwButton } from '../shared/qw-button/qw-button';
import { QwCounterEmitter } from '../shared/qw-counter/qw-counter';

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
  @Event() qwBasketChange: EventEmitter<{basket: BasketModel, element: any, type: string}>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.session = session;
      return BasketService.getBasket(session);
    })).subscribe();

    BasketWithPrice$.subscribe(basket => {
      this.basket = basket;
    });

    SessionIsLoading$.subscribe(isLoading => this.sessionIsLoading = isLoading);
    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);

    this.insurance = this.getInsuranceFromLocalStorage();

    window.addEventListener('changeInsuranceAcceptance', (event: CustomEvent) => {
      this.insurance = event.detail.insurance;
      this.insuranceAmount = event.detail.amount;
    });
  }

  private getInsuranceFromLocalStorage() {
    return JSON.parse(localStorage.getItem('insurance')) || undefined;
  }

  public isLoading() {
    return this.sessionIsLoading || this.basketIsLoading;
  }

  private getTotalPrice(basketRoomOccupancy: RoomBasketOccupancy) {
    return RateHelper.multiplyMoney(basketRoomOccupancy.price.converted, basketRoomOccupancy.selectedQuantity);
  }

  setRoomInBasket = (e: QwChangeRoomEvent) => {
    const occId = BasketHelper.getFirstOccupancyIdInBasketRoom(e.room);
    const {rateId, occupancyId} = e.room.occupancies[occId];
    let element = e;
    let type = 'Room';

    BasketService.setRoomInBasket({
      quantity: parseInt(e.quantity),
      roomId: e.room.roomId,
      rateId,
      occupancyId,
    }).subscribe((basket) => {
      this.qwBasketChange.emit({basket, element, type})
    });
  };

  setExtraInBasket = (e: QwChangeExtraEvent) => {
    let element = e;
    let type = 'Extra';
    BasketService.setExtraInBasket({
      extraId: e.extraId,
      quantity: parseInt(e.quantity),
      roomId: e.roomId
    }).subscribe((basket) => {
      this.qwBasketChange.emit({basket, element, type})
    });
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

  public removeTimeFromDateUTC(date: string) {
    if (date) {
      const dateElements = date.split('-');
      const year = parseInt(dateElements[0]);
      const month = parseInt(dateElements[1])-1;
      const day = parseInt(dateElements[2]);
      const utcDate = Date.UTC(year, month, day, 0,0,0,0);

      return new Date(utcDate);
    }
  };




  // TODO: to move in booking-state-manager

  formatArrivalDate(session: SessionModel) {
    const stayPeriod = session.context.stayPeriod;
    const language = session.display.culture;
    const arrivalDate = this.removeTimeFromDateUTC(stayPeriod.arrivalDate);
    return DateUtil.formatCalendarDate(arrivalDate, language);
  };

  formatDepartureDate(session: SessionModel) {
    const stayPeriod = session.context.stayPeriod;
    const language = session.display.culture;
    const departureDate = this.removeTimeFromDateUTC(stayPeriod.departureDate);
    return DateUtil.formatCalendarDate(departureDate, language);
  };

  formatStayPeriod(session: SessionModel) {
    return `${this.formatArrivalDate(session)} - ${this.formatDepartureDate(session)}`;
  };


  // END: to move in booking-state-manager

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
            const basketRoomExtras: ExtraBasketModel[] = Object.values(basketRoom.extras);

            return (
              <div class="qw-basket-summary__room--wrapper">
                <div class="qw-basket-summary__room">
                  <div class="qw-basket-summary__room-date">{this.formatStayPeriod(this.session)}</div>
                  <div class="qw-basket-summary__room-name">
                    <div class="qw-basket-summary__room-title">{basketRoom.name}</div>
                    <div class="qw-basket-summary__room-guests">{basketRoom.type}</div>
                  </div>
                  <div class="qw-basket-summary__room-rate">
                    <div class="qw-basket-summary__room-rate-name">{rateName}</div>
                    <div class="qw-basket-summary__room-rate-occupancy">{rateOccupancyText}</div>
                  </div>
                  <div class="qw-basket-summary__room-night">{SessionHelper.getNumberOfNights(this.session)}
                    <span>{Language.getTranslation('nights')}</span></div>
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
                {!!basketRoomExtras.length && <div class="qw-basket-summary__extras">
                  <p class="qw-basket-summary__section-title">{Language.getTranslation('extras')}</p>
                  {basketRoomExtras && basketRoomExtras.map(extra => {
                    return (
                      <div class="qw-basket-summary__room qw-basket-summary__extra">
                        <div class="qw-basket-summary__room-date">{this.formatStayPeriod(this.session)}</div>
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
                          <QwButton QwButtonLabel=""
                                    QwButtonOnClick={() => this.setExtraInBasket({quantity: '0', extraId: extra.extraId, roomId: basketRoom.roomId})}/>
                        </div>
                      </div>
                    );
                  })}
                </div>}
              </div>
            );
          })}
          {(!this.isLoading() && !this.basket?.rooms.length) ? Language.getTranslation('noRooms') : ''}
          {this.basket && this.basket.hotelExtras.map(extra => {
            return (
              <div class="qw-basket-summary__room qw-basket-summary__extra">
                <div class="qw-basket-summary__room-date">{this.formatStayPeriod(this.session)}</div>
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
            <div class="qw-basket-summary__room-date">{this.formatStayPeriod(this.session)}</div>
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
