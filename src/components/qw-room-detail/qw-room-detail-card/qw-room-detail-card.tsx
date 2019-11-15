import {Component, Host, h, Prop, Listen, EventEmitter, Event, State, Watch} from '@stencil/core';
import {Rate, RateHelper, RateModel, RoomModel} from '@qwentes/booking-state-manager';
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
  @Prop() qwRoomDetailCardRatesModel: {[rateId: string]: RateModel} = {};
  @Prop() qwRoomDetailCardNumberOfGuests: number;
  @Prop() qwRoomDetailCardNumberOfAccommodation: number;
  @Prop() qwRoomDetailCardAlertMessage: string;
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

  public getRateName(rateId: Rate['rateId']) {
    const rateIdPart = RateHelper.getIdPartOfRateId(rateId);
    return this.qwRoomDetailCardRatesModel[rateIdPart] && this.qwRoomDetailCardRatesModel[rateIdPart].name;
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
    console.log(this.qwRoomDetailCardNumberOfAccommodation);
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
                  qwRoomRateName={this.getRateName(rate.rateId)}/>;
              })}
              <div>{this.qwRoomDetailCardNumberOfAccommodation
                ? this.showAlertForAccommodation()
                  ? <div class="qw-room-detail-card__alert-message">
                    <QwButton QwButtonLabel="Add another room" QwButtonOnClick={() => this.qwRoomDetailCardAddAnotherRoom.emit()}/>
                    <div>{this.qwRoomDetailCardAlertMessage || 'No sufficent rooms for your guests'}</div>
                  </div>
                  : <QwButton QwButtonLabel="Proceed to checkout" QwButtonOnClick={() => this.qwRoomDetailCardProceed.emit()}/>
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
