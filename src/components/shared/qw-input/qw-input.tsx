import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';
import intlTelInput from 'intl-tel-input';

export interface QwInputEmitter {
  name: string;
  value: string | boolean;
  event: any;
  phoneCountryCode?: string;
}

const QW_INPUT_PHONE = 'qw-input__phone';

@Component({
  tag: 'qw-input',
  styleUrl: 'qw-input.css',
  shadow: false,
})
export class QwInput {
  @Prop() qwInputName: string;
  @Prop() qwInputType: string = 'text';
  @Prop() qwInputValue: string;
  @Prop() qwInputLabel: string;
  @Prop() qwInputCaption: string;
  @Prop() qwInputIsReadonly: boolean;
  @Prop() qwInputIsMandatory: boolean;
  @Prop() qwInputHasError: boolean;
  @Event() qwInputChanged: EventEmitter<QwInputEmitter>;

  public qwInputPhone;

  private isPhoneType() {
    return this.qwInputType === 'tel';
  }

  private isCheckboxType() {
    return this.qwInputType === 'checkbox';
  }

  componentDidLoad() {
    if (this.isPhoneType()) {
      this.initPhoneInput();
    }
  }

  private initPhoneInput() {
    const input = document.querySelector(`#${QW_INPUT_PHONE}`);
    this.qwInputPhone = intlTelInput(input, {});
    input.addEventListener('countrychange', (event) => {
      this.emitChangesForPhone(event);
    });
  }

  public inputChange(event) {
    if (this.isPhoneType()) {
      this.emitChangesForPhone(event);
    } else if (this.isCheckboxType()){
      this.emitChangesForCheckbox(event);
    } else {
      this.emitChanges(event);
    }
  };

  private emitChangesForPhone(event) {
    const selectedCountry = this.qwInputPhone.getSelectedCountryData();

    this.qwInputChanged.emit({
      value: event.target.value,
      name: this.qwInputName,
      event,
      phoneCountryCode: selectedCountry.dialCode,
    });
  }

  private emitChangesForCheckbox(event) {
    this.qwInputChanged.emit({
      value: event.target.checked,
      name: this.qwInputName,
      event
    });
  }

  private emitChanges(event) {
    this.qwInputChanged.emit({
      value: event.target.value,
      name: this.qwInputName,
      event
    });
  }

  private getId() {
    return this.isPhoneType()
      ? QW_INPUT_PHONE
      : `qw-input__${this.qwInputType}__${(Math.random() * 1000000).toFixed(0)}`;
  }

  render() {
    return (
      <Host class={`
        ${this.qwInputName ? 'qw-input__' + this.qwInputName : ''}
        ${this.qwInputIsMandatory ? 'qw-input--mandatory' : ''}
        ${this.qwInputHasError ? 'qw-input--error' : ''}
      `}>
        <label>
          <div class="qw-input__label">{this.qwInputLabel}</div>
          <input
            readonly={this.qwInputIsReadonly}
            type={this.qwInputType}
            id={this.getId()}
            value={this.qwInputValue}
            onInput={(event: any) => this.inputChange(event)}/>
            {this.qwInputCaption && <div class="qw-input__caption">{this.qwInputCaption}</div>}
        </label>
      </Host>
    );
  }
}
