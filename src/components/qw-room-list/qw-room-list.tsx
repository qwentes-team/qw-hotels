import {Component, Event, EventEmitter, h, Host, State} from '@stencil/core';
import {
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
import {zip} from 'rxjs/internal/observable/zip';
import {QwRoomCardButtonType} from '../../index';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false,
})
export class QwRoomList {
  @State() rooms: RoomModel[] = [];
  @State() isBasketLoading: boolean;
  @State() isRoomLoading: boolean;
  @State() isSessionLoading: boolean;
  @State() session: SessionModel;
  @State() rangeDate: Date[];
  @State() rangeDateSession: Date[];
  @State() roomPrices: PricesForStayPeriod = {};
  @State() isPriceLoading: boolean;
  @Event() qwRoomListClickRoom: EventEmitter<{type: QwRoomCardButtonType, room: RoomModel}>;

  private startDate: Date;
  private endDate: Date;
  private symbol: string;
  private rangeDateString: string[];
  private rangeDateStored: string[] = [];
  private todayString: string;

  constructor() {
  }

  public componentDidLoad() {
    this.todayString = DateUtil.getDateStringFromDate(this.initNewDate(new Date()));
    SessionService.getSession().subscribe();

    // todo gestire meglio il loading dei prezzi
    SessionLoaded$.pipe(
      switchMap(session => {
        this.isPriceLoading = true;
        this.session = session;
        this.symbol = MONEY_SYMBOLS[session.display.currency] || session.display.currency;
        return zip(this.getRoomsSearchForRange(session.context.stayPeriod), RoomService.getRooms(session.sessionId));
      }),
    ).subscribe(([newRoomPrices]) => {
      const firstRoomId = Object.keys(newRoomPrices).length && Object.keys(newRoomPrices)[0];
      const newDatesToStore = newRoomPrices[firstRoomId] ? Object.keys(newRoomPrices[firstRoomId]) : [];
      const mergedDataStored = [...this.rangeDateStored, ...newDatesToStore];
      this.rangeDateStored = [...new Set(mergedDataStored)].sort();
      this.roomPrices = this.mergeActiveRoomPricesWitNewRoomPrices(newRoomPrices);
      this.isPriceLoading = false;
    });

    RoomLoaded$.subscribe(res => this.rooms = res);
    RoomIsLoading$.subscribe(isLoading => this.isRoomLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  private mergeActiveRoomPricesWitNewRoomPrices(newRoomPrices: PricesForStayPeriod) {
    if (!Object.keys(newRoomPrices).length) {
      return this.roomPrices;
    }

    return Object.keys(newRoomPrices).reduce((acc, roomId) => {
      const newRoomPriceMerged = {...this.roomPrices[roomId], ...newRoomPrices[roomId]};
      return {...acc, [roomId]: newRoomPriceMerged};
    }, {} as PricesForStayPeriod);
  }

  private getRoomsSearchForRange(sessionStayPeriod: SessionStayPeriod) {
    const dayToRemoveToStartDate = sessionStayPeriod.arrivalDate <= this.todayString ? 0 : -1;
    this.startDate = DateUtil.addDaysToDate(dayToRemoveToStartDate, this.initNewDate(sessionStayPeriod.arrivalDate));
    this.endDate = DateUtil.addDaysToDate(6, this.initNewDate(this.startDate));
    this.rangeDate = DateUtil.getDatesRange(this.startDate, this.endDate, DateFormat.Date);
    this.rangeDateString = DateUtil.getDatesRange(this.startDate, this.endDate, DateFormat.String);
    this.rangeDateSession = DateUtil.getDatesRange(this.initNewDate(sessionStayPeriod.arrivalDate), this.initNewDate(sessionStayPeriod.departureDate), DateFormat.Date);

    const newDateToRequest = this.rangeDateString.filter(d => !this.rangeDateStored.includes(d));

    if (!newDateToRequest.length) {
      return of({});
    }

    const endDateStringPlusOneDay = DateUtil.getDateStringFromDate(
      DateUtil.addDaysToDate(1, this.initNewDate(newDateToRequest[newDateToRequest.length - 1])),
    );

    const newDateToRequestStayPeriods = DateUtil.getAllPossibleStayPeriod({
      arrivalDate: newDateToRequest[0], departureDate: endDateStringPlusOneDay,
    });
    return RoomService.getRoomPricesForStayPeriods(newDateToRequestStayPeriods);
  }

  private getAveragePricePerNight(roomId) {
    if (!this.roomPrices[roomId]) {
      return `${this.symbol} 0`;
    }

    const stayPeriod = this.session.context.stayPeriod;
    const arrivalDate = this.initNewDate(stayPeriod.arrivalDate);
    const departureDate = this.initNewDate(stayPeriod.departureDate);
    const endDateSession = departureDate <= this.endDate ? departureDate : this.endDate;

    const range = DateUtil.getDatesRange(arrivalDate, endDateSession, DateFormat.String);
    const pricesForSession = range.reduce((acc, date) => {
      const valueToAdd = this.roomPrices[roomId][date] ? this.roomPrices[roomId][date].value.amount : 0;
      return acc + valueToAdd;
    }, 0) / range.length;
    return `${this.symbol} ${Math.round(pricesForSession).toString()}`;
  }

  clickButton = (type: QwRoomCardButtonType, room: RoomModel) => {
    this.qwRoomListClickRoom.emit({type, room});
  };

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
                qwRoomCardId={r.roomId}
                qwRoomCardTitle={r.name}
                qwRoomCardPrice={`From: ${RoomHelper.getCheapestPriceFormatted(r)}`}
                qwRoomCardAveragePrice={!this.isPriceLoading ? this.getAveragePricePerNight(r.roomId) : ''}
                qwRoomCardSquareMeter={r.surfaceArea.text}
                qwRoomCardGuests={RoomHelper.getDefaultOccupancy(r).definition.text}
                qwRoomCardImage={RoomHelper.getCoverImage(r).url}
                qwRoomCardRates={r.rates}
                qwRoomCardIsLoading={this.isLoadingData()}
                qwRoomCardDescription={RoomHelper.getSummary(r).text}
                qwRoomCardRangeDate={this.rangeDate}
                qwRoomCardRangeDateSession={this.rangeDateSession}
                qwRoomCardPrices={this.roomPrices[r.roomId]}
                qwRoomCardOnClickBook={() => this.clickButton(QwRoomCardButtonType.BookNow, r)}
                qwRoomCardOnClickView={() => this.clickButton(QwRoomCardButtonType.ViewRoom, r)}/>
            </div>;
          })}
        </div>
      </Host>
    );
  }
}
