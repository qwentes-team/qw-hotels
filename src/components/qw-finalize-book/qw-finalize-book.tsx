import {Component, Host, h, State, Listen} from '@stencil/core';
import {
  SessionLoaded$, SessionService, SessionModel,
  QuoteService, QuoteModel, QuoteCreateBody, QuoteHelper,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwSelect} from '../shared/qw-select/qw-select';
import countries from './countries';
import {QwInputEmitter} from '../shared/qw-input/qw-input';
import {QwButton} from '../shared/qw-button/qw-button';

@Component({
  tag: 'qw-finalize-book',
  styleUrl: 'qw-finalize-book.css',
  shadow: false
})
export class QwFinalizeBook {
  @State() quote: QuoteModel;
  @State() openSpecialRequests: boolean;
  @State() isConfirmedConditions: boolean;

  private sessionId: SessionModel['sessionId'];
  private formQuote: QuoteCreateBody;
  private countries: Array<{name: string, code: string}> = countries;
  private mandatoriesCustomerFields = ['firstName', 'lastName', 'countryCode', 'emailAddress'];

  public componentDidLoad() {
    this.initFormQuote();
    SessionService.getSession().subscribe();
    SessionLoaded$
      .pipe(switchMap(session => {
        this.sessionId = session.sessionId;
        return QuoteService.getQuote(session.sessionId)
      }))
      .subscribe((quote) => this.quote = quote);
  }

  private initFormQuote() {
    this.formQuote = {
      customerDetails: {firstName: undefined, lastName: undefined, countryCode: undefined, emailAddress: undefined},
    };
  }

  private guestDetailTitleSelectChanged(e) {
    this.formQuote.customerDetails.title = e.target.value;
  };

  private guestDetailCountrySelectChanged(e) {
    this.formQuote.customerDetails.countryCode = e.target.value;
  };

  @Listen('qwInputChanged')
  public guestDetailInputChanged(e: CustomEvent<QwInputEmitter>) {
    const {name, value, phoneCountryCode} = e.detail;

    // todo fare factory
    if (this.isPhone(name)) {
      this.formQuote.customerDetails.phoneCountryCode = `+${phoneCountryCode}`;
      this.formQuote.customerDetails.phoneNumber = value.toString();
    } else if (this.isConfirmConditions(name)) {
      this.isConfirmedConditions = Boolean(value);
    } else {
      this.formQuote.customerDetails[name] = value;
    }
  }

  public isPayNowAvailable() {
    if (!this.formQuote) {
      return;
    }

    return this.isConfirmedConditions && this.hasAllMandatoryPropertiesSet();
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

  private isPhone(name: QwInputEmitter['name']) {
    return name === 'phone';
  }

  private isConfirmConditions(name: QwInputEmitter['name']) {
    return name === 'confirmConditions';
  }

  public payNow = () => {
    QuoteService.createQuote(this.sessionId, this.formQuote).subscribe((res) => {
      window.open(res.redirectionUrl, '_blank');
    });
  };

  render() {
    return (
      <Host>
        <div class="qw-guest-detail">
          <QwSelect QwSelectLabel="Title" QwSelectOnChange={(e) => this.guestDetailTitleSelectChanged(e)}>
            <option value="">--</option>
            {this.quote && this.quote.guestTitles.map(title => <option value={title.value}>{title.text}</option>)}
          </QwSelect>
          <qw-input qwInputName="firstName" qwInputLabel="First Name *" />
          <qw-input qwInputName="lastName" qwInputLabel="Last Name *" />
          <QwSelect QwSelectLabel="Country of residence *" QwSelectOnChange={(e) => this.guestDetailCountrySelectChanged(e)}>
            <option value="">--</option>
            {this.countries.map(country => <option value={country.code}>{country.name}</option>)}
          </QwSelect>
          <h4>Contacts</h4>
          <qw-input qwInputName="emailAddress" qwInputLabel="Email *" qwInputType="email" qwInputCaption="This is the email we will send your confirmation to" />
          <qw-input qwInputName="phone" qwInputLabel="Phone number" qwInputType="tel" qwInputCaption="We will use this for urgent communications" />
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
              <QwButton QwButtonLabel="" QwButtonOnClick={() => this.openSpecialRequests = !this.openSpecialRequests }/>
            </div>
            <div class="qw-finalize-book__special-requests__caption">
              Tell us if you need any special services or special requests
            </div>
            {this.openSpecialRequests && <div class="qw-finalize-book__special-requests__content">
              <qw-textarea qwTextareaName="specialRequest" />
            </div>}
          </div>
          {this.quote && <div class="qw-finalize-book__booking-conditions">
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
        <div class="qw-finalize-book__pay">
          <QwButton
            QwButtonLabel="Pay now"
            QwButtonDisabled={!this.isPayNowAvailable()}
            QwButtonOnClick={() => this.payNow()} />
        </div>
      </Host>
    );
  }
}
