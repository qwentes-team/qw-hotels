import {Component, Host, h, State, Prop, Event, EventEmitter} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketQuery, BasketService,
  MoneyPrice, SessionHelper, SessionLoaded$, SessionService,
} from 'booking-state-manager';
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
  @State() totalPrice: MoneyPrice;
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

    BasketQuery.select().subscribe(basket => {
      this.totalPrice = BasketHelper.getTotalOriginalPrice(basket);
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
    return this.totalPrice && this.totalPrice.value.amount === 0
  }

  private isAccommodationSatisfy() {
    return this.numberOfGuests <= this.numberOfAccommodation;
  }

  public render() {
    return (
      <Host>
        {!this.isTotalPriceZero() && <div class="qw-basket__price" onClick={() => this.clickPrice()}>
          <div class={`qw-basket__price-total ${this.isLoading ? 'qw-basket__price__amount--disabled' : ''}`}>
            {this.totalPrice && this.totalPrice.text}
          </div>
        </div>}
        {this.qwBasketShowEmptyButton && <QwButton
          QwButtonLabel="Empty basket"
          QwButtonOnClick={this.deleteBasket}/>}
        {this.qwBasketShowBookNowButton && <QwButton
          QwButtonLabel="Book Now"
          QwButtonDisabled={!this.totalPrice || this.isTotalPriceZero() || !this.isAccommodationSatisfy()}
          QwButtonOnClick={this.bookNow}/>}
      </Host>
    );
  }
}
