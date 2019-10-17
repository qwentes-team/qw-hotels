import {Component, Host, h, State} from '@stencil/core';
import {BasketHelper, BasketIsLoading$, BasketQuery, BasketService, MoneyPrice} from 'booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';

@Component({
  tag: 'qw-basket',
  styleUrl: 'qw-basket.css',
  shadow: false
})
export class QwBasket {
  @State() totalPrice: MoneyPrice;
  @State() isLoading: boolean;

  public componentDidLoad() {
    BasketService.getBasket().subscribe();
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
          {this.isLoading && <qw-loading qw-loading-size="18"></qw-loading>}
        </div>
        <QwButton QwButtonLabel="Empty basket" QwButtonOnClick={this.deleteBasket} />
      </Host>
    );
  }
}
