import {Component, h, Host, Prop, State} from '@stencil/core';
import {
  DateUtil, PricesForStayPeriod, RoomModel,
  SessionLoaded$, SessionModel, SessionService,
} from 'booking-state-manager';

@Component({
  tag: 'qw-week-calendar',
  styleUrl: 'qw-week-calendar.css',
  shadow: false,
})
export class QwWeekCalendar {
  @Prop() qwWeekCalendarIsPriceLoading: boolean;
  @Prop() qwWeekCalendarRangeDate: Date[];
  @Prop() qwWeekCalendarRangeDateSession: Date[];
  @Prop() qwWeekCalendarPricesByRoom: PricesForStayPeriod[RoomModel['roomId']] = {};
  @Prop() qwWeekCalendarSelectedRoomId: RoomModel['roomId'];
  @State() session: SessionModel; // todo passare lingua come prop e rimuovere session

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);
  }

  private formatDate(date: Date) {
    const language = this.session && this.session.display.culture;
    return DateUtil.formatCalendarDate(date, language);
  }

  private isDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession.some(d => d.getTime() === date.getTime());
  }

  private getPriceForDate(date: Date) {
    const price = this.qwWeekCalendarPricesByRoom[DateUtil.getDateStringFromDate(date)];
    return price ? price.text : '--';
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
        {this.qwWeekCalendarRangeDate && this.qwWeekCalendarRangeDate.map(date => {
          return <div class={
            `qw-calendar-week__block ${this.isDateInSession(date) ? 'qw-calendar-week__block--selected' : ''}
            ${this.isFirstDateInSession(date) ? 'qw-calendar-week__block--first' : ''}
            ${this.isLastDateInSession(date) ? 'qw-calendar-week__block--last' : ''}`
          }>
            <div class="qw-calendar-week__block-date">{`${this.formatDate(date)}`}</div>
            <div class="qw-calendar-week__block-price">
              {this.getPriceForDate(date)}
            </div>
          </div>;
        })}
      </Host>
    );
  }
}
