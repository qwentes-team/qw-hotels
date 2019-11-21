import {Component, Host, h, Prop, EventEmitter, Event, State, Listen} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';
import {Rate, RateHelper} from '@qwentes/booking-state-manager';

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
  @Prop() qwRoomRateQualifier: string;
  @Prop() qwRoomRateSummary: string;
  @State() quantity: number = 0;
  @State() showConditions: boolean;
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

  render() {
    return (
      <Host class={this.qwRoomRateIsDisabled ? 'qw-room-rate__disabled' : ''}>
        <div class="qw-room-rate__title">
          <div class="qw-room-rate__title-name">{this.qwRoomRateName}</div>
          <div class="qw-room-rate__availability">{this.qwRoomRateRate.availableQuantity - (this.qwRoomRateRate.selectedQuantity || 0)} available</div>
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
            <div class="qw-room-rate__conditions-trigger" onClick={() => this.showConditions = !this.showConditions}>
              {this.showConditions ? '-' : '+'} Booking conditions
            </div>
            {this.showConditions && <div class="qw-room-rate__conditions-content">
              <li>City taxes not included.</li>
              <li>{this.qwRoomRateRate.taxes.onSite.amount.text && RateHelper.getOnSiteTaxesMessageFormatted(this.qwRoomRateRate)}</li>
              <li>{this.qwRoomRateQualifier}</li>
              {this.qwRoomRateSummary && <li>{this.qwRoomRateSummary}</li>}
              <li>{RateHelper.getDefaultCancelConditionName(this.qwRoomRateRate)}</li>
            </div>}
          </div>
      </Host>
    );
  }
}
