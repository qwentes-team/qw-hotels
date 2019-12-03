import {Component, EventEmitter, h, Host, Prop, State, Event} from '@stencil/core';
import {
  DateUtil, PricesForStayPeriod, RoomDefaultLabel, RoomModel,
  SessionLoaded$, SessionModel, SessionService,
} from '@qwentes/booking-state-manager';
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
  @State() session: SessionModel; // todo passare lingua come prop e rimuovere session
  @Event() qwWeekCalendarChangeDates: EventEmitter<QwWeekCalendarDirection>;

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
    return price ? price.text : RoomDefaultLabel.NoPrice;
  }

  private isFirstDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession[0].getTime() === date.getTime();
  }

  private isLastDateInSession(date: Date) {
    return this.qwWeekCalendarRangeDateSession[this.qwWeekCalendarRangeDateSession.length - 1].getTime() === date.getTime();
  }

  private disableLeftButton() {
    const today = DateUtil.removeTimeFromDate(new Date());
    const firstDateInRange = DateUtil.removeTimeFromDate(this.qwWeekCalendarRangeDate[0]);
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
          QwButtonOnClick={() => this.onChangeDates(QwWeekCalendarDirection.Left)} />
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
        <QwButton
          QwButtonLabel=""
          QwButtonDisabled={this.qwWeekCalendarIsLoading}
          QwButtonClass="qw-week-calendar__icon"
          QwButtonOnClick={() => this.onChangeDates(QwWeekCalendarDirection.Right)} />
      </Host>
    );
  }
}
