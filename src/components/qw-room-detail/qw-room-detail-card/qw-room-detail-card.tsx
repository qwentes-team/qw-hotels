import {Component, Host, h, Prop, Listen, EventEmitter, Event, State, Watch} from '@stencil/core';
import {Rate, RateHelper, RateModel, RoomModel} from 'booking-state-manager';
import {QwRoomRateAddToBasketEmitter} from '../../qw-room-rate/qw-room-rate';
import {QwImage} from '../../shared/qw-image/qw-image';

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
  @State() qwRoomDetailCardActiveRate: Rate['rateId'];
  @Event() qwRoomDetailCardAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;

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
            <div class="qw-room-detail-card__nights">
              Prices for {this.qwRoomDetailCardNumberOfNights} {this.qwRoomDetailCardNumberOfNights > 1 ? 'nights' : 'night'}
            </div>
          </div>

          <div class="qw-room-detail-card__rates">
            {this.qwRoomDetailCardRates.length
              && this.qwRoomDetailCardRates.map(rate => {
                return rate && <qw-room-rate
                  qwRoomRateRate={rate}
                  qwRoomRateIsDisabled={this.isRateDisabled(rate.rateId)}
                  qwRoomRateIsLoading={this.qwRoomDetailCardIsLoading}
                  qwRoomRateName={this.getRateName(rate.rateId)}/>;
              })
            }
          </div>

          <div class="qw-room-detail-card__services">
            <qw-room-base-info qw-room-base-info-room-id={this.qwRoomDetailCardRoomId.toString()}/>
          </div>
        </qw-card>
      </Host>
    );
  }
}
