import {Component, h, Host} from '@stencil/core';

@Component({
  tag: 'qw-card',
  styleUrl: 'qw-card.css',
  shadow: false
})
export class QwCard {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
