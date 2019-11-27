import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketWithPrice$, createRateFromRoomBasketOccupancy, Rate,
  RoomBasketModel, RoomHelper, RoomLoaded$, RoomModel, RoomOccupancy, RoomService,
  SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwRoomRateAddedToBasketEmitter} from '../qw-room-rate/qw-room-rate';

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
  @State() basketRoomOccupancyText: RoomOccupancy['definition']['text'];
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
        const basketRoom = basket.rooms && this.getBasketRoom(basket.rooms);
        this.basketRoomOccupancyText = basketRoom && basketRoom.defaultOccupancy.definition.text;
        const occupancyId = basketRoom && BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
        this.basketRoomRate = basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[occupancyId]);
      });

    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
  }

  private getBasketRoom(rooms: RoomBasketModel[]) {
    return this.room && rooms.find(r => r.roomId === this.room.roomId);
  }

  @Listen('qwRoomDetailCardAddedToBasket')
  public addedToBasket(e: CustomEvent<QwRoomRateAddedToBasketEmitter>) {
    this.numberOfAccommodation = BasketHelper.getNumberOfAccommodation(e.detail.basket);
    this.qwRoomDetailAddToBasketSuccess.emit({
      numberOfGuests: this.numberOfGuests,
      numberOfAccommodation: this.numberOfAccommodation,
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
          qwRoomDetailCardBasketRoomOccupancyText={this.basketRoomOccupancyText}
          qwRoomDetailCardRates={this.basketRoomRate ? [this.basketRoomRate] : this.room.rates}/>}
      </Host>
    );
  }
}
