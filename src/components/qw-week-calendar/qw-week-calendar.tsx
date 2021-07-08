import {Component, EventEmitter, h, Host, Prop, Event} from '@stencil/core';
import {DateUtil, PricesForStayPeriod, RoomDefaultLabel, RoomModel, SessionDisplay} from '@qwentes/booking-state-manager';
import {QwWeekCalendarDirection} from '../../index';
import {QwButton} from '../shared/qw-button/qw-button';

@Component({
  tag: 'qw-week-calendar',
  styleUrl: 'qw-week-calendar.css',
  shadow: false,
})
export class QwWeekCalendar {
  @Prop() qwWeekCalendarRangeDate: Date[];
  @Prop() qwWeekCalendarRangeDateSession: Date[];
  @Prop() qwWeekCalendarPricesByRoom: PricesForStayPeriod[RoomModel['roomId']] = {};
  @Prop() qwWeekCalendarSelectedRoomId: RoomModel['roomId'];
  @Prop() qwWeekCalendarIsLoading: boolean;
  @Prop() qwWeekCalendarLanguage: SessionDisplay['culture'];
  @Event() qwWeekCalendarChangeDates: EventEmitter<QwWeekCalendarDirection>;

  private formatDate(date: Date) {
    return DateUtil.formatCalendarDate(date, this.qwWeekCalendarLanguage);
  }

  private isDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession.some(d => d.getTime() === date.getTime());
  }

  private getPriceForDate(date: Date) {
    const price = this.qwWeekCalendarPricesByRoom[DateUtil.getDateStringFromDate(date)];
    const priceValue = price?.text.split(' ')[1];
    const priceCurrency = price?.text.split(' ')[0];
    const formattedPriceValue = this.formatPrice(priceValue?.replace(/,/g, ""));
    return price ? {currency: priceCurrency, value: priceValue, formattedValue: formattedPriceValue} : {currency: RoomDefaultLabel.NoPrice, value: RoomDefaultLabel.NoPrice, formattedValue: RoomDefaultLabel.NoPrice};
  }

  /* 0 < 10 000 : € or IDR
    10 000 < 10 000 000 : k€ kIDR => 9000k € or 9000k IDR
    10 000 000 : M€ MIDR => 11M € or 11M IDR */

  private formatPrice(value) {
    let valueHtml = Math.ceil(value) + "";
    if (value >= Math.pow(10, 12 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 12), 1) + "T";
    } else if (value >= Math.pow(10, 9 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 9), 1) + "G";
    } else if (value >= Math.pow(10, 6 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 6), 1) + "M";
    } else if (value >= Math.pow(10, 3 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 3), 1) + "k";
    }
    return valueHtml;
  }

  private precisionRound(value, divisor, precision) {
    let number = value / divisor;
    // Round to the n decimal
    var factor = Math.pow(10, precision);
    let r = Math.round(number * factor) / factor;

    let d = r.toFixed(1);

    if (d[d.length - 1] === "0") {
      return r.toFixed(0);
    }

    return d;
  }

  private isFirstDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession[0].getTime() === date.getTime();
  }

  private isLastDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession[this.qwWeekCalendarRangeDateSession.length - 1].getTime() === date.getTime();
  }

  removeTimeFromDate(date: string) {
    if (date) {
      const dateElements = (date as string).split('-');
      const year = parseInt(dateElements[0]);
      const month = parseInt(dateElements[1]);
      const day = parseInt(dateElements[2]);
      const utcDate = Date.UTC(year, month, day, 0, 0, 0, 0);
      return new Date(utcDate);
    }
  }

  private disableLeftButton() {
    const today = this.removeTimeFromDate(this.formatDate(new Date()));
    const firstDateInRange = this.removeTimeFromDate(this.formatDate(this.qwWeekCalendarRangeDate[0]));
    return today >= firstDateInRange;
  }

  public onChangeDates(direction: QwWeekCalendarDirection) {
    const dates = document.querySelectorAll('.qw-calendar-week__block-date');
    const prices = document.querySelectorAll('.qw-calendar-week__block-price');
    const selectedBlocks = document.querySelectorAll('.qw-calendar-week__block--selected');
    dates.forEach(d => d.classList.add('hide'));
    prices.forEach(d => d.classList.add('hide'));
    selectedBlocks.forEach(d => d.classList.add('hide'));
    setTimeout(() => this.qwWeekCalendarChangeDates.emit(direction), 300);
  }

  render() {
    return (
      <Host>
        <QwButton
          QwButtonLabel=""
          QwButtonDisabled={this.qwWeekCalendarIsLoading || this.disableLeftButton()}
          QwButtonClass="qw-week-calendar__icon"
          QwButtonOnClick={() => this.onChangeDates(QwWeekCalendarDirection.Left)}/>
        {this.qwWeekCalendarRangeDate && this.qwWeekCalendarRangeDate.map(date => {
          return <div class={
            `qw-calendar-week__block ${this.isDateInSession(date) ? 'qw-calendar-week__block--selected' : ''}
            ${this.isFirstDateInSession(date) ? 'qw-calendar-week__block--first' : ''}
            ${this.isLastDateInSession(date) ? 'qw-calendar-week__block--last' : ''}`
          }>
            <div class="qw-calendar-week__block-date">{`${this.formatDate(date)}`}</div>
            <div class="qw-calendar-week__block-price" title={this.getPriceForDate(date).currency + ' ' + this.getPriceForDate(date).value}>
              {this.getPriceForDate(date).currency + ' ' + this.getPriceForDate(date).formattedValue}
            </div>
          </div>;
        })}
        <QwButton
          QwButtonLabel=""
          QwButtonDisabled={this.qwWeekCalendarIsLoading}
          QwButtonClass="qw-week-calendar__icon"
          QwButtonOnClick={() => this.onChangeDates(QwWeekCalendarDirection.Right)}/>
      </Host>
    );
  }
}
