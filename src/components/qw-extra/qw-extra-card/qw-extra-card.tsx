import {Component, Host, h, Prop, Listen, EventEmitter, Event} from '@stencil/core';
import {ExtraModel, Language} from '@qwentes/booking-state-manager';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';
import {QwCounterId} from '../../../index';

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
  @Prop() qwExtraCardSummary: string;
  @Prop() qwExtraCardCover: string;
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
          <qw-image qwImageUrl={this.qwExtraCardCover} qwImageAlt={this.qwExtraCardName}/>
        </div>
        <div class="qw-extra-card__title">
          <h4>{this.qwExtraCardName}</h4>
          <span class="qw-extra-card__summary">{this.qwExtraCardSummary}</span>
        </div>
        <div class="qw-extra-card__footer">
          <div class="qw-extra-card__price">
            <div class="qw-extra-card__price-label">{Language.getTranslation('person')} / {Language.getTranslation('day')}</div>
            <div class="qw-extra-card__price-content">{this.qwExtraCardUnitPrice}</div>
          </div>
          <div class="qw-extra-card__quantity">
            <div class="qw-extra-card__quantity-label">{Language.getTranslation('quantity')}</div>
            <div class="qw-extra-card__quantity-content">
              <qw-counter
                qwCounterId={QwCounterId.QwExtraCardCounter}
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
