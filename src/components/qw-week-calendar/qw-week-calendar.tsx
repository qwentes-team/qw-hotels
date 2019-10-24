import {Component, h, Host, Prop, State} from '@stencil/core';
import {
  DateUtil, RoomModel,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
} from 'booking-state-manager';

const FALLBACK_PRICE_LABEL = '--';

@Component({
  tag: 'qw-week-calendar',
  styleUrl: 'qw-week-calendar.css',
  shadow: false,
})
export class QwWeekCalendar {
  @Prop() qwWeekCalendarIsPriceLoading: boolean;
  @Prop() qwWeekCalendarRangeDate: Date[];
  @Prop() qwWeekCalendarRangeDateSession: Date[];
  @Prop() qwWeekCalendarPricesByRoom: any;
  @Prop() qwWeekCalendarSelectedRoomId: RoomModel['roomId'];
  @State() session: SessionModel;
  @State() isSessionLoading: boolean;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  private formatDate(date: Date) {
    return Intl.DateTimeFormat(this.session && this.session.display.culture, {day: 'numeric', month: 'short'}).format(date);
  }

  private isDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession.some(d => {
      return d.getTime() === date.getTime()
    });
  }

  private getPriceForDate(date: Date) {
    if (!this.qwWeekCalendarPricesByRoom[this.qwWeekCalendarSelectedRoomId]) {
      return FALLBACK_PRICE_LABEL;
    }
    return this.qwWeekCalendarPricesByRoom[this.qwWeekCalendarSelectedRoomId][DateUtil.getDateStringFromDate(date)];
  }

  private isFirstDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession[0].getTime() === date.getTime();
  }

  private isLastDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession[this.qwWeekCalendarRangeDateSession.length - 1].getTime() === date.getTime();
  }

  render() {
    return (
      <Host>
        {!this.isSessionLoading && this.qwWeekCalendarRangeDate ? this.qwWeekCalendarRangeDate.map(date => {
          return <div class={
            `qw-calendar-week__block ${this.isDateInSession(date) ? 'qw-calendar-week__block--selected' : ''}
            ${this.isFirstDateInSession(date) ? 'qw-calendar-week__block--first' : ''}
            ${this.isLastDateInSession(date) ? 'qw-calendar-week__block--last' : ''}`
          }>
            <div class="qw-calendar-week__block-date">{`${this.formatDate(date)}`}</div>
            <div class="qw-calendar-week__block-price">
              {this.qwWeekCalendarPricesByRoom ? (this.getPriceForDate(date) || FALLBACK_PRICE_LABEL) : <qw-loading qw-loading-size="16"></qw-loading>}
            </div>
          </div>;
        }) : <qw-loading qw-loading-size="22"></qw-loading>}
      </Host>
    );
  }
}
