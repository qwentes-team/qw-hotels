import {Component, Host, h, Prop, Listen} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
import {
  BasketHelper,
  BasketModel,
  MoneyPrice,
  Language,
  Rate,
  RoomBasketModel,
  RoomDefaultLabel,
  RoomModel,
  SessionDisplay,
} from '@qwentes/booking-state-manager';
import {QwChangeRoomEvent, QwCounterId, QwWeekCalendarDirection} from '../../../index';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';
import {QwRoomRateAddedToBasketEmitter} from '../../qw-room-rate/qw-room-rate';

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
  @Prop() qwRoomListCardBasketRoomOccupancyId: number;
  @Prop() qwRoomListCardBasketIsEmpty: boolean;
  @Prop() qwRoomListCardAddableLeftover: number = 0;
  @Prop() qwRoomListCardNumberOfGuests: number;
  @Prop() qwRoomListCardNumberOfAccommodation: number;
  @Prop() qwRoomListCardLanguage: SessionDisplay['culture'];
  @Prop() qwRoomListCardOnClickBook: () => void;
  @Prop() qwRoomListCardOnClickView: () => void;
  @Prop() qwRoomListCardOnClickChangeDate: () => void;
  @Prop() qwRoomListCardOnProceedToCheckout: () => void;
  @Prop() qwRoomListCardOnChangeRoom: (e: QwChangeRoomEvent) => void;
  @Prop() qwRoomListCardOnChangeWeekDates: (e: QwWeekCalendarDirection) => void;
  @Prop() qwRoomListCardOnAddedToBasket: (e: BasketModel) => void;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    if (event.detail.id === QwCounterId.QwRoomRateCounter) {
      return;
    }

    this.qwRoomListCardOnChangeRoom({
      quantity: event.detail.value.toString(),
      room: this.qwRoomListCardBasketRoom,
    });
  }

  @Listen('qwWeekCalendarChangeDates')
  public weekDatesChanged(event: CustomEvent<QwWeekCalendarDirection>) {
    this.qwRoomListCardOnChangeWeekDates(event.detail);
  }

  @Listen('qwRoomRateAddedToBasket')
  public qwRoomRateAddedToBasket(event: CustomEvent<QwRoomRateAddedToBasketEmitter>) {
    this.qwRoomListCardOnAddedToBasket(event.detail.basket);
  }

  public getActionsCounterValues() {
    const occupancyId = BasketHelper.getFirstOccupancyIdInBasketRoom(this.qwRoomListCardBasketRoom);
    return {
      selectedQuantity: this.qwRoomListCardBasketRoom.occupancies[occupancyId].selectedQuantity,
      availableQuantity: this.qwRoomListCardBasketRoom.occupancies[occupancyId].availableQuantity,
    }
  }

  public getRateForBasketNotEmpty() {
    const rate = this.qwRoomListCardRates.find(r => {
      return r.occupancy.occupancyId === this.qwRoomListCardBasketRoomOccupancyId || r.occupancy.occupancyId === 0;
    });

    return rate ? <qw-room-rate
      qwRoomRateRoomId={this.qwRoomListCardId}
      qwRoomRateRate={rate}
      qwRoomRateIsLoading={this.qwRoomListCardIsLoading}/> : '';
  }

  private getMaxValue(availableQuantity: number, selectedQuantity: number) {
    const leftover = this.qwRoomListCardAddableLeftover + selectedQuantity;
    return Math.min(availableQuantity, leftover);
  }

  private showProceedButton() {
    return this.qwRoomListCardNumberOfGuests <= this.qwRoomListCardNumberOfAccommodation;
  }

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-list-card__image" onClick={() => this.qwRoomListCardOnClickView()}>
            <QwImage imageUrl={this.qwRoomListCardImage} alt={this.qwRoomListCardTitle}/>
          </div>

          <div class={`qw-room-list-card__title ${!this.qwRoomListCardPrice ? 'qw-room-list-card--has-error' : ''}`}>
            <div class="qw-room-list-card__title-content" onClick={() => this.qwRoomListCardOnClickView()}>
              <h4>{this.qwRoomListCardTitle}</h4>
              <h6 class="qw-room-list-card__caption">
                {this.qwRoomListCardGuests}{this.qwRoomListCardSquareMeter && ` / ${this.qwRoomListCardSquareMeter}`}
              </h6>
            </div>
            {this.qwRoomListCardShowPrice && (!this.qwRoomListCardPrice
              ? <qw-error>{Language.getTranslation('roomListCardErrorMessage')}</qw-error>
              : <qw-price
                  onClick={() => this.qwRoomListCardOnClickBook()}
                  qwPriceCrossedPrice={this.qwRoomListCardCrossedOutPrice || RoomDefaultLabel.NoPrice}
                  qwPriceMainPrice={this.qwRoomListCardPrice || RoomDefaultLabel.NoPrice}
                  qwPriceCaption={`
                    ${Language.getTranslation('totalFor')} ${this.qwRoomListCardNights} ${Language.getTranslation('nights')}
                  `}/>)
            }
          </div>

          {this.qwRoomListCardShowDescription && <div class="qw-room-list-card__descriptions">
            <p>{this.qwRoomListCardDescription}</p>
          </div>}

          {this.qwRoomListCardShowPrices && <div class="qw-room-list-card__prices">
            {this.qwRoomListCardBasketIsEmpty && <div class="qw-room-list-card__prices-container">
              <div class="qw-room-list-card__prices-average">
                {Language.getTranslation('bestPrices')} - {Language.getTranslation('averagePerNight')}:
                {this.qwRoomListCardAveragePrice || RoomDefaultLabel.NoPrice}
              </div>
              <qw-week-calendar
                qwWeekCalendarRangeDate={this.qwRoomListCardRangeDate}
                qwWeekCalendarRangeDateSession={this.qwRoomListCardRangeDateSession}
                qwWeekCalendarPricesByRoom={this.qwRoomListCardPrices}
                qwWeekCalendarIsLoading={this.qwRoomListCardIsLoadingPrice}
                qwWeekCalendarLanguage={this.qwRoomListCardLanguage}
                qwWeekCalendarSelectedRoomId={this.qwRoomListCardId}/>
            </div>}

            {!this.qwRoomListCardBasketIsEmpty && this.qwRoomListCardRates.length ? this.getRateForBasketNotEmpty() : ''}
          </div>}

          {this.qwRoomListCardBasketRoom && this.qwRoomListCardShowActions && <div class="qw-room-list-card__basket-actions">
            <div class="qw-room-list-card__basket-actions-counter">
              <div class="qw-room-list-card__basket-actions-counter-label">
                {Language.getTranslation('roomQuantity')}
              </div>
              <qw-counter
                qwCounterId={QwCounterId.QwRoomListCardCounter}
                qwCounterValue={this.getActionsCounterValues().selectedQuantity}
                qwCounterName={this.qwRoomListCardId}
                qwCounterMaxValue={this.getMaxValue(this.getActionsCounterValues().availableQuantity, this.getActionsCounterValues().selectedQuantity)}/>
            </div>

            {this.qwRoomListCardShowPriceAndTaxes && <div class="qw-room-list-card__prices-with-taxes">
              <div class="qw-room-list-card__prices-with-taxes--amount">
                {this.qwRoomListCardPrice}
                <div class="qw-room-list-card__room-taxes">{this.qwRoomListCardTaxes}</div>
              </div>
            </div>}
          </div>}

          {this.qwRoomListCardShowCta && <div class="qw-room-list-card__cta">
            {this.showProceedButton()
              ? <QwButton
                  QwButtonLabel={Language.getTranslation('proceedToCheckout')}
                  QwButtonOnClick={() => this.qwRoomListCardOnProceedToCheckout()}/>
              : <QwButton
                  QwButtonLabel={Language.getTranslation('viewRoom')}
                  QwButtonOnClick={() => this.qwRoomListCardOnClickView()}/>
            }
            {this.qwRoomListCardPrice
              ? <QwButton
                  QwButtonLabel={Language.getTranslation('viewAllRates')}
                  QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
              : <QwButton
                  QwButtonLabel={Language.getTranslation('changeDates')}
                  QwButtonOnClick={() => this.qwRoomListCardOnClickChangeDate()}/>
            }
          </div>}
        </qw-card>
      </Host>
    );
  }
}
