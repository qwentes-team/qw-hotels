import {Component, Host, h, State, Event, EventEmitter, Prop} from '@stencil/core';
import {RoomLoaded$, RoomModel, RoomService, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-room-names',
  styleUrl: 'qw-room-names.css',
  shadow: false
})
export class QwRoomNames {
  @State() rooms: RoomModel[] = [];
  @State() filteredRooms: RoomModel[] = [];
  @Event() qwRoomNamesClick: EventEmitter<RoomModel>;
  @Prop() qwRoomNamesIds: string;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap(session => RoomService.getRooms(session.sessionId))).subscribe();
    RoomLoaded$.subscribe(rooms => {
      this.rooms = !this.qwRoomNamesIds ? rooms : this.getFilteredRooms(rooms);
    });
  }

  private getFilteredRooms(rooms) {
    const roomIdsToFilter = JSON.parse(this.qwRoomNamesIds);
    return rooms.filter(r => roomIdsToFilter.includes(r.roomId));
  }

  render() {
    return (
      <Host>{this.rooms.map(r => {
        return <div class="qw-room-names__name" onClick={() => this.qwRoomNamesClick.emit(r)}>{r.name}</div>
      })}</Host>
    );
  }
}
