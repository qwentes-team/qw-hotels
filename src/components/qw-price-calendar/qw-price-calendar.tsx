import {Component, Host, h, Prop, State, Event, EventEmitter} from '@stencil/core';
import {DateUtil, RoomModel, SessionDisplay} from "@qwentes/booking-state-manager";
import {QwButton} from "../shared/qw-button/qw-button";
import {combineLatest, Observable, Subscription} from "rxjs";

@Component({
  tag: 'qw-price-calendar',
  styleUrl: 'qw-price-calendar.css',
  shadow: false,
})
export class QwPriceCalendar {
  @Prop() rangeDate: Date[] = [
    new Date(2021,7,26),
    new Date(2021,7,27),
    new Date(2021,7,28),
    new Date(2021,7,29),
    new Date(2021,7,30),
    new Date(2021,7,31),
    new Date(2021,8,2),
    new Date(2021,8,3),
    new Date(2021,8,4),
  ];
  @Prop() rangeDateSession: Date[] = [
    new Date(2021,7,26),
    new Date(2021,7,27),
    new Date(2021,7,28),
    new Date(2021,7,29),
    new Date(2021,7,30),
  ];
  @Prop() language: SessionDisplay['culture'];
  @Prop() roomId: RoomModel['roomId'];
  @Event() qwPriceCalendarChangeDates: EventEmitter<'left' | 'right'>;

  @State() priceRange: string[];
  @State() loading = true;

  private getPriceForDate(date: Date) {
    const stringDate = DateUtil.getDateStringFromDate(date);
    // TODO usare state manager
    return fetchPrice(stringDate);
  }

  private isFirstDateInSession(date: Date) {
    return this.rangeDateSession[0].getTime() === date.getTime();
  }

  private isLastDateInSession(date: Date) {
    return this.rangeDateSession[this.rangeDateSession.length - 1].getTime() === date.getTime();
  }

  private isDateInSession(date: Date) {
    return this.rangeDateSession.some(d => d.getTime() === date.getTime());
  }

  private disableLeftButton() {
    const newDate = new Date();
    const today = DateUtil.removeTimeFromDate(newDate);
    const firstDateInRange = DateUtil.removeTimeFromDate(this.rangeDate[0]);
    console.log('disable first', today >= firstDateInRange)
    return today >= firstDateInRange;
  }

  public onChangeDates(direction: 'left' | 'right') {
    const dates = document.querySelectorAll('.qw-price-calendar__block-date');
    const prices = document.querySelectorAll('.qw-price-calendar__block-price');
    const selectedBlocks = document.querySelectorAll('.qw-price-calendar__block--selected');
    dates.forEach(d => d.classList.add('hide'));
    prices.forEach(d => d.classList.add('hide'));
    selectedBlocks.forEach(d => d.classList.add('hide'));
    setTimeout(() => this.qwPriceCalendarChangeDates.emit(direction), 300);
  }

  private formatDate(date: Date) {
    return DateUtil.formatCalendarDate(date, this.language);
  }

  private priceSub$: Subscription;

  private hydratePrices() {
    const prices$ = this.rangeDate.map((date) => this.getPriceForDate(date));
    this.priceSub$?.unsubscribe();
    this.priceSub$ = combineLatest(prices$).subscribe((prices: string[]) => {
      this.priceRange = prices;
      this.loading = false;
    });
  }

  componentWillLoad() {
    this.hydratePrices();
  }

  componentShouldUpdate() {
    this.hydratePrices();
  }

  disconnectedCallback() {
    this.priceSub$.unsubscribe();
  }

  render() {
    return this.loading ? (<qw-loading />)
    : (
      <Host>
        <QwButton
          QwButtonLabel=""
          QwButtonDisabled={this.loading || this.disableLeftButton()}
          QwButtonClass="qw-price-calendar__icon"
          QwButtonOnClick={() => this.onChangeDates('left')}/>
        {this.rangeDate && this.rangeDate.map((date, index) => {
          return <div class={
            `qw-price-calendar__block ${this.isDateInSession(date) ? 'qw-price-calendar__block--selected' : ''}
            ${this.isFirstDateInSession(date) ? 'qw-price-calendar__block--first' : ''}
            ${this.isLastDateInSession(date) ? 'qw-price-calendar__block--last' : ''}`
          }>
            <div class="qw-price-calendar__block-date">{`${this.formatDate(date)}`}</div>
            <div class="qw-price-calendar__block-price" title={this.priceRange[index]}>
              {this.priceRange[index]}
            </div>
          </div>;
        })}
        <QwButton
          QwButtonLabel=""
          QwButtonDisabled={this.loading}
          QwButtonClass="qw-price-calendar__icon"
          QwButtonOnClick={() =>  this.onChangeDates('right')}/>
      </Host>
    );
  }

}

const WEBSDK_TOKEN  = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJib29raW5nRW5naW5lUmVmZXJlbmNlIjoiSko3WSIsImhvdGVsSWQiOiIyNDE4MiIsImdyb3VwSWQiOiIxNDgxNyIsInJlZmVyZW5jZVJhdGVDb2RlIjoiQkIiLCJkaXNwbGF5TmFtZSI6IkdyYW5kLUhvdGVsLUl0YWx5IiwibmJmIjoxNTg0NDU4Mjc4LCJleHAiOjI1MzQwMjMwMDgwMCwiaWF0IjoxNTg0NDU4Mjc4LCJpc3MiOiJBdmFpbHBybyBBUEkgTWFuYWdlciIsImF1ZCI6ImQtZWRnZSJ9.grqf869JR4wLntg3ZVdyA0zUCzx_tr97txzphfueDLKOJBVGbX8df_Kw-UsTd42e8LWqnV82DbjVo4xgxCUvSw';
const WEBSDK_HOTEL_ID = 'JJ7Y-24182';

// Utility function to build the URL query string
const serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

// To simplify the example, this is the context, given the session, the current date of calendar cell, room ID, rate ID, adults, children, accessCode in the session
const context  =  { date: '2021-09-12', adults: 2, children: 1, infants: 0, roomId: 103252, rateName: 291308, accessCode: '', currency: 'EUR' }

let childrenAges = [];
for (let i = 0; i< context.children; i++) { childrenAges.push(12); }
for (let i = 0; i< context.infants; i++) { childrenAges.push(0); }

const buildUrl = (date: string) => {
  return 'https://websdk.d-edge.com/quotation?' + serialize({
    arrivalDate: date,
    property: WEBSDK_HOTEL_ID,
    _authCode:WEBSDK_TOKEN,
    nights: 1,
    roomRestriction: context.roomId,
    currency: context.currency,
    rateName: context.rateName,
    adults: context.adults,
    //childrenAges: childrenAges.join(','),
    // accessCode: context.accessCode
  })
}

// const fetchPrice = (date: string) => {
//   return fetch(buildUrl(date))
//     .then((req) => req.json())
//     .then(
//       // That data.data[0].pricePerNight contains the price for this calendar cell :)
//       (data) => data.data[0].pricePerNight ?? '-'
//     );
// }

const fetchPrice = (date:string) => new Observable((observer) => {
  fetch(buildUrl(date))
    .then(response => response.json())
    .then(res => {
      observer.next(res.data[0].pricePerNight ?? '-');
      observer.complete();
    })
    .catch(err => observer.error(err));
});
