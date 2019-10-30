import {Component, h, Host, Listen, Prop, State} from '@stencil/core';
import {RoomModel, RoomService, SessionLoaded$, SessionService} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwRoomRateAddToBasketEmitter} from '../qw-room-rate/qw-room-rate';

@Component({
  tag: 'qw-room-detail',
  styleUrl: 'qw-room-detail.css',
  shadow: false
})
export class QwRoomDetail {
  @Prop() qwRoomDetailId: string;
  @State() room: RoomModel;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => RoomService.getRooms(session.sessionId))
    ).subscribe(rooms => {
      this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId));
      console.log(this.room);
    })
  }

  @Listen('qwRoomDetailCardAddToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    console.log(e.detail);
  }


  render() {
    return (
      <Host>
        {this.room && <qw-room-detail-card
          qwRoomDetailCardRates={this.room.rates}/>}
      </Host>
    );
  }
}
