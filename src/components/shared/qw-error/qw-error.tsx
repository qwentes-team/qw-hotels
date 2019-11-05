import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'qw-error',
  styleUrl: 'qw-error.css',
  shadow: false
})
export class QwError {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
