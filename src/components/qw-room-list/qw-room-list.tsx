import {Component, h, Host, Prop, State} from '@stencil/core';
import {
  BasketIsLoading$,
  BasketService,
  DateFormat,
  DateUtil,
  MONEY_SYMBOLS,
  PricesForStayPeriod,
  RoomDefaultLabel,
  RoomHelper,
  RoomIsLoading$,
  RoomLoaded$,
  RoomModel,
  RoomService,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionStayPeriod,
} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';

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
  @State() roomPrices: PricesForStayPeriod = {};
  @State() isPriceLoading: boolean;

  private startDate: Date;
  private endDate: Date;
  private symbol: string;
  private rangeDateString: string[];
  private rangeDateStored: string[] = [];

  constructor() {
    this.setRoomToBasket = this.setRoomToBasket.bind(this);
  }

  public componentDidLoad() {
    SessionService.getSession().pipe(
      switchMap(session => this.QwRoomListTriggerBasket ? BasketService.getBasket(session) : of(undefined)),
    ).subscribe();

    // todo lanciare insieme rooms e prezzi
    SessionLoaded$.pipe(
      tap(() => this.isPriceLoading = true),
      switchMap(session => {
        this.session = session;
        this.symbol = MONEY_SYMBOLS[session.display.currency] || session.display.currency;
        return RoomService.getRooms(session.sessionId);
      }),
      switchMap(() => this.getRoomsSearchForRange(this.session.context.stayPeriod)),
    ).subscribe({
      next: newRoomPrices => {
        this.roomPrices = this.mergeActiveRoomPricesWitNewRoomPrices(newRoomPrices);
        this.isPriceLoading = false;
      },
      error: err => {
        console.log(err);
        this.isPriceLoading = false;
      },
      complete: () => {
        console.log('completed');
        this.isPriceLoading = false;
      },
    });

    RoomLoaded$.subscribe(res => this.rooms = res);
    BasketIsLoading$.subscribe(isLoading => this.isBasketLoading = isLoading);
    RoomIsLoading$.subscribe(isLoading => this.isRoomLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  private mergeActiveRoomPricesWitNewRoomPrices(newRoomPrices: PricesForStayPeriod) {
    if (!Object.keys(newRoomPrices).length) {
      return this.roomPrices;
    }

    return Object.keys(newRoomPrices).reduce((acc, roomId) => {
      const newRoomPriceMerged = {...this.roomPrices[roomId], ...newRoomPrices[roomId]};
      return {...acc, [roomId]: newRoomPriceMerged}
    }, {} as PricesForStayPeriod);
  }

  private getRoomsSearchForRange(sessionStayPeriod: SessionStayPeriod) {
    this.startDate = DateUtil.addDaysToDate(-1, this.initNewDate(sessionStayPeriod.arrivalDate));
    this.endDate = DateUtil.addDaysToDate(6, this.initNewDate(this.startDate));
    this.rangeDate = DateUtil.getDatesRange(this.startDate, this.endDate, DateFormat.Date);
    this.rangeDateString = DateUtil.getDatesRange(this.startDate, this.endDate, DateFormat.String);
    this.rangeDateSession = DateUtil.getDatesRange(this.initNewDate(sessionStayPeriod.arrivalDate), this.initNewDate(sessionStayPeriod.departureDate), DateFormat.Date);

    const newDateToRequest = this.rangeDateString.filter(d => !this.rangeDateStored.includes(d));
    const mergedDataStored = [...this.rangeDateStored, ...newDateToRequest];
    this.rangeDateStored = [...new Set(mergedDataStored)].sort();

    if (!newDateToRequest.length) {
      return of({});
    }

    const endDateStringPlusOneDay = DateUtil.getDateStringFromDate(
      DateUtil.addDaysToDate(1, this.initNewDate(newDateToRequest[newDateToRequest.length - 1]))
    );

    const newDateToRequestStayPeriods = DateUtil.getAllPossibleStayPeriod({
      arrivalDate: newDateToRequest[0], departureDate: endDateStringPlusOneDay,
    });
    console.log(newDateToRequest);
    console.log(this.rangeDateStored);
    return RoomService.getRoomPricesForStayPeriods(newDateToRequestStayPeriods);
  }

  private getAveragePricePerNight(roomId) {
    if (!this.roomPrices[roomId]) {
      return `${this.symbol} 0`;
    }

    const stayPeriod = this.session.context.stayPeriod; // todo rendere stayPeriod globale del componente
    const arrivalDate = this.initNewDate(stayPeriod.arrivalDate);
    const departureDate = this.initNewDate(stayPeriod.departureDate);
    const endDateSession = departureDate <= this.endDate ? departureDate : this.endDate;

    const range = DateUtil.getDatesRange(arrivalDate, endDateSession, DateFormat.String);
    const pricesForSession = range.reduce((acc, date) => {
      const valueToAdd = this.roomPrices[roomId][date].value.amount;
      return acc + valueToAdd;
    }, 0) / range.length;
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
                qw-room-card-average-price={!this.isPriceLoading && this.getAveragePricePerNight(r.roomId)}
                qwRoomCardAvailability={RoomHelper.getAvailabilityForCheapestRate(r)}
                qwRoomCardGuests={RoomHelper.getDefaultOccupancy(r).definition.text}
                qwRoomCardBeds={r.bedding.beds[0].count + ' ' + r.bedding.beds[0].type.text}
                qwRoomCardImage={RoomHelper.getCoverImage(r).url}
                qwRoomCardRates={r.rates}
                qwRoomCardIsLoading={this.isLoadingData()}
                qwRoomCardOnClickBook={() => this.setRoomToBasket(r)}/>
              <qw-week-calendar
                qwWeekCalendarIsPriceLoading={this.isPriceLoading}
                qwWeekCalendarRangeDate={this.rangeDate}
                qwWeekCalendarRangeDateSession={this.rangeDateSession}
                qwWeekCalendarPricesByRoom={this.roomPrices[r.roomId]}
                qwWeekCalendarSelectedRoomId={r.roomId}/>
            </div>;
          })}
        </div>
      </Host>
    );
  }
}
