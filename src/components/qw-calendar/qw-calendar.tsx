import {Component, Host, h, Prop, State, Listen, Event, EventEmitter} from '@stencil/core';
import {
  SessionDisplay, SessionHasRoomsSync,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
  SessionStayPeriod,
} from '@qwentes/booking-state-manager';

@Component({
  tag: 'qw-calendar',
  styleUrl: 'qw-calendar.css',
  shadow: false
})
export class QwCalendar {
  @Prop() qwCalendarNumberOfMonths: number = 1;
  @Prop() qwCalendarResponsive: boolean = true;
  @Prop() qwCalendarSyncOnChange: boolean = true;
  @Prop() qwCalendarDesktopLimit: number = 600;
  @Prop() qwCalendarConfig: string; // flatpickr Options
  @State() session: SessionModel;
  @State() stayPeriod: SessionStayPeriod;
  @State() isSessionLoading: boolean;
  @State() locale: SessionDisplay['culture'];
  @Event() qwCalendarChange: EventEmitter<SessionStayPeriod>;
  @Event() qwCalendarChangeSuccess: EventEmitter<void>;
  @Event() qwBasketWillBeReset: EventEmitter<void>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.stayPeriod = {...session.context.stayPeriod};
      this.locale = session.display.culture;
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

    if (SessionHasRoomsSync()) {
      this.qwBasketWillBeReset.emit();
    }

    SessionService.updateContextSession({...this.session.context, stayPeriod: this.stayPeriod})
      .subscribe({
        next: () => this.qwCalendarChangeSuccess.emit(),
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
          qwCalendarPickerDesktopLimit={this.qwCalendarDesktopLimit}
          qwCalendarPickerResponsive={this.qwCalendarResponsive}
          qwCalendarPickerNumberOfMonths={this.qwCalendarNumberOfMonths}
          qwCalendarPickerDisabled={this.isSessionLoading}
          qwCalendarPickerLocale={this.locale}
          qwCalendarPickerStayPeriod={this.stayPeriod}
          qwCalendarPickerConfig={this.qwCalendarConfig ? JSON.parse(this.qwCalendarConfig) : {}}/>
      </Host>
    );
  }
}
