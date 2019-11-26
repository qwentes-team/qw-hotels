import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';
import {Rate, RateHelper, RateInformation, RateQualifierType, RoomMetadata} from '@qwentes/booking-state-manager';

export interface QwRoomRateAddToBasketEmitter {
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
  @Prop() qwRoomRateName: string;
  @Prop() qwRoomRateIsLoading: boolean;
  @Prop() qwRoomRateIsDisabled: boolean;
  @Prop() qwRoomRateQualifier: RoomMetadata<RateQualifierType>;
  @Prop() qwRoomRateSummary: string;
  @Prop() qwRoomRateShowConditions: boolean;
  @State() quantity: number = 0;
  @Event() qwRoomRateAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;
  @Event() qwRoomRateCounterChanged: EventEmitter<QwRoomRateAddToBasketEmitter>;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    this.quantity = event.detail.value;
    this.qwRoomRateCounterChanged.emit({quantity: this.quantity, rateId: this.qwRoomRateRate.rateId});
  }

  addToBasket = () => {
    this.qwRoomRateAddToBasket.emit({quantity: this.quantity, rateId: this.qwRoomRateRate.rateId});
  };

  public hasBreakfast(qualifier: RateInformation['qualifier']) {
    return qualifier.value === RateQualifierType.BreakfastIncluded;
  }

  render() {
    return (
      <Host class={this.qwRoomRateIsDisabled ? 'qw-room-rate__disabled' : ''}>
        <div class="qw-room-rate__title">
          <div class="qw-room-rate__title-name">{this.qwRoomRateName}</div>
          <div
            class="qw-room-rate__availability">{this.qwRoomRateRate.availableQuantity - (this.qwRoomRateRate.selectedQuantity || 0)} available
          </div>
          <div class="qw-room-rate__occupancy">{this.qwRoomRateRate.occupancy && this.qwRoomRateRate.occupancy.definition.text}</div>
        </div>
        <div class="qw-room-rate__price">
          {this.qwRoomRateRate.price.totalPrice.converted.text}
          <div class="qw-room-rate__taxes">
            {RateHelper.getTaxesMessageFormatted(this.qwRoomRateRate.taxes, 1)}
          </div>
        </div>

        <qw-counter
          qwCounterName={this.qwRoomRateName}
          qwCounterValue={this.qwRoomRateRate.selectedQuantity || 0}
          qwCounterMaxValue={this.qwRoomRateRate.availableQuantity}/>

        <QwButton
          QwButtonLabel="Add to cart"
          QwButtonDisabled={!this.quantity || this.quantity === this.qwRoomRateRate.selectedQuantity || this.qwRoomRateIsLoading}
          QwButtonOnClick={() => this.addToBasket()}/>

        <div class="qw-room-rate__conditions">
          {this.qwRoomRateRate.taxes.onSite.amount.text && <li class="qw-room-rate--stay-tax">
            {RateHelper.getOnSiteTaxesMessageFormatted(this.qwRoomRateRate)}
          </li>}
          <li class={this.hasBreakfast(this.qwRoomRateQualifier) ? 'qw-room-rate--has-breakfast' : 'qw-room-rate--has-not-breakfast'}>
            {this.qwRoomRateQualifier.text}
          </li>
          <li class="qw-room-rate--cancel-condition-name">{RateHelper.getDefaultCancelConditionName(this.qwRoomRateRate)}</li>

          {this.qwRoomRateSummary && <div class="qw-room-rate__other-conditions">
            <div
              class="qw-room-rate__conditions-trigger"
              onClick={() => this.qwRoomRateShowConditions = !this.qwRoomRateShowConditions}>
              {this.qwRoomRateShowConditions ? '-' : '+'} View more
            </div>

            {this.qwRoomRateShowConditions && <div class="qw-room-rate__conditions-content">
              {<li>{this.qwRoomRateSummary}</li>}
            </div>}
          </div>}
        </div>
      </Host>
    );
  }
}
