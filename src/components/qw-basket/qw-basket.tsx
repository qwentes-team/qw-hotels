import {Component, Host, h, State, Prop, Event, EventEmitter} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketService, BasketWithPrice$,
  MoneyPrice, SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-basket',
  styleUrl: 'qw-basket.css',
  shadow: false,
})
export class QwBasket {
  @Prop() qwBasketShowEmptyButton: boolean = false;
  @Prop() qwBasketShowBookNowButton: boolean = false;
  @Prop() qwBasketShowPriceIfEmpty: boolean = false;
  @Prop() qwBasketShowTaxes: boolean = false;
  @Prop() qwBasketShowOnSiteTaxes: boolean = false;
  @Prop() qwBasketBookNowButtonLabel: string;
  @State() totalPrice: MoneyPrice;
  @State() onSiteTaxes: string;
  @State() taxesMessage: string;
  @State() isLoading: boolean;
  @State() numberOfGuests: number;
  @State() numberOfAccommodation: number;
  @Event() qwBasketBookNow: EventEmitter<void>;
  @Event() qwBasketClickPrice: EventEmitter<void>;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.numberOfGuests = SessionHelper.getTotalGuests(session);
      return BasketService.getBasket(session)
    })).subscribe();

    BasketWithPrice$.subscribe(basket => {
      this.totalPrice = BasketHelper.getTotalOriginalPrice(basket);
      this.onSiteTaxes = basket.taxes.onSite.text;
      this.taxesMessage = BasketHelper.getTaxesFormatted(basket);
      this.numberOfAccommodation = BasketHelper.getNumberOfAccommodation(basket);
    });
    BasketIsLoading$.subscribe(isLoading => this.isLoading = isLoading);
  }

  private deleteBasket() {
    BasketService.deleteBasket().subscribe();
  }

  bookNow = () => {
    this.qwBasketBookNow.emit();
  };

  private clickPrice() {
    this.qwBasketClickPrice.emit();
  }

  private isTotalPriceZero() {
    return !this.totalPrice || this.totalPrice.value.amount === 0
  }

  private isAccommodationSatisfy() {
    return this.numberOfGuests <= this.numberOfAccommodation;
  }

  public render() {
    return (
      <Host>
        {(!this.isTotalPriceZero() || this.qwBasketShowPriceIfEmpty) && <div class="qw-basket__price" onClick={() => this.clickPrice()}>
          {this.qwBasketShowTaxes && <div class={`qw-basket__tax-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.taxesMessage}
          </div>}
          {this.qwBasketShowOnSiteTaxes && <div class={`qw-basket__on-site-tax-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.onSiteTaxes}
          </div>}
          <div class={`qw-basket__price-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.totalPrice && this.totalPrice.text}
          </div>
        </div>}
        {this.qwBasketShowEmptyButton && <QwButton
          QwButtonLabel="Empty basket"
          QwButtonOnClick={this.deleteBasket}/>}
        {this.qwBasketShowBookNowButton && <QwButton
          QwButtonClass="qw-button--checkout"
          QwButtonLabel={this.qwBasketBookNowButtonLabel || 'Checkout'}
          QwButtonDisabled={!this.totalPrice || this.isTotalPriceZero() || !this.isAccommodationSatisfy()}
          QwButtonOnClick={this.bookNow}/>}
      </Host>
    );
  }
}
