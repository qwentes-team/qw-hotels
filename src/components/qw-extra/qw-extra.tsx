import {Component, Host, h, State, Listen} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$,
  ExtraHelper, ExtraIsLoading$, ExtraLoaded$, ExtraModel, ExtraService, SessionHasRooms$,
  SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwExtraEmitter} from './qw-extra-card/qw-extra-card';
import {of, zip} from 'rxjs';

@Component({
  tag: 'qw-extra',
  styleUrl: 'qw-extra.css',
  shadow: false,
})
export class QwExtra {
  @State() extra: ExtraModel[];
  @State() basket: BasketModel;
  @State() basketIsLoading: boolean;
  @State() extraIsLoading: boolean;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => zip(
        of(session.sessionId),
        SessionHasRooms$,
        BasketService.getBasket(session),
      )),
      switchMap(([sessionId, hasRooms]) => hasRooms ? ExtraService.getExtra(sessionId) : of(null)),
    ).subscribe();

    ExtraLoaded$.subscribe(extra => this.extra = extra);
    BasketWithPrice$.subscribe(basket => this.basket = basket);
    BasketIsLoading$.subscribe(loading => this.basketIsLoading = loading);
    ExtraIsLoading$.subscribe(loading => this.extraIsLoading = loading);
  }

  @Listen('qwExtraCounterChanged')
  public extraChanged(e: CustomEvent<QwExtraEmitter>) {
    BasketService.setExtraInBasket({
      quantity: e.detail.quantity,
      extraId: e.detail.extraId,
    }).subscribe();
  }

  private isInitData() {
    return this.extra && !!this.extra.length && this.basket;
  }

  private isLoadingData() {
    return this.basketIsLoading || this.extraIsLoading;
  }

  render() {
    return (
      <Host class={`${!this.extra ? 'qw-extra--loading' : 'qw-extra--loaded'}`}>
        <div style={this.extra && {'display': 'none'}}>
          <slot name="qwExtraLoading"/>
        </div>
        <div class="qw-extra__card-wrapper">
          {this.isInitData() && this.extra.map(extra => {
            const basketExtra = this.basket.hotelExtras.find(basketEx => basketEx.extraId === extra.extraId);
            return <qw-extra-card
              class={this.isLoadingData() ? 'qw-extra-card--disabled' : ''}
              qwExtraCardId={extra.extraId}
              qwExtraCardName={extra.name}
              qwExtraCardCover={ExtraHelper.getCoverImage(extra)}
              qwExtraCardUnitPrice={extra.price.unitPrice.converted.text || extra.gratuitousnessType.text}
              qwExtraCardAvailability={basketExtra && basketExtra.availableQuantity}
              qwExtraCardSelectedQuantity={basketExtra ? basketExtra.selectedQuantity.value : 0}/>;
          })}
        </div>
      </Host>
    );
  }
}
