import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
import {Rate, RoomModel} from 'booking-state-manager';
import {MoneyPrice} from 'booking-state-manager/src/core/money/money';

@Component({
  tag: 'qw-room-card',
  styleUrl: 'qw-room-card.css',
  shadow: false
})
export class QwRoomCard {
  @Prop() qwRoomCardId: RoomModel['roomId'];
  @Prop() qwRoomCardTitle: string;
  @Prop() qwRoomCardPrice: string;
  @Prop() qwRoomCardAveragePrice: string;
  @Prop() qwRoomCardSquareMeter: string;
  @Prop() qwRoomCardGuests: string;
  @Prop() qwRoomCardImage: string;
  @Prop() qwRoomCardRates: Rate[];
  @Prop() qwRoomCardIsLoading: boolean;
  @Prop() qwRoomCardDescription: string;
  @Prop() qwRoomCardRangeDate: Date[];
  @Prop() qwRoomCardRangeDateSession: Date[];
  @Prop() qwRoomCardPrices: {[dateString: string]: MoneyPrice};
  @Prop() qwRoomCardOnClickBook: () => void;
  @Prop() qwRoomCardOnClickView: () => void;

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
            <qw-week-calendar
              qwWeekCalendarRangeDate={this.qwRoomCardRangeDate}
              qwWeekCalendarRangeDateSession={this.qwRoomCardRangeDateSession}
              qwWeekCalendarPricesByRoom={this.qwRoomCardPrices}
              qwWeekCalendarSelectedRoomId={this.qwRoomCardId}/>
          </div>

          <div class="qw-room-card__cta">
            <QwButton QwButtonLabel="Book now" QwButtonOnClick={() => this.qwRoomCardOnClickBook()}/>
            <QwButton QwButtonLabel="View room" QwButtonOnClick={() => this.qwRoomCardOnClickBook()}/>
          </div>
        </qw-card>
      </Host>
    );
  }
}
