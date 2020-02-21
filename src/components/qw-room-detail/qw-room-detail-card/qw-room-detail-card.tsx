import {Component, Host, h, Prop, Listen, EventEmitter, Event, State, Watch} from '@stencil/core';
import {Language, Rate, RoomModel} from '@qwentes/booking-state-manager';
import {QwRoomRateAddedToBasketEmitter, QwRoomRateCounterChangedEmitter} from '../../qw-room-rate/qw-room-rate';
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
  @Prop() qwRoomDetailCardRates: Rate[] = [];
  @Prop() qwRoomDetailCardSquareMeter: string;
  @Prop() qwRoomDetailCardGuests: string;
  @Prop() qwRoomDetailCardBed: string;
  @Prop() qwRoomDetailCardNumberOfNights: number;
  @Prop() qwRoomDetailCardIsLoading: boolean;
  @Prop() qwRoomDetailCardNumberOfGuests: number;
  @Prop() qwRoomDetailCardNumberOfAccommodation: number;
  @State() qwRoomDetailCardActiveRate: Rate['rateId'];
  @Event() qwRoomDetailCardAddedToBasket: EventEmitter<QwRoomRateAddedToBasketEmitter>;
  @Event() qwRoomDetailCardAddAnotherRoom: EventEmitter<void>;
  @Event() qwRoomDetailCardProceed: EventEmitter<void>;

  @Listen('qwRoomRateAddedToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddedToBasketEmitter>) {
    this.qwRoomDetailCardAddedToBasket.emit(e.detail);
  }

  @Listen('qwRoomRateCounterChanged')
  public rateChanged(e: CustomEvent<QwRoomRateCounterChangedEmitter>) {
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
              {Language.getTranslation('pricesFor')} {this.qwRoomDetailCardNumberOfNights} {Language.getTranslation('nights')}
            </div>}
            {this.qwRoomDetailCardRates.length &&
            <div>
              {this.qwRoomDetailCardRates.map(rate => {
                return rate && <qw-room-rate
                  qwRoomRateRoomId={this.qwRoomDetailCardRoomId}
                  qwRoomRateRate={rate}
                  qwRoomRateIsDisabled={this.isRateDisabled(rate.rateId)}
                  qwRoomRateIsLoading={this.qwRoomDetailCardIsLoading}
                  qwRoomRateShowConditions={this.qwRoomDetailCardRates.length === 1}/>;
              })}
              <div class="qw-room-detail-card__alert">{this.qwRoomDetailCardNumberOfAccommodation
                ? this.showAlertForAccommodation()
                  ? <div class="qw-room-detail-card__alert-message">
                    <QwButton
                      QwButtonLabel={Language.getTranslation('addAnotherRoom')}
                      QwButtonOnClick={() => this.qwRoomDetailCardAddAnotherRoom.emit()}/>
                    <div>{Language.getTranslation('noSufficientRooms')}</div>
                  </div>
                  : <QwButton
                      QwButtonClass="qw-room-detail-card__alert-proceed"
                      QwButtonLabel={Language.getTranslation('proceedToCheckout')}
                      QwButtonOnClick={() => this.qwRoomDetailCardProceed.emit()}/>
                : ''
              }</div>
            </div>}
          </div>
        </qw-card>
      </Host>
    );
  }
}
