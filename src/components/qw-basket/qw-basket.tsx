import {Component, Host, h, State} from '@stencil/core';
import {BasketHelper, BasketQuery, BasketService, MoneyPrice} from 'booking-state-manager';

@Component({
  tag: 'qw-basket',
  styleUrl: 'qw-basket.css',
  shadow: false
})
export class QwBasket {
  @State() totalPrice: MoneyPrice;

  public componentDidLoad() {
    BasketService.getBasket().subscribe();
    BasketQuery.select().subscribe(basket => {
      this.totalPrice = BasketHelper.getTotalOriginalPrice(basket);
    })
  }

  private deleteBasket() {
    BasketService.deleteBasket().subscribe();
  }

  public render() {
    return (
      <Host>
        <div>{this.totalPrice && this.totalPrice.text}</div>
        <button onClick={() => this.deleteBasket()}>Empty basket</button>
      </Host>
    );
  }
}
