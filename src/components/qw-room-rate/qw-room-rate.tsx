import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';
import {
  BasketHelper,
  BasketModel, BasketService, Language,
  Rate, RateHelper, RateInformation, RateQualifierType,
  RoomModel, RoomSummaryType,
  SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwCounterId} from '../../index';

export interface QwRoomRateAddedToBasketEmitter {
  basket: BasketModel;
}

export interface QwRoomRateCounterChangedEmitter {
  quantity: number;
  rateId: string;
}

@Component({
  tag: 'qw-room-rate',
  styleUrl: 'qw-room-rate.css',
  shadow: false,
})
export class QwRoomRate {
  @Prop() qwRoomRateRate: Rate;
  @Prop() qwRoomRateIsLoading: boolean;
  @Prop() qwRoomRateIsAddingToBasket: boolean;
  @Prop() qwRoomRateIsDisabled: boolean;
  @Prop() qwRoomRateShowConditions: boolean;
  @Prop() qwRoomRateDefaultToOne: boolean = false;
  @Prop() qwRoomRateRoomId: RoomModel['roomId'];
  @State() quantity: number = 0;
  @State() numberOfGuests: number = 0;
  @State() numberOfRooms: number = 0;
  @Event() qwRoomRateAddedToBasket: EventEmitter<QwRoomRateAddedToBasketEmitter>;
  @Event() qwRoomRateCounterChanged: EventEmitter<QwRoomRateCounterChangedEmitter>;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    this.quantity = event.detail.value;
    this.qwRoomRateCounterChanged.emit({quantity: this.quantity, rateId: this.qwRoomRateRate.rateId});
  }

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => {
        this.numberOfGuests = SessionHelper.getTotalGuests(session);
        return BasketService.getBasket(session);
      })
    ).subscribe(basket => this.numberOfRooms = BasketHelper.getNumberOfRooms(basket));
  }

  addToBasket = () => {
    this.qwRoomRateIsAddingToBasket = true;
    BasketService.setRoomInBasket({
      roomId: this.qwRoomRateRoomId,
      rateId: this.qwRoomRateRate.rateId,
      occupancyId: this.qwRoomRateRate.occupancy.occupancyId,
      quantity: this.qwRoomRateDefaultToOne ? 1 : this.quantity,
    }).subscribe((basket) => {
      this.qwRoomRateIsAddingToBasket = false;
      this.qwRoomRateAddedToBasket.emit({basket});
    });
  };

  public hasBreakfast(qualifier: RateInformation['qualifier']) {
    return qualifier.value === RateQualifierType.BreakfastIncluded;
  }

  public getRateSummary() {
    const summary = this.qwRoomRateRate.description.summary.find(summary => summary.value === RoomSummaryType.PlainText);
    return summary && summary.text;
  }

  private getMaxValue(currentValue = 0) {
    const numberOfRoomsStillAddable = (this.numberOfGuests - this.numberOfRooms) + currentValue;
    return Math.min(this.qwRoomRateRate.availableQuantity, numberOfRoomsStillAddable);
  }

  private isAddToCartDisabled() {
    if (this.notAddedWithDefaultToOne()) {
      return false;
    }

    return !this.quantity
      || this.quantity === this.qwRoomRateRate.selectedQuantity
      || this.qwRoomRateIsLoading;
  }

  private notAddedWithDefaultToOne() {
    return this.qwRoomRateDefaultToOne && this.qwRoomRateRate.selectedQuantity !== 1;
  }

  render() {
    return (
      <Host class={`
        ${this.qwRoomRateIsDisabled ? 'qw-room-rate__disabled' : ''}
        ${this.qwRoomRateIsLoading ? 'qw-room-rate__is-loading' : ''}
        ${this.qwRoomRateIsAddingToBasket ? 'qw-room-rate__is-adding-to-basket' : ''}
      `}>
        {this.qwRoomRateRate && <div class="qw-room-rate__title">
          <div class="qw-room-rate__title-name">{this.qwRoomRateRate.description.name}</div>
          <div class="qw-room-rate__occupancy">
            {Array.from(Array(this.qwRoomRateRate.occupancy.definition.value.personCount)).map(() => <span/>)}
          </div>
        </div>}
        {this.qwRoomRateRate && <div class="qw-room-rate__price">
          {this.qwRoomRateRate.price ? this.qwRoomRateRate.price.totalPrice.converted.text : '--'}
          <div class="qw-room-rate__taxes">
            {this.qwRoomRateRate.taxes && RateHelper.getTaxesMessageFormatted(this.qwRoomRateRate.taxes)}
          </div>
        </div>}

        {!this.qwRoomRateDefaultToOne && <div class="qw-room-rate__counter">
          <div class="qw-room-rate__counter-label">Number of rooms</div>
          {this.qwRoomRateRate && <qw-counter
            qwCounterId={QwCounterId.QwRoomRateCounter}
            qwCounterName={this.qwRoomRateRate.description.name}
            qwCounterValue={this.qwRoomRateRate.selectedQuantity || 0}
            qwCounterMaxValue={this.getMaxValue(this.qwRoomRateRate.selectedQuantity)}/>}
          <div class="qw-room-rate__counter-availability">
            {this.qwRoomRateRate.availableQuantity - (this.qwRoomRateRate.selectedQuantity || 0)} available
          </div>
        </div>}

        {this.qwRoomRateRate && <QwButton
          QwButtonClass="qw-button--primary qw-button--add-to-basket"
          QwButtonLabel={Language.getTranslation('addToCart')}
          QwButtonDisabled={this.isAddToCartDisabled()}
          QwButtonOnClick={() => this.addToBasket()}/>}

        {this.qwRoomRateRate && <div class="qw-room-rate__conditions">
          {this.qwRoomRateRate.taxes.onSite.amount.text && <li class="qw-room-rate--stay-tax">
            {RateHelper.getOnSiteTaxesMessageFormatted(this.qwRoomRateRate)}
          </li>}
          <li class={this.hasBreakfast(this.qwRoomRateRate.description.qualifier) ? 'qw-room-rate--has-breakfast' : 'qw-room-rate--has-not-breakfast'}>
            {this.qwRoomRateRate.description.qualifier.text}
          </li>
          <li class="qw-room-rate--cancel-condition-name">{RateHelper.getDefaultCancelConditionName(this.qwRoomRateRate)}</li>

          {this.getRateSummary() && <div class="qw-room-rate__other-conditions">
            <div
              class="qw-room-rate__conditions-trigger"
              onClick={() => this.qwRoomRateShowConditions = !this.qwRoomRateShowConditions}>
              {this.qwRoomRateShowConditions ? '-' : '+'} {Language.getTranslation('viewMore')}
            </div>

            {this.qwRoomRateShowConditions && <div class="qw-room-rate__conditions-content">
              {<li>{this.getRateSummary()}</li>}
            </div>}
          </div>}
        </div>}
      </Host>
    );
  }
}
