import {Component, Host, h, State} from '@stencil/core';
import {
  QuoteHelper,
  QuoteModel,
  QuoteService,
  SessionLoaded$,
  SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-book-condition',
  styleUrl: 'qw-book-condition.css',
  shadow: false
})
export class QwBookCondition {
  @State() quote: QuoteModel;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$
      .pipe(switchMap(session => {
        return QuoteService.getQuote(session.sessionId);
      }))
      .subscribe((quote: QuoteModel) => this.quote = quote);
  }

  render() {
    return (
      <Host>
        <slot>
          {this.quote && Object.keys(this.quote).length
          ? <div class="qw-book__booking-conditions">
            <h4>Booking & Sales Conditions</h4>
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
          </div> : ''}
        </slot>
      </Host>
    );
  }
}
