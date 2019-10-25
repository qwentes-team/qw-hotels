import {Component, h, Host, Prop, State} from '@stencil/core';
import {
  MONEY_SYMBOLS,
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
  shadow: false,
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
  @State() pricesByRoom: any; // todo

  private startDateString: string;
  private startDate: Date;
  private endDate: Date;
  private symbol: string;
  private rangeDateSessionString: string[];

  constructor() {
    this.setRoomToBasket = this.setRoomToBasket.bind(this);
  }

  public componentDidLoad() {
    SessionService.getSession().pipe(
      switchMap(session => this.QwRoomListTriggerBasket ? BasketService.getBasket(session) : of(undefined)),
    ).subscribe();

    SessionLoaded$.pipe(
      switchMap(session => {
        this.pricesByRoom = null;
        this.session = session;
        this.symbol = MONEY_SYMBOLS[session.display.currency] || session.display.currency;
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
    this.rangeDate = DateUtil.getDatesRange(this.startDate, this.endDate, DateFormat.Date);
    this.rangeDateSession = DateUtil.getDatesRange(this.initNewDate(sessionStayPeriod.arrivalDate), this.initNewDate(sessionStayPeriod.departureDate), DateFormat.Date);
    this.rangeDateSessionString = DateUtil.getDatesRange(this.initNewDate(sessionStayPeriod.arrivalDate), this.initNewDate(sessionStayPeriod.departureDate), DateFormat.String);
    const endDateStringPlusOneDay = DateUtil.getDateStringFromDate(DateUtil.addDaysToDate(1, this.endDate));
    const stayPeriodsRange = {arrivalDate: this.startDateString, departureDate: endDateStringPlusOneDay};
    const stayPeriods = DateUtil.getAllPossibleStayPeriod(stayPeriodsRange);
    const observables = stayPeriods.map((sp) => RoomService.getRoomsSearchForSpecificStayPeriod(sp));
    return zip(of(stayPeriods), ...observables).pipe(map(([stayPeriods, ...prices]) => {
      this.pricesByRoom = RoomService.formatPricesForStayPeriods(stayPeriods, prices);
      return this.pricesByRoom;
    }));
  }

  private getAveragePricePerNight(roomId) {
    if (!this.pricesByRoom[roomId]) {
      return `${this.symbol} 0`;
    }
    const pricesForSession = this.rangeDateSessionString.reduce((acc, date) => {
      const valueToAdd = this.pricesByRoom[roomId][date].value.amount;
      return acc + valueToAdd;
    }, 0) / this.rangeDateSessionString.length;
    return `${this.symbol} ${Math.round(pricesForSession).toString()}`;
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
    return RoomHelper.getCheapestPriceFormatted(room) !== RoomDefaultLabel.NoPrice;
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
        <div class="qw-room-list__wrapper">
          {this.rooms.map(r => {
            return <div class="qw-room-list__card-wrapper">
              <qw-room-card
                class={(this.isLoadingData() || !this.hasPrice(r)) && 'qw-room-card__disabled'}
                qwRoomCardTitle={r.name}
                qwRoomCardPrice={`From: ${RoomHelper.getCheapestPriceFormatted(r)}`}
                qw-room-card-average-price={this.pricesByRoom && this.getAveragePricePerNight(r.roomId)}
                qwRoomCardAvailability={RoomHelper.getAvailabilityForCheapestRate(r)}
                qwRoomCardGuests={RoomHelper.getDefaultOccupancy(r).definition.text}
                qwRoomCardBeds={r.bedding.beds[0].count + ' ' + r.bedding.beds[0].type.text}
                qwRoomCardImage={RoomHelper.getCoverImage(r).url}
                qwRoomCardRates={r.rates}
                qwRoomCardIsLoading={this.isLoadingData()}
                qwRoomCardOnClickBook={() => this.setRoomToBasket(r)}/>
              <qw-week-calendar
                qwWeekCalendarIsPriceLoading={!this.pricesByRoom}
                qwWeekCalendarRangeDate={this.rangeDate}
                qwWeekCalendarRangeDateSession={this.rangeDateSession}
                qwWeekCalendarPricesByRoom={this.pricesByRoom}
                qwWeekCalendarSelectedRoomId={r.roomId}/>
            </div>;
          })}
        </div>
      </Host>
    );
  }
}
