import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {
  BasketHelper,
  BasketService,
  BasketWithPrice$,
  createRateFromRoomBasketOccupancy,
  DateFormat,
  DateUtil,
  MONEY_SYMBOLS,
  MoneyPrice,
  PricesForStayPeriod,
  Rate,
  RoomBasketModel,
  RoomBasketOccupancy,
  RoomDefaultLabel,
  RoomHelper,
  RoomIsLoading$,
  RoomLoaded$,
  RoomModel,
  RoomService,
  SessionHelper,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionStayPeriod,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {zip} from 'rxjs/internal/observable/zip';
import {QwChangeRoomEvent, QwRoomListCardButtonType, QwRoomListOrderType, QwRoomListType, QwWeekCalendarDirection} from '../../index';

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
  @Prop() qwRoomListOrder: QwRoomListOrderType = QwRoomListOrderType.AscendingPrice;
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
  @State() basketIsEmpty: boolean;
  @State() basketRooms: RoomBasketModel[] = [];
  @State() basketRoomsOccupancyId: RoomBasketOccupancy['occupancyId'];
  @State() basketRoom: RoomBasketModel;
  @State() basketRoomTotals: {[roomId: string]: MoneyPrice} = {};
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
        const sessionStayPeriod = session.context.stayPeriod;
        this.rangeDateSession = DateUtil.getDatesRange(this.initNewDate(sessionStayPeriod.arrivalDate), this.initNewDate(sessionStayPeriod.departureDate), DateFormat.Date);
        return zip(of(session), BasketService.getBasket(session));
      }),
      switchMap(([session]) => {
        if (!this.qwRoomListShowPrices) {
          return zip(of({}), RoomService.getRooms(session.sessionId));
        }
        return zip(this.getRoomsSearchForRange(session.context.stayPeriod), RoomService.getRooms(session.sessionId));
      })
    ).subscribe(([newRoomPrices]) => this.getRoomsSearchForRangeSuccess(newRoomPrices));

    RoomLoaded$.subscribe(res => {
      const roomsWithPrice = res.filter(room => {
        return RoomHelper.getCheapestPrice(room).value || this.basketRoomTotals[room.roomId];
      });

      const roomsWithoutPrice = res.filter(room => {
        return !(RoomHelper.getCheapestPrice(room).value || this.basketRoomTotals[room.roomId]);
      });

      const sortedRooms = roomsWithPrice.sort((a, b) => {
        const priceA = RoomHelper.getCheapestPrice(a).value || (this.basketRoomTotals[a.roomId] && this.basketRoomTotals[a.roomId].value);
        const priceB = RoomHelper.getCheapestPrice(b).value || (this.basketRoomTotals[b.roomId] && this.basketRoomTotals[b.roomId].value);
        return this.qwRoomListOrder === QwRoomListOrderType.AscendingPrice ? priceA.amount - priceB.amount : priceB.amount - priceA.amount;
      });

      const rooms = [...sortedRooms, ...roomsWithoutPrice];

      return this.rooms = !this.qwRoomListFilterRoomsWith ? rooms : this.getFilteredRooms(rooms);
    });
    BasketWithPrice$.subscribe(basket => {
      this.basketIsEmpty = !basket.rooms.length;
      this.basketRooms = basket.rooms;
      const firstBasketRoom = !this.basketIsEmpty && basket.rooms[0];
      this.basketRoomsOccupancyId = parseInt(firstBasketRoom && BasketHelper.getFirstOccupancyIdInBasketRoom(firstBasketRoom));
      this.basketRoomTotals = basket.rooms.reduce((acc, room) => {
        const occupancyId = BasketHelper.getFirstOccupancyIdInBasketRoom(room);
        return {...acc, [room.roomId]: room.occupancies[occupancyId].price.converted};
      }, {});
    });

    RoomIsLoading$.subscribe(isLoading => this.isRoomLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
    SessionIsLoading$.subscribe(isLoading => this.isBasketLoading = isLoading);
  }

  private getRoomsSearchForRangeSuccess(newRoomPrices) {
    const firstRoomId = Object.keys(newRoomPrices).length && Object.keys(newRoomPrices)[0];
    const newDatesToStore = newRoomPrices[firstRoomId] ? Object.keys(newRoomPrices[firstRoomId]) : [];
    const mergedDataStored = [...this.rangeDateStored, ...newDatesToStore];
    this.rangeDateStored = [...new Set(mergedDataStored)].sort();
    this.roomPrices = this.mergeActiveRoomPricesWitNewRoomPrices(newRoomPrices);
    this.isPriceLoading = false;
  }

  private getBasketRoom(roomId: RoomModel['roomId']) {
    return this.basketRooms.find(r => r.roomId === roomId);
  }

  private getBasketRoomRate(roomId: RoomModel['roomId']) {
    const basketRoom = this.getBasketRoom(roomId);
    const occupancyId = basketRoom && BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
    return basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[occupancyId]);
  }

  private mergeRatesAndBasketRoomRate(rates: Rate[] = [], roomId: RoomModel['roomId']) {
    const basketRoomRate = this.getBasketRoomRate(roomId);
    return basketRoomRate ? [basketRoomRate, ...rates] : rates;
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

    const range = DateUtil.getDatesRange(arrivalDate, departureDate, DateFormat.String);
    const rangeWithoutDepartureDate = [...range];
    rangeWithoutDepartureDate.length = range.length - 1;

    return `${this.symbol} ${Math.round(this.calculateAverage(roomId, rangeWithoutDepartureDate)).toString()}`;
  }

  private calculateAverage(roomId: RoomModel['roomId'], rangeWithoutDepartureDate: string[]) {
    const rangeFiltered = rangeWithoutDepartureDate.reduce((acc, dateString) => {
      return this.roomPrices[roomId][dateString] ? [...acc, dateString] : acc;
    }, []);

    return rangeFiltered.reduce((acc, date) => {
      const valueToAdd = this.roomPrices[roomId][date] ? this.roomPrices[roomId][date].value.amount : 0;
      return acc + valueToAdd;
    }, 0) / rangeFiltered.length;
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

  setRoomInBasket = (e: QwChangeRoomEvent) => {
    const occId = BasketHelper.getFirstOccupancyIdInBasketRoom(e.room);
    const {rateId, occupancyId} = e.room.occupancies[occId];

    BasketService.setRoomInBasket({
      quantity: parseInt(e.quantity),
      roomId: e.room.roomId,
      rateId,
      occupancyId,
    }).subscribe();
  };

  weekDatesChanged = (e: QwWeekCalendarDirection) => {
    this.isPriceLoading = true;
    const newRange = e === QwWeekCalendarDirection.Right
      ? this.getNextRangeOfDates(this.rangeDateString[this.rangeDateString.length - 1])
      : this.getPrevRangeOfDates(this.rangeDateString[0]);

    this.getRoomsSearchForRange(newRange)
      .subscribe((newRoomPrices) => this.getRoomsSearchForRangeSuccess(newRoomPrices));
  };

  private getNextRangeOfDates(date: string): SessionStayPeriod {
    const firstDateMinusOne = this.initNewDate(date);
    const firstDate = DateUtil.addDaysToDate(2, firstDateMinusOne);
    const lastDate = DateUtil.addDaysToDate(8, firstDate);
    return {arrivalDate: DateUtil.getDateStringFromDate(firstDate), departureDate: DateUtil.getDateStringFromDate(lastDate)};
  }

  private getPrevRangeOfDates(date: string) {
    const today = this.initNewDate(new Date());
    const lastDate = this.initNewDate(date);
    const shouldBeFirstDate = DateUtil.addDaysToDate(-6, lastDate);
    const firstDate = today >= shouldBeFirstDate ? today : shouldBeFirstDate;
    return {arrivalDate: DateUtil.getDateStringFromDate(firstDate), departureDate: DateUtil.getDateStringFromDate(lastDate)};
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
              qwRoomListCardPrice={RoomHelper.getCheapestPriceFormatted(r) || (this.basketRoomTotals[r.roomId] && this.basketRoomTotals[r.roomId].text)}
              qwRoomListCardCrossedOutPrice={RoomHelper.getCheapestCrossedOutPriceFormatted(r)}
              qwRoomListCardAveragePrice={this.roomPrices ? this.getAveragePricePerNight(r.roomId) : ''}
              qwRoomListCardSquareMeter={r.surfaceArea.text}
              qwRoomListCardGuests={RoomHelper.getDefaultOccupancy(r).definition.text}
              qwRoomListCardImage={RoomHelper.getCoverImage(r).url}
              qwRoomListCardRates={this.mergeRatesAndBasketRoomRate(r.rates, r.roomId)}
              qwRoomListCardBasketRoom={this.getBasketRoom(r.roomId)}
              qwRoomListCardBasketRoomOccupancyId={this.basketRoomsOccupancyId}
              qwRoomListCardIsLoading={this.isLoadingData()}
              qwRoomListCardIsLoadingPrice={this.isPriceLoading}
              qwRoomListCardDescription={RoomHelper.getSummary(r).text}
              qwRoomListCardRangeDate={this.rangeDate}
              qwRoomListCardRangeDateSession={this.rangeDateSession}
              qwRoomListCardPrices={this.roomPrices[r.roomId]}
              qwRoomListCardShowPrices={this.qwRoomListShowPrices}
              qwRoomListCardNights={this.nights}
              qwRoomListCardShowCta={this.qwRoomListShowCta}
              qwRoomListCardBasketIsEmpty={this.basketIsEmpty}
              qwRoomListCardOnChangeRoom={(e) => this.setRoomInBasket(e)}
              qwRoomListCardOnClickBook={() => this.clickButton(QwRoomListCardButtonType.BookNow, r)}
              qwRoomListCardOnClickView={() => this.clickButton(QwRoomListCardButtonType.ViewRoom, r)}
              qwRoomListCardOnClickChangeDate={() => this.clickButton(QwRoomListCardButtonType.ChangeDate, r)}
              qwRoomListCardOnChangeWeekDates={(e) => this.weekDatesChanged(e)}/>
          </div>;
        })}
      </Host>
    );
  }
}
