import {Component, Element, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {QwSelect} from '../shared/qw-select/qw-select';
import {
  BasketService,
  QwLanguageKeys,
  SessionDisplay,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
} from '@qwentes/booking-state-manager';
import {first, map, tap} from 'rxjs/operators';
import {QwLanguageType} from '../../index';

const LABEL_LANGUAGES = {
  'ar-MA':	'Arabic',
  'bg-BG':	'Bulgarian',
  'ca-ES':	'Catalan',
  'zh-CN':	'Chinese (Simplified)',
  'hr-HR':	'Croatian',
  'cs-CZ':	'Czech',
  'da-DK':	'Danish',
  'nl-NL':	'Dutch',
  'en-US':	'English',
  'et-EE':	'Estonian',
  'fi-FI':	'Finnish',
  'fr-FR':	'French',
  'de-DE':	'German',
  'el-GR':	'Greek',
  'he-IL':	'Hebrew',
  'hu-HU':	'Hungarian',
  'is-IS':	'Icelandic',
  'id-ID':	'Indonesian',
  'it-IT':	'Italian',
  'ja-JP':	'Japanese',
  'ko-KR':	'Korean',
  'lv-LV':	'Latvian',
  'lt-LT':	'Lithuanian',
  'ms-MY':	'Malay',
  'nb-NO':	'Norwegian (Bokmal)',
  'pl-PL':	'Polish',
  'pt-PT':	'Portuguese (Portugal)',
  'ro-RO':	'Romanian',
  'ru-RU':	'Russian',
  'sr-Latn-RS':	'Serbian',
  'sk-SK':	'Slovak',
  'sl-SI':	'Slovenian',
  'es-ES':	'Spanish',
  'sv-SE':	'Swedish',
  'th-TH':	'Thai',
  'tr-TR':	'Turkish',
  'uk-UA':	'Ukrainian',
  'vi-VN':	'Vietnamese'
};

@Component({
  tag: 'qw-language',
  styleUrl: 'qw-language.css',
  shadow: false,
})
export class QwLanguage {
  @Prop() qwLanguageType: QwLanguageType = QwLanguageType.Select;
  @Prop() qwLanguageLanguages: string;
  @Prop() qwLanguagePreselected: string;
  @State() session: SessionModel;
  @State() isSessionLoading: boolean;
  @State() currentLanguage: SessionDisplay['culture'];
  @Event() qwLanguageChanged: EventEmitter<SessionDisplay['culture']>;
  @Element() el: HTMLElement;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.subscribe((session) => this.session = session);

    SessionLoaded$.pipe(
      first(),
      map(session => {
        this.currentLanguage = session.display.culture;
        this.setCurrentLanguage(session.display.culture);

        if (this.qwLanguagePreselected) {
          if (session.display.culture !== this.qwLanguagePreselected) {
            this.setLanguage(this.qwLanguagePreselected);
            this.setCurrentLanguage(this.qwLanguagePreselected);
          }
        }
      }),
    ).subscribe();

    SessionIsLoading$.subscribe(isLoading => this.isSessionLoading = isLoading);
  }

  private getLanguagesFromProps(): string[] {
    return this.qwLanguageLanguages ? JSON.parse(this.qwLanguageLanguages) : Object.values(QwLanguageKeys);
  }

  languageChanged = (e) => {
    this.setLanguage(e.target.value);
    this.setClassToSelect(e.target.value);
  };

  private setLanguage = (culture: SessionDisplay['culture']) => {
    SessionService.updateDisplaySession({...this.session.display, culture})
      .pipe(tap((session) => BasketService.fetchBasket(session).subscribe()))
      .subscribe(session => {
        this.qwLanguageChanged.emit(session.display.culture);
        this.currentLanguage = culture;
      });
  };

  private setCurrentLanguage(culture: SessionDisplay['culture']) {
    setTimeout(() => this.setClassToSelect(culture), 300);
  }

  private setClassToSelect(culture: SessionDisplay['culture']) {
    const select = this.el.querySelector('.qw-select__qw-language select');
    if (!select) {
      return;
    }
    Object.values(QwLanguageKeys).forEach(labelKey => select.classList.remove(labelKey));
    select.classList.add(culture);
  }

  private renderLanguageSelect() {
    return (
      <Host>
        <QwSelect
          QwSelectName="qw-language"
          QwSelectDisabled={this.isSessionLoading}
          QwSelectOnChange={(e) => this.languageChanged(e)}>
          {this.getLanguagesFromProps().map(lang => {
            return <option value={lang} selected={lang === this.currentLanguage}>{LABEL_LANGUAGES[lang].toUpperCase()}</option>;
          })}
        </QwSelect>
      </Host>
    );
  }

  private renderLanguageDropDown() {
    return (
      <Host>
        <div class="qw-language__drop-down__current">{LABEL_LANGUAGES[this.currentLanguage]}</div>
        <div class="qw-language__drop-down__list">
          {this.getLanguagesFromProps().map(lang => {
            return lang !== this.currentLanguage
              ? <span class={lang} onClick={() => this.setLanguage(lang)}>{LABEL_LANGUAGES[lang]}</span>
              : '';
          })}
        </div>
      </Host>
    );
  }

  render() {
    return this.session && (this.qwLanguageType === QwLanguageType.Select ? this.renderLanguageSelect() : this.renderLanguageDropDown());
  }
}
