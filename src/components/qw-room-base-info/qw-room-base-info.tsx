import {Component, Host, h, Prop, State} from '@stencil/core';
import {RoomHelper, RoomLoaded$, RoomModel, RoomService, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/internal/operators/switchMap';

@Component({
  tag: 'qw-room-base-info',
  styleUrl: 'qw-room-base-info.css',
  shadow: false,
})
export class QwRoomBaseInfo {
  @Prop() qwRoomBaseInfoIsStateFull: boolean = false;
  @Prop() qwRoomBaseInfoRoomId: string;
  @State() room: RoomModel;

  public componentDidLoad() {
    if (this.qwRoomBaseInfoIsStateFull) {
      SessionService.getSession().subscribe();
      SessionLoaded$
        .pipe(switchMap(session => RoomService.getRooms(session.sessionId)))
        .subscribe();
    }

    RoomLoaded$.subscribe(rooms => {
      this.room = rooms.find(r => r.roomId === parseInt(this.qwRoomBaseInfoRoomId));
    });
  }

  render() {
    return (
      <Host>
        {this.room && <ul>
          <li>{RoomHelper.getDefaultOccupancy(this.room).definition.text}</li>
          {this.room.surfaceArea.text && <li>{this.room.surfaceArea.text}</li>}
          <li>{RoomHelper.getRoomBedsFormatted(this.room)}</li>
        </ul>}
      </Host>
    );
  }
}
