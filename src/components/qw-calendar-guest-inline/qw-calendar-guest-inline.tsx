import {Component, Host, h, State, Event, EventEmitter, Prop} from '@stencil/core';
import {
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionHelper,
  SessionIsLoading$, Language,
} from '@qwentes/booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCalendarGuestInlineInputType} from '../../index';

@Component({
  tag: 'qw-calendar-guest-inline',
  styleUrl: 'qw-calendar-guest-inline.css',
  shadow: false,
})
export class QwCalendarGuestInline {
  @Prop() qwCalendarGuestInlineShowCheckButton: boolean = true;
  @Prop() qwCalendarGuestInlineShowInputs: boolean = true;
  @State() session: SessionModel;
  @State() isSessionLoading: boolean;
  @Event() qwCalendarGuestInlineCheckAvailability: EventEmitter<void>;
  @Event() qwCalendarGuestInlineClickInput: EventEmitter<QwCalendarGuestInlineInputType>;

  public componentWillLoad() {
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
        {this.qwCalendarGuestInlineShowInputs && <div class="qw-calendar-guest-inline__input-fields">
          <qw-input
            onClick={() => this.onClickInput(QwCalendarGuestInlineInputType.Date)}
            qwInputIsReadonly={true}
            qwInputLabel={Language.getTranslation('dates')}
            qwInputValue={(this.session && SessionHelper.formatStayPeriod(this.session))
              || Language.getTranslation('dates')}/>
          <qw-input
            onClick={() => this.onClickInput(QwCalendarGuestInlineInputType.Guest)}
            qwInputIsReadonly={true}
            qwInputLabel={Language.getTranslation('guests')}
            qwInputValue={(this.session && `${SessionHelper.getTotalGuests(this.session)} ${Language.getTranslation('guests')}`)
              || Language.getTranslation('guests')}/>
        </div>}
        {this.qwCalendarGuestInlineShowCheckButton && <QwButton
          QwButtonLabel={Language.getTranslation('checkAvailability')}
          QwButtonDisabled={this.isSessionLoading}
          QwButtonOnClick={() => this.onCheckAvailability()}/>}
      </Host>
    );
  }
}
