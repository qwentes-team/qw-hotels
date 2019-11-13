import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketHelper,
  BasketQuery,
  BasketService, Rate,
  RateModel,
  RateService, RoomBasketModel,
  RoomHelper, RoomLoaded$,
  RoomModel,
  RoomService, SessionHelper,
  SessionLoaded$, SessionModel,
  SessionService,
} from 'booking-state-manager';
import {switchMap, filter} from 'rxjs/operators';
import {QwRoomRateAddToBasketEmitter} from '../qw-room-rate/qw-room-rate';
import {createRateFromRoomBasketOccupancy} from 'booking-state-manager/dist/feature/rate/model/rate';

export interface QwRoomDetailAddToBasketEmitter {
  numberOfGuests: number;
  numberOfAccommodation: number;
}

@Component({
  tag: 'qw-room-detail',
  styleUrl: 'qw-room-detail.css',
  shadow: false,
})
export class QwRoomDetail {
  @Prop() qwRoomDetailId: string;
  @State() room: RoomModel;
  @State() basketRoomRate: Rate;
  @State() numberOfNights: number;
  @State() rates: {[rateId: string]: RateModel} = {};
  @State() basketIsLoading: boolean;
  @State() numberOfGuests: number;
  @Event() qwRoomDetailAddToBasketSuccess: EventEmitter<QwRoomDetailAddToBasketEmitter>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => {
        this.numberOfGuests = SessionHelper.getTotalGuests(session);
        if (!Object.keys(this.rates).length) {
          this.getRates(session.sessionId);
        }

        this.numberOfNights = SessionHelper.getNumberOfNights(session);
        return RoomService.getRooms(session.sessionId);
      }),
    ).subscribe();

    RoomLoaded$
      .pipe(
        switchMap(rooms => {
          this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId));
          return BasketQuery.select().pipe(filter(basket => !basket.loading));
        }),
      )
      .subscribe(basket => {
        const basketRoom = this.getBasketRoom(basket.rooms);
        this.basketRoomRate = basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[0]);
      });
  }

  // todo ottimizzare getRates
  private getRates(sessionId: SessionModel['sessionId']) {
    RateService.getRates(sessionId).subscribe(res => {
      this.rates = res.reduce((acc, r) => ({...acc, [r.rateId]: r}), {});
    });
  }

  private getBasketRoom(rooms: RoomBasketModel[]) {
    return rooms.find(r => r.roomId === this.room.roomId);
  }

  @Listen('qwRoomDetailCardAddToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    this.basketIsLoading = true;
    BasketService.setRoomInBasket({
      roomId: this.room.roomId,
      rateId: e.detail.rateId,
      occupancyId: RoomHelper.getDefaultOccupancy(this.room).occupancyId,
      quantity: e.detail.quantity,
    }).subscribe((basket) => {
      this.basketIsLoading = false;
      this.qwRoomDetailAddToBasketSuccess.emit({
        numberOfGuests: this.numberOfGuests,
        numberOfAccommodation: BasketHelper.getNumberOfAccommodation(basket),
      });
    });
  }

  render() {
    return (
      <Host class={`${!this.room ? 'qw-room-detail--loading' : 'qw-room-detail--loaded'}`}>
        <div style={this.room && {'display': 'none'}}>
          <slot name="qwRoomDetailLoading"/>
        </div>
        {this.room && <qw-room-detail-card
          qwRoomDetailCardRoomId={this.room.roomId}
          qwRoomDetailCardTitle={this.room.name}
          qwRoomDetailCardImage={RoomHelper.getCoverImage(this.room).url}
          qwRoomDetailCardSquareMeter={this.room.surfaceArea.text}
          qwRoomDetailCardGuests={RoomHelper.getDefaultOccupancy(this.room).definition.text}
          qwRoomDetailCardBed={this.room.bedding.beds[0].type.text}
          qwRoomDetailCardRatesModel={this.rates}
          qwRoomDetailCardNumberOfNights={this.numberOfNights}
          qwRoomDetailCardIsLoading={this.basketIsLoading}
          qwRoomDetailCardRates={this.room.rates || [this.basketRoomRate] || []}/>}
      </Host>
    );
  }
}
