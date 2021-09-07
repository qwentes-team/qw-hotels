import {Component, Host, h, Prop, Listen, EventEmitter, Event, State, Watch} from '@stencil/core';
import { ExtraModel, Language, RoomModel } from '@qwentes/booking-state-manager';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';
import {QwButton} from '../../shared/qw-button/qw-button';
import {QwSelect} from '../../shared/qw-select/qw-select';

export interface QwExtraEmitter {
  quantity: number;
  extraId: ExtraModel['extraId'];
  roomId?: RoomModel['roomId'];
}

export interface QwExtraCounting {
  text: string;
  value: string;
}

export interface QwExtraTrackingDataEmitter {
  id: number,
  category: string,
  name: string,
  price: string,
  currency: string,
  quantity : string | number,
}


@Component({
  tag: 'qw-extra-card',
  styleUrl: 'qw-extra-card.css',
  shadow: false,
})
export class QwExtraCard {
  @Prop() qwExtraCardRoomId: RoomModel['roomId'];
  @Prop() qwExtraCardId: number;
  @Prop() qwExtraCardName: string;
  @Prop() qwExtraCardSummary: string;
  @Prop() qwExtraCardCover: string;
  @Prop() qwExtraCardType: string;
  @Prop() qwExtraCardCounting: QwExtraCounting;
  @Prop() qwExtraCardUnitPrice: string;
  @Prop() qwExtraCardUnitQuantity: number | string;
  @Prop() qwExtraCardQuantityOptions: any[];
  @Prop() qwExtraCardAvailability: number;
  @Prop() qwExtraCardSelectedQuantityValue: number = 0;
  @Prop() qwExtraCardCanAddMoreExtra: boolean;
  @Prop() qwExtraCardShowCounter: boolean;
  @Prop() qwExtraShowSummary: boolean;
  @Prop() qwExtraCardPriceCurrency: string;
  @Event() qwExtraCounterChanged: EventEmitter<QwExtraEmitter>;
  @Event() qwSingleExtraChanged: EventEmitter<QwExtraEmitter>;
  @Event() qwExtraDetails: EventEmitter<number>;
  @Event() qwQuantityExtraChanged: EventEmitter<QwExtraEmitter>;
  @Event() qwExtraAddedToBasket: EventEmitter<QwExtraTrackingDataEmitter>;
  @Event() qwExtraRemovedFromBasket: EventEmitter<QwExtraTrackingDataEmitter>;
  @State() isExtraInBasket: boolean = this.qwExtraCardCanAddMoreExtra;

