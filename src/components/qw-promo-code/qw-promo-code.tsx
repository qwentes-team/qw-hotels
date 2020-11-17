import {Component, Host, h, Prop} from '@stencil/core';

@Component({
  tag: 'qw-promo-code',
  styleUrl: 'qw-promo-code.css',
  shadow: false,
})
export class QwPromoCode {
  @Prop() qwPromoCodeLabel: string;

  public componentWillLoad() {
    console.log('test');
  }

  render() {
    return (
      <Host>
        <label>
          {this.qwPromoCodeLabel}
          <input type="text"/>
        </label>
      </Host>
    );
  }

}
