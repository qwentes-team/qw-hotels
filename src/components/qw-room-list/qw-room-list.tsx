import {Component, h, Host, State} from '@stencil/core';
import {RoomService, RoomModel} from 'booking-state-manager';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false
})
export class QwRoomList {
  @State() rooms: RoomModel[] = [];

  componentDidLoad() {
    RoomService.getRooms().subscribe(res => {
      this.rooms = res;
    })
  }

  render() {
    return (
      <Host>
        {this.rooms.map(r => {
          return <qw-room-card
            qw-room-card-title={r.name}
            qw-room-card-caption={r.getCheapestRateFormatted()}
            qw-room-card-guests={r.getDefaultOccupancy().definition.text}
            qw-room-card-beds={r.bedding.beds[0].count + ' ' + r.bedding.beds[0].type.text}
            qw-room-card-image={r.getCoverImage().url}
          />
        })}
      </Host>
    );
  }
}
