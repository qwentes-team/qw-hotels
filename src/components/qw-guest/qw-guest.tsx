import {Component, Host, h, State, Listen, Prop, Event, EventEmitter} from '@stencil/core';
import {
  Language,
  SessionGuests,
  SessionHasRoomsSync,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
} from '@qwentes/booking-state-manager';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';
import {QwCounterId} from '../../index';

@Component({
  tag: 'qw-guest',
  styleUrl: 'qw-guest.css',
  shadow: false,
})
export class QwGuest {
  @Prop() qwGuestCenter: boolean;
  @Prop() qwGuestSyncOnChange: boolean = true;
  @State() session: SessionModel;
  @State() guests: SessionGuests;
  @State() isSessionLoading: boolean = false;
  @Event() qwGuestChange: EventEmitter<SessionGuests>;
  @Event() qwBasketWillBeReset: EventEmitter<void>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.guests = {...session.context.guests};
    });
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  @Listen('qwCounterChangeValue')
  public updateSessionGuest(event: CustomEvent<QwCounterEmitter>) {
    this.guests = {...this.guests, [event.detail.name]: event.detail.value};
    this.qwGuestChange.emit(this.guests);

    if (!this.qwGuestSyncOnChange) {
      return;
    }

    if (SessionHasRoomsSync()) {
      this.qwBasketWillBeReset.emit();
    }

    SessionService.updateContextSession({...this.session.context, guests: this.guests})
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
      this.guests && <Host class={`
        ${this.qwGuestCenter ? 'qw-guest--center' : ''}
        ${this.isSessionLoading ? 'qw-guest--disabled' : ''}
      `}>
        {Object.keys(this.guests).map((guestKey: 'adults' | 'children' | 'infants') => {
          return (
            <div class="qw-guest__counter-wrapper">
              <div class="qw-guest__counter-wrapper__label">{Language.getTranslation(guestKey)}</div>
              <qw-counter
                qwCounterId={QwCounterId.QwGuestCounter}
                qwCounterValue={this.guests[guestKey]}
                qwCounterName={guestKey}/>
            </div>
          );
        })}
      </Host>
    );
  }
}
