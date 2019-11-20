import {Component, Host, h, State, Listen} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel,
  BasketService,
  BasketWithPrice$, ExtraHelper, RateHelper,
  SessionLoaded$,
  SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwExtraEmitter} from '../qw-extra/qw-extra-card/qw-extra-card';

@Component({
  tag: 'qw-extra-basket',
  styleUrl: 'qw-extra-basket.css',
  shadow: false
})
export class QwExtraBasket {
  @State() basket: BasketModel;
  @State() basketIsLoading: boolean;

  public componentDidLoad() {
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
      extraId: e.detail.extraId
    }).subscribe();
  }

  render() {
    return (
      <Host class={`${!this.basket ? 'qw-extra-basket--loading' : 'qw-extra-basket--loaded'}`}>
        {this.basket && this.basket.hotelExtras.map(basketExtra => {
          const price = basketExtra.price.converted.text
            ? RateHelper.multiplyMoney(basketExtra.price.converted, basketExtra.selectedQuantity.value)
            : basketExtra.gratuitousnessType.text;
          return <qw-extra-card
            class={this.basketIsLoading ? 'qw-extra-card--disabled' : ''}
            qwExtraCardId={basketExtra.extraId}
            qwExtraCardName={basketExtra.name}
            qwExtraCardCover={ExtraHelper.getCoverImage(basketExtra)}
            qwExtraCardUnitPrice={price}
            qwExtraCardAvailability={basketExtra && basketExtra.availableQuantity}
            qwExtraCardSelectedQuantity={basketExtra ? basketExtra.selectedQuantity.value : 0}/>
        })}
      </Host>
    );
  }
}
