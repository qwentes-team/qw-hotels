import {Component, Host, h, Prop, Listen, EventEmitter, Event, State} from '@stencil/core';
import {ExtraModel, Language} from '@qwentes/booking-state-manager';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';
import {QwCounterId} from '../../../index';
import {QwButton} from '../../shared/qw-button/qw-button';

export interface QwExtraEmitter {
  quantity: number;
  extraId: ExtraModel['extraId'];
}

export interface QwExtraCounting {
  text: string;
  value: string;
}

enum QwExtraCountingValue {
  person = 'Person',
  day = 'Day',
  personDay = 'PersonDay',
  booking = 'Booking',
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
  @Prop() qwExtraCardCounting: QwExtraCounting;
  @Prop() qwExtraCardUnitPrice: string;
  @Prop() qwExtraCardAvailability: number;
  @Prop() qwExtraCardSelectedQuantity: number;
  @Prop() qwExtraCardCanAddMoreExtra: boolean;
  @Event() qwExtraCounterChanged: EventEmitter<QwExtraEmitter>;
  @Event() qwSingleExtraChanged: EventEmitter<QwExtraEmitter>;
  @State() isExtraAdded: boolean = this.qwExtraCardCanAddMoreExtra;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    const {value, name} = event.detail;
    this.qwExtraCounterChanged.emit({quantity: value, extraId: name as number});
  }

  private showExtraCounter() {
    if (this.qwExtraCardCounting) {
      return this.qwExtraCardCounting.value === QwExtraCountingValue.person || this.qwExtraCardCounting.value === QwExtraCountingValue.personDay || this.qwExtraCardCounting.value === QwExtraCountingValue.day;
    }
    return false
  }

  private emitQwSingleExtraChanged(quantity, name) {
    this.qwSingleExtraChanged.emit({quantity, extraId: name as number});
  }

  public onChangeSingleExtra(name: number, isAdded: boolean) {
    this.isExtraAdded = isAdded;
    this.isExtraAdded
      ? this.emitQwSingleExtraChanged(1, name)
      : this.emitQwSingleExtraChanged(0, name);
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
            <div class="qw-extra-card__price-label">{this.qwExtraCardCounting?.text}</div>
            <div class="qw-extra-card__price-content">{this.qwExtraCardUnitPrice}</div>
          </div>
          <div class="qw-extra-card__quantity">
            <div class="qw-extra-card__quantity-label">
              {Language.getTranslation('maximum')} {Language.getTranslation('quantity')} {this.qwExtraCardAvailability}
            </div>
            <div class="qw-extra-card__quantity-content">
              {this.showExtraCounter() && <qw-counter
                qwCounterId={QwCounterId.QwExtraCardCounter}
                qwCounterValue={this.qwExtraCardSelectedQuantity}
                qwCounterName={this.qwExtraCardId}
                qwCounterMaxValue={this.qwExtraCardAvailability}/>}
              {!this.showExtraCounter() && <QwButton
                QwButtonClass="qw-extra-card__add-btn"
                QwButtonOnClick={() => this.onChangeSingleExtra(this.qwExtraCardId, !this.isExtraAdded)}
                QwButtonLabel={!this.isExtraAdded ? Language.getTranslation('addToCart') : Language.getTranslation('removeFromCart') }/>}
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
