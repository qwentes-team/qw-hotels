import {Component, Host, h, Prop, State} from '@stencil/core';
import {
  BasketHelper,
  BasketWithPrice$, Language,
  MoneyPrice,
  RoomDefaultLabel,
  RoomHelper,
  RoomModel, RoomService, SessionHelper, SessionModel,
  SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {of, zip} from 'rxjs';

@Component({
  tag: 'qw-price',
  styleUrl: 'qw-price.css',
  shadow: false,
})
export class QwPrice {
  @Prop() qwPriceMainPrice: string;
  @Prop() qwPriceCrossedPrice: string;
  @Prop() qwPriceCaption: string;
  @Prop() qwPriceRoomId?: number;
  @State() qwPriceRoom?: RoomModel;
  @State() basketRoomTotals: {[roomId: string]: MoneyPrice} = {};
  @State() session: SessionModel;

  public componentWillLoad() {
    if (this.qwPriceRoomId) {
      BasketWithPrice$.subscribe(basket => {
        this.basketRoomTotals = basket.rooms.reduce((acc, room) => {
          const occupancyId = BasketHelper.getFirstOccupancyIdInBasketRoom(room);
          return {...acc, [room.roomId]: room.occupancies[occupancyId].price.converted};
        }, {});
      });
    }
    SessionService.getSession().pipe(
      switchMap((session: SessionModel) => {
        return zip(of(session), RoomService.getRooms(session.sessionId));
      }),
    ).subscribe(([session, roomsArray]) => {
      this.session = session;
      this.qwPriceRoom = this.qwPriceRoomId && this.getRoomById(roomsArray, this.qwPriceRoomId);
    });
  }

  private getRoomById(roomsArray, id) {
    return roomsArray.find(r => r.roomId === id);
  }

  private getMainPrice() {
    return this.qwPriceRoom
      ? RoomHelper.getCheapestPriceFormatted(this.qwPriceRoom) || (this.basketRoomTotals[this.qwPriceRoom.roomId] && this.basketRoomTotals[this.qwPriceRoom.roomId].text)
      : this.qwPriceMainPrice || RoomDefaultLabel.NoPrice;
  }

  private getCrossedPrice() {
    return this.qwPriceRoom
      ? RoomHelper.getCheapestCrossedOutPriceFormatted(this.qwPriceRoom)
      : this.qwPriceCrossedPrice || RoomDefaultLabel.NoPrice;
  }

  render() {
    return (
      <Host>
        <div class="qw-price__crossed-price">{this.getCrossedPrice()}</div>
        <div class="qw-price__main-price">{this.getMainPrice() || <qw-loading qw-loading-size="22"/>}</div>
        {this.session && this.session.context && <div class="qw-price__caption">{`${Language.getTranslation('totalFor')} ${SessionHelper.getNumberOfNights(this.session)} ${Language.getTranslation('nights')}`}</div>}
      </Host>
    );
  }
}
