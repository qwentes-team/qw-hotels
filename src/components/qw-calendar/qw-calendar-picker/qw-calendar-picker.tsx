import {Component, Host, h, Prop, Watch, State, Event, EventEmitter, Listen} from '@stencil/core';
import flatpickr from 'flatpickr';
import * as English from 'flatpickr/dist/l10n/default.js';
import * as Arabic from 'flatpickr/dist/l10n/ar.js';
import * as Bulgarian from 'flatpickr/dist/l10n/bg.js';
import * as Catalan from 'flatpickr/dist/l10n/cat.js';
import * as Mandarin from 'flatpickr/dist/l10n/zh.js';
import * as Croatian from 'flatpickr/dist/l10n/hr.js';
import * as Czech from 'flatpickr/dist/l10n/cs.js';
import * as Danish from 'flatpickr/dist/l10n/da.js';
import * as Dutch from 'flatpickr/dist/l10n/nl.js';
import * as Estonian from 'flatpickr/dist/l10n/et.js';
import * as Finnish from 'flatpickr/dist/l10n/fi.js';
import * as French from 'flatpickr/dist/l10n/fr.js';
import * as German from 'flatpickr/dist/l10n/de.js';
import * as Greek from 'flatpickr/dist/l10n/gr.js';
import * as Hebrew from 'flatpickr/dist/l10n/he.js';
import * as Hungarian from 'flatpickr/dist/l10n/hu.js';
import * as Icelandic from 'flatpickr/dist/l10n/is.js';
import * as Indonesian from 'flatpickr/dist/l10n/id.js';
import * as Italian from 'flatpickr/dist/l10n/it.js';
import * as Japanese from 'flatpickr/dist/l10n/ja.js';
import * as Korean from 'flatpickr/dist/l10n/ko.js';
import * as Latvian from 'flatpickr/dist/l10n/lv.js';
import * as Lithuanian from 'flatpickr/dist/l10n/lt.js';
import * as Malaysian from 'flatpickr/dist/l10n/ms.js';
import * as Norwegian from 'flatpickr/dist/l10n/no.js';
import * as Polish from 'flatpickr/dist/l10n/pl.js';
import * as Portuguese from 'flatpickr/dist/l10n/pt.js';
import * as Romanian from 'flatpickr/dist/l10n/ro.js';
import * as Russian from 'flatpickr/dist/l10n/ru.js';
import * as Serbian from 'flatpickr/dist/l10n/sr.js';
import * as Slovak from 'flatpickr/dist/l10n/sk.js';
import * as Slovenian from 'flatpickr/dist/l10n/sl.js';
import * as Spanish from 'flatpickr/dist/l10n/es.js';
import * as Swedish from 'flatpickr/dist/l10n/sv.js';
import * as Thai from 'flatpickr/dist/l10n/th.js';
import * as Turkish from 'flatpickr/dist/l10n/tr.js';
import * as Ukrainian from 'flatpickr/dist/l10n/uk.js';
import * as Vietnamese from 'flatpickr/dist/l10n/vn.js';
import {QwLanguageKeys, SessionDisplay, SessionStayPeriod} from '@qwentes/booking-state-manager';

const CALENDAR_ID = 'flatpickr-element';

@Component({
  tag: 'qw-calendar-picker',
  styleUrl: 'qw-calendar-picker.css',
  shadow: false,
})
export class QwCalendarPicker {
  @Prop() qwCalendarPickerId: string = CALENDAR_ID;
  @Prop() qwCalendarPickerUniqueClass: string;
  @Prop() qwCalendarPickerDisabled: boolean;
  @Prop() qwCalendarPickerNumberOfMonths: number;
  @Prop() qwCalendarPickerResponsive: boolean;
  @Prop() qwCalendarPickerStayPeriod: SessionStayPeriod;
  @Prop() qwCalendarPickerDesktopLimit: number;
  @Prop() qwCalendarPickerLocale: SessionDisplay['culture'];
  @Prop() qwCalendarPickerConfig: any; // todo capire perché si rompe flatpickr.Options.Options;
  @State() disableStartDate: boolean = false;
  @State() calendarInstance: flatpickr.Instance;
  @Event() qwCalendarPickerChangeDates: EventEmitter<any>;

  private elementCalendarInstance: HTMLElement;
  private configCalendarInstance: {[key: string]: any} = {};

  public componentDidLoad() {
    this.initCalendar();
    this.qwCalendarPickerConfig.defaultDate && this.updateConfigCalendarAndRefresh({
      defaultDate: [
        this.qwCalendarPickerConfig.defaultDate[0],
        this.qwCalendarPickerConfig.defaultDate[1],
      ],
    });
  }

  private initCalendar() {
    this.elementCalendarInstance = document.querySelector(`#${this.qwCalendarPickerId}`);
    this.configCalendarInstance = {
      mode: 'range',
      minDate: 'today',
      inline: true,
      showMonths: this.qwCalendarPickerNumberOfMonths,
      locale: this.getLocaleForCalendar(),
      onChange: this.change,
      ...this.qwCalendarPickerConfig,
    };
    console.log('configCalendarInstance', this.configCalendarInstance);
    let uniqueClass = this.qwCalendarPickerId + '-' + Math.random().toString(16).slice(2)
    this.qwCalendarPickerUniqueClass = uniqueClass;
    this.calendarInstance = flatpickr(this.elementCalendarInstance, this.configCalendarInstance);
    this.setOneOrTwoMonthIfResponsive();
  }

