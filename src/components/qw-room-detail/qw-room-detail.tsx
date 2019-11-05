import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {BasketService, RoomHelper, RoomModel, RoomService, SessionLoaded$, SessionService} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwRoomRateAddToBasketEmitter} from '../qw-room-rate/qw-room-rate';

@Component({
  tag: 'qw-room-detail',
  styleUrl: 'qw-room-detail.css',
  shadow: false,
})
export class QwRoomDetail {
  @Prop() qwRoomDetailId: string;
  @State() room: RoomModel;
  @Event() qwRoomDetailAddToBasketSuccess: EventEmitter<void>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => RoomService.getRooms(session.sessionId)),
    ).subscribe(rooms => {
      this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId));
    });
  }

  @Listen('qwRoomDetailCardAddToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    BasketService.setRoomInBasket({
      roomId: this.room.roomId,
      rateId: e.detail.rateId,
      occupancyId: RoomHelper.getDefaultOccupancy(this.room).occupancyId,
      quantity: e.detail.quantity,
    }).subscribe(() => {
      this.qwRoomDetailAddToBasketSuccess.emit();
    });
  }

  render() {
    return (
      <Host>
        {this.room && <qw-room-detail-card
          qwRoomDetailCardTitle={this.room.name}
          qwRoomDetailCardImage={RoomHelper.getCoverImage(this.room).url}
          qwRoomDetailCardSquareMeter={this.room.surfaceArea.text}
          qwRoomDetailCardGuests={RoomHelper.getDefaultOccupancy(this.room).definition.text}
          qwRoomDetailCardBed={this.room.bedding.beds[0].type.text}
          qwRoomDetailCardRates={this.room.rates || []}/>}
      </Host>
    );
  }
}
