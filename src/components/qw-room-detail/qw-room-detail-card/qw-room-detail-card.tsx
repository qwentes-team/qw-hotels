import {Component, Host, h, Prop, Listen, EventEmitter, Event} from '@stencil/core';
import {Language, RateInformation, RoomModel} from '@qwentes/booking-state-manager';
import {QwRoomRateAddedToBasketEmitter} from '../../qw-room-rate/qw-room-rate';
import {QwButton} from '../../shared/qw-button/qw-button';
import {Transformation} from 'cloudinary-core';

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
  @Prop() qwRoomDetailCardNumberOfGuests: number;
  @Prop() qwRoomDetailCardNumberOfAccommodation: number;
  @Prop() qwRoomDetailCardRateHighlight: RateInformation['code'];
  @Prop() qwRoomDetailCardImageTransformationOptions: Transformation.Options = {};
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
            <qw-image
              qwImageTransformationOptions={this.qwRoomDetailCardImageTransformationOptions}
              qwImageUrl={this.qwRoomDetailCardImage}
              qwImageAlt={this.qwRoomDetailCardTitle}/>
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
              <qw-room-rates qwRoomRatesRoomId={this.qwRoomDetailCardRoomId} qwRoomRatesRateHighlight={this.qwRoomDetailCardRateHighlight}/>

              <div class="qw-room-detail-card__alert">{this.qwRoomDetailCardNumberOfAccommodation
                ? this.showAlertForAccommodation()
                  ? <div class="qw-room-detail-card__alert-message">
                    <QwButton
                      QwButtonLabel={Language.getTranslation('addAnotherRoom')}
                      QwButtonOnClick={() => this.qwRoomDetailCardAddAnotherRoom.emit()}/>
                    <div>aaa{Language.getTranslation('noSufficientRooms')}</div>
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
