import {Component, h, Host, State} from '@stencil/core';
import {RoomService, RoomModel, BasketService, RoomHelper} from 'booking-state-manager';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false
})
export class QwRoomList {
  @State() rooms: RoomModel[] = [];

  public componentDidLoad() {
    RoomService.getRooms().subscribe(res => this.rooms = res);
  }

  private setRoomToBasket(room: RoomModel) {
    BasketService.setRoomInBasket({
      roomId: room.roomId,
      rateId: RoomHelper.getCheapestRate(room).rateId,
      occupancyId: RoomHelper.getDefaultOccupancy(room).occupancyId,
      quantity: 1,
    }).subscribe();
  }

  private hasPrice(room: RoomModel) {
    return RoomHelper.getCheapestRateFormatted(room) !== RoomHelper.DEFAULT_NO_PRICE_LABEL;
  }

  public render() {
    return (
      <Host>
        {this.rooms.map(r => {
          return <qw-room-card
            class={!this.hasPrice(r) && 'qw-room-card__disabled'}
            onClick={() => this.setRoomToBasket(r)}
            qw-room-card-title={r.name}
            qw-room-card-caption={RoomHelper.getCheapestRateFormatted(r)}
            qw-room-card-guests={RoomHelper.getDefaultOccupancy(r).definition.text}
            qw-room-card-beds={r.bedding.beds[0].count + ' ' + r.bedding.beds[0].type.text}
            qw-room-card-image={RoomHelper.getCoverImage(r).url}
          />
        })}
      </Host>
    );
  }
}
