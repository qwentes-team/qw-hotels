import {Component, Host, h, Prop} from '@stencil/core';
import {QwRoomListType} from '../../../index';

@Component({
  tag: 'qw-placeholder',
  styleUrl: 'qw-placeholder.css',
  shadow: false
})
export class QwPlaceholder {
  @Prop() qwPlaceholderType: QwRoomListType = QwRoomListType.Inline;

  render() {
    return (
      <Host class={`qw-placeholder--${this.qwPlaceholderType}`}>
        <slot></slot>
      </Host>
    );
  }

}
