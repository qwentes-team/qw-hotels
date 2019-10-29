import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
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
  @Prop() qwRoomCardImage: string;
  @Prop() qwRoomCardRates: Rate[];
  @Prop() qwRoomCardIsLoading: boolean;
  @Prop() qwRoomCardDescription: string;
  @Prop() qwRoomCardOnClickBook: () => void;

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-card__image">
            <QwImage imageUrl={this.qwRoomCardImage} alt={this.qwRoomCardTitle}/>
          </div>

          <div class="qw-room-card__title">
            <div class="qw-room-card__title-content">
              <h4>{this.qwRoomCardTitle}</h4>
              <h6 class="qw-room-card__caption">
                {this.qwRoomCardGuests}{this.qwRoomCardSquareMeter && ` / ${this.qwRoomCardSquareMeter}`}
              </h6>
            </div>
            <qw-price qw-price-main-price={this.qwRoomCardAveragePrice} qw-price-caption={'Average per night'}/>
          </div>

          <div class="qw-room-card__descriptions">
            <p>{this.qwRoomCardDescription}</p>
          </div>

          <div class="qw-room-card__prices">
            PREZZI
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
