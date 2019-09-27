import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'qw-card',
  styleUrl: 'qw-card.css',
  shadow: false
})
export class QwCard {

  @Prop() cardTitle: string;

  render() {
    return (
      <div>
        <h3>{this.cardTitle}</h3>
        <slot></slot>
      </div>
    );
  }

}
