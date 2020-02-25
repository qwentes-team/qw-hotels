import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketService, BasketWithPrice$, createRateFromRoomBasketOccupancy, Rate,
  RoomBasketModel, RoomHelper, RoomIsLoading$, RoomLoaded$, RoomModel, RoomService,
  SessionHelper, SessionIsLoading$, SessionLoaded$, SessionModel, SessionService,
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
  @Prop() qwRoomDetailForceBasketCall: boolean = false;
  @State() room: RoomModel;
  @State() session: SessionModel;
  @State() basketRoomRate: Rate;
  @State() numberOfNights: number;
  @State() basketIsLoading: boolean;
  @State() sessionIsLoading: boolean;
  @State() roomIsLoading: boolean;
  @State() numberOfGuests: number;
  @State() numberOfAccommodation: number;
  @Event() qwRoomDetailAddToBasketSuccess: EventEmitter<QwRoomDetailAddToBasketEmitter>;
  @Event() qwRoomDetailAddAnotherRoom: EventEmitter<void>;
  @Event() qwRoomDetailProceed: EventEmitter<void>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => {
        this.session = session;
        this.numberOfGuests = SessionHelper.getTotalGuests(session);
        this.numberOfNights = SessionHelper.getNumberOfNights(session);
        return RoomService.getRooms(session.sessionId);
      }),
    ).subscribe();

    RoomLoaded$.pipe(
      switchMap(rooms => {
        this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId));
        return this.qwRoomDetailForceBasketCall ? BasketService.getBasket(this.session) : BasketWithPrice$;
      }),
    ).subscribe(basket => {
      const basketRoom = basket.rooms && this.getBasketRoom(basket.rooms);
      const occupancyId = basketRoom && BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
      this.basketRoomRate = basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[occupancyId]);
    });

    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.sessionIsLoading = isLoading);
    RoomIsLoading$.subscribe(isLoading => this.roomIsLoading = isLoading);
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

  private isLoadingData() {
    return this.basketIsLoading || this.sessionIsLoading || this.roomIsLoading;
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
          qwRoomDetailCardNumberOfNights={this.numberOfNights}
          qwRoomDetailCardIsLoading={this.isLoadingData()}
          qwRoomDetailCardNumberOfGuests={this.numberOfGuests}
          qwRoomDetailCardNumberOfAccommodation={this.numberOfAccommodation}
          qwRoomDetailCardRates={this.basketRoomRate ? [this.basketRoomRate] : (this.room.rates || [])}/>}
      </Host>
    );
  }
}
