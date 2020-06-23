import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {
  BasketService,
  MONEY_CURRENCIES,
  SessionDisplay,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
} from '@qwentes/booking-state-manager';
import {QwSelect} from '../shared/qw-select/qw-select';
import {tap} from 'rxjs/operators';
import {QwCurrencyType} from '../../index';

@Component({
  tag: 'qw-currency',
  styleUrl: 'qw-currency.css',
  shadow: false,
})
export class QwCurrency {
  @Prop() qwCurrencyType: QwCurrencyType = QwCurrencyType.Classic;
  @Prop() qwCurrencyHasSymbol = false;
  @State() session: SessionModel;
  @State() currentCurrency: SessionDisplay['currency'];
  @State() isSessionLoading: boolean;
  @Event() qwCurrencyChanged: EventEmitter<SessionDisplay['currency']>;

  public currencies = this.sortCurrenciesByName();

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.currentCurrency = session.display.currency;
    });
  }

  public currencyChanged = (e) => {
    this.setCurrency(e.target.value);
  };

  private setCurrency = (currency: SessionDisplay['currency']) => {
    SessionService.updateDisplaySession({...this.session.display, currency})
      .pipe(tap((session) => BasketService.fetchBasket(session).subscribe()))
      .subscribe(session => this.qwCurrencyChanged.emit(session.display.currency));
  };

  private sortCurrenciesByName() {
    const importantKeys = ['EUR', 'USD', 'AUD', 'CAD', 'GBP', 'CHF', 'JPY'];
    const toSkipKeys = ['BYN'];
    const ordered = Object.keys(MONEY_CURRENCIES)
      .filter(k => !importantKeys.includes(k) && !toSkipKeys.includes(k))
      .sort((a, b) => {
        const keyToSort = this.isClassic() ? 'name' : 'code';
        return MONEY_CURRENCIES[a][keyToSort] < MONEY_CURRENCIES[b][keyToSort]
          ? -1
          : (MONEY_CURRENCIES[b][keyToSort] > MONEY_CURRENCIES[a][keyToSort] ? 1 : 0);
      }).reduce((acc, key) => ({...acc, [key]: MONEY_CURRENCIES[key]}), {});
    const important = importantKeys.reduce((acc, key) => ({...acc, [key]: MONEY_CURRENCIES[key]}), {});
    return {...important, ...ordered};
  }

  private isClassic() {
    return this.qwCurrencyType === QwCurrencyType.Classic;
  }

  private shouldShowSymbol(currencyCode: string) {
    return this.qwCurrencyHasSymbol ? `(${this.currencies[currencyCode].symbol})` : ''
  }

  render() {
    return (
      <Host>
        {this.session && <QwSelect
          QwSelectName="qw-currency"
          QwSelectDisabled={this.isSessionLoading}
          QwSelectOnChange={(e) => this.currencyChanged(e)}>
          {Object.keys(this.currencies).map(currencyCode => {
            return <option value={currencyCode} selected={currencyCode === this.currentCurrency}>
              {this.isClassic() ? this.currencies[currencyCode].name : currencyCode} {this.shouldShowSymbol(currencyCode)}
            </option>;
          })}
        </QwSelect>}
      </Host>
    );
  }
}
