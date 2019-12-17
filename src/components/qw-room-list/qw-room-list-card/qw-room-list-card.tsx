import {Component, Host, h, Prop, Listen} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
import {
  BasketHelper,
  BasketModel,
  MoneyPrice,
  Rate,
  RoomBasketModel,
  RoomDefaultLabel,
  RoomModel,
  SessionDisplay,
} from '@qwentes/booking-state-manager';
import {QwChangeRoomEvent, QwWeekCalendarDirection} from '../../../index';
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

  private getMessageError() {
    // todo differenziare i due errori
    return 'This room is not available fot the dates selected, or the rate is not available with the one in your basket.';
  }

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    // todo fare enum per counterIds
    if (event.detail.id === 'qwRoomRateCounter') {
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

  // todo usare sempre occupancy.definition - to refactor
  public getRateForBasketNotEmpty() {
    const rate = this.qwRoomListCardRates.find(r => {
      if (r.occupancy) {
        return r.occupancy.occupancyId === this.qwRoomListCardBasketRoomOccupancyId || r.occupancy.occupancyId === 0;
      }
      return true;
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
              ? <qw-error>{this.getMessageError()}</qw-error>
              : <qw-price
                  onClick={() => this.qwRoomListCardOnClickBook()}
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
                qwWeekCalendarIsLoading={this.qwRoomListCardIsLoadingPrice}
                qwWeekCalendarLanguage={this.qwRoomListCardLanguage}
                qwWeekCalendarSelectedRoomId={this.qwRoomListCardId}/>
            </div>}

            {!this.qwRoomListCardBasketIsEmpty && this.qwRoomListCardRates.length ? this.getRateForBasketNotEmpty() : ''}
          </div>}

          {this.qwRoomListCardBasketRoom && this.qwRoomListCardShowActions && <div class="qw-room-list-card__basket-actions">
            <div class="qw-room-list-card__basket-actions-counter">
              <div class="qw-room-list-card__basket-actions-counter-label">Room qty.</div>
              <qw-counter
                qwCounterId="qwRoomListCardCounter"
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
                  QwButtonLabel={this.qwRoomListCardLanguage === 'fr-FR' ? 'Passer à la caisse' : 'Proceed to checkout'}
                  QwButtonOnClick={() => this.qwRoomListCardOnProceedToCheckout()}/>
              : <QwButton
                  QwButtonLabel={this.qwRoomListCardLanguage === 'fr-FR' ? 'Voir chambre' : 'View room'}
                  QwButtonOnClick={() => this.qwRoomListCardOnClickView()}/>
            }
            {this.qwRoomListCardPrice
              ? <QwButton
                  QwButtonLabel={this.qwRoomListCardLanguage === 'fr-FR' ? 'Voir les tarifs' : 'View all rates'}
                  QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
              : <QwButton
                  QwButtonLabel={this.qwRoomListCardLanguage === 'fr-FR' ? 'Changer les dates' : 'Change dates'}
                  QwButtonOnClick={() => this.qwRoomListCardOnClickChangeDate()}/>
            }
          </div>}
        </qw-card>
      </Host>
    );
  }
}
