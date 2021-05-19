import {Component, Host, h, State, Listen} from '@stencil/core';
import {
  BasketIsLoading$, BasketModel, BasketService, BasketWithPrice$,
  ExtraHelper, ExtraIsLoading$, ExtraLoaded$, ExtraService, ExtraStructure, Language, SessionHasRooms$,
  SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {first, switchMap} from 'rxjs/operators';
import {QwExtraEmitter} from './qw-extra-card/qw-extra-card';
import {of, zip} from 'rxjs';

@Component({
  tag: 'qw-extra',
  styleUrl: 'qw-extra.css',
  shadow: false,
})
export class QwExtra {
  @State() extra: ExtraStructure;
  @State() basket: BasketModel;
  @State() basketIsLoading: boolean;
  @State() extraIsLoading: boolean;
  @State() canAddMoreExtra: boolean;

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
    }).pipe(first()).subscribe();
  }

  @Listen('qwSingleExtraChanged')
  public singleExtraChanged(e: CustomEvent<QwExtraEmitter>) {
    BasketService.setExtraInBasket({
      quantity: e.detail.quantity,
      extraId: e.detail.extraId,
      roomId: e.detail.roomId
    }).pipe(first()).subscribe();
  }

  @Listen('qwQuantityExtraChanged')
  public quantityExtraChanged(e: CustomEvent<QwExtraEmitter>) {
    BasketService.setExtraInBasket({
      quantity: e.detail.quantity,
      extraId: e.detail.extraId,
      roomId: e.detail.roomId
    }).pipe(first()).subscribe();
  }

  private isInitData() {
    return this.extra && !!this.extra.hotelExtras.length && this.basket;
  }

  private isLoadingData() {
    return this.basketIsLoading || this.extraIsLoading;
  }

  private getSummaryExtra(extra) {
    return extra.summary.length && <p innerHTML={extra.summary.find(s => s.text).text}></p>;
  }

  private getMaxAvailability(items) {
    return Math.max.apply(Math, items.map(i => i.quantity.value));
  }

  render() {
    return (
      <Host class={`${!this.extra ? 'qw-extra--loading' : 'qw-extra--loaded'}`}>
        <div style={this.extra && {'display': 'none'}}>
          <slot name="qwExtraLoading"/>
        </div>
        <div class="qw-extra__card-wrapper">
          {this.isInitData() && this.extra.hotelExtras.map(extra => {
            const basketExtra = this.basket.hotelExtras.find(basketEx => basketEx.extraId === extra.extraId);
            return <qw-extra-card
              class={this.isLoadingData() ? 'qw-extra-card--disabled' : ''}
              qwExtraCardId={extra.extraId}
              qwExtraCardName={extra.name}
              qwExtraCardSummary={this.getSummaryExtra(extra)}
              qwExtraCardCover={ExtraHelper.getCoverImage(extra).url}
              qwExtraCardCounting={extra.counting}
              qwExtraCardUnitQuantity={extra.items[0].quantity.value}
              qwExtraCardQuantityOptions={extra.items}
              qwExtraCardUnitPrice={extra.price.unitPrice.converted.text || extra.gratuitousnessType.text}
              qwExtraCardAvailability={this.getMaxAvailability(extra.items)}
              qwExtraCardCanAddMoreExtra={basketExtra?.selectedQuantity.value > 0}
              qwExtraCardShowCounter={false}
              qwExtraCardSelectedQuantityValue={basketExtra ? basketExtra.selectedQuantity.value : 0}/>;
          })}
        </div>
        {this.basket && this.basket.rooms.map(r => {
          return <div class="qw-extra__card-wrapper qw-extra__card-wrapper--room-extras">
            {this.extra?.roomExtras[r.roomId] && <h3 class="qw-extra__card-wrapper-title">{r.name} {Language.getTranslation('extras')}</h3>}
            {this.extra?.roomExtras[r.roomId] && <div class="qw-extra__card-content">
              {this.isInitData() && this.extra.roomExtras[r.roomId]?.map(e => {
                const extra = e;
                const basketExtra = r.extras[e.extraId];
                return <qw-extra-card
                  class={this.isLoadingData() ? 'qw-extra-card--disabled' : ''}
                  qwExtraCardRoomId={r.roomId}
                  qwExtraCardId={extra.extraId}
                  qwExtraCardName={extra.name}
                  qwExtraCardSummary={this.getSummaryExtra(extra)}
                  qwExtraCardCover={ExtraHelper.getCoverImage(extra).url}
                  qwExtraCardCounting={extra.counting}
                  qwExtraCardUnitQuantity={extra.items[0].quantity.value}
                  qwExtraCardQuantityOptions={extra.items}
                  qwExtraCardUnitPrice={extra.price.unitPrice.converted.text || extra.gratuitousnessType.text}
                  qwExtraCardAvailability={this.getMaxAvailability(extra.items)}
                  qwExtraCardCanAddMoreExtra={basketExtra?.selectedQuantity.value > 0}
                  qwExtraCardShowCounter={false}
                  qwExtraCardSelectedQuantityValue={basketExtra ? basketExtra.selectedQuantity.value : 0}
                />;
              })}
            </div>}
          </div>;
        })}
      </Host>
    );
  }
}
