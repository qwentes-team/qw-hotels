import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketHelper, BasketModel, BasketService, BasketWithPrice$, DateFormat, DateUtil, Language,
  MONEY_SYMBOLS, MoneyPrice, PricesForStayPeriod, RateInformation, RoomAvailability,
  RoomBasketModel, RoomDefaultLabel, RoomHelper, RoomIsLoading$, RoomLoaded$, RoomModel, RoomService,
  SessionDisplay, SessionHelper, SessionIsLoading$, SessionLoaded$, SessionModel, SessionService, SessionStayPeriod,
} from '@qwentes/booking-state-manager';
import {first, switchMap} from 'rxjs/operators';
import {of, zip} from 'rxjs';
import {
  QwChangeRoomEvent,
  QwRoomBaseInfoType,
  QwRoomListCardButtonType,
  QwRoomListOrderType,
  QwRoomListType,
  QwWeekCalendarDirection,
} from '../../index';

const mockRoomsSkeleton = {roomId: 1, pictures: [], summary: []} as any;

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
  @Prop() qwRoomListShowRates: boolean = false;
  @Prop() qwRoomListOrder: QwRoomListOrderType = QwRoomListOrderType.AscendingPrice;
  @Prop() qwRoomListPlaceholders: string;
  @Prop() qwRoomListBaseInfoType: QwRoomBaseInfoType = QwRoomBaseInfoType.Inline;
  @Prop() qwRoomListImageTransformationOptions: string;
  @Prop() qwRoomListRateHighlight: RateInformation['code'];
  @Prop() qwRoomListShowAvailabilityMessage: boolean = false;
  @State() rooms: RoomModel[] = [];
  @State() firstLoad: boolean = false;
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
  @State() basketRoom: RoomBasketModel;
  @State() basketRoomTotals: {[roomId: string]: MoneyPrice} = {};
  @State() numberOfGuests: number;
  @State() numberOfAccommodation: number;
  @State() language: SessionDisplay['culture'];
  @State() noAvailability = false;
  @Event() qwRoomListClickRoom: EventEmitter<{type: QwRoomListCardButtonType, room: RoomModel}>;
  @Event() qwRoomListOnLoad: EventEmitter<void>;

  private startDate: Date;
  private endDate: Date;
  private symbol: string;
  private rangeDateString: string[];
  private rangeDateStored: string[] = [];
  private todayString: string;

  public componentWillLoad() {
    if (this.qwRoomListPlaceholders) {
      this.rooms = Array(parseInt(this.qwRoomListPlaceholders)).fill(mockRoomsSkeleton);
    }

    this.todayString = DateUtil.getDateStringFromDate(this.initNewDate(new Date()));
    SessionService.getSession().subscribe();

    // prezzi gestiti nella lista perché arrivano in batch - non è possibile fare un componente plug and play per questioni di performance
    SessionLoaded$.pipe(
      switchMap(session => {
        this.isPriceLoading = true;
        this.session = session;
        this.language = session.display.culture;
        this.symbol = MONEY_SYMBOLS[session.display.currency] || session.display.currency;
        this.nights = SessionHelper.getNumberOfNights(session);
        this.numberOfGuests = SessionHelper.getTotalGuests(session);
        const sessionStayPeriod = session.context.stayPeriod;
        this.rangeDateSession = DateUtil.getDatesRange(this.initNewDate(sessionStayPeriod.arrivalDate), this.initNewDate(sessionStayPeriod.departureDate), DateFormat.Date);
        return zip(of(session), BasketService.getBasket(session));
      }),
      switchMap(([session]) => {
        RoomService.getRoomsAvailability(session.sessionId)
          .subscribe((res) => this.getRoomAvailabilitySuccess(res));

        if (!this.qwRoomListShowPrices) {
          return zip(of({}), RoomService.getRooms(session.sessionId));
        }
        return zip(this.getRoomsSearchForRange(session.context.stayPeriod), RoomService.getRooms(session.sessionId));
      }),
    ).subscribe(([newRoomPrices]) => {
      this.getRoomsSearchForRangeSuccess(newRoomPrices);
    });

    RoomLoaded$.pipe(first()).subscribe(() => this.qwRoomListOnLoad.emit());

    RoomLoaded$.subscribe(res => {
      this.firstLoad = true;

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

  private getRoomsSearchForRange(
    sessionStayPeriod: SessionStayPeriod,
    currency: SessionDisplay['currency'] = this.session.display.currency,
  ) {
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
    return RoomService.getRoomPricesForStayPeriods(newDateToRequestStayPeriods, currency);
  }

  private getAveragePricePerNight(roomId: RoomModel['roomId']) {
    if (!this.roomPrices[roomId] || !Object.keys(this.roomPrices[roomId]).length) {
      return RoomDefaultLabel.NoPrice;
    }

    const stayPeriod = this.session.context.stayPeriod;
    const arrivalDate = this.initNewDate(stayPeriod.arrivalDate);
    const departureDate = this.initNewDate(stayPeriod.departureDate);

    const range = DateUtil.getDatesRange(arrivalDate, departureDate, DateFormat.String);
    const rangeWithoutDepartureDate = [...range];
    rangeWithoutDepartureDate.length = range.length - 1;

    const calculate = this.calculateAverage(roomId, rangeWithoutDepartureDate);

    if (!Number(calculate)) {
      return RoomDefaultLabel.NoPrice;
    }

    return `${this.symbol} ${Math.round(calculate).toString()}`;
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
    const dates = document.querySelectorAll('.qw-calendar-week__block-date');
    const prices = document.querySelectorAll('.qw-calendar-week__block-price');
    const selectedBlocks = document.querySelectorAll('.qw-calendar-week__block--selected');
    dates.forEach(d => d.classList.remove('hide'));
    prices.forEach(d => d.classList.remove('hide'));
    selectedBlocks.forEach(d => d.classList.remove('hide'));

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

  onAddedToBasket = (e: BasketModel) => {
    this.numberOfAccommodation = BasketHelper.getNumberOfAccommodation(e);
  };

  private resetRoomPrices() {
    this.roomPrices = Object.keys(this.roomPrices).reduce((acc, key) => ({...acc, [key]: {}}), {});
    this.rangeDateStored = [];
  }

  @Listen('qwCurrencyChanged', {target: 'window'})
  public currencyChanged(event: CustomEvent<SessionDisplay['currency']>) {
    this.resetRoomPrices();
    this.getRoomsSearchForRange(this.session.context.stayPeriod, event.detail)
      .subscribe((newRoomPrices) => this.getRoomsSearchForRangeSuccess(newRoomPrices));
  }

  public getRoomAvailabilitySuccess(availability: RoomAvailability) {
    this.noAvailability = availability === RoomAvailability.noAvailability;
  }

  public render() {
    return (
      <Host class={`
        qw-room-list--${this.qwRoomListType}
        ${!this.firstLoad ? 'qw-room-list--loading' : 'qw-room-list--loaded'}
      `}>
        <div class="qw-room-list__loading-wrapper">
          <slot name="qwRoomListLoading"/>
        </div>
        <div class="qw-room-list__cards">

          {this.qwRoomListShowAvailabilityMessage && this.noAvailability
            ? <qw-error class="qw-room-list__no-availability">{Language.getTranslation('noAvailabilityRooms')}</qw-error>
            : ''}

          {this.rooms.map(r => {
            return <div class="qw-room-list__card-wrapper">
              <qw-room-list-card
                class={`
                  qw-room-list-card--${this.qwRoomListType}
                  ${this.isLoadingData() ? 'qw-room-list-card__disabled' : ''}
                `}
                qwRoomListCardId={r.roomId}
                qwRoomListCardTitle={r.name}
                qwRoomListCardPrice={RoomHelper.getCheapestPriceFormatted(r) || (this.basketRoomTotals[r.roomId] && this.basketRoomTotals[r.roomId].text)}
                qwRoomListCardCrossedOutPrice={RoomHelper.getCheapestCrossedOutPriceFormatted(r)}
                qwRoomListCardAveragePrice={this.roomPrices ? this.getAveragePricePerNight(r.roomId) : ''}
                qwRoomListCardImage={RoomHelper.getCoverImage(r)?.url}
                qwRoomListCardBasketRoom={this.getBasketRoom(r.roomId)}
                qwRoomListCardIsLoading={this.isLoadingData()}
                qwRoomListCardIsLoadingPrice={this.isPriceLoading}
                qwRoomListCardDescription={RoomHelper.getSummary(r)?.text}
                qwRoomListCardRangeDate={this.rangeDate}
                qwRoomListCardRangeDateSession={this.rangeDateSession}
                qwRoomListCardPrices={this.roomPrices[r.roomId]}
                qwRoomListCardShowPrices={this.qwRoomListShowPrices}
                qwRoomListCardNights={this.nights}
                qwRoomListCardShowCta={this.qwRoomListShowCta}
                qwRoomListCardShowRates={this.qwRoomListShowRates}
                qwRoomListCardBasketIsEmpty={this.basketIsEmpty}
                qwRoomListCardOnChangeRoom={(e) => this.setRoomInBasket(e)}
                qwRoomListCardNumberOfGuests={this.numberOfGuests}
                qwRoomListCardNumberOfAccommodation={this.numberOfAccommodation}
                qwRoomListCardLanguage={this.language}
                qwRoomListCardType={this.qwRoomListType}
                qwRoomListCardPlaceholders={this.qwRoomListPlaceholders}
                qwRoomListCardBaseInfoType={this.qwRoomListBaseInfoType}
                qwRoomListCardRateHighlight={this.qwRoomListRateHighlight}
                qwRoomListCardImageTransformationOptions={this.qwRoomListImageTransformationOptions ? JSON.parse(this.qwRoomListImageTransformationOptions) : {}}
                qwRoomListCardOnClickBook={() => this.clickButton(QwRoomListCardButtonType.BookNow, r)}
                qwRoomListCardOnClickView={() => this.clickButton(QwRoomListCardButtonType.ViewRoom, r)}
                qwRoomListCardOnClickChangeDate={() => this.clickButton(QwRoomListCardButtonType.ChangeDate, r)}
                qwRoomListCardOnChangeWeekDates={(e) => this.weekDatesChanged(e)}
                qwRoomListCardOnAddedToBasket={(e) => this.onAddedToBasket(e)}
                qwRoomListCardOnProceedToCheckout={() => this.clickButton(QwRoomListCardButtonType.Checkout, r)}/>
            </div>;
          })}
        </div>
      </Host>
    );
  }
}
