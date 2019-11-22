import {Component, Host, h, State, Listen, Prop} from '@stencil/core';
import {
  SessionLoaded$, SessionService, SessionModel,
  QuoteService, QuoteModel, QuoteCreateBody, QuoteHelper,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwInputEmitter} from '../shared/qw-input/qw-input';
import {QwButton} from '../shared/qw-button/qw-button';
import {GuestDetailFormProperty} from '../../index';
import {emailIsValid} from '../../globals/app';

@Component({
  tag: 'qw-book',
  styleUrl: 'qw-book.css',
  shadow: false,
})
export class QwBook {
  @Prop() qwBookErrorQuoteMessage: string;
  @State() quote: QuoteModel;
  @State() openSpecialRequests: boolean;
  @State() isConfirmedConditions: boolean;
  @State() formQuote: QuoteCreateBody;

  private sessionId: SessionModel['sessionId'];
  private quoteErrorMessage = 'The basket rooms could not welcome all guests';
  private mandatoriesCustomerFields = [
    GuestDetailFormProperty.FirstName,
    GuestDetailFormProperty.LastName,
    GuestDetailFormProperty.CountryCode,
    GuestDetailFormProperty.EmailAddress,
  ];

  public componentDidLoad() {
    this.formQuote = QuoteHelper.initObjectForCreateBody();
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

  @Listen('qwBookGuestDetailChangeForm')
  public qwBookGuestDetailChangeForm(e: CustomEvent<QuoteCreateBody>) {
    this.formQuote = e.detail;
  }

  @Listen('qwInputChanged')
  public guestDetailInputChanged(e: CustomEvent<QwInputEmitter>) {
    const {name, value} = e.detail;
    if (this.isConfirmConditionsFormName(name)) {
      this.isConfirmedConditions = Boolean(value);
    }
  }

  public isFormValid() {
    if (!this.formQuote) {
      return;
    }

    return this.isConfirmedConditions
      && this.hasAllMandatoryPropertiesSet()
      && emailIsValid(this.formQuote.customerDetails.emailAddress);
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

  private isConfirmConditionsFormName(name: QwInputEmitter['name']) {
    return name === GuestDetailFormProperty.ConfirmConditions;
  }

  public payNow = () => {
    QuoteService.createQuote(this.sessionId, this.formQuote).subscribe((res) => {
      window.open(res.redirectionUrl, '_blank');
    });
  };

  render() {
    return (
      <Host class={`${!this.quote ? 'qw-book--loading' : 'qw-book--loaded'}`}>
        <div style={this.quote && {'display': 'none'}}>
          <slot name="qwBookLoading"/>
        </div>
        {this.quote
          ? this.quoteHasError()
            ? <div class="qw-book__error-quote">
              {this.qwBookErrorQuoteMessage || this.quoteErrorMessage}
            </div>
            : <div class="qw-book__wrapper">
              <qw-book-guest-detail qwBookGuestDetailTitleOptions={this.quote && this.quote.guestTitles}/>

              <div class="qw-book__extra">
                <h3>Extras</h3>
                <qw-extra/>
              </div>

              <div class="qw-book__other-info">
                <h3>Other info</h3>
                <div class="qw-book__special-requests">
                  <div class="qw-book__special-requests__title">
                    <h4>Special requests</h4>
                    <QwButton QwButtonLabel="" QwButtonOnClick={() => this.openSpecialRequests = !this.openSpecialRequests}/>
                  </div>
                  <div class="qw-book__special-requests__caption">
                    Tell us if you need any special services or special requests
                  </div>
                  {this.openSpecialRequests && <div class="qw-book__special-requests__content">
                    <qw-textarea qwTextareaName="specialRequest"/>
                  </div>}
                </div>
                {this.quote
                && <div class="qw-book__booking-conditions">
                  <h4>Booking Conditions</h4>
                  <div class="qw-book__booking-conditions__cancellation">
                    <h5>Cancellation Policy</h5>
                    <li>{QuoteHelper.getDefaultCancelConditionMessage(this.quote)}</li>
                  </div>
                  <div class="qw-book__booking-conditions__deposit">
                    <h5>Deposit</h5>
                    <li>{this.quote.depositConditions.text}</li>
                  </div>
                  {this.quote.taxes.excludedTaxes.totalAmount.text && <div class="qw-book__booking-conditions__excluded-taxes">
                    <h5>Taxes excluded in the room price</h5>
                    <li>{`${this.quote.taxes.excludedTaxes.computations[0].summary} (${this.quote.taxes.excludedTaxes.totalAmount.text})`}</li>
                  </div>}
                  {this.quote.taxes.onSiteTaxes.totalAmount.text && <div class="qw-book__booking-conditions__on-site-taxes">
                    <h5>Taxes added to the price of the room</h5>
                    {this.quote.taxes.onSiteTaxes.totalAmount.text &&
                    <li>{`${this.quote.taxes.onSiteTaxes.computations[0].summary} (${this.quote.taxes.onSiteTaxes.totalAmount.text})`}</li>}
                  </div>}
                </div>}
                <div class="qw-book__confirmation">
                  <h4>Confirmation</h4>
                  <div class="qw-book__confirmation-checkbox">
                    <qw-input qwInputType="checkbox" qwInputName="confirmConditions"/>
                    <div>I have read and agree with the terms & conditions and booking conditions for my stay *</div>
                  </div>
                </div>
              </div>

              {this.formQuote && !this.isFormValid() && <div class="qw-book__form-error">
                <div class="qw-book__form-error-message">Please fill the mandatory fields to complete the process. You are
                  missing:
                </div>
                <ul>
                  {!this.formQuote.customerDetails.firstName && <li>First Name</li>}
                  {!this.formQuote.customerDetails.lastName && <li>Last Name</li>}
                  {!this.formQuote.customerDetails.emailAddress && <li>Email address</li>}
                  {!emailIsValid(this.formQuote.customerDetails.emailAddress) && <li>Email address is invalid</li>}
                  {!this.formQuote.customerDetails.countryCode && <li>Country of residence</li>}
                  {!this.isConfirmedConditions && <li>Terms & conditions</li>}
                </ul>
              </div>}

              <div class="qw-book__pay">
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
