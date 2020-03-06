import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketHelper, BasketService,
  RoomHelper, RoomLoaded$, RoomModel, RoomService,
  SessionHelper, SessionLoaded$, SessionModel, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwRoomRateAddedToBasketEmitter} from '../qw-room-rate/qw-room-rate';
import {zip} from 'rxjs';

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
  @Prop() qwRoomDetailImageTransformationOptions: string;
  @State() room: RoomModel;
  @State() session: SessionModel;
  @State() numberOfNights: number;
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
        return zip(RoomService.getRooms(session.sessionId), BasketService.getBasket(session));
      }),
    ).subscribe();

    RoomLoaded$
      .subscribe((rooms) => {
        this.room = rooms.find(r => r.roomId == parseInt(this.qwRoomDetailId));
      });
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
          qwRoomDetailCardNumberOfNights={this.numberOfNights}
          qwRoomDetailCardNumberOfGuests={this.numberOfGuests}
          qwRoomDetailCardImageTransformationOptions={this.qwRoomDetailImageTransformationOptions ? JSON.parse(this.qwRoomDetailImageTransformationOptions) : {}}
          qwRoomDetailCardNumberOfAccommodation={this.numberOfAccommodation}/>}
      </Host>
    );
  }
}
