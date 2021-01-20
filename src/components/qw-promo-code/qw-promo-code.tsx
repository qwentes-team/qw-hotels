import {Component, Host, h, Prop, State} from '@stencil/core';
import {Language, SessionLoaded$, SessionModel, SessionService} from '@qwentes/booking-state-manager';
import {SessionHelperService} from '@qwentes/booking-state-manager/dist/feature/session/session-helper.service';
import {QwButton} from '../shared/qw-button/qw-button';
import {catchError, switchMap} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';

@Component({
  tag: 'qw-promo-code',
  styleUrl: 'qw-promo-code.css',
  shadow: false,
})
export class QwPromoCode {
  @State() session: SessionModel;
  @State() promoCodeValue: string = window.QW_HOTEL_ENV.PROMO_CODE_DEFAULT ? window.QW_HOTEL_ENV.PROMO_CODE_DEFAULT : '';
  @State() hasPromo: boolean;
  @State() promoCodeFeedback = '';
  @Prop() qwPromoCodeLabel: string;

  public componentWillLoad() {
    SessionLoaded$.subscribe((session) => {
      this.session = session;
      this.hasPromo = this.hasPromoCode();
      if (this.hasPromo) {
        this.promoCodeValue = this.session.context.promoCode;
      }
    });
  }

  private hasPromoCode() {
    return !!this.session.context.promoCode;
  }

  private onChangeValue(event) {
    this.promoCodeValue = event.target.value;
  }

  private setPromoCodeFeedback(res, customFeedback) {
    this.promoCodeFeedback = res.status === 400 ? res.body.Message : customFeedback;
  }

  private fetchSessionWithPromoCode(action) {
    if (action === 'remove') {
      this.promoCodeValue = '';
    }
    return SessionHelperService.fetchUpdateSessionContext(
      this.session?.sessionId,
      {
        stayPeriod: this.session.context.stayPeriod,
        guests: this.session.context.guests,
        selectedHotelId: this.session.context.selectedHotelId,
        promoCode: this.promoCodeValue,
      }).pipe(
        switchMap((res) => {
          return forkJoin([of(res), SessionService.fetchSession(this.session.sessionId)])
        }),
      catchError((err) =>of(err)),
    ).subscribe((res) => {
      const actionFeedback = action === 'add' ? Language.getTranslation('promoCodeAdded') : Language.getTranslation('promoCodeRemoved');
      this.setPromoCodeFeedback(res, actionFeedback);
    });
  }

  render() {
    return (
      <Host>
        <qw-input
          class="promo-code__label"
          qwInputValue={this.promoCodeValue}
          qwInputLabel={this.qwPromoCodeLabel}
          qwInputCaption={this.promoCodeFeedback}
          onKeyUp={(event: UIEvent) => this.onChangeValue(event)}/>
        {!this.hasPromo && <QwButton
          QwButtonIcon={true}
          QwButtonIconFileName={'arrow-select.svg'}
          QwButtonOnClick={() => this.fetchSessionWithPromoCode('add')}/>}
        {this.hasPromo && <QwButton
          QwButtonIcon={true}
          QwButtonIconFileName={'close.svg'}
          QwButtonOnClick={() => this.fetchSessionWithPromoCode('remove')}/>}
      </Host>
    );
  }
}
