import {Component, h, Host} from '@stencil/core';

@Component({
  tag: 'qw-room-detail',
  styleUrl: 'qw-room-detail.css',
  shadow: false
})
export class QwRoomDetail {

  render() {
    return (
      <Host>
        Room Detail
      </Host>
    );
  }

}