  change = (selectedDates: Date[], dateStr: string) => {
    if (selectedDates.length === 1) {
      this.disableStartDate = true;
    }

    if (selectedDates.length === 2) {
      this.disableStartDate = false;
      const datesToEmit = dateStr.split(' ');
      const newStayPeriod: SessionStayPeriod = {
        arrivalDate: datesToEmit[0],
        departureDate: datesToEmit[datesToEmit.length - 1] || datesToEmit[0],
      };

      const trackingData = {
        stayPeriod: newStayPeriod,
        classPicker: this.qwCalendarPickerUniqueClass
      }

      this.qwCalendarPickerChangeDates.emit(trackingData);
    }
  };

  private updateConfigCalendarAndRefresh(options) {
    this.configCalendarInstance = {
      ...this.configCalendarInstance,
      ...options,
    };

    // todo: capire perché non funziona il set, ma solo reistanziandolo
    this.calendarInstance = this.getInstance();
  }

  private getInstance() {
    return flatpickr(this.elementCalendarInstance, this.configCalendarInstance);
  }

  private setOneOrTwoMonthIfResponsive() {
    if (!this.qwCalendarPickerResponsive) {
      return;
    }

    const width = window.innerWidth;
    if (width > this.qwCalendarPickerDesktopLimit && this.qwCalendarPickerNumberOfMonths === 1) {
      this.qwCalendarPickerNumberOfMonths = 2;
      this.updateConfigCalendarAndRefresh({showMonths: this.qwCalendarPickerNumberOfMonths});
    }

    if (width <= this.qwCalendarPickerDesktopLimit && this.qwCalendarPickerNumberOfMonths === 2) {
      this.qwCalendarPickerNumberOfMonths = 1;
      this.updateConfigCalendarAndRefresh({showMonths: this.qwCalendarPickerNumberOfMonths});
    }
  }

  private getLocaleForCalendar() {
    switch (this.qwCalendarPickerLocale) {
      case QwLanguageKeys.ar:
        return Arabic.default.ar;
      case QwLanguageKeys.bg:
        return Bulgarian.default.bg;
      case QwLanguageKeys.ca:
        return Catalan.default.cat;
      case QwLanguageKeys.zh:
        return Mandarin.default.zh;
      case QwLanguageKeys.hr:
        return Croatian.default.hr;
      case QwLanguageKeys.cs:
        return Czech.default.cs;
      case QwLanguageKeys.da:
        return Danish.default.da;
      case QwLanguageKeys.nl:
        return Dutch.default.nl;
      case QwLanguageKeys.et:
        return Estonian.default.et;
      case QwLanguageKeys.fi:
        return Finnish.default.fi;
      case QwLanguageKeys.fr:
        return French.default.fr;
      case QwLanguageKeys.de:
        return German.default.de;
      case QwLanguageKeys.el:
        return Greek.default.gr;
      case QwLanguageKeys.he:
        return Hebrew.default.he;
      case QwLanguageKeys.hu:
        return Hungarian.default.hu;
      case QwLanguageKeys.is:
        return Icelandic.default.is;
      case QwLanguageKeys.id:
        return Indonesian.default.id;
      case QwLanguageKeys.it:
        return Italian.default.it;
      case QwLanguageKeys.ja:
        return Japanese.default.ja;
      case QwLanguageKeys.ko:
        return Korean.default.ko;
      case QwLanguageKeys.lv:
        return Latvian.default.lv;
      case QwLanguageKeys.lt:
        return Lithuanian.default.lt;
      case QwLanguageKeys.ms:
        return Malaysian.default.ms;
      case QwLanguageKeys.nb:
        return Norwegian.default.no;
      case QwLanguageKeys.pl:
        return Polish.default.pl;
      case QwLanguageKeys.pt:
        return Portuguese.default.pt;
      case QwLanguageKeys.ro:
        return Romanian.default.ro;
      case QwLanguageKeys.ru:
        return Russian.default.ru;
      case QwLanguageKeys.sr:
        return Serbian.default.sr;
      case QwLanguageKeys.sk:
        return Slovak.default.sk;
      case QwLanguageKeys.sl:
        return Slovenian.default.sl;
      case QwLanguageKeys.es:
        return Spanish.default.es;
      case QwLanguageKeys.sv:
        return Swedish.default.sv;
      case QwLanguageKeys.th:
        return Thai.default.th;
      case QwLanguageKeys.tr:
        return Turkish.default.tr;
      case QwLanguageKeys.uk:
        return Ukrainian.default.uk;
      case QwLanguageKeys.vi:
        return Vietnamese.default.vn;
      default:
        return English.default;
    }
  }

  @Watch('qwCalendarPickerStayPeriod')
  watchStayPeriod(newValue: SessionStayPeriod) {
    this.updateConfigCalendarAndRefresh({defaultDate: [newValue.arrivalDate, newValue.departureDate]});
  }

  @Watch('qwCalendarPickerLocale')
  watchLocale() {
    this.updateConfigCalendarAndRefresh({locale: this.getLocaleForCalendar()});
  }

  @Listen('resize', {target: 'window'})
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
        <div id={this.qwCalendarPickerId} class={this.qwCalendarPickerUniqueClass} />
      </Host>
    );
  }
}
