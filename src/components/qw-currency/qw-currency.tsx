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
    const toSkipKeys = ['XUA', 'BYN', 'VES', 'XBA', 'XBB', 'XBD', 'XBC', 'XTS', 'SVC', 'XAU', 'MXV', 'BOV', 'MRU', 'XPD', 'XPT', 'XDR', 'XAG', 'XSU', 'XXX', 'USN', 'UYW', 'CLF', 'COU', 'UYI'];
    const ordered = Object.keys(MONEY_CURRENCIES)
      .filter(k => !importantKeys.includes(k) && !toSkipKeys.includes(k))
      .sort((a, b) => {
        return MONEY_CURRENCIES[a].currency < MONEY_CURRENCIES[b].currency
          ? -1
          : (MONEY_CURRENCIES[b].currency > MONEY_CURRENCIES[a].currency ? 1 : 0);
      }).reduce((acc, key) => ({...acc, [key]: MONEY_CURRENCIES[key]}), {});
    const important = importantKeys.reduce((acc, key) => ({...acc, [key]: MONEY_CURRENCIES[key]}), {});
    return {...important, ...ordered};
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
              {
                this.qwCurrencyType === QwCurrencyType.Classic
                  ? this.currencies[currencyCode].currency
                  : currencyCode
              }
            </option>;
          })}
        </QwSelect>}
      </Host>
    );
  }
}
