import {Component, Host, h, Prop, Listen, EventEmitter, Event, State, Watch} from '@stencil/core';
import {Rate, RoomModel} from '@qwentes/booking-state-manager';
import {QwRoomRateAddToBasketEmitter} from '../../qw-room-rate/qw-room-rate';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';

@Component({
  tag: 'qw-room-detail-card',
  styleUrl: 'qw-room-detail-card.css',
  shadow: false,
})
export class QwRoomDetailCard {
  @Prop() qwRoomDetailCardRoomId: RoomModel['roomId'];
  @Prop() qwRoomDetailCardTitle: string;
  @Prop() qwRoomDetailCardImage: string;
  @Prop() qwRoomDetailCardRates: Rate[];
  @Prop() qwRoomDetailCardSquareMeter: string;
  @Prop() qwRoomDetailCardGuests: string;
  @Prop() qwRoomDetailCardBed: string;
  @Prop() qwRoomDetailCardNumberOfNights: number;
  @Prop() qwRoomDetailCardIsLoading: boolean;
  @Prop() qwRoomDetailCardNumberOfGuests: number;
  @Prop() qwRoomDetailCardNumberOfAccommodation: number;
  @Prop() qwRoomDetailCardAlertMessage: string;
  @Prop() qwRoomDetailAddAnotherRoomButtonMessage: string;
  @Prop() qwRoomDetailProceedToCheckoutButtonMessage: string;
  @State() qwRoomDetailCardActiveRate: Rate['rateId'];
  @Event() qwRoomDetailCardAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;
  @Event() qwRoomDetailCardAddAnotherRoom: EventEmitter<void>;
  @Event() qwRoomDetailCardProceed: EventEmitter<void>;

  @Listen('qwRoomRateAddToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    this.qwRoomDetailCardAddToBasket.emit(e.detail);
  }

  @Listen('qwRoomRateCounterChanged')
  public rateChanged(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    this.qwRoomDetailCardActiveRate = e.detail.quantity && e.detail.rateId;
  }

  private isRateDisabled(rateId) {
    if (!this.qwRoomDetailCardActiveRate) {
      return false;
    }

    return this.qwRoomDetailCardActiveRate !== rateId;
  }

  private showAlertForAccommodation() {
    return this.qwRoomDetailCardNumberOfGuests > this.qwRoomDetailCardNumberOfAccommodation;
  }

  @Watch('qwRoomDetailCardRates')
  ratesWatcher() {
    this.qwRoomDetailCardActiveRate = undefined;
  }

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-detail-card__image">
            <QwImage imageUrl={this.qwRoomDetailCardImage} alt={this.qwRoomDetailCardTitle}/>
          </div>

          <div class="qw-room-detail-card__title">
            <h4>{this.qwRoomDetailCardTitle}</h4>
            <qw-room-base-info qw-room-base-info-room-id={this.qwRoomDetailCardRoomId.toString()}/>
          </div>

          <div class="qw-room-detail-card__rates">
            {this.qwRoomDetailCardRates.length && <div class="qw-room-detail-card__nights">
              Prices for {this.qwRoomDetailCardNumberOfNights} {this.qwRoomDetailCardNumberOfNights > 1 ? 'nights' : 'night'}
            </div>}
            {this.qwRoomDetailCardRates.length &&
            <div>
              {this.qwRoomDetailCardRates.map(rate => {
                return rate && <qw-room-rate
                  qwRoomRateRate={rate}
                  qwRoomRateIsDisabled={this.isRateDisabled(rate.rateId)}
                  qwRoomRateIsLoading={this.qwRoomDetailCardIsLoading}
                  qwRoomRateShowConditions={this.qwRoomDetailCardRates.length === 1}/>;
              })}
              <div class="qw-room-detail-card__alert">{this.qwRoomDetailCardNumberOfAccommodation
                ? this.showAlertForAccommodation()
                  ? <div class="qw-room-detail-card__alert-message">
                    <QwButton
                      QwButtonLabel={this.qwRoomDetailAddAnotherRoomButtonMessage || 'Add another room'}
                      QwButtonOnClick={() => this.qwRoomDetailCardAddAnotherRoom.emit()}/>
                    <div>{this.qwRoomDetailCardAlertMessage || 'No sufficent rooms for your guests'}</div>
                  </div>
                  : <QwButton
                      QwButtonLabel={this.qwRoomDetailProceedToCheckoutButtonMessage || 'Proceed to checkout'}
                      QwButtonOnClick={() => this.qwRoomDetailCardProceed.emit()}/>
                : ''
              }</div>
            </div>}
          </div>

          <div class="qw-room-detail-card__services">
            {/* todo */}
          </div>
        </qw-card>
      </Host>
    );
  }
}
