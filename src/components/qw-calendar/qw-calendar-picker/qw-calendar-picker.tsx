import {Component, Host, h, Prop, Watch, State, Event, EventEmitter, Listen} from '@stencil/core';
import flatpickr from 'flatpickr';
import * as English from 'flatpickr/dist/l10n/default.js';
import * as French from 'flatpickr/dist/l10n/fr.js';
import * as Italian from 'flatpickr/dist/l10n/it.js';
import * as Spanish from 'flatpickr/dist/l10n/es.js';
import * as German from 'flatpickr/dist/l10n/de.js';
import {QwLanguageKeys, SessionDisplay, SessionStayPeriod} from '@qwentes/booking-state-manager';

const CALENDAR_ID = 'flatpickr-element';

@Component({
  tag: 'qw-calendar-picker',
  styleUrl: 'qw-calendar-picker.css',
  shadow: false
})
export class QwCalendarPicker {
  @Prop() qwCalendarPickerDisabled: boolean;
  @Prop() qwCalendarPickerNumberOfMonths: number;
  @Prop() qwCalendarPickerResponsive: boolean;
  @Prop() qwCalendarPickerStayPeriod: SessionStayPeriod;
  @Prop() qwCalendarPickerDesktopLimit: number;
  @Prop() qwCalendarPickerLocale: SessionDisplay['culture'];
  @Prop() qwCalendarPickerConfig: any; // todo capire perché si rompe flatpickr.Options.Options;
  @State() disableStartDate: boolean = false;
  @State() calendarInstance: flatpickr.Instance;
  @Event() qwCalendarPickerChangeDates: EventEmitter<SessionStayPeriod>;

  private elementCalendarInstance: HTMLElement;
  private configCalendarInstance: { [key: string]: any } = {};

  public componentDidLoad() {
    this.initCalendar();
  }

  private initCalendar() {
    this.elementCalendarInstance = document.querySelector(`#${CALENDAR_ID}`);
    this.configCalendarInstance = {
      mode: 'range',
      minDate: 'today',
      inline: true,
      showMonths: this.qwCalendarPickerNumberOfMonths,
      locale: this.getLocaleForCalendar(),
      onChange: this.change,
      ...this.qwCalendarPickerConfig,
    };
    this.calendarInstance = flatpickr(this.elementCalendarInstance, this.configCalendarInstance);
    this.setOneOrTwoMonthIfResponsive();
  }

  change = (selectedDates: Date[], dateStr: string) => {
    if (selectedDates.length === 1) {
      this.disableStartDate = true;
    }

    if (selectedDates.length === 2) {
      this.disableStartDate = false;
      const datesToEmit = dateStr.split(' to ');
      const newStayPeriod: SessionStayPeriod = {
        arrivalDate: datesToEmit[0],
        departureDate: datesToEmit[1] || datesToEmit[0]
      };
      this.qwCalendarPickerChangeDates.emit(newStayPeriod);
    }
  };

  private updateConfigCalendar(options) {
    this.configCalendarInstance = {
      ...this.configCalendarInstance,
      ...options,
    };

    // todo: capire perché non funziona il set, ma solo reistanziandolo
    this.calendarInstance = flatpickr(this.elementCalendarInstance, this.configCalendarInstance);
  }

  private setOneOrTwoMonthIfResponsive() {
    if (!this.qwCalendarPickerResponsive) {
      return;
    }

    const width = window.innerWidth;
    if (width > this.qwCalendarPickerDesktopLimit && this.qwCalendarPickerNumberOfMonths === 1) {
      this.qwCalendarPickerNumberOfMonths = 2;
      this.updateConfigCalendar({showMonths: this.qwCalendarPickerNumberOfMonths});
    }

    if (width <= this.qwCalendarPickerDesktopLimit && this.qwCalendarPickerNumberOfMonths === 2) {
      this.qwCalendarPickerNumberOfMonths = 1;
      this.updateConfigCalendar({showMonths: this.qwCalendarPickerNumberOfMonths});
    }
  }

  private getLocaleForCalendar() {
    switch (this.qwCalendarPickerLocale) {
      case QwLanguageKeys.fr:
        return French.default.fr;
      case QwLanguageKeys.it:
        return Italian.default.it;
      case QwLanguageKeys.es:
        return Spanish.default.es;
      case QwLanguageKeys.de:
        return German.default.de;
      default:
        return English.default;
    }
  }

  @Watch('qwCalendarPickerStayPeriod')
  watchStayPeriod(newValue: SessionStayPeriod) {
    this.updateConfigCalendar({defaultDate: [newValue.arrivalDate, newValue.departureDate]});
  }

  @Watch('qwCalendarPickerLocale')
  watchLocale() {
    this.updateConfigCalendar({locale: this.getLocaleForCalendar()});
  }


  @Listen('resize', { target: 'window' })
  handleScroll() {
    this.setOneOrTwoMonthIfResponsive();
  }

  render() {
    return (
      <Host class={`
        ${this.qwCalendarPickerDisabled && 'qw-calendar-picker--disabled'}
        ${this.disableStartDate && 'qw-calendar-picker--disable-start-date'}
        ${this.qwCalendarPickerResponsive && 'qw-calendar-picker--responsive'}
      `}>
        <div id={CALENDAR_ID}/>
      </Host>
    );
  }
}
