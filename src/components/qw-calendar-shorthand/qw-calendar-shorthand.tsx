import {Component, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {
  DateUtil,
  Language, SessionHasRoomsSync,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionStayPeriod,
} from '@qwentes/booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';
import {removeTimeFromDate} from "../../index";

@Component({
  tag: 'qw-calendar-shorthand',
  styleUrl: 'qw-calendar-shorthand.css',
  shadow: false
})
export class QwCalendarShorthand {
  @State() session: SessionModel;
  @State() isSessionLoading: boolean;
  @Event() qwCalendarShorthandTodaySuccess: EventEmitter<void>;
  @Event() qwCalendarShorthandTomorrowSuccess: EventEmitter<void>;
  @Event() qwCalendarShorthandOtherDates: EventEmitter<void>;
  @Event() qwBasketWillBeReset: EventEmitter<void>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);
    SessionIsLoading$.subscribe((isLoading) => this.isSessionLoading = isLoading);
  }

  addDaysToDate(days: number, date: Date) {
    const dateToFormat = DateUtil.formatDate(date);
    const extendedDate = removeTimeFromDate(dateToFormat);
    extendedDate.setDate(extendedDate.getDate() + (days + 1));
    return extendedDate;
  };

//
  private getTomorrowDateString() {
    return DateUtil.getDateStringFromDate(this.addDaysToDate(1, removeTimeFromDate(DateUtil.formatDate(new Date()))));
  }

  public today() {
    const arrivalDate = DateUtil.getDateStringFromDate(removeTimeFromDate(DateUtil.formatDate(new Date())));
    const departureDate = this.getTomorrowDateString();
    this.updateDates({arrivalDate, departureDate}).subscribe(() => {
      this.qwCalendarShorthandTodaySuccess.emit();
    });
  }

  public tomorrow() {
    const arrivalDate = this.getTomorrowDateString();
    const departureDate = DateUtil.getDateStringFromDate(this.addDaysToDate(2, removeTimeFromDate(DateUtil.formatDate(new Date()))));
    this.updateDates({arrivalDate, departureDate}).subscribe(() => {
      this.qwCalendarShorthandTomorrowSuccess.emit();
    });
  }

  public otherDates() {
    this.qwCalendarShorthandOtherDates.emit();
  }

  private updateDates(stayPeriod: SessionStayPeriod) {
    if (SessionHasRoomsSync()) {
      this.qwBasketWillBeReset.emit();
    }
    return SessionService.updateContextSession({...this.session.context, stayPeriod: stayPeriod});
  }

  render() {
    return (
      <Host>
        <QwButton QwButtonLabel={Language.getTranslation('today')}
                  QwButtonDisabled={this.isSessionLoading} QwButtonOnClick={() => this.today()}/>
        <QwButton QwButtonLabel={Language.getTranslation('tomorrow')}
                  QwButtonDisabled={this.isSessionLoading} QwButtonOnClick={() => this.tomorrow()}/>
        <QwButton QwButtonLabel={Language.getTranslation('otherDates')}
                  QwButtonDisabled={this.isSessionLoading} QwButtonOnClick={() => this.otherDates()}/>
      </Host>
    );
  }
}
