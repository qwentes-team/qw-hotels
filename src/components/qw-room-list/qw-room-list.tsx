import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {
  BasketWithPrice$,
  DateFormat,
  DateUtil,
  MONEY_SYMBOLS,
  PricesForStayPeriod, RoomDefaultLabel,
  RoomHelper,
  RoomIsLoading$,
  RoomLoaded$,
  RoomModel,
  RoomService, SessionHelper,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionStayPeriod,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {zip} from 'rxjs/internal/observable/zip';
import {QwRoomListCardButtonType, QwRoomListType} from '../../index';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false,
})
export class QwRoomList {
  @Prop() qwRoomListType: QwRoomListType = QwRoomListType.Inline;
  @Prop() qwRoomListFilterRoomsWith: string;
  @Prop() qwRoomListShowPrices: boolean = true;
  @Prop() qwRoomListShowCta: boolean = true;
  @Prop() qwRoomListHeaderMessage: string;
  @State() rooms: RoomModel[] = [];
  @State() isBasketLoading: boolean;
  @State() isRoomLoading: boolean;
  @State() isSessionLoading: boolean;
  @State() session: SessionModel;
  @State() rangeDate: Date[];
  @State() rangeDateSession: Date[];
  @State() roomPrices: PricesForStayPeriod = {};
  @State() isPriceLoading: boolean;
  @State() nights: number;
  @State() basketRoomTotals: {[roomId: string]: string};
  @Event() qwRoomListClickRoom: EventEmitter<{type: QwRoomListCardButtonType, room: RoomModel}>;

  private startDate: Date;
  private endDate: Date;
  private symbol: string;
  private rangeDateString: string[];
  private rangeDateStored: string[] = [];
  private todayString: string;

  public componentDidLoad() {
    this.todayString = DateUtil.getDateStringFromDate(this.initNewDate(new Date()));
    SessionService.getSession().subscribe();

    // todo gestire meglio il loading dei prezzi
    SessionLoaded$.pipe(
      switchMap(session => {
        this.isPriceLoading = true;
        this.session = session;
        this.symbol = MONEY_SYMBOLS[session.display.currency] || session.display.currency;
        this.nights = SessionHelper.getNumberOfNights(session);
        if (!this.qwRoomListShowPrices) {
          return zip(of({}), RoomService.getRooms(session.sessionId));
        }
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

    RoomLoaded$.subscribe(res => this.rooms = !this.qwRoomListFilterRoomsWith ? res : this.getFilteredRooms(res));
    BasketWithPrice$.subscribe(basket => {
      this.basketRoomTotals = basket.rooms.reduce((acc, room) => {
        return {...acc, [room.roomId]: room.occupancies[0].price.converted.text};
      }, {});
    });

    RoomIsLoading$.subscribe(isLoading => this.isRoomLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  private getFilteredRooms(rooms: RoomModel[]) {
    const roomIdsToFilter = JSON.parse(this.qwRoomListFilterRoomsWith);
    return rooms.filter(r => roomIdsToFilter.includes(r.roomId));
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

  private getAveragePricePerNight(roomId: RoomModel['roomId']) {
    if (!this.roomPrices[roomId]) {
      return RoomDefaultLabel.NoPrice;
    }

    const stayPeriod = this.session.context.stayPeriod;
    const arrivalDate = this.initNewDate(stayPeriod.arrivalDate);
    const departureDate = this.initNewDate(stayPeriod.departureDate);
    const endDateSession = departureDate <= this.endDate ? departureDate : this.endDate;

    const range = DateUtil.getDatesRange(arrivalDate, endDateSession, DateFormat.String);
    const rangeWithoutDepartureDate = [...range];
    rangeWithoutDepartureDate.length = range.length - 1;

    if (this.hasAtLeastOneDateNull(roomId, rangeWithoutDepartureDate)) {
      return RoomDefaultLabel.NoPrice;
    }

    return `${this.symbol} ${Math.round(this.calculateAverage(roomId, rangeWithoutDepartureDate)).toString()}`;
  }

  private hasAtLeastOneDateNull(roomId: RoomModel['roomId'], rangeWithoutDepartureDate: string[]) {
    return rangeWithoutDepartureDate.find(date => !!(this.roomPrices[roomId][date] === undefined));
  }

  private calculateAverage(roomId: RoomModel['roomId'], rangeWithoutDepartureDate: string[]) {
    return rangeWithoutDepartureDate.reduce((acc, date) => {
      const valueToAdd = this.roomPrices[roomId][date] ? this.roomPrices[roomId][date].value.amount : 0;
      return acc + valueToAdd;
    }, 0) / rangeWithoutDepartureDate.length;
  }

  clickButton = (type: QwRoomListCardButtonType, room: RoomModel) => {
    this.qwRoomListClickRoom.emit({type, room});
  };

  private initNewDate(date: string | Date) {
    return DateUtil.removeTimeFromDate(new Date(date));
  }

  private isLoadingData() {
    return this.isBasketLoading || this.isRoomLoading || this.isSessionLoading;
  }

  public render() {
    return (
      <Host class={`
        ${this.qwRoomListType === QwRoomListType.Grid ? 'qw-room-list--grid' : ''}
        ${!this.rooms.length ? 'qw-room-list--loading' : 'qw-room-list--loaded'}
      `}>
        <div style={this.rooms.length && { 'display': 'none' }}>
          <slot name="qwRoomListLoading"/>
        </div>
        <div class="qw-room-list__header-message">{this.qwRoomListHeaderMessage}</div>
        {this.rooms.map(r => {
          return <div class="qw-room-list__card-wrapper">
            <qw-room-list-card
              class={`
                ${this.isLoadingData() ? 'qw-room-list-card__disabled' : ''}
                ${this.qwRoomListType === QwRoomListType.Grid ? 'qw-room-list-card--grid' : ''}
              `}
              qwRoomListCardId={r.roomId}
              qwRoomListCardTitle={r.name}
              qwRoomListCardPrice={RoomHelper.getCheapestPriceFormatted(r) || this.basketRoomTotals[r.roomId]}
              qwRoomListCardCrossedOutPrice={RoomHelper.getCheapestCrossedOutPriceFormatted(r)}
              qwRoomListCardAveragePrice={!this.isPriceLoading ? this.getAveragePricePerNight(r.roomId) : ''}
              qwRoomListCardSquareMeter={r.surfaceArea.text}
              qwRoomListCardGuests={RoomHelper.getDefaultOccupancy(r).definition.text}
              qwRoomListCardImage={RoomHelper.getCoverImage(r).url}
              qwRoomListCardRates={r.rates}
              qwRoomListCardIsLoading={this.isLoadingData()}
              qwRoomListCardIsLoadingPrice={this.isPriceLoading}
              qwRoomListCardDescription={RoomHelper.getSummary(r).text}
              qwRoomListCardRangeDate={this.rangeDate}
              qwRoomListCardRangeDateSession={this.rangeDateSession}
              qwRoomListCardPrices={this.roomPrices[r.roomId]}
              qwRoomListCardShowPrices={this.qwRoomListShowPrices}
              qwRoomListCardNights={this.nights}
              qwRoomListCardShowCta={this.qwRoomListShowCta}
              qwRoomListCardOnClickBook={() => this.clickButton(QwRoomListCardButtonType.BookNow, r)}
              qwRoomListCardOnClickView={() => this.clickButton(QwRoomListCardButtonType.ViewRoom, r)}
              qwRoomListCardOnClickChangeDate={() => this.clickButton(QwRoomListCardButtonType.ChangeDate, r)}/>
          </div>;
        })}
      </Host>
    );
  }
}
