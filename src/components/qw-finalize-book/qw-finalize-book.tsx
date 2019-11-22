import {Component, Host, h, State, Listen, Prop} from '@stencil/core';
import {
  SessionLoaded$, SessionService, SessionModel,
  QuoteService, QuoteModel, QuoteCreateBody, QuoteHelper,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwSelect} from '../shared/qw-select/qw-select';
import countries from './countries';
import {QwInputEmitter} from '../shared/qw-input/qw-input';
import {QwButton} from '../shared/qw-button/qw-button';

enum GuestDetailFormProperty {
  FirstName = 'firstName',
  LastName = 'lastName',
  EmailAddress = 'emailAddress',
  PhoneNumber = 'phoneNumber',
  PhoneCountryCode = 'phoneCountryCode',
  Phone = 'phone',
  ConfirmConditions = 'confirmConditions',
  Title = 'title',
  CountryCode = 'countryCode',
}

@Component({
  tag: 'qw-finalize-book',
  styleUrl: 'qw-finalize-book.css',
  shadow: false,
})
export class QwFinalizeBook {
  @Prop() qwFinalizeBookErrorQuoteMessage: string;
  @State() quote: QuoteModel;
  @State() openSpecialRequests: boolean;
  @State() isConfirmedConditions: boolean;
  @State() formQuote: QuoteCreateBody;

  private sessionId: SessionModel['sessionId'];
  private countries: Array<{name: string, code: string}> = countries;
  private quoteErrorMessage = 'The basket rooms could not welcome all guests';
  private mandatoriesCustomerFields = [
    GuestDetailFormProperty.FirstName,
    GuestDetailFormProperty.LastName,
    GuestDetailFormProperty.CountryCode,
    GuestDetailFormProperty.EmailAddress,
  ];

  public componentDidLoad() {
    this.initFormQuote();
    SessionService.getSession().subscribe();
    SessionLoaded$
      .pipe(switchMap(session => {
        this.sessionId = session.sessionId;
        return QuoteService.getQuote(session.sessionId);
      }))
      .subscribe((quote: QuoteModel) => this.quote = quote);
  }

  private quoteHasError() {
    return !Object.keys(this.quote).length;
  }

  private initFormQuote() {
    this.formQuote = {
      customerDetails: {firstName: undefined, lastName: undefined, countryCode: undefined, emailAddress: undefined},
    };
  }

