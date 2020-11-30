import {Component, Host, h, State, Listen, Prop} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel,
  BasketService,
  BasketWithPrice$, ExtraHelper, Language, RateHelper,
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
    }).subscribe();
  }

  private getSummaryType(summary, type) {
    return summary.find(s => s.value === type);
  }
  private getSummaryExtra(extra) {
    const summary = extra.summary;
    if (this.getSummaryType( summary, ExtraSummaryType.Html)) {
      const htmlSummary = this.getSummaryType( summary, ExtraSummaryType.Html)?.text;
      return <div innerHTML={htmlSummary}></div>;
    } else {
      return this.getSummaryType( summary, ExtraSummaryType.PlainText)?.text
    }
  }

  render() {
    return (
      <Host class={`
        qw-extra-basket--${this.qwExtraBasketType}
        ${!this.basket ? 'qw-extra-basket--loading' : 'qw-extra-basket--loaded'}
      `}>
        {this.basket ?
          !this.basket.hotelExtras.length
            ? <div class="qw-extra-basket__no-extra">{Language.getTranslation('noExtraInYourBasket')}</div>
            : this.basket.hotelExtras.map(basketExtra => {
              const price = basketExtra.price.converted.text
                ? RateHelper.multiplyMoney(basketExtra.price.converted, basketExtra.selectedQuantity.value)
                : basketExtra.gratuitousnessType.text;
              return <qw-extra-card
                class={this.basketIsLoading ? 'qw-extra-card--disabled' : ''}
                qwExtraCardId={basketExtra.extraId}
                qwExtraCardName={basketExtra?.selectedQuantity.value + ' ' +basketExtra.name}
                qwExtraCardSummary={basketExtra && this.getSummaryExtra(basketExtra)}
                qwExtraCardCover={this.qwExtraBasketHasImage ? ExtraHelper.getCoverImage(basketExtra).url : undefined}
                qwExtraCardUnitPrice={price}
                qwExtraCardAvailability={basketExtra && basketExtra.availableQuantity}
                qwExtraCardSelectedQuantity={basketExtra?.selectedQuantity.value || 0}/>;
            }) : undefined}
      </Host>
    );
  }
}
