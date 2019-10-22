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
  @Prop() QwCalendarPickerStayPeriod: string;
  @Event() qwCalendarPickerChangeDates: EventEmitter<SessionStayPeriod>;

  private elementCalendarInstance: HTMLElement;
  private configCalendarInstance: {[key: string]: any} = {};

  @State() calendarInstance: flatpickr.Instance;

  constructor() {
    this.change = this.change.bind(this);
  }

  public componentDidLoad() {
    this.initCalendar();
  }

  private initCalendar() {
    this.elementCalendarInstance = document.querySelector(`#${CALENDAR_ID}`);
    this.configCalendarInstance = {
      mode: 'range',
      inline: true,
      showMonths: this.QwCalendarPickerNumberOfMonths,
      onChange: this.change,
    };
    this.calendarInstance = flatpickr(this.elementCalendarInstance, this.configCalendarInstance);
  }

  private change(selectedDates: Date[], dateStr: string) {
    console.log(dateStr);
    if (selectedDates.length === 2) {
      const datesToEmit = dateStr.split(' to ');
      const newStayPeriod: SessionStayPeriod = {arrivalDate: datesToEmit[0], departureDate: datesToEmit[1]};
      this.qwCalendarPickerChangeDates.emit(newStayPeriod);
    }
  }

  // todo: JSON.parse è pesante, capire se vale la pena altrimenti fare tutto in componente statefull
  @Watch('QwCalendarPickerStayPeriod')
  watchStayPeriod(newValue: string) {
    const parsedNewValue: SessionStayPeriod = JSON.parse(newValue);

    // todo: capire perché non funziona il set, ma solo reistanziandolo
    this.calendarInstance = flatpickr(this.elementCalendarInstance, {
      ...this.configCalendarInstance,
      defaultDate: [parsedNewValue.arrivalDate, parsedNewValue.departureDate],
    });
  }

  render() {
    return (
      <Host class={this.QwCalendarPickerDisabled && 'qw-calendar-picker--disabled'}>
        <div id={CALENDAR_ID}/>
      </Host>
    );
  }
}
