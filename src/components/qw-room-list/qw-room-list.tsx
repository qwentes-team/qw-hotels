import {Component, h, Host, Prop, State} from '@stencil/core';
import {
  BasketIsLoading$, BasketService,
  RoomService, RoomIsLoading$, RoomLoaded$, RoomHelper, RoomDefaultLabel, RoomModel,
  SessionService, SessionLoaded$, SessionModel,
} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false
})
export class QwRoomList {
  @Prop() QwRoomListTriggerBasket: boolean = false;
  @State() rooms: RoomModel[] = [];
  @State() isBasketLoading: boolean;
  @State() isRoomLoading: boolean;
  @State() session: SessionModel;

  constructor() {
    this.setRoomToBasket = this.setRoomToBasket.bind(this);
  }

  public componentDidLoad() {
    SessionService.getSession().pipe(
      switchMap(session => {
        return this.QwRoomListTriggerBasket ? BasketService.getBasket(session) : of(undefined)
      })).subscribe();

    SessionLoaded$.pipe(
      switchMap(session => {
        this.session = session;
        return RoomService.getRooms(session.sessionId);
      })
    ).subscribe();

    RoomLoaded$.subscribe(res => this.rooms = res);
    BasketIsLoading$.subscribe(isLoading => this.isBasketLoading = isLoading);
    RoomIsLoading$.subscribe(isLoading => this.isRoomLoading = isLoading);
  }

  public setRoomToBasket(room: RoomModel) {
    BasketService.setRoomInBasket({
      roomId: room.roomId,
      rateId: RoomHelper.getCheapestRate(room).rateId,
      occupancyId: RoomHelper.getDefaultOccupancy(room).occupancyId,
      quantity: 1,
    }).subscribe();
  }

  private hasPrice(room: RoomModel) {
    return RoomHelper.getCheapestRateFormatted(room) !== RoomDefaultLabel.NoPrice;
  }

  public render() {
    return (
      <Host>
        {this.session && <div>Guests: {this.session.context.guests.adults}</div>}
        {this.rooms.map(r => {
          return <qw-room-card
            class={!this.hasPrice(r) && 'qw-room-card__disabled'}
            qw-room-card-title={r.name}
            qw-room-card-price={RoomHelper.getCheapestRateFormatted(r)}
            qw-room-card-availability={RoomHelper.getAvailabilityForCheapestRate(r)}
            qw-room-card-guests={RoomHelper.getDefaultOccupancy(r).definition.text}
            qw-room-card-beds={r.bedding.beds[0].count + ' ' + r.bedding.beds[0].type.text}
            qw-room-card-image={RoomHelper.getCoverImage(r).url}
            qw-room-card-is-loading={this.isBasketLoading || this.isRoomLoading}
            QwRoomCardOnClickBook={() => this.setRoomToBasket(r)}
          />
        })}
      </Host>
    );
  }
}
