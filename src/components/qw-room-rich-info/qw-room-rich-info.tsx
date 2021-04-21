import {Component, Host, h, Prop, State, EventEmitter, Event} from '@stencil/core';
import {Language, RoomHelper, RoomLoaded$, RoomModel, RoomService, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/internal/operators/switchMap';
import {QwRoomBaseInfoGuestType, QwRoomBaseInfoType} from '../../index';
import {first} from 'rxjs/operators';

@Component({
  tag: 'qw-room-rich-info',
  styleUrl: 'qw-room-rich-info.css',
  shadow: false
})
export class QwRoomRichInfo {
  @Prop() qwRoomRichInfoRoomId: string;
  @Prop() qwRoomRichInfoForceRoomsCall: boolean = false;
  @Prop() qwRoomRichInfoBaseInfoType: QwRoomBaseInfoType = QwRoomBaseInfoType.Inline;
  @State() room: RoomModel;
  @State() showAmenities: boolean = false;
  @Event() qwRoomRichInfoOnLoad: EventEmitter<void>;

  public componentWillLoad() {
    if (this.qwRoomRichInfoForceRoomsCall) {
      SessionService.getSession().subscribe();
      SessionLoaded$
        .pipe(switchMap(session => RoomService.getRooms(session.sessionId)))
        .subscribe();
    }

    RoomLoaded$.pipe(first()).subscribe(() => this.qwRoomRichInfoOnLoad.emit());
    RoomLoaded$.subscribe(rooms => {
      this.room = rooms.find(r => r.roomId === parseInt(this.qwRoomRichInfoRoomId));
    });
  }

  render() {
    return (
      this.room && <Host class={`qw-room-rich-info__content ${!this.room ? 'qw-room-rich-info--loading' : 'qw-room-rich-info--loaded'}`}>
        <div class="qw-room-rich-info__loading-wrapper">
          <slot name="qwRoomRichInfoLoading"/>
        </div>
        <h4 class="qw-room-rich-info__title">{this.room.name}</h4>
        <div class="qw-room-rich-info__info">
          <qw-room-base-info
            qwRoomBaseInfoType={this.qwRoomRichInfoBaseInfoType}
            qwRoomBaseInfoGuestType={this.qwRoomRichInfoBaseInfoType === QwRoomBaseInfoType.List
              ? QwRoomBaseInfoGuestType.Text
              : QwRoomBaseInfoGuestType.Icon}
            qwRoomBaseInfoRoomId={this.qwRoomRichInfoRoomId}/>
            <p class="qw-room-rich-info__amenities-trigger" onClick={() => this.showAmenities = !this.showAmenities}>
              {Language.getTranslation('amenities')} {this.showAmenities ? '-' : '+'}
            </p>
        </div>

        {this.showAmenities && <qw-room-service qwRoomServiceRoomId={this.qwRoomRichInfoRoomId} />}

        <p class="qw-room-rich-info__description" innerHTML={RoomHelper.getSummary(this.room)?.text}/>
      </Host>
    );
  }

}
