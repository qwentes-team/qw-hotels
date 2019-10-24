import {Component, h, Host, Prop, State} from '@stencil/core';
import {
  BasketIsLoading$, BasketService,
  RoomService, RoomIsLoading$, RoomLoaded$, RoomHelper, RoomDefaultLabel, RoomModel,
  SessionService, SessionLoaded$, SessionModel, DateUtil, DateFormat, SessionStayPeriod, SessionIsLoading$,
} from 'booking-state-manager';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {zip} from 'rxjs/internal/observable/zip';

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
  @State() isSessionLoading: boolean;
  @State() session: SessionModel;
  @State() rangeDate: Date[];
  @State() rangeDateSession: Date[];
  @State() pricesByRoom: any;

  public startDateString: string;
  public endDateString: string;
  public startDate: Date;
  public endDate: Date;


  constructor() {
    this.setRoomToBasket = this.setRoomToBasket.bind(this);
  }

  public componentDidLoad() {
    SessionService.getSession().pipe(
      switchMap(session => this.QwRoomListTriggerBasket ? BasketService.getBasket(session) : of(undefined))
    ).subscribe();

    SessionLoaded$.pipe(
      switchMap(session => {
        this.pricesByRoom = null;
        this.session = session;
        return RoomService.getRooms(session.sessionId);
      }),
      switchMap(() => this.getRoomsSearchForRange(this.session.context.stayPeriod)),
    ).subscribe();

    RoomLoaded$.subscribe(res => this.rooms = res);
    BasketIsLoading$.subscribe(isLoading => this.isBasketLoading = isLoading);
    RoomIsLoading$.subscribe(isLoading => this.isRoomLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  private getRoomsSearchForRange(sessionStayPeriod: SessionStayPeriod) {
    this.startDate = DateUtil.addDaysToDate(-1, this.initNewDate(sessionStayPeriod.arrivalDate));
    this.endDate = DateUtil.addDaysToDate(6, this.initNewDate(this.startDate));
    this.startDateString = DateUtil.getDateStringFromDate(this.startDate);
    this.endDateString = DateUtil.getDateStringFromDate(this.endDate);
    this.rangeDate = DateUtil.getDatesRange(this.startDate, this.endDate, DateFormat.Date);
    this.rangeDateSession = DateUtil.getDatesRange(this.initNewDate(sessionStayPeriod.arrivalDate), this.initNewDate(sessionStayPeriod.departureDate), DateFormat.Date);
    const endDateStringPlusOneDay = DateUtil.getDateStringFromDate(DateUtil.addDaysToDate(1, this.endDate));
    const stayPeriodsRange = {arrivalDate: this.startDateString, departureDate: endDateStringPlusOneDay};
    const stayPeriods = DateUtil.getAllPossibleStayPeriod(stayPeriodsRange);
    const observables = stayPeriods.map((sp) => RoomService.getRoomsSearchForSpecificStayPeriod(sp));
    return zip(of(stayPeriods), ...observables).pipe(map(([stayPeriods, ...prices]) => {
      this.pricesByRoom = RoomService.formatPricesForStayPeriods(stayPeriods, prices);
      return this.pricesByRoom;
    }));
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

  private initNewDate(date: string | Date) {
    return DateUtil.removeTimeFromDate(new Date(date));
  }

  private isLoadingData() {
    return this.isBasketLoading || this.isRoomLoading || this.isSessionLoading;
  }

  public render() {
    return (
      <Host>
        {this.session && <div>Guests: {this.session.context.guests.adults}</div>}
        <div class="qw-room-list__wrapper">
          {this.rooms.map(r => {
            return <div class="qw-room-list__card-wrapper">
              <qw-room-card
                class={(this.isLoadingData() || !this.hasPrice(r)) && 'qw-room-card__disabled'}
                qwRoomCardTitle={r.name}
                qwRoomCardPrice={`From: ${RoomHelper.getCheapestRateFormatted(r)}`}
                qwRoomCardAvailability={RoomHelper.getAvailabilityForCheapestRate(r)}
                qwRoomCardGuests={RoomHelper.getDefaultOccupancy(r).definition.text}
                qwRoomCardBeds={r.bedding.beds[0].count + ' ' + r.bedding.beds[0].type.text}
                qwRoomCardImage={RoomHelper.getCoverImage(r).url}
                qwRoomCardRates={r.rates}
                qwRoomCardIsLoading={this.isLoadingData()}
                qwRoomCardOnClickBook={() => this.setRoomToBasket(r)}
              />
              <qw-week-calendar
                qwWeekCalendarIsPriceLoading={!this.pricesByRoom}
                qwWeekCalendarRangeDate={this.rangeDate}
                qwWeekCalendarRangeDateSession={this.rangeDateSession}
                qwWeekCalendarPricesByRoom={this.pricesByRoom}
                qwWeekCalendarSelectedRoomId={r.roomId}
              />
            </div>;
          })}
        </div>
      </Host>
    );
  }
}
