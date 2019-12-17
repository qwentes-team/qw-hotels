import {Component, Host, h, Prop, State, Listen, EventEmitter, Event} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$,
  BasketWithPrice$,
  createRateFromRoomBasketOccupancy, Rate, RoomBasketModel, RoomIsLoading$,
  RoomLoaded$, RoomModel,
  RoomService, SessionHelper, SessionIsLoading$,
  SessionLoaded$,
  SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';
import {QwRoomRateAddedToBasketEmitter} from '../qw-room-rate/qw-room-rate';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterId} from '../../index';

@Component({
  tag: 'qw-room-rate-list',
  styleUrl: 'qw-room-rate-list.css',
  shadow: false
})
export class QwRoomRateList {
  @Prop() qwRoomRateListId: string;
  @Prop() qwRoomRateListAddAnotherRoomButtonMessage: string;
  @Prop() qwRoomRateListProceedToCheckoutButtonMessage: string;
  @Prop() qwRoomRateListAlertMessage: string;
  @Prop() qwRoomRateListDefaultToOne: boolean = false;
  @Event() qwRoomRateListAddAnotherRoom: EventEmitter<void>;
  @Event() qwRoomRateListProceed: EventEmitter<void>;
  @State() activeRate: Rate['rateId'];
  @State() room: RoomModel;
  @State() roomRates: Rate[];
  @State() basketRoomRate: Rate;
  @State() basketIsLoading: boolean;
  @State() sessionIsLoading: boolean;
  @State() roomIsLoading: boolean;
  @State() numberOfGuests: number;
  @State() numberOfAccommodation: number;
  @State() maxNumberOfPeopleInRate: number;
  @State() mixNumberOfPeopleInRate: number;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$
      .pipe(switchMap(session => {
        this.numberOfGuests = SessionHelper.getTotalGuests(session);
        return RoomService.getRooms(session.sessionId)
      }))
      .subscribe();

    RoomLoaded$.pipe(
        switchMap(rooms => {
          this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomRateListId));
          const listOfNumberOfPeople = this.room.rates ? this.room.rates.map(r => r.occupancy.definition.value.personCount) : [];
          this.maxNumberOfPeopleInRate = Math.max(...listOfNumberOfPeople);
          this.mixNumberOfPeopleInRate = Math.min(...listOfNumberOfPeople);
          const initialValueForFilterRates = this.getInitNumberOfRateByPeople();
          this.roomRates = this.filterRoomRatesByPeopleCount(initialValueForFilterRates);
          return BasketWithPrice$;
        }),
      )
      .subscribe(basket => {
        const basketRoom = basket.rooms && this.getBasketRoom(basket.rooms);
        const occupancyId = basketRoom && BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
        this.basketRoomRate = basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[occupancyId]);
      });

    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.sessionIsLoading = isLoading);
    RoomIsLoading$.subscribe(isLoading => this.roomIsLoading = isLoading);
  }

  private getMaxNumberOfRateByPeople() {
    return this.numberOfGuests > this.maxNumberOfPeopleInRate ? this.numberOfGuests : this.maxNumberOfPeopleInRate
  }

  private getInitNumberOfRateByPeople() {
    return this.numberOfGuests > this.maxNumberOfPeopleInRate ? this.maxNumberOfPeopleInRate : this.numberOfGuests;
  }

  private filterRoomRatesByPeopleCount(peopleCount: number) {
    return this.room.rates
      ? this.room.rates.filter(r => r.occupancy.definition.value.personCount === peopleCount)
      : [];
  }

  private isRateDisabled(rateId) {
    if (!this.activeRate) {
      return false;
    }

    return this.activeRate !== rateId;
  }

  private getBasketRoom(rooms: RoomBasketModel[]) {
    return this.room && rooms.find(r => r.roomId === this.room.roomId);
  }

  private isLoadingData() {
    return !this.roomRates || this.basketIsLoading || this.sessionIsLoading || this.roomIsLoading;
  }

  private getRate(rate: Rate) {
    return <qw-room-rate
      qwRoomRateRoomId={parseInt(this.qwRoomRateListId)}
      qwRoomRateRate={rate}
      qwRoomRateDefaultToOne={this.qwRoomRateListDefaultToOne}
      qwRoomRateIsDisabled={this.isRateDisabled(rate.rateId)}
      qwRoomRateIsLoading={this.isLoadingData()}/>
  }

  @Listen('qwCounterChangeValue')
  public counterFilterRatesChanged(event: CustomEvent<QwCounterEmitter>) {
    if (event.detail.id === QwCounterId.QwRoomRateListCounter) {
      this.roomRates = this.filterRoomRatesByPeopleCount(event.detail.value);
    }
  }

  @Listen('qwRoomRateAddedToBasket')
  public qwRoomRateAddedToBasket(event: CustomEvent<QwRoomRateAddedToBasketEmitter>) {
    this.numberOfAccommodation = BasketHelper.getNumberOfAccommodation(event.detail.basket);
  }

  private showAlertForAccommodation() {
    return this.numberOfGuests > this.numberOfAccommodation;
  }

  onProceed = () => {
    this.qwRoomRateListProceed.emit();
  };

  onAddAnotherRoom = () => {
    this.qwRoomRateListAddAnotherRoom.emit();
  };

  render() {
    return (
      <Host class={`${!this.room ? 'qw-room-rate-list--loading' : 'qw-room-rate-list--loaded'}`}>
        <div style={this.room && { 'display': 'none' }}>
          <slot name="qwRoomRateListLoading"/>
        </div>
        <div class="qw-room-rate-list__wrapper">
          <div class="qw-room-rate-list__header">
            <span>Number of guests</span>
            <qw-counter
              qwCounterId={QwCounterId.QwRoomRateListCounter}
              qwCounterDisabled={this.isLoadingData() || !!this.basketRoomRate}
              qwCounterValue={this.numberOfGuests}
              qwCounterName={QwCounterId.QwRoomRateListCounter}
              qwCounterMaxValue={this.getMaxNumberOfRateByPeople()}
              qwCounterMinValue={this.mixNumberOfPeopleInRate}/>
          </div>
          {this.basketRoomRate
            ? this.getRate(this.basketRoomRate)
            : this.room && this.roomRates && this.roomRates.map(rate => rate && this.getRate(rate))
          }
        </div>
        <div class="qw-room-rate-list__alert">{this.numberOfAccommodation
          ? this.showAlertForAccommodation()
            ? <div class="qw-room-rate-list__alert-message">
              <QwButton
                QwButtonLabel={this.qwRoomRateListAddAnotherRoomButtonMessage || 'Add another room'}
                QwButtonOnClick={() => this.onAddAnotherRoom()}/>
              <div>{this.qwRoomRateListAlertMessage || 'No sufficent rooms for your guests'}</div>
            </div>
            : <QwButton
              QwButtonClass="qw-room-rate-list__alert-proceed"
              QwButtonLabel={this.qwRoomRateListProceedToCheckoutButtonMessage || 'Proceed to checkout'}
              QwButtonOnClick={() => this.onProceed()}/>
          : ''
        }</div>
      </Host>
    );
  }
}
