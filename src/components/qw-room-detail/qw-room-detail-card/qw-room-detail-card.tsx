import {Component, Host, h, Prop, Listen, EventEmitter, Event} from '@stencil/core';
import {Language, RoomModel} from '@qwentes/booking-state-manager';
import {QwRoomRateAddedToBasketEmitter} from '../../qw-room-rate/qw-room-rate';
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
  @Prop() qwRoomDetailCardNumberOfNights: number;
  @Prop() qwRoomDetailCardIsLoading: boolean;
  @Prop() qwRoomDetailCardNumberOfGuests: number;
  @Prop() qwRoomDetailCardNumberOfAccommodation: number;
  @Event() qwRoomDetailCardAddedToBasket: EventEmitter<QwRoomRateAddedToBasketEmitter>;
  @Event() qwRoomDetailCardAddAnotherRoom: EventEmitter<void>;
  @Event() qwRoomDetailCardProceed: EventEmitter<void>;

  @Listen('qwRoomRateAddedToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddedToBasketEmitter>) {
    this.qwRoomDetailCardAddedToBasket.emit(e.detail);
  }

  private showAlertForAccommodation() {
    return this.qwRoomDetailCardNumberOfGuests > this.qwRoomDetailCardNumberOfAccommodation;
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
            <div>
              <div class="qw-room-detail-card__nights">
                {Language.getTranslation('pricesFor')} {this.qwRoomDetailCardNumberOfNights} {Language.getTranslation('nights')}
              </div>
              <qw-room-rates qwRoomRatesRoomId={this.qwRoomDetailCardRoomId} qwRoomRatesIsLoading={this.qwRoomDetailCardIsLoading}/>

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
            </div>
          </div>
        </qw-card>
      </Host>
    );
  }
}
