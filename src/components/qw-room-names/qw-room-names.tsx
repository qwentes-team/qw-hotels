import {Component, Host, h, State} from '@stencil/core';
import {RoomLoaded$, RoomService, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-room-names',
  styleUrl: 'qw-room-names.css',
  shadow: false
})
export class QwRoomNames {
  @State() roomNames: string[] = [];

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap(session => RoomService.getRooms(session.sessionId))).subscribe();
    RoomLoaded$.subscribe(rooms => this.roomNames = rooms.map(r => r.name));
  }

  render() {
    return (
      <Host>{this.roomNames.map(r => <div class="qw-room-names__name">{r}</div>)}</Host>
    );
  }
}
