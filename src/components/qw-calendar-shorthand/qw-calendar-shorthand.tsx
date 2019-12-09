import {Component, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {
  DateUtil,
  SessionDisplay,
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
  @State() language: SessionDisplay['culture'];
  @Event() qwCalendarShorthandTodaySuccess: EventEmitter<void>;
  @Event() qwCalendarShorthandTomorrowSuccess: EventEmitter<void>;
  @Event() qwCalendarShorthandOtherDates: EventEmitter<void>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.language = session.display.culture;
    });
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
        <QwButton QwButtonLabel={this.language === 'fr-FR' ? 'Aujourd\'hui' : 'Today'}
                  QwButtonDisabled={this.isSessionLoading} QwButtonOnClick={() => this.today()}/>
        <QwButton QwButtonLabel={this.language === 'fr-FR' ? 'Demain' : 'Tomorrow'}
                  QwButtonDisabled={this.isSessionLoading} QwButtonOnClick={() => this.tomorrow()}/>
        <QwButton QwButtonLabel={this.language === 'fr-FR' ? 'Autres dates' : 'Other dates'}
                  QwButtonDisabled={this.isSessionLoading} QwButtonOnClick={() => this.otherDates()}/>
      </Host>
    );
  }
}
