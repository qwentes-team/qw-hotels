import {Component, Host, h, Prop, EventEmitter, Event, State, Listen} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';

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
  @Prop() qwRoomRateRate: any; // Rate
  @Prop() qwRoomRateName: string;
  @Prop() qwRoomRateIsLoading: boolean;
  @State() quantity: number = 0;
  @Event() qwRoomRateAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    this.quantity = event.detail.value;
  }

  addToBasket = () => {
    this.qwRoomRateAddToBasket.emit({quantity: this.quantity, rateId: this.qwRoomRateRate.rateId});
  };

  render() {
    return (
      <Host>
        <div class="qw-room-rate__title">
          <div class="qw-room-rate__title-name">{this.qwRoomRateName}</div>
          <div class="qw-room-rate__availability">{this.qwRoomRateRate.availableQuantity} available</div>
        </div>
        <div class="qw-room-rate__price">
          {this.qwRoomRateRate.price.totalPrice ? this.qwRoomRateRate.price.totalPrice.converted.text : this.qwRoomRateRate.price.converted.text}
        </div>

        <qw-counter
          qwCounterName={this.qwRoomRateName}
          qwCounterValue={this.qwRoomRateRate.selectedQuantity || 0}
          qwCounterMaxValue={this.qwRoomRateRate.availableQuantity}/>

        <QwButton
          QwButtonLabel="Add to cart"
          QwButtonDisabled={!this.quantity || this.qwRoomRateIsLoading}
          QwButtonOnClick={() => this.addToBasket()}/>
      </Host>
    );
  }
}
