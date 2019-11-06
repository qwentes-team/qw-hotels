import {Component, Host, h, Prop, EventEmitter, Event, State} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwSelect} from '../shared/qw-select/qw-select';
import {Rate} from 'booking-state-manager';

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
  @Prop() qwRoomRateName: String;
  @State() quantity: number = 0;
  @Event() qwRoomRateAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;

  changeSelect = (quantity: string) => {
    this.quantity = parseInt(quantity);
  };

  addToBasket = () => {
    this.qwRoomRateAddToBasket.emit({quantity: this.quantity, rateId: this.qwRoomRateRate.rateId});
  };

  render() {
    return (
      <Host>
        <div class="qw-room-rate__title">{this.qwRoomRateName}</div>
        <div class="qw-room-rate__price">{this.qwRoomRateRate.price.totalPrice.converted.text}</div>
        <QwSelect QwSelectLabel="Room qty." QwSelectOnChange={(e) => this.changeSelect(e.target.value)}>
          {Array.from(Array(this.qwRoomRateRate.availableQuantity + 1).keys()).map(o => {
            return <option value={o}>{o}</option>;
          })}
        </QwSelect>
        <QwButton
          QwButtonLabel="Add to cart"
          QwButtonDisabled={!this.quantity}
          QwButtonOnClick={() => this.addToBasket()}/>
      </Host>
    );
  }
}
