import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketHelper, BasketService, BasketWithPrice$, createRateFromRoomBasketOccupancy, Rate,
  RoomBasketModel, RoomHelper, RoomLoaded$, RoomModel, RoomService,
  SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwRoomRateAddToBasketEmitter} from '../qw-room-rate/qw-room-rate';

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
  @Prop() qwRoomDetailAlertMessage: string;
  @Prop() qwRoomDetailAddAnotherRoomButtonMessage: string;
  @Prop() qwRoomDetailProceedToCheckoutButtonMessage: string;
  @State() room: RoomModel;
  @State() basketRoomRate: Rate;
  @State() numberOfNights: number;
  @State() basketIsLoading: boolean;
  @State() numberOfGuests: number;
  @State() numberOfAccommodation: number;
  @Event() qwRoomDetailAddToBasketSuccess: EventEmitter<QwRoomDetailAddToBasketEmitter>;
  @Event() qwRoomDetailAddAnotherRoom: EventEmitter<void>;
  @Event() qwRoomDetailProceed: EventEmitter<void>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => {
        this.numberOfGuests = SessionHelper.getTotalGuests(session);
        this.numberOfNights = SessionHelper.getNumberOfNights(session);
        return RoomService.getRooms(session.sessionId);
      }),
    ).subscribe();

    RoomLoaded$
      .pipe(
        switchMap(rooms => {
          this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId));
          return BasketWithPrice$;
        }),
      )
      .subscribe(basket => {
        const basketRoom = this.getBasketRoom(basket.rooms);
        this.basketRoomRate = basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[0]);
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
      this.numberOfAccommodation = BasketHelper.getNumberOfAccommodation(basket);
      this.qwRoomDetailAddToBasketSuccess.emit({
        numberOfGuests: this.numberOfGuests,
        numberOfAccommodation: this.numberOfAccommodation,
      });
    });
  }

  @Listen('qwRoomDetailCardAddAnotherRoom')
  public addAnotherRoom() {
    this.qwRoomDetailAddAnotherRoom.emit();
  }

  @Listen('qwRoomDetailCardProceed')
  public proceed() {
    this.qwRoomDetailProceed.emit();
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
          qwRoomDetailCardBed={RoomHelper.getRoomBedsFormatted(this.room)}
          qwRoomDetailCardNumberOfNights={this.numberOfNights}
          qwRoomDetailCardIsLoading={this.basketIsLoading}
          qwRoomDetailCardNumberOfGuests={this.numberOfGuests}
          qwRoomDetailCardNumberOfAccommodation={this.numberOfAccommodation}
          qwRoomDetailCardAlertMessage={this.qwRoomDetailAlertMessage}
          qwRoomDetailCardRates={this.room.rates || [this.basketRoomRate] || []}/>}
      </Host>
    );
  }
}
