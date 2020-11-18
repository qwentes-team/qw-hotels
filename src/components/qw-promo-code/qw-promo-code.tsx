import {Component, Host, h, Prop, State} from '@stencil/core';
import {SessionLoaded$, SessionModel} from '@qwentes/booking-state-manager';
import {SessionHelperService} from '@qwentes/booking-state-manager/dist/feature/session/session-helper.service';
import {QwButton} from '../shared/qw-button/qw-button';
import {catchError} from 'rxjs/operators';
import {of} from 'rxjs';

@Component({
  tag: 'qw-promo-code',
  styleUrl: 'qw-promo-code.css',
  shadow: false,
})
export class QwPromoCode {
  @State() session: SessionModel;
  @State() promoCodeValue: string;
  @State() invalidCodeMessage = '';
  @Prop() qwPromoCodeLabel: string;

  public componentWillLoad() {
    SessionLoaded$.subscribe((session) => {
      this.session = session;
    });
  }

  render() {
    return (
      <Host>
        <qw-input
          qwInputLabel={this.qwPromoCodeLabel}
          qwInputCaption={this.invalidCodeMessage}
          onKeyUp={(event: UIEvent) => this.onChangeValue(event)}/>
        {this.promoCodeValue && <QwButton
          QwButtonIcon={true}
          QwButtonIconFileName={'arrow-select.svg'}
          QwButtonOnClick={() => this.fetchSessionWithPromoCode()}/> }
      </Host>
    );
  }

  private onChangeValue(event) {
    this.promoCodeValue = event.target.value;
  }

  private fetchSessionWithPromoCode() {
    SessionHelperService.fetchUpdateSessionContext(
      this.session?.sessionId,
      {
        stayPeriod: this.session.context.stayPeriod,
        guests: this.session.context.guests,
        selectedHotelId: this.session.context.selectedHotelId,
        promoCode: this.promoCodeValue
      }).pipe(
        catchError((err) => of(err))
    ).subscribe(res => {
      this.invalidCodeMessage = res.status === 400 && res.body.Message;
    });
  }
}
