import {Component, Host, h, Prop, Listen, EventEmitter, Event} from '@stencil/core';
import {ExtraModel, RoomImageMetadata} from '@qwentes/booking-state-manager';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';

export interface QwExtraEmitter {
  quantity: number;
  extraId: ExtraModel['extraId'];
}

@Component({
  tag: 'qw-extra-card',
  styleUrl: 'qw-extra-card.css',
  shadow: false,
})
export class QwExtraCard {
  @Prop() qwExtraCardId: number;
  @Prop() qwExtraCardName: string;
  @Prop() qwExtraCardCover: RoomImageMetadata;
  @Prop() qwExtraCardUnitPrice: string;
  @Prop() qwExtraCardAvailability: number;
  @Prop() qwExtraCardSelectedQuantity: number;
  @Event() qwExtraCounterChanged: EventEmitter<QwExtraEmitter>;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    const {value, name} = event.detail;
    this.qwExtraCounterChanged.emit({quantity: value, extraId: name as number});
  }

  render() {
    return (
      <Host>
        <div class="qw-extra-card__image">
          <img src={this.qwExtraCardCover.url} alt={this.qwExtraCardName}/>
        </div>
        <div class="qw-extra-card__title">
          <h4>{this.qwExtraCardName}</h4>
        </div>
        <div class="qw-extra-card__footer">
          <div class="qw-extra-card__price">
            <div class="qw-extra-card__price-label">Per person / day</div>
            <div class="qw-extra-card__price-content">{this.qwExtraCardUnitPrice}</div>
          </div>
          <div class="qw-extra-card__quantity">
            <div class="qw-extra-card__quantity-label">Quantity</div>
            <div class="qw-extra-card__quantity-content">
              <qw-counter
                qwCounterValue={this.qwExtraCardSelectedQuantity}
                qwCounterName={this.qwExtraCardId}
                qwCounterMaxValue={this.qwExtraCardAvailability}/>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}