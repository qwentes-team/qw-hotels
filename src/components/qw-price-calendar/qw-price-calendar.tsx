import {Component, Host, h, Prop, State, Event, EventEmitter, Watch} from '@stencil/core';
import {
  DateUtil,
  RoomModel,
  SessionDisplay,
  WebsdkQuotationService,
  WebskdQuotationParams
} from "@qwentes/booking-state-manager";
import {QwButton} from "../shared/qw-button/qw-button";
import {combineLatest, Subscription} from "rxjs";
import {PriceCalendarContext} from "../../index";

@Component({
  tag: 'qw-price-calendar',
  styleUrl: 'qw-price-calendar.css',
  shadow: false,
})
export class QwPriceCalendar {
  @Prop() rangeDate: Date[] = [new Date()];
  @Prop() rangeDateSession: Date[] = [new Date()];
  @Prop() language: SessionDisplay['culture'];
  @Prop() roomId!: RoomModel['roomId'];
  @Prop() context: PriceCalendarContext;
  @Event() qwPriceCalendarChangeDates: EventEmitter<'left' | 'right'>;

  @State() priceRange: string[];
  @State() loading = true;

  private getPriceForDate(date: Date) {
    const stringDate = DateUtil.getDateStringFromDate(date);
    return this.fetchPrice(stringDate);
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
    this.priceRange = [];
    const prices$ = this.rangeDate.map((date) => this.getPriceForDate(date));
    this.priceSub$?.unsubscribe();
    this.priceSub$ = combineLatest(prices$).subscribe((prices: string[]) => {
      this.priceRange = prices;
      this.loading = false;
    });
  }

  private createParamsForRequest(date: string) {
    return {
      arrivalDate: date,
      nights: 1,
      roomRestriction: this.roomId,
      currency: this.context.currency,
      adults: this.context.adults,
    }
  }

  private fetchPrice(date: string) {
    const params = this.createParamsForRequest(date);
    return WebsdkQuotationService.getNightQuotation(params as WebskdQuotationParams)
  }

  componentWillLoad() {
    this.hydratePrices();
  }

  @Watch('rangeDate')
  onNameChanged() {
    this.hydratePrices();
  }

  disconnectedCallback() {
    this.priceSub$?.unsubscribe();
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
              {this.priceRange[index] ?? '--'}
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
