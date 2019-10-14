import {Component, Host, h, State} from '@stencil/core';
import {BasketHelper, BasketQuery, BasketService, MoneyPrice} from 'booking-state-manager';

@Component({
  tag: 'qw-basket',
  styleUrl: 'qw-basket.css',
  shadow: false
})
export class QwBasket {
  @State() totalPrice: MoneyPrice;

  componentDidLoad() {
    BasketService.getBasket().subscribe();
    BasketQuery.select().subscribe(basket => {
      this.totalPrice = BasketHelper.getTotalOriginalPrice(basket);
    })
  }

  render() {
    return (
      <Host>
        <div>{this.totalPrice && this.totalPrice.text}</div>
      </Host>
    );
  }

}
