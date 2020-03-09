import {Component, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {RoomLoaded$, RoomModel, RoomService, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-room-names',
  styleUrl: 'qw-room-names.css',
  shadow: false
})
export class QwRoomNames {
  @State() rooms: RoomModel[] = [];
  @Event() qwRoomNamesClick: EventEmitter<RoomModel>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap(session => RoomService.getRooms(session.sessionId))).subscribe();
    RoomLoaded$.subscribe(rooms => this.rooms = rooms);
  }

  render() {
    return (
      <Host>{this.rooms.map(r => {
        return <div class="qw-room-names__name" onClick={() => this.qwRoomNamesClick.emit(r)}>{r.name}</div>
      })}</Host>
    );
  }
}
