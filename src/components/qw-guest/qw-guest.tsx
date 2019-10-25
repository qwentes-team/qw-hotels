import {Component, Host, h, State, Listen} from '@stencil/core';
import {SessionGuests, SessionIsLoading$, SessionLoaded$, SessionModel, SessionService} from 'booking-state-manager';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';

@Component({
  tag: 'qw-guest',
  styleUrl: 'qw-guest.css',
  shadow: false,
})
export class QwGuest {
  @State() session: SessionModel;
  @State() guests: SessionGuests;
  @State() isSessionLoading: boolean = false;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.guests = {...session.context.guests};
    });
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  @Listen('qwCounterChangeValue')
  public updateSessionGuest(event: CustomEvent<QwCounterEmitter>) {
    console.log(event.detail);
    const newGuestOption = {...this.guests, [event.detail.name]: event.detail.value};
    SessionService.updateContextSession({...this.session.context, guests: newGuestOption})
      .subscribe({
        error: (err) => {
          console.log(err);
          this.restoreGuests();
        },
      });
  }

  private restoreGuests() {
    this.guests = {} as SessionGuests;
    setTimeout(() => this.guests = {...this.session.context.guests});
  }

  render() {
    return (
      this.guests && <Host class={this.isSessionLoading ? 'qw-guest--disabled' : ''}>
        {Object.keys(this.guests).map(guestKey => {
          return (
            <div class="qw-guest__counter-wrapper">
              <div class="qw-guest__counter-wrapper__label">{guestKey}</div>
              <qw-counter qwCounterValue={this.guests[guestKey]} qwCounterName={guestKey}/>
            </div>
          );
        })}
      </Host>
    );
  }
}
