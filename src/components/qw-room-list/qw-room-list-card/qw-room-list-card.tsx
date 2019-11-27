import {Component, Host, h, Prop, Listen} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
import {MoneyPrice, Rate, RoomBasketModel, RoomDefaultLabel, RoomModel} from '@qwentes/booking-state-manager';
import {QwChangeRoomEvent} from '../../../index';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';

@Component({
  tag: 'qw-room-list-card',
  styleUrl: 'qw-room-list-card.css',
  shadow: false,
})
export class QwRoomListCard {
  @Prop() qwRoomListCardId: RoomModel['roomId'];
  @Prop() qwRoomListCardTitle: string;
  @Prop() qwRoomListCardPrice: string;
  @Prop() qwRoomListCardCrossedOutPrice: string;
  @Prop() qwRoomListCardAveragePrice: string;
  @Prop() qwRoomListCardTaxes: string;
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
  @Prop() qwRoomListCardIsLoadingBasket: boolean;
  @Prop() qwRoomListCardNights: number;
  @Prop() qwRoomListCardShowPrices: boolean = true;
  @Prop() qwRoomListCardShowCta: boolean = true;
  @Prop() qwRoomListCardShowPrice: boolean = true;
  @Prop() qwRoomListCardShowDescription: boolean = true;
  @Prop() qwRoomListCardShowPriceAndTaxes: boolean;
  @Prop() qwRoomListCardShowActions: boolean;
  @Prop() qwRoomListCardBasketRoom: RoomBasketModel;
  @Prop() qwRoomListCardBasketIsEmpty: boolean;
  @Prop() qwRoomListCardOnClickBook: () => void;
  @Prop() qwRoomListCardOnClickView: () => void;
  @Prop() qwRoomListCardOnClickChangeDate: () => void;
  @Prop() qwRoomListCardOnChangeRoom: (e: QwChangeRoomEvent) => void;

  private getMessageError() {
    // todo differenziare i due errori
    return 'This room is not available fot the dates selected, or the rate is not available with the one in your basket.';
  }

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    // todo differenziare i counter event emitter -> uno usato nella room-list e uno usato nella room-basket
    this.qwRoomListCardOnChangeRoom({
      quantity: event.detail.value.toString(),
      room: this.qwRoomListCardBasketRoom,
      roomId: this.qwRoomListCardId,
    });
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
            {this.qwRoomListCardShowPrice && (!this.qwRoomListCardPrice
              ? <qw-error>{this.getMessageError()}</qw-error>
              : <qw-price
                  qwPriceCrossedPrice={this.qwRoomListCardCrossedOutPrice || RoomDefaultLabel.NoPrice}
                  qwPriceMainPrice={this.qwRoomListCardPrice || RoomDefaultLabel.NoPrice}
                  qwPriceCaption={`Total for ${this.qwRoomListCardNights} ${this.qwRoomListCardNights > 1 ? 'nights' : 'night'}`}/>)
            }
          </div>

          {this.qwRoomListCardShowDescription && <div class="qw-room-list-card__descriptions">
            <p>{this.qwRoomListCardDescription}</p>
          </div>}

          {this.qwRoomListCardShowPrices && <div class="qw-room-list-card__prices">
            {this.qwRoomListCardBasketIsEmpty && <div class="qw-room-list-card__prices-container">
              <div class="qw-room-list-card__prices-average">
                Best prices - Average per night: {this.qwRoomListCardAveragePrice || RoomDefaultLabel.NoPrice}
              </div>
              <qw-week-calendar
                qwWeekCalendarRangeDate={this.qwRoomListCardRangeDate}
                qwWeekCalendarRangeDateSession={this.qwRoomListCardRangeDateSession}
                qwWeekCalendarPricesByRoom={this.qwRoomListCardPrices}
                qwWeekCalendarSelectedRoomId={this.qwRoomListCardId}/>
            </div>}

            {!this.qwRoomListCardBasketIsEmpty && this.qwRoomListCardRates && this.qwRoomListCardRates.length === 1 &&
              <qw-room-rate
                qwRoomRateRate={this.qwRoomListCardRates[0]}
                qwRoomRateIsLoading={this.qwRoomListCardIsLoading}/>
            }
          </div>}

          {this.qwRoomListCardBasketRoom && this.qwRoomListCardShowActions && <div class="qw-room-list-card__basket-actions">
            <div class="qw-room-list-card__basket-actions-counter">
              <div class="qw-room-list-card__basket-actions-counter-label">Room qty.</div>
              <qw-counter
                qwCounterId="qwRoomListCardCounter"
                qwCounterValue={this.qwRoomListCardBasketRoom.occupancies[0].selectedQuantity}
                qwCounterName={this.qwRoomListCardId}
                qwCounterMaxValue={this.qwRoomListCardBasketRoom.occupancies[0].availableQuantity}
              />
            </div>

            {this.qwRoomListCardShowPriceAndTaxes && <div class="qw-room-list-card__prices-with-taxes">
              <div class="qw-room-list-card__prices-with-taxes--amount">
                {this.qwRoomListCardPrice}
                <div class="qw-room-list-card__room-taxes">{this.qwRoomListCardTaxes}</div>
              </div>
            </div>}
          </div>}

          {this.qwRoomListCardShowCta && <div class="qw-room-list-card__cta">
            <QwButton QwButtonLabel="View room" QwButtonOnClick={() => this.qwRoomListCardOnClickView()}/>
            {this.qwRoomListCardPrice
              ? <QwButton QwButtonLabel="View all rates" QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
              : <QwButton QwButtonLabel="Change dates" QwButtonOnClick={() => this.qwRoomListCardOnClickChangeDate()}/>
            }
          </div>}
        </qw-card>
      </Host>
    );
  }
}
