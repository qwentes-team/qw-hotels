import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketService,
  RateModel,
  RateService,
  RoomHelper,
  RoomModel,
  RoomService,
  SessionLoaded$, SessionModel,
  SessionService,
} from 'booking-state-manager';
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
  @State() rates: {[rateId: string]: RateModel} = {};
  @Event() qwRoomDetailAddToBasketSuccess: EventEmitter<void>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => {
        if (!Object.keys(this.rates).length) {
          this.getRates(session.sessionId);
        }

        return RoomService.getRooms(session.sessionId);
      }),
    ).subscribe(rooms => {
      this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId));
    });
  }

  // todo ottimizzare getRates
  private getRates(sessionId: SessionModel['sessionId']) {
    RateService.getRates(sessionId).subscribe(res => {
      this.rates = res.reduce((acc, r) => ({...acc, [r.rateId]: r}), {});
    })
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
          qwRoomDetailCardRatesModel={this.rates}
          qwRoomDetailCardRates={this.room.rates || []}/>}
      </Host>
    );
  }
}
