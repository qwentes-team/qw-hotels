import {Component, Host, h, Prop} from '@stencil/core';
import {RoomDefaultLabel} from '@qwentes/booking-state-manager';

@Component({
  tag: 'qw-price',
  styleUrl: 'qw-price.css',
  shadow: false
})
export class QwPrice {
  @Prop() qwPriceMainPrice: string;
  @Prop() qwPriceCrossedPrice: string;
  @Prop() qwPriceCaption: string;

  render() {
    return (
      <Host>
        {(this.qwPriceCrossedPrice && this.qwPriceCrossedPrice !== RoomDefaultLabel.NoPrice) && <div class="qw-price__crossed-price">{this.qwPriceCrossedPrice}</div>}
        <div class="qw-price__main-price">{this.qwPriceMainPrice || <qw-loading qw-loading-size="22" />}</div>
        <div class="qw-price__caption">{this.qwPriceCaption}</div>
      </Host>
    );
  }

}
