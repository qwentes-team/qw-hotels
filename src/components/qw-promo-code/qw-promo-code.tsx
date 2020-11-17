import {Component, Host, h, Prop, State} from '@stencil/core';
import {SessionLoaded$, SessionModel} from '@qwentes/booking-state-manager';
import {SessionHelperService} from '@qwentes/booking-state-manager/dist/feature/session/session-helper.service';
import {QwButton} from '../shared/qw-button/qw-button';

@Component({
  tag: 'qw-promo-code',
  styleUrl: 'qw-promo-code.css',
  shadow: false,
})
export class QwPromoCode {
  @State() session: SessionModel;
  @State() promoCodeValue: string;
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
          onKeyUp={(event: UIEvent) => this.onChangeValue(event)}/>
        {this.promoCodeValue && <QwButton
          QwButtonIcon={true}
          QwButtonIconFileName={'arrow-select.svg'}
          QwButtonOnClick={() => this.fetchSessionWithPromoCode()}/> }
      </Host>
    );
  }

  private fetchSessionWithPromoCode() {
    SessionHelperService.fetchUpdateSessionContext(this.session.sessionId, {promoCode: this.promoCodeValue} as any).subscribe(res => console.log(res));
  }

  private onChangeValue(event) {
    this.promoCodeValue = event.target.value;
  }

}
