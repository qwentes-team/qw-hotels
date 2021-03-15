import {Component, Host, h, State, Listen, EventEmitter, Event} from '@stencil/core';
import {
  SessionLoaded$, SessionService, SessionModel,
  QuoteService, QuoteModel, QuoteCreateBody, QuoteHelper, QuoteLoaded$,
  BasketService, BasketHelper, SessionHelper, BasketWithPrice$, Language,
} from '@qwentes/booking-state-manager';
import {first, switchMap} from 'rxjs/operators';
import {QwInputEmitter} from '../shared/qw-input/qw-input';
import {QwButton} from '../shared/qw-button/qw-button';
import {GuestDetailFormProperty} from '../../index';
import {emailIsValid} from '../../globals/app';
import {of} from 'rxjs';

@Component({
  tag: 'qw-book',
  styleUrl: 'qw-book.css',
  shadow: false,
})
export class QwBook {
  @State() quote: QuoteModel;
  @State() isConfirmedConditions: boolean;
  @State() isInsuranceAccepted: boolean = false;
  @State() formQuote: QuoteCreateBody;
  @State() showFormErrors: boolean = false;
  @Event() qwBookIsLoaded: EventEmitter<void>;
  @Event() qwInsuranceAcceptanceChanged: EventEmitter<boolean>;

  private session: SessionModel;
  private mandatoriesCustomerFields = [
    GuestDetailFormProperty.FirstName,
    GuestDetailFormProperty.LastName,
    GuestDetailFormProperty.CountryCode,
    GuestDetailFormProperty.EmailAddress,
  ];

  public componentWillLoad() {
    this.formQuote = QuoteHelper.initObjectForCreateBody();

    SessionService.getSession().subscribe();
    SessionLoaded$
      .pipe(switchMap(session => {
        this.session = session;
        return BasketService.getBasket(session);
      })).subscribe();

    BasketWithPrice$.pipe(switchMap(basket => {
      const numberOfAccommodations = BasketHelper.getNumberOfAccommodation(basket);
      const numberOfGuests = SessionHelper.getTotalGuests(this.session);
      if (numberOfAccommodations >= numberOfGuests) {
        return QuoteService.getQuote(this.session.sessionId);
      }
      this.quote = null;
      return of(null);
    })).subscribe();

    QuoteLoaded$.pipe(first()).subscribe(() => this.qwBookIsLoaded.emit());
    QuoteLoaded$.subscribe(quote => {
      this.quote = quote
    });
    this.formQuote.subscribeInsurance = this.isInsuranceAccepted;
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
    if (this.isInsuranceAcceptanceFormName(name)) {
      this.isInsuranceAccepted = Boolean(value);
      this.formQuote.subscribeInsurance = this.isInsuranceAccepted;
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

  private isInsuranceAcceptanceFormName(name: QwInputEmitter['name']) {
    return name === GuestDetailFormProperty.InsuranceAcceptance;
  }

  public payNow = () => {
    console.log(this.formQuote);
    if (this.isFormValid()) {
      let windowReference: any = window.open();
      QuoteService.createQuote(this.session.sessionId, this.formQuote).subscribe((res) => {
        windowReference.location = res.redirectionUrl;
      });
    } else {
      this.showFormErrors = true;
    }
  };

  public showMissingRequiredForm() {
    return this.showFormErrors && (!this.isFormValid() || !this.isConfirmedConditions);
  }

  public emitInsuranceAcceptance() {
    this.qwInsuranceAcceptanceChanged.emit(true);
  }

  render() {
    return (
      <Host class={`${!this.quote ? 'qw-book--loading' : 'qw-book--loaded'}`}>
        <div style={this.quote && {'display': 'none'}}>
          <slot name="qwBookLoading"/>
        </div>
        {this.quote
          ? this.quoteHasError()
            ? <div class="qw-book__error-quote">
                {Language.getTranslation('quoteErrorMessage')}
              </div>
            : <div class="qw-book__wrapper">
              <qw-book-guest-detail
                qwBookFormShowError={this.showFormErrors}
                qwBookGuestDetailTitleOptions={this.quote && this.quote.guestTitles}/>

              <div class="qw-book__insurance">
                <h3>Cancellation insurance</h3>
                <div class="insurance__heading">
                  <img src={this.quote.insurance.logoUrl} alt="insurance logo"/>
                  <h4>{this.quote.insurance.name}</h4>
                </div>
                <p>{this.quote.insurance.depositText}</p>
                <a href={this.quote.insurance.termsUrl} target="_blank">Terms & Conditions</a>
                <p>{this.quote.insurance.price.converted.text}</p>
                <div
                  class={`qw-book__insurance-acceptance-checkbox ${this.showFormErrors && !this.isInsuranceAccepted ? 'qw-book__insurance-acceptance-checkbox--error' : ''}`}>
                  <qw-input qwInputType="checkbox" qwInputName="insuranceAcceptance"/>
                  <div>By checking this flag you will be charged with the insurance cost above during the payment process.</div>
                </div>

              </div>

              <div class="qw-book__extra">
                <h3>{Language.getTranslation('extras')}</h3>
                <qw-extra></qw-extra>
              </div>

              <div class="qw-book__other-info">
                <h3>{Language.getTranslation('otherInfo')}</h3>
                <div class="qw-book__special-requests">
                  <div class="qw-book__special-requests__title">
                    <h4>{Language.getTranslation('specialRequest')}</h4>
                    <QwButton QwButtonLabel=""/>
                  </div>
                  <div class="qw-book__special-requests__caption">
                    {Language.getTranslation('specialRequestMessage')}
                  </div>
                  <div class="qw-book__special-requests__content">
                    <qw-textarea qwTextareaName="specialRequest"/>
                  </div>
                </div>
                {this.quote && <qw-book-condition/>}
                <div class="qw-book__confirmation">
                  <h4>{Language.getTranslation('confirmation')}</h4>
                  <div class={`qw-book__confirmation-checkbox ${this.showFormErrors && !this.isConfirmedConditions ? 'qw-book__confirmation-checkbox--error' : ''}`}>
                    <qw-input qwInputType="checkbox" qwInputName="confirmConditions"/>
                    <div>{Language.getTranslation('termsAndConditionMessage')} *</div>
                  </div>
                </div>
              </div>

              <div class="qw-book__pay">
                {this.showMissingRequiredForm() ? <span class="qw-book__missing-required-fields">
                  {Language.getTranslation('missingRequiredFields')}
                </span> : ''}
                <QwButton
                  QwButtonLabel={Language.getTranslation('payNow')}
                  QwButtonOnClick={() => this.payNow()}/>
              </div>
            </div>
          : ''
        }
      </Host>
    );
  }
}
