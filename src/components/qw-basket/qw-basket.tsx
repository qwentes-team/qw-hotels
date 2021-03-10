import {Component, Host, h, State, Prop, Event, EventEmitter} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketService, BasketWithPrice$, Language,
  MoneyPrice, SessionHelper, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {QwButton} from '../shared/qw-button/qw-button';
import {debounceTime, switchMap} from 'rxjs/operators';

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
  @State() totalPrice: MoneyPrice;
  @State() onSiteTaxes: string;
  @State() taxesMessage: string;
  @State() isLoading: boolean;
  @State() sessionOccupancy: any;
  @State() numberOfAccommodation: any;
  @Event() qwBasketBookNow: EventEmitter<void>;
  @Event() qwBasketClickPrice: EventEmitter<void>;
  @Event() qwBasketIsAccommodationSatisfy: EventEmitter<{isAccommodationSatisfy: boolean, status: number}>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap((session) => {
      this.sessionOccupancy = SessionHelper.getSessionOccupancy(session);
      return BasketService.getBasket(session);
    })).subscribe();

    BasketWithPrice$.pipe(debounceTime(500)).subscribe(basket => {
      this.totalPrice = BasketHelper.getTotalConvertedPrice(basket);
      this.onSiteTaxes = basket.taxes.onSite.text;
      this.taxesMessage = BasketHelper.getTaxesFormatted(basket);
      this.numberOfAccommodation = BasketHelper.getOccupancyOfAccommodation(basket);
      this.qwBasketIsAccommodationSatisfy.emit(this.isAccommodationSatisfy());
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
    return !this.totalPrice || this.totalPrice.value.amount === 0;
  }

  private isAccommodationSatisfy() {
    const totalAdults = this.numberOfAccommodation?.reduce((acc, room) => {
      const adulti = room.occupancy.personCount || room.occupancy.adultCount;
      return acc + adulti;
    }, 0);
    const totalChildren = this.numberOfAccommodation?.reduce((acc, room) => {
      return acc + room.occupancy.childCount || 0;
    }, 0);
    const totalInfants = this.numberOfAccommodation?.reduce((acc, room) => {
      return acc + room.occupancy.infantCount || 0;
    }, 0);

    const currentOccupancy = {
      adults: {currentValue: totalAdults, sessionValue: this.sessionOccupancy?.adults},
      children: {currentValue: totalChildren, sessionValue: this.sessionOccupancy?.children},
      infants: {currentValue: totalInfants, sessionValue: this.sessionOccupancy?.infants},
    };

    if (!this.numberOfAccommodation?.length) {
      return {isAccommodationSatisfy: false, status: 0, detail: currentOccupancy};
    } else if (!this.isOccupancySatisfied(totalAdults, totalChildren, totalInfants)) {
      return {isAccommodationSatisfy: false, status: 2, detail: currentOccupancy};
    } else if (this.isOccupancySatisfied(totalAdults, totalChildren, totalInfants)) {
      return {isAccommodationSatisfy: true, status: 1, detail: currentOccupancy};
    } else {
      return;
    }
  }

  private isOccupancySatisfied(totalAdults, totalChildren, totalInfants) {
    return totalAdults >= this.sessionOccupancy?.adults
      && totalChildren >= this.sessionOccupancy?.children
      && totalInfants >= this.sessionOccupancy?.infants;
  }

  public render() {
    return (
      <Host class={this.isAccommodationSatisfy() ? 'qw-basket--active' : ''}>
        {(!this.isTotalPriceZero() || this.qwBasketShowPriceIfEmpty) && <div class="qw-basket__price" onClick={() => this.clickPrice()}>
          <span>{Language.getTranslation('total')}</span>
          {this.qwBasketShowTaxes && <div class={`qw-basket__tax-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.taxesMessage}
          </div>}
          <div class={`qw-basket__price-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.totalPrice && this.totalPrice.text}
          </div>
        </div>}
        {this.qwBasketShowEmptyButton && <QwButton
          QwButtonLabel={Language.getTranslation('emptyBasket')}
          QwButtonOnClick={this.deleteBasket}/>}
        {this.qwBasketShowBookNowButton && <QwButton
          QwButtonClass="qw-button--checkout"
          QwButtonLabel={Language.getTranslation('checkout')}
          QwButtonDisabled={!this.isAccommodationSatisfy().isAccommodationSatisfy}
          QwButtonOnClick={this.bookNow}/>}
        {(!this.isTotalPriceZero() && this.qwBasketShowOnSiteTaxes) &&
        <div class={`qw-basket__on-site-tax-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
          <span>{Language.getTranslation('cityTaxesNotIncluded')}</span> {this.onSiteTaxes}
        </div>}
      </Host>
    );
  }
}
