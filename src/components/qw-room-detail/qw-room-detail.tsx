import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketQuery,
  BasketService,
  RateModel,
  RateService, RoomBasketOccupancy,
  RoomHelper, RoomLoaded$,
  RoomModel,
  RoomService, SessionHelper,
  SessionLoaded$, SessionModel,
  SessionService,
} from 'booking-state-manager';
import {switchMap, filter} from 'rxjs/operators';
import {QwRoomRateAddToBasketEmitter} from '../qw-room-rate/qw-room-rate';

@Component({
  tag: 'qw-room-detail',
  styleUrl: 'qw-room-detail.css',
  shadow: false,
})
export class QwRoomDetail {
  @Prop() qwRoomDetailId: string;
  @State() room: RoomModel;
  @State() basketRoom: RoomBasketOccupancy;
  @State() numberOfNights: number;
  @State() rates: {[rateId: string]: RateModel} = {};
  @State() basketIsLoading: boolean;
  @Event() qwRoomDetailAddToBasketSuccess: EventEmitter<void>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => {
        if (!Object.keys(this.rates).length) {
          this.getRates(session.sessionId);
        }

        this.numberOfNights = SessionHelper.getNumberOfNights(session);
        return RoomService.getRooms(session.sessionId);
      }),
    ).subscribe();

    RoomLoaded$.subscribe(rooms => this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId)));
    BasketQuery.select().pipe(filter(basket => !basket.loading)).subscribe(basket => {
      console.log(basket);
      this.basketRoom = basket.rooms[0] && basket.rooms[0].occupancies[0]; // todo prendere roomId
      console.log(this.basketRoom);
      debugger;
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
    this.basketIsLoading = true;
    BasketService.setRoomInBasket({
      roomId: this.room.roomId,
      rateId: e.detail.rateId,
      occupancyId: RoomHelper.getDefaultOccupancy(this.room).occupancyId,
      quantity: e.detail.quantity,
    }).subscribe(() => {
      this.basketIsLoading = false;
      this.qwRoomDetailAddToBasketSuccess.emit();
    });
  }

  render() {
    return (
      <Host>
        <div style={this.room && { 'display': 'none' }}>
          <slot name="qwRoomDetailLoading"/>
        </div>
        {this.room && <qw-room-detail-card
          qwRoomDetailCardTitle={this.room.name}
          qwRoomDetailCardImage={RoomHelper.getCoverImage(this.room).url}
          qwRoomDetailCardSquareMeter={this.room.surfaceArea.text}
          qwRoomDetailCardGuests={RoomHelper.getDefaultOccupancy(this.room).definition.text}
          qwRoomDetailCardBed={this.room.bedding.beds[0].type.text}
          qwRoomDetailCardRatesModel={this.rates}
          qwRoomDetailCardNumberOfNights={this.numberOfNights}
          qwRoomDetailCardIsLoading={this.basketIsLoading}
          qwRoomDetailCardRates={this.room.rates || []}/> /* this.basketRoom */ }
      </Host>
    );
  }
}
