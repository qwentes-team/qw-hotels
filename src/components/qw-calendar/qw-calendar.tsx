import {Component, Host, h, Prop, State, Listen} from '@stencil/core';
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
  @Prop() qwCalendarNumberOfMonths: number = 2;
  @State() session: SessionModel;
  @State() stayPeriod: SessionStayPeriod;
  @State() isSessionLoading: boolean = false;

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
    SessionService.updateContextSession({...this.session.context, stayPeriod: event.detail})
      .subscribe({
        error: (err) => {
          // todo: gestire errore 'basket not empty'
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
          qw-calendar-picker-number-of-months={this.qwCalendarNumberOfMonths}
          qw-calendar-picker-disabled={this.isSessionLoading}
          qwCalendarPickerStayPeriod={this.stayPeriod}/>
      </Host>
    );
  }
}
