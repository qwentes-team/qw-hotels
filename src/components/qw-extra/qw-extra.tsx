import {Component, Host, h, State, Listen} from '@stencil/core';
import {
  BasketModel,
  BasketService, BasketWithPrice$,
  ExtraHelper,
  ExtraLoaded$,
  ExtraModel,
  ExtraService,
  SessionLoaded$,
  SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwExtraEmitter} from './qw-extra-card/qw-extra-card';
import {zip} from 'rxjs';

@Component({
  tag: 'qw-extra',
  styleUrl: 'qw-extra.css',
  shadow: false,
})
export class QwExtra {
  @State() extra: ExtraModel[];
  @State() basket: BasketModel;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => zip(ExtraService.getExtra(session.sessionId), BasketService.getBasket(session))),
    ).subscribe();

    ExtraLoaded$.subscribe(extra => this.extra = extra);
    BasketWithPrice$.subscribe(basket => {
      this.basket = basket;
      console.log(basket);
    });
    // todo fare loading
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
      <Host>
        <div style={this.extra && {'display': 'none'}}>
          <slot name="qwExtraLoading"/>
        </div>
        <div class="qw-extra__card-wrapper">
          {this.extra && !!this.extra.length && this.extra.map(extra => {
            return <qw-extra-card
              qwExtraCardId={extra.extraId}
              qwExtraCardName={extra.name}
              qwExtraCardCover={ExtraHelper.getCoverImage(extra)}
              qwExtraCardUnitPrice={extra.price.unitPrice.converted.text || extra.gratuitousnessType.text}
              qwExtraCardAvailability={extra.items.find(item => item.isDefault).quantity.value}/>
          })}
          <qw-extra-card
            qwExtraCardId={12345}
            qwExtraCardName="Champagne"
            qwExtraCardCover={{
              name: 'test',
              url: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/champagner-royalty-free-image-910994628-1545247117.jpg?crop=1xw:0.75019xh;center,top&resize=480:*'
            }}
            qwExtraCardUnitPrice="30 $"/>
        </div>
      </Host>
    );
  }
}
