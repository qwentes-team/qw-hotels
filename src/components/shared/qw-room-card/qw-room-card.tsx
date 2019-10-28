import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../qw-image/qw-image';
import {QwButton} from '../qw-button/qw-button';
import {Rate} from 'booking-state-manager';

@Component({
  tag: 'qw-room-card',
  styleUrl: 'qw-room-card.css',
  shadow: false
})
export class QwRoomCard {
  @Prop() qwRoomCardTitle: string;
  @Prop() qwRoomCardPrice: string;
  @Prop() qwRoomCardAveragePrice: string;
  @Prop() qwRoomCardSquareMeter: string;
  @Prop() qwRoomCardGuests: string;
  @Prop() qwRoomCardBeds: string;
  @Prop() qwRoomCardImage: string;
  @Prop() qwRoomCardRates: Rate[];
  @Prop() qwRoomCardIsLoading: boolean;
  @Prop() qwRoomCardDescription: string;
  @Prop() qwRoomCardOnClickBook: () => void;

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-card__header-wrapper">
            <div class="qw-room-card__header">
              <h4 class="qw-room-card__title">{this.qwRoomCardTitle}</h4>
              <h6 class="qw-room-card__caption">
                <div>{this.qwRoomCardGuests}{this.qwRoomCardSquareMeter && ` / ${this.qwRoomCardSquareMeter}`}</div>
              </h6>
            </div>
            <qw-price
              qw-price-main-price={this.qwRoomCardAveragePrice}
              qw-price-caption={'Average per night'}/>
          </div>
          <QwImage imageUrl={this.qwRoomCardImage} alt={this.qwRoomCardTitle}/>
          <div class="qw-room-card__footer">
            <div class="qw-room-card__footer-top">
              <p>{this.qwRoomCardDescription}</p>
              {/*<p>{this.qwRoomCardGuests}</p>*/}
              {/*<p>{this.qwRoomCardBeds}</p>*/}
            </div>
          </div>
          <div class="qw-room-card__cta">
            <QwButton
              QwButtonLabel="Book now"
              QwButtonDisabled={this.qwRoomCardIsLoading}
              QwButtonOnClick={() => this.qwRoomCardOnClickBook()}/>
          </div>
        </qw-card>
      </Host>
    );
  }
}
