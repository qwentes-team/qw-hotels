import {Component, Host, h, State} from '@stencil/core';
import {
  Language,
  SessionHelper,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
} from '@qwentes/booking-state-manager';

@Component({
  tag: 'qw-calendar-inline',
  styleUrl: 'qw-calendar-inline.css',
  shadow: false
})
export class QwCalendarInline {
  @State() session: SessionModel;
  @State() isSessionLoading: boolean;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);
    SessionIsLoading$.subscribe((isLoading) => this.isSessionLoading = isLoading);
  }

  render() {
    return (
      <Host>
        <div class="qw-calendar-inline__box">
          <div class="qw-calendar-inline__label">{Language.getTranslation('arrival')}</div>
          <div class="qw-calendar-inline__date">
            {this.session ? SessionHelper.formatArrivalDate(this.session) : '--'}
          </div>
        </div>

        <qw-separator />

        <div class="qw-calendar-inline__box">
          <div class="qw-calendar-inline__label">{Language.getTranslation('departure')}</div>
          <div class="qw-calendar-inline__date">
            {this.session ? SessionHelper.formatDepartureDate(this.session) : '--'}
          </div>
        </div>
      </Host>
    );
  }
}
