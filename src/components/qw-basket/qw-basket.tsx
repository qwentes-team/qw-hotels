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
  @State() totalPriceValue: string;
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
      const totalPriceAmount = parseInt(this.totalPrice.value.amount.toString().replace(",", ""), 10);
      console.log('totalPriceAmount', totalPriceAmount);
      this.totalPriceValue = this.formatPrice(totalPriceAmount);
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
      return {isAccommodationSatisfy: false, status: 0, detail: currentOccupancy}
    } else if (!this.isOccupancySatisfied(totalAdults, totalChildren, totalInfants)){
      return {isAccommodationSatisfy: false, status: 2, detail: currentOccupancy}
    } else if(this.isOccupancySatisfied(totalAdults, totalChildren, totalInfants)) {
      return {isAccommodationSatisfy: true, status: 1, detail: currentOccupancy}
    } else {
      return
    }
  }

  /* 0 < 10 000 : € or IDR
10 000 < 10 000 000 : k€ kIDR => 9000k € or 9000k IDR
10 000 000 : M€ MIDR => 11M € or 11M IDR */

  private formatPrice(value) {
    console.log('format this', value);
    let valueHtml = Math.ceil(value) + "";
    if (value >= Math.pow(10, 12 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 12), 1) + "T";
    } else if (value >= Math.pow(10, 9 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 9), 1) + "G";
    } else if (value >= Math.pow(10, 6 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 6), 1) + "M";
    } else if (value >= Math.pow(10, 3 + 1)) {
      valueHtml = this.precisionRound(value, Math.pow(10, 3), 1) + "k";
    }
    return valueHtml;
  }

  private precisionRound(value, divisor, precision) {
    let number = value / divisor;
    // Round to the n decimal
    const factor = Math.pow(10, precision);
    let r = Math.round(number * factor) / factor;

    let d = r.toFixed(1);

    if (d[d.length - 1] === "0") {
      return r.toFixed(0);
    }

    return d;
  }

  private isOccupancySatisfied(totalAdults, totalChildren, totalInfants) {
    return totalAdults >= this.sessionOccupancy?.adults
      && totalChildren >= this.sessionOccupancy?.children
      && totalInfants >= this.sessionOccupancy?.infants
  }

  public render() {
    return (
      <Host class={this.isAccommodationSatisfy().isAccommodationSatisfy ? 'qw-basket--active' : ''}>
        {(!this.isTotalPriceZero() || this.qwBasketShowPriceIfEmpty) && <div class="qw-basket__price" onClick={() => this.clickPrice()}>
          <span>{Language.getTranslation('total')}</span>
          {this.qwBasketShowTaxes && <div class={`qw-basket__tax-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.taxesMessage}
          </div>}
          <div class={`qw-basket__price-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.totalPrice && this.totalPrice.value.currency} {this.totalPrice && this.totalPriceValue}
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
