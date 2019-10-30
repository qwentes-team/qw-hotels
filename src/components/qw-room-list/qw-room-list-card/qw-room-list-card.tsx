import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
import {Rate, RoomModel} from 'booking-state-manager';
import {MoneyPrice} from 'booking-state-manager/src/core/money/money';

@Component({
  tag: 'qw-room-list-card',
  styleUrl: 'qw-room-list-card.css',
  shadow: false
})
export class QwRoomListCard {
  @Prop() qwRoomListCardId: RoomModel['roomId'];
  @Prop() qwRoomListCardTitle: string;
  @Prop() qwRoomListCardPrice: string;
  @Prop() qwRoomListCardAveragePrice: string;
  @Prop() qwRoomListCardSquareMeter: string;
  @Prop() qwRoomListCardGuests: string;
  @Prop() qwRoomListCardImage: string;
  @Prop() qwRoomListCardRates: Rate[];
  @Prop() qwRoomListCardIsLoading: boolean;
  @Prop() qwRoomListCardDescription: string;
  @Prop() qwRoomListCardRangeDate: Date[];
  @Prop() qwRoomListCardRangeDateSession: Date[];
  @Prop() qwRoomListCardPrices: {[dateString: string]: MoneyPrice};
  @Prop() qwRoomListCardShowPrices: boolean = true;
  @Prop() qwRoomListCardOnClickBook: () => void;
  @Prop() qwRoomListCardOnClickView: () => void;

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-list-card__image">
            <QwImage imageUrl={this.qwRoomListCardImage} alt={this.qwRoomListCardTitle}/>
          </div>

          <div class="qw-room-list-card__title">
            <div class="qw-room-list-card__title-content">
              <h4>{this.qwRoomListCardTitle}</h4>
              <h6 class="qw-room-list-card__caption">
                {this.qwRoomListCardGuests}{this.qwRoomListCardSquareMeter && ` / ${this.qwRoomListCardSquareMeter}`}
              </h6>
            </div>
            <qw-price qw-price-main-price={this.qwRoomListCardAveragePrice} qw-price-caption={'Average per night'}/>
          </div>

          <div class="qw-room-list-card__descriptions">
            <p>{this.qwRoomListCardDescription}</p>
          </div>

          {this.qwRoomListCardShowPrices && <div class="qw-room-list-card__prices">
            <qw-week-calendar
              qwWeekCalendarRangeDate={this.qwRoomListCardRangeDate}
              qwWeekCalendarRangeDateSession={this.qwRoomListCardRangeDateSession}
              qwWeekCalendarPricesByRoom={this.qwRoomListCardPrices}
              qwWeekCalendarSelectedRoomId={this.qwRoomListCardId}/>
          </div>}

          <div class="qw-room-list-card__cta">
            <QwButton QwButtonLabel="Book now" QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
            <QwButton QwButtonLabel="View room" QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
          </div>
        </qw-card>
      </Host>
    );
  }
}
