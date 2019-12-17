import {Component, Host, h, Prop, State, EventEmitter, Event, Element} from '@stencil/core';
import {QwSelect} from '../shared/qw-select/qw-select';
import {
  SessionDisplay,
  SessionIsLoading$,
  SessionLoaded$,
  SessionModel,
  SessionService,
} from '@qwentes/booking-state-manager';
import {first, map} from 'rxjs/operators';

const LABEL_LANGUAGES = {
  'en-US': 'ENGLISH',
  'fr-FR': 'FRANÇAIS',
  'it-IT': 'ITALIANO',
};

@Component({
  tag: 'qw-language',
  styleUrl: 'qw-language.css',
  shadow: false,
})
export class QwLanguage {
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
    return this.qwLanguageLanguages ? JSON.parse(this.qwLanguageLanguages) : [];
  }

  languageChanged = (e) => {
    this.setLanguage(e.target.value);
    this.setClassToSelect(e.target.value);
  };

  private setLanguage = (culture: SessionDisplay['culture']) => {
    SessionService.updateDisplaySession({...this.session.display, culture})
      .subscribe(session => this.qwLanguageChanged.emit(session.display.culture));
  };

  private setCurrentLanguage(culture: SessionDisplay['culture']) {
    setTimeout(() => {
      this.currentLanguage = culture;
      this.setClassToSelect(culture);
    }, 300);
  }

  private setClassToSelect(culture: SessionDisplay['culture']) {
    const select = this.el.querySelector('.qw-select__qw-language select');
    Object.keys(LABEL_LANGUAGES).forEach(labelKey => select.classList.remove(labelKey));
    select.classList.add(culture);
  }

  render() {
    return (
      <Host>
        {this.session && <QwSelect
          QwSelectName="qw-language"
          QwSelectDisabled={this.isSessionLoading}
          QwSelectOnChange={(e) => this.languageChanged(e)}>
          {this.getLanguagesFromProps().map(lang => {
            return <option value={lang} selected={lang === this.currentLanguage}>{LABEL_LANGUAGES[lang]}</option>;
          })}
        </QwSelect>}
      </Host>
    );
  }
}
