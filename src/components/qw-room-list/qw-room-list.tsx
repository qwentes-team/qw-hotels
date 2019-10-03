import {Component, h, Host} from '@stencil/core';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false
})
export class QwRoomList {
  render() {
    return (
      <Host>
        <qw-room-card
          qw-room-card-title="Room Card"
          qw-room-card-caption="Room Caption"
          qw-room-card-guests="2 people"
          qw-room-card-beds="1 bed"
        />
      </Host>
    );
  }
}
