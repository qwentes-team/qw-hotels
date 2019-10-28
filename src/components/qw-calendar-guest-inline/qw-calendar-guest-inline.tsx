import {Component, Host, h, State} from '@stencil/core';
import {SessionLoaded$, SessionModel, SessionService, SessionHelper} from 'booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';

@Component({
  tag: 'qw-calendar-guest-inline',
  styleUrl: 'qw-calendar-guest-inline.css',
  shadow: false,
})
export class QwCalendarGuestInline {
  @State() session: SessionModel;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);
  }

  render() {
    return (
      <Host>
        <qw-input
          qwInputIsReadonly={true}
          qwInputLabel="Dates"
          qwInputValue={(this.session && SessionHelper.formatStayPeriod(this.session)) || 'Dates'}
        />
        <qw-input
          qwInputIsReadonly={true}
          qwInputLabel="Guests"
          qwInputValue={(this.session && `${SessionHelper.getTotalGuests(this.session)} guests`) || 'Guests'}
        />
        <QwButton QwButtonLabel="Check Availability"/>
      </Host>
    );
  }
}
