import {Component, Host, h, Prop, EventEmitter, Event, State, Listen} from '@stencil/core';
import {QwSelect} from '../../shared/qw-select/qw-select';
import {RoomMetadata} from '@qwentes/booking-state-manager/src/feature/room/model/room.interface';
import {Language, QuoteCreateBody, QuoteHelper} from '@qwentes/booking-state-manager';
import {GuestDetailFormProperty} from '../../../index';
import countries from './countries';
import {QwInputEmitter} from '../../shared/qw-input/qw-input';
import {emailIsValid} from '../../../globals/app';

@Component({
  tag: 'qw-book-guest-detail',
  styleUrl: 'qw-book-guest-detail.css',
  shadow: false
})
export class QwBookGuestDetail {
  @Prop() qwBookGuestDetailTitleOptions: Array<RoomMetadata<string>> = [];
  @Prop() qwBookFormShowError: boolean;
  @Prop({mutable: true}) qwBookGuestDetailDefaultPhoneCountry: string;
  @State() guestDetailForm: QuoteCreateBody;
  @Event() qwBookGuestDetailChangeForm: EventEmitter<QuoteCreateBody>;
  @Event() qwBookChangeGuestDetailPhoneCountry: EventEmitter<string>;

  private countries: Array<{ name: string, code: string }> = countries;

  public componentWillLoad() {
    this.guestDetailForm = QuoteHelper.initObjectForCreateBody();
  }

  private emitForm() {
    this.qwBookGuestDetailChangeForm.emit(this.guestDetailForm);
  }

  private guestDetailTitleSelectChanged(e) {
    this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.Title, e.target.value);
    this.emitForm();
  };

  private guestDetailCountrySelectChanged(e) {
    this.qwBookGuestDetailDefaultPhoneCountry = e.target.value.toLowerCase();
    this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.CountryCode, e.target.value);
    this.qwBookChangeGuestDetailPhoneCountry.emit(this.qwBookGuestDetailDefaultPhoneCountry);
    this.emitForm();
  };

  @Listen('qwInputChanged')
  public guestDetailInputChanged(e: CustomEvent<QwInputEmitter>) {
    this.setNewPropertyInFormFromQwInput(e.detail);
    this.emitForm();
  }

  private setNewPropertyInFormFromQwInput(emitter: QwInputEmitter) {
    const {name, value, phoneCountryCode} = emitter;

    if (this.isPhoneFormName(name)) {
      this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.PhoneCountryCode, `+${phoneCountryCode}`);
      this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.PhoneNumber, value.toString());
      return;
    }

    this.updateFormQuoteCustomerDetail(name, value);
  }

  private isPhoneFormName(name: QwInputEmitter['name']) {
    return name === GuestDetailFormProperty.Phone;
  }

  private updateFormQuoteCustomerDetail(key, value) {
    this.guestDetailForm = {
      ...this.guestDetailForm,
      customerDetails: {...this.guestDetailForm.customerDetails, [key]: value},
    };
  }

  render() {
    return (
      <Host>
        <QwSelect
          QwSelectLabel={Language.getTranslation('title')}
          QwSelectName={GuestDetailFormProperty.Title}
          QwSelectOnChange={(e) => this.guestDetailTitleSelectChanged(e)}>
          <option value="">--</option>
          {this.qwBookGuestDetailTitleOptions.map(title => <option value={title.value}>{title.text}</option>)}
        </QwSelect>
        <qw-input
          qwInputHasError={this.qwBookFormShowError && !this.guestDetailForm.customerDetails.firstName}
          qwInputName={GuestDetailFormProperty.FirstName}
          qwInputIsMandatory={true}
          qwInputLabel={Language.getTranslation('firstName') + ' *'}/>
        <qw-input
          qwInputHasError={this.qwBookFormShowError && !this.guestDetailForm.customerDetails.lastName}
          qwInputName={GuestDetailFormProperty.LastName}
          qwInputIsMandatory={true}
          qwInputLabel={Language.getTranslation('lastName') + ' *'}/>
        <QwSelect
          QwSelectLabel={Language.getTranslation('country') + ' *'}
          QwSelectName={GuestDetailFormProperty.CountryCode}
          QwSelectIsMandatory={true}
          QwSelectOnChange={(e) => this.guestDetailCountrySelectChanged(e)}
          QwSelectHasError={this.qwBookFormShowError && !this.guestDetailForm.customerDetails.countryCode}>
          <option value="">--</option>
          {this.countries.map(country => <option value={country.code}>{country.name}</option>)}
        </QwSelect>
        <h4>{Language.getTranslation('contacts')}</h4>
        <qw-input
          qwInputName={GuestDetailFormProperty.EmailAddress}
          qwInputLabel={Language.getTranslation('email') + ' *'}
          qwInputType="email"
          qwInputIsMandatory={true}
          qwInputHasError={
            !emailIsValid(this.guestDetailForm && this.guestDetailForm.customerDetails.emailAddress) ||
            this.guestDetailForm && !this.guestDetailForm.customerDetails.emailAddress &&
            this.qwBookFormShowError
          }
          qwInputCaption={Language.getTranslation('emailCaption')}/>
        <qw-input
          qwInputName={GuestDetailFormProperty.Phone}
          qwInputLabel={Language.getTranslation('phone')}
          qwInputType="tel"
          qwInputDefaultPhoneCountry={this.qwBookGuestDetailDefaultPhoneCountry}
          qwInputCaption={Language.getTranslation('phoneCaption')}/>
      </Host>
    );
  }
}
