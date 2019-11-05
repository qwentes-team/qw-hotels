import {Component, Host, h, State, Prop} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketQuery, BasketService,
  MoneyPrice, SessionLoaded$, SessionService,
} from 'booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-basket',
  styleUrl: 'qw-basket.css',
  shadow: false,
})
export class QwBasket {
  @Prop() qwBasketShowEmptyButton: boolean = false;
  @State() totalPrice: MoneyPrice;
  @State() isLoading: boolean;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap(BasketService.getBasket)).subscribe();

    BasketQuery.select().subscribe(basket => this.totalPrice = BasketHelper.getTotalOriginalPrice(basket));
    BasketIsLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  private deleteBasket() {
    BasketService.deleteBasket().subscribe();
  }

  public render() {
    return (
      <Host>
        <div class="qw-basket__price">
          <div class={this.isLoading && 'qw-basket__price__amount--disabled'}>
            {this.totalPrice && this.totalPrice.text}
          </div>
          {this.isLoading && <qw-loading qw-loading-size="18"/>}
        </div>
        {this.qwBasketShowEmptyButton && <QwButton QwButtonLabel="Empty basket" QwButtonOnClick={this.deleteBasket}/>}
      </Host>
    );
  }
}
