import {Component, Host, h, State, Listen, EventEmitter, Event, Prop} from '@stencil/core';
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
  @Prop()  guestPhoneCountry: string;
  @State() quote: QuoteModel;
  @State() isConfirmedConditions: boolean;
  @State() hasInsurance: boolean;
  @State() formQuote: QuoteCreateBody;
  @State() showFormErrors: boolean = false;
  @Event() qwBookIsLoaded: EventEmitter<void>;
  @Event() changeInsuranceAcceptance: EventEmitter<{insurance: any, amount: number}>;

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
      this.quote = quote;
    });
    this.hasInsurance = this.isInsuranceAccepted();
    this.formQuote.subscribeInsurance = this.isInsuranceAccepted();

    window.addEventListener('removeInsuranceAcceptance', (e: CustomEvent) => {
      if (e.detail.insurance === undefined) {
        this.formQuote.subscribeInsurance = this.isInsuranceAccepted();
        this.hasInsurance = false;
      }
    });
  }

  private quoteHasError() {
    return !Object.keys(this.quote).length;
  }

  @Listen('qwBookGuestDetailChangeForm')
  public qwBookGuestDetailChangeForm(e: CustomEvent<QuoteCreateBody>) {
    this.formQuote = e.detail;
    this.formQuote.subscribeInsurance = this.isInsuranceAccepted();
  }

  @Listen('qwInputChanged')
  public guestDetailInputChanged(e: CustomEvent<QwInputEmitter>) {
    const {name, value} = e.detail;
    if (this.isConfirmConditionsFormName(name)) {
      this.isConfirmedConditions = Boolean(value);
    }
  }

  public onClickInsuranceAcceptance(value: boolean) {
    this.formQuote.subscribeInsurance = value;
    this.hasInsurance = value;
    if (value) {
      this.changeInsuranceAcceptance.emit({insurance: this.quote.insurance, amount: this.quote.insurance.price.converted.value.amount});
      localStorage.setItem('insuranceAmount', JSON.stringify(this.quote.insurance.price.converted.value.amount));
      localStorage.setItem('insurance', JSON.stringify(this.quote.insurance));
    } else {
      this.changeInsuranceAcceptance.emit({insurance: this.quote.insurance, amount: 0});
      localStorage.setItem('insuranceAmount', JSON.stringify(0));
      localStorage.setItem('insurance', undefined);
    }
  }

  public isInsuranceAccepted() {
    return JSON.parse(localStorage.getItem('insuranceAmount')) > 0;
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

  private makeInsuranceLogoUrl() {
    return this.quote.insurance.logoUrl.replace('~', 'http://secure-hotel-booking.com');
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
                qwBookGuestDetailDefaultPhoneCountry={this.guestPhoneCountry}
                qwBookFormShowError={this.showFormErrors}
                qwBookGuestDetailTitleOptions={this.quote && this.quote.guestTitles}/>

              {this.quote.insurance && <h3>{Language.getTranslation('cancellationInsurance')}</h3>}
              {this.quote.insurance && <div class="qw-book__insurance">
                {this.quote.insurance.logoUrl && <div class="insurance__heading">
                  <img src={this.makeInsuranceLogoUrl()} alt="insurance logo"/>
                </div>}
                <div class="insurance__content">
                  <h3>{Language.getTranslation('cancellationInsuranceQuestion')} {this.quote.insurance.price.converted.text}?</h3>
                  <p>{Language.getTranslation('cancellationInsuranceAcceptance')}</p>
                  <a class="insurance__link" href={this.quote.insurance.termsUrl}
                     target="_blank">{Language.getTranslation('cancellationInsuranceTermsAndConditions')}</a>
                  <a class="insurance__link" href={this.quote.insurance.ipidUrl}
                     target="_blank">{Language.getTranslation('cancellationInsuranceSummary')}</a>
                </div>
                <div
                  class={`qw-book__insurance-acceptance-actions ${this.showFormErrors && !this.hasInsurance ? 'qw-book__insurance-acceptance-actions--error' : ''}`}>
                  <QwButton QwButtonClass={this.hasInsurance ? 'insurance__action--selected' : ''}
                            QwButtonLabel={Language.getTranslation('yes')} QwButtonOnClick={() => this.onClickInsuranceAcceptance(true)}/>
                  <QwButton QwButtonClass={!this.hasInsurance ? 'insurance__action--selected' : ''}
                            QwButtonLabel={Language.getTranslation('no')} QwButtonOnClick={() => this.onClickInsuranceAcceptance(false)}/>
                </div>
              </div>}

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
                  <div
                    class={`qw-book__confirmation-checkbox ${this.showFormErrors && !this.isConfirmedConditions ? 'qw-book__confirmation-checkbox--error' : ''}`}>
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
