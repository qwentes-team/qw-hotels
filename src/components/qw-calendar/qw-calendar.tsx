import {Component, Host, h, Prop, State, Listen, Event, EventEmitter} from '@stencil/core';
import {
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionStayPeriod
} from 'booking-state-manager';

@Component({
  tag: 'qw-calendar',
  styleUrl: 'qw-calendar.css',
  shadow: false
})
export class QwCalendar {
  @Prop() qwCalendarNumberOfMonths: number = 1;
  @Prop() qwCalendarResponsive: boolean = true;
  @Prop() qwCalendarSyncOnChange: boolean = true;
  @State() session: SessionModel;
  @State() stayPeriod: SessionStayPeriod;
  @State() isSessionLoading: boolean;
  @Event() qwCalendarChange: EventEmitter<SessionStayPeriod>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.stayPeriod = {...session.context.stayPeriod};
    });
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  @Listen('qwCalendarPickerChangeDates')
  updateStayPeriod(event: CustomEvent<SessionStayPeriod>) {
    this.stayPeriod = {...event.detail};
    this.qwCalendarChange.emit(this.stayPeriod);

    if (!this.qwCalendarSyncOnChange) {
      return
    }

    SessionService.updateContextSession({...this.session.context, stayPeriod: this.stayPeriod})
      .subscribe({
        error: (err) => {
          console.log(err);
          this.restoreStayPeriod();
        }
      });
  }

  private restoreStayPeriod() {
    this.stayPeriod = {} as SessionStayPeriod;
    setTimeout(() => this.stayPeriod = {...this.session.context.stayPeriod});
  }

  render() {
    return (
      <Host>
        <qw-calendar-picker
          qwCalendarPickerResponsive={this.qwCalendarResponsive}
          qwCalendarPickerNumberOfMonths={this.qwCalendarNumberOfMonths}
          qwCalendarPickerDisabled={this.isSessionLoading}
          qwCalendarPickerStayPeriod={this.stayPeriod}/>
      </Host>
    );
  }
}