  @Watch('qwExtraCardCanAddMoreExtra')
  updateIsExtraInBasket(newValue: boolean) {
    this.isExtraInBasket = newValue;
  }

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    const {value, name} = event.detail;
    this.qwExtraCounterChanged.emit({quantity: value, extraId: name as number, roomId: this.qwExtraCardRoomId});
  }

  private emitQwSingleExtraChanged(quantity, name, roomId?) {
    this.qwSingleExtraChanged.emit({
      quantity: this.qwExtraCardUnitQuantity > 0 ? quantity : this.qwExtraCardUnitQuantity,
      roomId: roomId,
      extraId: name as number,
    });
  }

  public onChangeSingleExtra(name: number, isInBasket: boolean, roomId: number) {
    console.log(roomId);
    const nextQuantity = isInBasket ? 0 : 1;
    this.emitQwSingleExtraChanged(nextQuantity, name, roomId);

    this.qwExtraRemovedFromBasket.emit({
      id: this.qwExtraCardId,
      category: 'Extra',
      name: this.qwExtraCardName,
      price: this.qwExtraCardUnitPrice,
      currency: this.qwExtraCardPriceCurrency,
      quantity : nextQuantity,
    })
  }


  private emitQwQuantitySelectExtraChanged(quantity, name, roomId?) {
    this.qwQuantityExtraChanged.emit({
      quantity: quantity,
      roomId: roomId,
      extraId: name as number,
    });
  }

  private onChangeExtraQuantitySelect(name, event, roomId?) {
    this.emitQwQuantitySelectExtraChanged(event?.target?.value, name, roomId);
  }

  private createQuantitySelectOptions(items) {
    return items?.map(i => <option selected={this.qwExtraCardSelectedQuantityValue === i.quantity.value}
                                   value={i.quantity.value}>{i.quantity.text}</option>);
  }

  public onClickExtra() {
    this.qwExtraShowSummary = !this.qwExtraShowSummary;
    this.qwExtraDetails.emit(this.qwExtraCardId);
  }

  public extraTrackingData(e) {
    const trackinData = {
      id: this.qwExtraCardId,
      category: 'Extra',
      name: this.qwExtraCardName,
      price: this.qwExtraCardUnitPrice,
      currency: this.qwExtraCardPriceCurrency,
      quantity : e?.target?.value,
    }

    e?.target?.value == 0 ? this.qwExtraRemovedFromBasket.emit(trackinData) : this.qwExtraAddedToBasket.emit(trackinData)

  }

  render() {
    return (
      <Host>
        <div class="qw-extra-card__image">
          <qw-image qwImageUrl={this.qwExtraCardCover} qwImageAlt={this.qwExtraCardName}/>
        </div>
        <div class="qw-extra-card__title">
          <h4>{this.qwExtraCardName}</h4>
          {this.qwExtraCardSummary !== '0' && <div class="qw-extra-card__summary">
            <div
              class="qw-extra-card__summary-trigger"
              onClick={() => this.onClickExtra()}>
              {this.qwExtraShowSummary ? '-' : '+'} {Language.getTranslation('viewMore')}
            </div>
            {this.qwExtraShowSummary && <div class="qw-extra-card__summary-content">
              {this.qwExtraCardSummary}
            </div>}
          </div>}
        </div>
        <div class="qw-extra-card__footer">
          <div class="qw-extra-card__price">
            <div class="qw-extra-card__price-label">{this.isExtraInBasket ? Language.getTranslation('total') : this.qwExtraCardCounting?.text}</div>
            <div class="qw-extra-card__price-content">{this.qwExtraCardUnitPrice}</div>
          </div>
          <div class="qw-extra-card__quantity">
            <div class="qw-extra-card__quantity-label">
              {Language.getTranslation('maximum')} {Language.getTranslation('quantity')} {this.qwExtraCardAvailability}
            </div>
            <div class="qw-extra-card__quantity-content">
              {/*<qw-counter
                qwCounterId={QwCounterId.QwExtraCardCounter}
                qwCounterValue={this.qwExtraCardSelectedQuantityValue}
                qwCounterQuantity={this.qwExtraCardUnitQuantity}
                qwCounterName={this.qwExtraCardId}
                qwCounterMaxValue={this.qwExtraCardAvailability}/>*/}
              {this.qwExtraCardQuantityOptions.length !== 0 && <QwSelect
                QwSelectName={'extraQuantity'}
                QwSelectOnChange={(e) => {this.onChangeExtraQuantitySelect(this.qwExtraCardId, e, this.qwExtraCardRoomId), this.extraTrackingData(e)}}>
                <option value="0">{Language.getTranslation('noThanks')}</option>
                {this.createQuantitySelectOptions(this.qwExtraCardQuantityOptions)}
              </QwSelect>}
              <div class="quantity-content__selected-quantity">
                {this.qwExtraCardQuantityOptions.length === 0 && <p>
                  {Language.getTranslation('quantity')} {this.qwExtraCardSelectedQuantityValue}
                </p>}
                {this.isExtraInBasket && <QwButton
                  QwButtonClass="qw-extra-card__add-btn"
                  QwButtonOnClick={() => this.onChangeSingleExtra(this.qwExtraCardId, this.isExtraInBasket, this.qwExtraCardRoomId)}
                  QwButtonLabel={this.isExtraInBasket ? Language.getTranslation('removeFromCart') : Language.getTranslation('addToCart')}/>}
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
