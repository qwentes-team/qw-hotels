import {Component, h, Host, Prop, State} from '@stencil/core';
import {
  RoomModel,
  BasketService,
  RoomHelper,
  RoomQuery,
  RoomModelCollection,
  BasketWithPrice$,
  RoomService
} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false
})
export class QwRoomList {
  @Prop() QwRoomListTriggerBasket: boolean = false;
  @State() rooms: RoomModelCollection = {};

  public componentDidLoad() {
    if (this.QwRoomListTriggerBasket) {
      BasketService.getBasket().subscribe();
    }

    RoomQuery.select().subscribe(res => this.rooms = res);

    BasketWithPrice$
      .pipe(switchMap(() => RoomService.getRooms()))
      .subscribe((res) => {
        console.log('da BasketQuery.select');
        console.log('Rooms', res);
      });
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
        {Object.values(this.rooms).map(r => {
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
