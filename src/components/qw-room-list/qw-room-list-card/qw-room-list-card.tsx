import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
import {Rate, RoomDefaultLabel, RoomModel} from 'booking-state-manager';
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
  @Prop() qwRoomListCardCrossedOutPrice: string;
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
  @Prop() qwRoomListCardIsLoadingPrice: boolean;
  @Prop() qwRoomListCardShowPrices: boolean = true;
  @Prop() qwRoomListCardNights: number;
  @Prop() qwRoomListCardOnClickBook: () => void;
  @Prop() qwRoomListCardOnClickView: () => void;
  @Prop() qwRoomListCardOnClickChangeDate: () => void;

  private getMessageError() {
    // todo differenziare i due errori
    return 'This room is not available fot the dates selected, or the rate is not available with the one in your basket.'
  }

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-list-card__image">
            <QwImage imageUrl={this.qwRoomListCardImage} alt={this.qwRoomListCardTitle}/>
          </div>

          <div class={`qw-room-list-card__title ${!this.qwRoomListCardPrice ? 'qw-room-list-card--has-error' : ''}`}>
            <div class="qw-room-list-card__title-content">
              <h4>{this.qwRoomListCardTitle}</h4>
              <h6 class="qw-room-list-card__caption">
                {this.qwRoomListCardGuests}{this.qwRoomListCardSquareMeter && ` / ${this.qwRoomListCardSquareMeter}`}
              </h6>
            </div>
            {!this.qwRoomListCardPrice
              ? <qw-error>{this.getMessageError()}</qw-error>
              : <qw-price
                  qwPriceCrossedPrice={this.qwRoomListCardCrossedOutPrice || RoomDefaultLabel.NoPrice}
                  qwPriceMainPrice={this.qwRoomListCardPrice || RoomDefaultLabel.NoPrice}
                  qwPriceCaption={`Total for ${this.qwRoomListCardNights} ${this.qwRoomListCardNights > 1 ? 'nights' : 'night'}`}/>
            }
          </div>

          <div class="qw-room-list-card__descriptions">
            <p>{this.qwRoomListCardDescription}</p>
          </div>

          {this.qwRoomListCardShowPrices && <div class="qw-room-list-card__prices">
            <div class="qw-room-list-card__prices-average">
              Best prices - Average per night: {this.qwRoomListCardAveragePrice || RoomDefaultLabel.NoPrice}
            </div>
            <qw-week-calendar
              qwWeekCalendarRangeDate={this.qwRoomListCardRangeDate}
              qwWeekCalendarRangeDateSession={this.qwRoomListCardRangeDateSession}
              qwWeekCalendarPricesByRoom={this.qwRoomListCardPrices}
              qwWeekCalendarSelectedRoomId={this.qwRoomListCardId}/>
          </div>}

          <div class="qw-room-list-card__cta">
            <QwButton QwButtonLabel="View room" QwButtonOnClick={() => this.qwRoomListCardOnClickView()}/>
            {!this.qwRoomListCardIsLoadingPrice &&
              (this.qwRoomListCardPrices
                ? <QwButton QwButtonLabel="Book now" QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
                : <QwButton QwButtonLabel="Change dates" QwButtonOnClick={() => this.qwRoomListCardOnClickChangeDate()}/>)
            }
          </div>
        </qw-card>
      </Host>
    );
  }
}
