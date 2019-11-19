import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'qw-extra',
  styleUrl: 'qw-extra.css',
  shadow: false
})
export class QwExtra {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
