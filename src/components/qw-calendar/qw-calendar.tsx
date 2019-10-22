import {Component, Host, h, Prop, State, Element, Listen} from '@stencil/core';
import {SessionLoaded$, SessionModel, SessionService, SessionStayPeriod} from 'booking-state-manager';
import {HTMLStencilElement} from '@stencil/core/internal';

@Component({
  tag: 'qw-calendar',
  styleUrl: 'qw-calendar.css',
  shadow: false
})
export class QwCalendar {
  @Prop() QwCalendarNumberOfMonths: number = 1;
  @State() session: SessionModel;
  @State() stayPeriod: SessionStayPeriod = {arrivalDate: undefined, departureDate: undefined};
  @Element() el: HTMLStencilElement;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.stayPeriod = {...session.context.stayPeriod};
    });
  }

  @Listen('qwCalendarPickerChangeDates')
  todoCompletedHandler(event: CustomEvent) {
    const stayPeriod: SessionStayPeriod = event.detail;
    console.log('Received the custom qwCalendarPickerChangeDates event: ', stayPeriod);
    SessionService.updateContextSession({stayPeriod}).subscribe({
      error: (err) => {
        console.log(err);
        // todo: gestire errore 'basket not empty'
        // this.stayPeriod = {arrivalDate: '2019-10-20', departureDate: '2019-10-22'}
      }
    });
  }

  render() {
    return (
      <Host>
        <qw-calendar-picker
          qw-calendar-picker-number-of-monts={this.QwCalendarNumberOfMonths}
          qw-calendar-picker-disabled={!this.session}
          qw-calendar-picker-stay-period={JSON.stringify(this.stayPeriod)}/>
      </Host>
    );
  }
}
