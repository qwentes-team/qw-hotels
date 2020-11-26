import {Component, h, Host, Prop, State} from '@stencil/core';
import {Language, RoomHelper, RoomLoaded$, RoomModel, RoomService, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/internal/operators/switchMap';
import {QwRoomBaseInfoGuestType, QwRoomBaseInfoType} from '../../index';

@Component({
  tag: 'qw-room-base-info',
  styleUrl: 'qw-room-base-info.css',
  shadow: false,
})
export class QwRoomBaseInfo {
  @Prop() qwRoomBaseInfoType: QwRoomBaseInfoType = QwRoomBaseInfoType.Inline;
  @Prop() qwRoomBaseInfoGuestType: QwRoomBaseInfoGuestType = QwRoomBaseInfoGuestType.Icon;
  @Prop() qwRoomBaseInfoRoomId: string;
  @Prop() qwRoomBaseInfoForceRoomsCall: boolean = false;
  @State() room: RoomModel;

  public componentWillLoad() {
    if (this.qwRoomBaseInfoForceRoomsCall) {
      SessionService.getSession().subscribe();
      SessionLoaded$
        .pipe(switchMap(session => RoomService.getRooms(session.sessionId)))
        .subscribe();
    }

    RoomLoaded$.subscribe(rooms => {
      this.room = rooms.find(r => r.roomId === parseInt(this.qwRoomBaseInfoRoomId));
      console.log(this.room);
    });
  }

  private getMaxOccupancyValue() {
    const occupancyValue = RoomHelper.getDefaultOccupancy(this.room).definition.value;
    if (occupancyValue.isDetailed) {
      return occupancyValue.adultCount + occupancyValue.childCount + occupancyValue.infantCount;
    } else {
      return occupancyValue.personCount;
    }
  }

  render() {
    return (
      <Host>
        {this.room ? <ul class={`${this.qwRoomBaseInfoType === QwRoomBaseInfoType.Inline ? 'qw-room-base-info--inline' : ''}`}>
          {this.qwRoomBaseInfoGuestType === QwRoomBaseInfoGuestType.Icon
            ? <li class="qw-room-base-info__person-icon">
              {Language.getTranslation('maximum')} {this.getMaxOccupancyValue()} {this.getMaxOccupancyValue() === 1
                ? Language.getTranslation('person')
                : Language.getTranslation('people')}
            </li>
            : <li class="qw-room-base-info__person-text">{RoomHelper.getDefaultOccupancy(this.room).definition.text}</li>
          }
          {this.room.surfaceArea.text && <li class="qw-room-base-info__surface">{this.room.surfaceArea.text}</li>}
          <li class="qw-room-base-info__bed">{RoomHelper.getRoomBedsFormatted(this.room)}</li>
        </ul> : ''}
      </Host>
    );
  }
}
