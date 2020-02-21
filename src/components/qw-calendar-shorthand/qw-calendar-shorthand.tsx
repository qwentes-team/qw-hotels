import {Component, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {
  DateUtil,
  Language,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionStayPeriod,
} from '@qwentes/booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';

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

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);
    SessionIsLoading$.subscribe((isLoading) => this.isSessionLoading = isLoading);
  }

  private getTomorrowDateString() {
    return DateUtil.getDateStringFromDate(DateUtil.addDaysToDate(1, DateUtil.removeTimeFromDate(new Date())));
  }

  public today() {
    const arrivalDate = DateUtil.getDateStringFromDate(DateUtil.removeTimeFromDate(new Date()));
    const departureDate = this.getTomorrowDateString();
    this.updateDates({arrivalDate, departureDate}).subscribe(() => {
      this.qwCalendarShorthandTodaySuccess.emit();
    });
  }

  public tomorrow() {
    const arrivalDate = this.getTomorrowDateString();
    const departureDate = DateUtil.getDateStringFromDate(DateUtil.addDaysToDate(2, DateUtil.removeTimeFromDate(new Date())));
    this.updateDates({arrivalDate, departureDate}).subscribe(() => {
      this.qwCalendarShorthandTomorrowSuccess.emit();
    });
  }

  public otherDates() {
    this.qwCalendarShorthandOtherDates.emit();
  }

  private updateDates(stayPeriod: SessionStayPeriod) {
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
