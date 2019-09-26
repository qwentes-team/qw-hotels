import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'qw-button',
  styleUrl: 'qw-button.css',
  shadow: true
})
export class QwButton {

  @Prop() label: string;

  render() {
    return <button>{this.label}</button>;
  }

}
