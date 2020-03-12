import {Component, Host, h, State} from '@stencil/core';
import {Language, SessionHelper, SessionIsLoading$, SessionLoaded$, SessionModel, SessionService} from '@qwentes/booking-state-manager';

@Component({
  tag: 'qw-guest-inline',
  styleUrl: 'qw-guest-inline.css',
  shadow: false
})
export class QwGuestInline {
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
        {this.session
          ? `${SessionHelper.getTotalGuests(this.session)} ${Language.getTranslation('guests')}`
          : '--'
        }
      </Host>
    );
  }

}