  private guestDetailTitleSelectChanged(e) {
    this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.Title, e.target.value);
  };

  private guestDetailCountrySelectChanged(e) {
    this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.CountryCode, e.target.value);
  };

  @Listen('qwInputChanged')
  public guestDetailInputChanged(e: CustomEvent<QwInputEmitter>) {
    this.setNewPropertyInFormFromQwInput(e.detail);
  }

  private setNewPropertyInFormFromQwInput(emitter: QwInputEmitter) {
    const {name, value, phoneCountryCode} = emitter;

    if (this.isPhoneFormName(name)) {
      this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.PhoneCountryCode, `+${phoneCountryCode}`);
      this.updateFormQuoteCustomerDetail(GuestDetailFormProperty.PhoneNumber, value.toString());
      return;
    }

    if (this.isConfirmConditionsFormName(name)) {
      this.isConfirmedConditions = Boolean(value);
      return;
    }

    this.updateFormQuoteCustomerDetail(name, value);
  }

  private updateFormQuoteCustomerDetail(key, value) {
    this.formQuote = {
      ...this.formQuote,
      customerDetails: {...this.formQuote.customerDetails, [key]: value},
    };
    console.log(this.formQuote);
  }

  public isFormValid() {
    if (!this.formQuote) {
      return;
    }

    return this.isConfirmedConditions && this.hasAllMandatoryPropertiesSet() && this.emailIsValid(this.formQuote.customerDetails.emailAddress);
  }

  private hasAllMandatoryPropertiesSet() {
    const formQuoteWithPropertiesSet = Object.keys(this.formQuote.customerDetails).reduce((acc, key) => {
      return this.formQuote.customerDetails[key] ? {...acc, [key]: this.formQuote.customerDetails[key]} : acc;
    }, {});

    const formQuoteWithPropertiesSetKeys = Object.keys(formQuoteWithPropertiesSet);
    return this.mandatoriesCustomerFields.every(field => formQuoteWithPropertiesSetKeys.includes(field));
  }

  @Listen('qwTextareaChanged')
  public specialRequestsChanged(e: CustomEvent<QwInputEmitter>) {
    this.formQuote.specialRequest = e.detail.value.toString();
  }

  private isPhoneFormName(name: QwInputEmitter['name']) {
    return name === GuestDetailFormProperty.Phone;
  }

  private isConfirmConditionsFormName(name: QwInputEmitter['name']) {
    return name === GuestDetailFormProperty.ConfirmConditions;
  }

  public payNow = () => {
    QuoteService.createQuote(this.sessionId, this.formQuote).subscribe((res) => {
      window.open(res.redirectionUrl, '_blank');
    });
  };

  public emailIsValid(email: string) {
    if (!email) {
      return true;
    }
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  render() {
    return (
      <Host>
        <div style={this.quote && {'display': 'none'}}>
          <slot name="qwFinalizeBookLoading"/>
        </div>
        {this.quote
          ? this.quoteHasError()
            ? <div class="qw-finalize-book__error-quote">
              {this.qwFinalizeBookErrorQuoteMessage || this.quoteErrorMessage}
            </div>
            : <div class="qw-finalize-book__wrapper">
              <div class="qw-guest-detail">
                <QwSelect QwSelectLabel="Title" QwSelectOnChange={(e) => this.guestDetailTitleSelectChanged(e)}>
                  <option value="">--</option>
                  {this.quote && this.quote.guestTitles.map(title => <option value={title.value}>{title.text}</option>)}
                </QwSelect>
                <qw-input
                  qwInputName={GuestDetailFormProperty.FirstName}
                  qwInputIsMandatory={true}
                  qwInputLabel="First Name *"/>
                <qw-input
                  qwInputName={GuestDetailFormProperty.LastName}
                  qwInputIsMandatory={true}
                  qwInputLabel="Last Name *"/>
                <QwSelect
                  QwSelectLabel="Country of residence *"
                  QwSelectIsMandatory={true}
                  QwSelectOnChange={(e) => this.guestDetailCountrySelectChanged(e)}>
                  <option value="">--</option>
                  {this.countries.map(country => <option value={country.code}>{country.name}</option>)}
                </QwSelect>
                <h4>Contacts</h4>
                <qw-input
                  qwInputName={GuestDetailFormProperty.EmailAddress}
                  qwInputLabel="Email *"
                  qwInputType="email"
                  qwInputIsMandatory={true}
                  qwInputHasError={!this.emailIsValid(this.formQuote.customerDetails.emailAddress)}
                  qwInputCaption="This is the email we will send your confirmation to"/>
                <qw-input
                  qwInputName={GuestDetailFormProperty.Phone}
                  qwInputLabel="Phone number"
                  qwInputType="tel"
                  qwInputCaption="We will use this for urgent communications"/>
              </div>

              <div class="qw-finalize-book__extra">
                <h3>Extras</h3>
                <qw-extra/>
              </div>
              <div class="qw-finalize-book__other-info">
                <h3>Other info</h3>
                <div class="qw-finalize-book__special-requests">
                  <div class="qw-finalize-book__special-requests__title">
                    <h4>Special requests</h4>
                    <QwButton QwButtonLabel="" QwButtonOnClick={() => this.openSpecialRequests = !this.openSpecialRequests}/>
                  </div>
                  <div class="qw-finalize-book__special-requests__caption">
                    Tell us if you need any special services or special requests
                  </div>
                  {this.openSpecialRequests && <div class="qw-finalize-book__special-requests__content">
                    <qw-textarea qwTextareaName="specialRequest"/>
                  </div>}
                </div>
                {this.quote
                && <div class="qw-finalize-book__booking-conditions">
                  <h4>Booking Conditions</h4>
                  <div class="qw-finalize-book__booking-conditions__cancellation">
                    <h5>Cancellation Policy</h5>
                    <li>{QuoteHelper.getDefaultCancelConditionMessage(this.quote)}</li>
                  </div>
                  <div class="qw-finalize-book__booking-conditions__deposit">
                    <h5>Deposit</h5>
                    <li>{this.quote.depositConditions.text}</li>
                  </div>
                  {this.quote.taxes.excludedTaxes.totalAmount.text && <div class="qw-finalize-book__booking-conditions__excluded-taxes">
                    <h5>Taxes excluded in the room price</h5>
                    <li>{`${this.quote.taxes.excludedTaxes.computations[0].summary} (${this.quote.taxes.excludedTaxes.totalAmount.text})`}</li>
                  </div>}
                  {this.quote.taxes.onSiteTaxes.totalAmount.text && <div class="qw-finalize-book__booking-conditions__on-site-taxes">
                    <h5>Taxes added to the price of the room</h5>
                    {this.quote.taxes.onSiteTaxes.totalAmount.text &&
                    <li>{`${this.quote.taxes.onSiteTaxes.computations[0].summary} (${this.quote.taxes.onSiteTaxes.totalAmount.text})`}</li>}
                  </div>}
                </div>}
                <div class="qw-finalize-book__confirmation">
                  <h4>Confirmation</h4>
                  <div class="qw-finalize-book__confirmation-checkbox">
                    <qw-input qwInputType="checkbox" qwInputName="confirmConditions"/>
                    <div>I have read and agree with the terms & conditions and booking conditions for my stay.</div>
                  </div>
                </div>
              </div>
              {this.formQuote && !this.isFormValid() && <div class="qw-finalize-book__form-error">
                <div class="qw-finalize-book__form-error-message">Please fill the mandatory fields to complete the process. You are
                  missing:
                </div>
                <ul>
                  {!this.formQuote.customerDetails.firstName && <li>First Name</li>}
                  {!this.formQuote.customerDetails.lastName && <li>Last Name</li>}
                  {!this.formQuote.customerDetails.emailAddress && <li>Email address</li>}
                  {!this.emailIsValid(this.formQuote.customerDetails.emailAddress) && <li>Email address is invalid</li>}
                  {!this.formQuote.customerDetails.countryCode && <li>Country of residence</li>}
                  {!this.isConfirmedConditions && <li>Terms & conditions</li>}
                </ul>
              </div>}
              <div class="qw-finalize-book__pay">
                <QwButton
                  QwButtonLabel="Pay now"
                  QwButtonDisabled={!this.isFormValid()}
                  QwButtonOnClick={() => this.payNow()}/>
              </div>
            </div>
          : ''
        }
      </Host>
    );
  }
}
