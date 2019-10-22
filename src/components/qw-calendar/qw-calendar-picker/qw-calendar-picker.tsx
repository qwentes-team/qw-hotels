import {Component, Host, h, Prop, Watch, State, Event, EventEmitter} from '@stencil/core';
import flatpickr from 'flatpickr';
import {SessionStayPeriod} from 'booking-state-manager';

const CALENDAR_ID = 'flatpickr-element';

@Component({
  tag: 'qw-calendar-picker',
  styleUrl: 'qw-calendar-picker.css',
  shadow: false
})
export class QwCalendarPicker {
  @Prop() QwCalendarPickerDisabled: boolean = false;
  @Prop() QwCalendarPickerNumberOfMonths: number = 1;
  @Prop() qwCalendarPickerStayPeriod: string;
  @State() disableStartDate: boolean = false;
  @Event() qwCalendarPickerChangeDates: EventEmitter<SessionStayPeriod>;

  private elementCalendarInstance: HTMLElement;
  private configCalendarInstance: { [key: string]: any } = {};

  @State() calendarInstance: flatpickr.Instance;

  public componentDidLoad() {
    this.initCalendar();
  }

  private initCalendar() {
    this.elementCalendarInstance = document.querySelector(`#${CALENDAR_ID}`);
    this.configCalendarInstance = {
      mode: 'range',
      minDate: 'today',
      inline: true,
      showMonths: this.QwCalendarPickerNumberOfMonths,
      onChange: this.change,
    };
    this.calendarInstance = flatpickr(this.elementCalendarInstance, this.configCalendarInstance);
  }

  change = (selectedDates: Date[], dateStr: string) => {
    if(selectedDates.length === 1) {
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

  // todo: JSON.parse è pesante, capire se vale la pena altrimenti fare tutto in componente statefull
  @Watch('qwCalendarPickerStayPeriod')
  watchStayPeriod(newValue: string) {
    const parsedNewValue: SessionStayPeriod = JSON.parse(newValue);
    this.updateConfigCalendar({defaultDate: [parsedNewValue.arrivalDate, parsedNewValue.departureDate]});
  }

  private updateConfigCalendar(options) {
    this.configCalendarInstance = {
      ...this.configCalendarInstance,
      ...options,
    };

    // todo: capire perché non funziona il set, ma solo reistanziandolo
    this.calendarInstance = flatpickr(this.elementCalendarInstance, this.configCalendarInstance);
  }

  render() {
    return (
      <Host class={`
        ${this.QwCalendarPickerDisabled && 'qw-calendar-picker--disabled'} 
        ${this.disableStartDate && 'qw-calendar-picker--disable-start-date'}
      `}>
        <div id={CALENDAR_ID}/>
      </Host>
    );
  }
}
