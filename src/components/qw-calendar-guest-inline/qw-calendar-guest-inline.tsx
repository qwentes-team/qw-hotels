import {Component, Host, h, State, Event, EventEmitter, Prop} from '@stencil/core';
import {SessionLoaded$, SessionModel, SessionService, SessionHelper, SessionIsLoading$} from 'booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCalendarGuestInlineInputType} from '../../index';

@Component({
  tag: 'qw-calendar-guest-inline',
  styleUrl: 'qw-calendar-guest-inline.css',
  shadow: false,
})
export class QwCalendarGuestInline {
  @Prop() qwCalendarGuestInlineShowCheckButton: boolean = true;
  @State() session: SessionModel;
  @State() isSessionLoading: boolean;
  @Event() qwCalendarGuestInlineCheckAvailability: EventEmitter<void>;
  @Event() qwCalendarGuestInlineClickInput: EventEmitter<QwCalendarGuestInlineInputType>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);
    SessionIsLoading$.subscribe((isLoading) => this.isSessionLoading = isLoading);
  }

  private onCheckAvailability() {
    this.qwCalendarGuestInlineCheckAvailability.emit();
  }

  private onClickInput(inputName: QwCalendarGuestInlineInputType) {
    this.qwCalendarGuestInlineClickInput.emit(inputName)
  }

  render() {
    return (
      <Host>
        <div class="qw-calendar-guest-inline__input-fields">
          <qw-input
            onClick={() => this.onClickInput(QwCalendarGuestInlineInputType.Date)}
            qwInputIsReadonly={true}
            qwInputLabel="Dates"
            qwInputValue={(this.session && SessionHelper.formatStayPeriod(this.session)) || 'Dates'}/>
          <qw-input
            onClick={() => this.onClickInput(QwCalendarGuestInlineInputType.Guest)}
            qwInputIsReadonly={true}
            qwInputLabel="Guests"
            qwInputValue={(this.session && `${SessionHelper.getTotalGuests(this.session)} guests`) || 'Guests'}/>
        </div>
        {this.qwCalendarGuestInlineShowCheckButton && <QwButton
          QwButtonLabel="Check Availability"
          QwButtonDisabled={this.isSessionLoading}
          QwButtonOnClick={() => this.onCheckAvailability()}/>}
      </Host>
    );
  }
}
