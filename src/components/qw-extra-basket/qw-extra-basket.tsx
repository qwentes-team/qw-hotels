import {Component, Host, h, State, Listen, Prop} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel,
  BasketService,
  BasketWithPrice$, ExtraBasketModel, ExtraHelper, Language, RateHelper,
  SessionLoaded$,
  SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwExtraEmitter} from '../qw-extra/qw-extra-card/qw-extra-card';
import {QwRoomBasketType} from '../../index';

enum ExtraSummaryType {
  Html = 'Html',
  PlainText = 'PlainText',
}

@Component({
  tag: 'qw-extra-basket',
  styleUrl: 'qw-extra-basket.css',
  shadow: false,
})
export class QwExtraBasket {
  @Prop() qwExtraBasketHasImage: boolean = true;
  @Prop() qwExtraBasketType: QwRoomBasketType = QwRoomBasketType.Classic;
  @State() basket: BasketModel;
  @State() basketIsLoading: boolean;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => BasketService.getBasket(session)),
    ).subscribe();

    BasketWithPrice$.subscribe(basket => this.basket = basket);
    BasketIsLoading$.subscribe(loading => this.basketIsLoading = loading);
  }

  @Listen('qwExtraCounterChanged')
  public extraChanged(e: CustomEvent<QwExtraEmitter>) {
    BasketService.setExtraInBasket({
      quantity: e.detail.quantity,
      extraId: e.detail.extraId,
      roomId: e.detail.roomId
    }).subscribe();
  }

  @Listen('qwSingleExtraChanged')
  public singleExtraChanged(e: CustomEvent<QwExtraEmitter>) {
    BasketService.setExtraInBasket({
      quantity: e.detail.quantity,
      extraId: e.detail.extraId,
      roomId: e.detail.roomId
    }).subscribe();
  }

  private getSummaryType(summary, type) {
    return summary.find(s => s?.value === type);
  }
  private getSummaryExtra(extra) {
    const summary = extra.summary || extra.description.summary[0];
    if (this.getSummaryType( summary, ExtraSummaryType.Html)) {
      const htmlSummary = this.getSummaryType( summary, ExtraSummaryType.Html)?.text;
      return <div innerHTML={htmlSummary}></div>;
    } else {
      return this.getSummaryType( summary, ExtraSummaryType.PlainText)?.text
    }
  }

  public isBasketRoomExtraEmpty() {
    return this.basket?.rooms.every(r => !Object.values(r.extras).length);
  }

  render() {
    return (
      <Host class={`
        qw-extra-basket--${this.qwExtraBasketType}
        ${!this.basket ? 'qw-extra-basket--loading' : 'qw-extra-basket--loaded'}
      `}>
        {!!this.basket?.hotelExtras.length && this.basket.hotelExtras.map(basketExtra => {
              const price = basketExtra.price.converted.text
                ? RateHelper.multiplyMoney(basketExtra.price.converted, basketExtra.selectedQuantity.value)
                : basketExtra.gratuitousnessType.text;
              return <qw-extra-card
                class={this.basketIsLoading ? 'qw-extra-card--disabled' : ''}
                qwExtraCardId={basketExtra.extraId}
                qwExtraCardName={basketExtra?.selectedQuantity.value + ' ' +basketExtra.name}
                qwExtraCardSummary={basketExtra && this.getSummaryExtra(basketExtra)}
                qwExtraCardCounting={basketExtra?.countingType}
                qwExtraCardCover={this.qwExtraBasketHasImage ? ExtraHelper.getCoverImage(basketExtra).url : undefined}
                qwExtraCardUnitPrice={price}
                qwExtraCardUnitQuantity={basketExtra.selectedQuantity.value}
                qwExtraCardQuantityOptions={[]}
                qwExtraCardAvailability={basketExtra && basketExtra.availableQuantity}
                qwExtraCardCanAddMoreExtra={basketExtra?.selectedQuantity.value > 0}
                qwExtraCardShowCounter={false}
                qwExtraCardSelectedQuantityValue={basketExtra?.selectedQuantity.value || 0}/>;
            })}
        <div>
          {this.basket?.rooms.map(basketRoom => {
            const basketRoomExtras: ExtraBasketModel[] = Object.values(basketRoom.extras);
            return <div>
              {!!basketRoomExtras.length && <p class="qw-extra-basket__room">{basketRoom.name + ' ' + Language.getTranslation('extras')}</p>}
              {!!basketRoomExtras.length && basketRoomExtras.map(extra => {
                return <qw-extra-card
                  class={this.basketIsLoading ? 'qw-extra-card--disabled' : ''}
                  qwExtraCardId={extra.extraId}
                  qwExtraCardRoomId={basketRoom.roomId}
                  qwExtraCardName={extra?.selectedQuantity.value + ' ' + extra.name}
                  qwExtraCardCounting={extra?.countingType}
                  qwExtraCardCover={this.qwExtraBasketHasImage ? (extra as any).description.pictures[0].templates[0].url : undefined}
                  qwExtraCardUnitPrice={extra.price.converted.text}
                  qwExtraCardUnitQuantity={extra.selectedQuantity.value}
                  qwExtraCardQuantityOptions={[]}
                  qwExtraCardAvailability={extra && extra.availableQuantity}
                  qwExtraCardCanAddMoreExtra={extra?.selectedQuantity.value > 0}
                  qwExtraCardShowCounter={false}
                  qwExtraCardSelectedQuantityValue={extra?.selectedQuantity.value || 0}/>;
              })}
            </div>
          })}
        </div>
        {!this.basket?.hotelExtras.length && this.isBasketRoomExtraEmpty() &&
        <div class="qw-extra-basket__no-extra">{Language.getTranslation('noExtraInYourBasket')}</div>}
      </Host>
    );
  }
}
