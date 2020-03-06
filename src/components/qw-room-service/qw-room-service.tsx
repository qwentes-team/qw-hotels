import {Component, Host, h, Prop, State} from '@stencil/core';
import {RoomLoaded$, RoomModel, RoomService, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-room-service',
  styleUrl: 'qw-room-service.css',
  shadow: false
})
export class QwRoomService {
  @Prop() qwRoomServiceRoomId: string;
  @Prop() qwRoomServiceForceRoomsCall: boolean = false;
  @State() room: RoomModel;

  public componentWillLoad() {
    if (this.qwRoomServiceForceRoomsCall) {
      SessionService.getSession().subscribe();
      SessionLoaded$
        .pipe(switchMap(session => RoomService.getRooms(session.sessionId)))
        .subscribe();
    }

    RoomLoaded$.subscribe(rooms => {
      this.room = rooms.find(r => r.roomId === parseInt(this.qwRoomServiceRoomId));
    });
  }

  render() {
    return (
      <Host>
        {this.room && this.room.services.map(service => {
          return <ul>
            <div class="qw-room-service__category">{service.category.text}</div>
            {service.amenities.map(amenity => {
              return <li class={`qw-room-service__service qw-room-service__service-${amenity.value}`}>{amenity.text}</li>
            })}
          </ul>
        })}
      </Host>
    );
  }
}
