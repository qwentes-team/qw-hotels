import {Component, Host, h, Prop, Listen, EventEmitter, Event, State, Watch} from '@stencil/core';
import {ExtraModel, Language} from '@qwentes/booking-state-manager';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';
import {QwButton} from '../../shared/qw-button/qw-button';
import {QwSelect} from '../../shared/qw-select/qw-select';

export interface QwExtraEmitter {
  quantity: number;
  extraId: ExtraModel['extraId'];
}

export interface QwExtraCounting {
  text: string;
  value: string;
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
  @Prop() qwExtraCardType: string;
  @Prop() qwExtraCardCounting: QwExtraCounting;
  @Prop() qwExtraCardUnitPrice: string;
  @Prop() qwExtraCardUnitQuantity: number;
  @Prop() qwExtraCardQuantityOptions: any[];
  @Prop() qwExtraCardAvailability: number;
  @Prop() qwExtraCardSelectedQuantityValue: number = 0;
  @Prop() qwExtraCardCanAddMoreExtra: boolean;
  @Event() qwExtraCounterChanged: EventEmitter<QwExtraEmitter>;
  @Event() qwSingleExtraChanged: EventEmitter<QwExtraEmitter>;
  @Event() qwQuantityExtraChanged: EventEmitter<QwExtraEmitter>;
  @State() isExtraInBasket: boolean = this.qwExtraCardCanAddMoreExtra;

  @Watch('qwExtraCardCanAddMoreExtra')
  updateIsExtraInBasket(newValue: boolean) {
    this.isExtraInBasket = newValue;
  }

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    const {value, name} = event.detail;
    this.qwExtraCounterChanged.emit({quantity: value, extraId: name as number});
  }

  private emitQwSingleExtraChanged(quantity, name) {
    this.qwSingleExtraChanged.emit({
      quantity: this.qwExtraCardUnitQuantity > 0 ? quantity : this.qwExtraCardUnitQuantity,
      extraId: name as number,
    });
  }

  public onChangeSingleExtra(name: number, isInBasket: boolean) {
    const nextQuantity = isInBasket ? 0 : 1;
    this.emitQwSingleExtraChanged(nextQuantity, name);
  }

  private emitQwQuantitySelectExtraChanged(quantity, name) {
    this.qwQuantityExtraChanged.emit({
      quantity: quantity,
      extraId: name as number,
    });
  }

  private onChangeExtraQuantitySelect(name, event) {
    this.emitQwQuantitySelectExtraChanged(event?.target?.value, name);
  }

  private createQuantitySelectOptions(items) {
    return items?.map(i => <option selected={this.qwExtraCardSelectedQuantityValue === i.quantity.value}
                                   value={i.quantity.value}>{i.quantity.value}</option>);
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
              {/*<qw-counter
                qwCounterId={QwCounterId.QwExtraCardCounter}
                qwCounterValue={this.qwExtraCardSelectedQuantity}
                qwCounterQuantity={this.qwExtraCardUnitQuantity}
                qwCounterName={this.qwExtraCardId}
                qwCounterMaxValue={this.qwExtraCardAvailability}/>*/}
              {this.qwExtraCardQuantityOptions.length !== 0 && <QwSelect
                QwSelectName={'extraQuantity'}
                QwSelectOnChange={(e) => this.onChangeExtraQuantitySelect(this.qwExtraCardId, e)}>
                <option value="0">0</option>
                {this.createQuantitySelectOptions(this.qwExtraCardQuantityOptions)}
              </QwSelect>}
              <div class="quantity-content__selected-quantity">
                {this.qwExtraCardQuantityOptions.length === 0 && <p>{this.qwExtraCardSelectedQuantityValue}</p>}
                {this.isExtraInBasket && <QwButton
                  QwButtonClass="qw-extra-card__add-btn"
                  QwButtonOnClick={() => this.onChangeSingleExtra(this.qwExtraCardId, this.isExtraInBasket)}
                  QwButtonLabel={this.isExtraInBasket ? Language.getTranslation('removeFromCart') : Language.getTranslation('addToCart')}/>}
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
