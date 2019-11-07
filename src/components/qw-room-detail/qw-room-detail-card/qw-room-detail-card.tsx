import {Component, Host, h, Prop, Listen, EventEmitter, Event} from '@stencil/core';
import {Rate, RateHelper, RateModel} from 'booking-state-manager';
import {QwRoomRateAddToBasketEmitter} from '../../qw-room-rate/qw-room-rate';
import {QwImage} from '../../shared/qw-image/qw-image';

@Component({
  tag: 'qw-room-detail-card',
  styleUrl: 'qw-room-detail-card.css',
  shadow: false,
})
export class QwRoomDetailCard {
  @Prop() qwRoomDetailCardTitle: string;
  @Prop() qwRoomDetailCardImage: string;
  @Prop() qwRoomDetailCardRates: any; // Rate[] | RoomBasketOccupancy[]
  @Prop() qwRoomDetailCardSquareMeter: string;
  @Prop() qwRoomDetailCardGuests: string;
  @Prop() qwRoomDetailCardBed: string;
  @Prop() qwRoomDetailCardNumberOfNights: number;
  @Prop() qwRoomDetailCardIsLoading: boolean;
  @Prop() qwRoomDetailCardRatesModel: {[rateId: string]: RateModel} = {};
  @Event() qwRoomDetailCardAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;

  @Listen('qwRoomRateAddToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    this.qwRoomDetailCardAddToBasket.emit(e.detail);
  }

  public getRateName(rateId: Rate['rateId']) {
    const rateIdPart = RateHelper.getIdPartOfRateId(rateId);
    return this.qwRoomDetailCardRatesModel[rateIdPart] && this.qwRoomDetailCardRatesModel[rateIdPart].name;
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
            <div class="qw-room-detail-card__nights">Prices for {this.qwRoomDetailCardNumberOfNights} nights</div>
          </div>

          <div class="qw-room-detail-card__rates">
            {this.qwRoomDetailCardRates.length
              ? this.qwRoomDetailCardRates.map(rate => {
                return <qw-room-rate
                  qwRoomRateRate={rate}
                  qwRoomRateIsLoading={this.qwRoomDetailCardIsLoading}
                  qwRoomRateName={this.getRateName(rate.rateId)}/>
              })
              : 'No Rate Available'
            }
          </div>

          <div class="qw-room-detail-card__services">
            <ul>
              <li>Maximum occupancy: {this.qwRoomDetailCardGuests}</li>
              <li>{this.qwRoomDetailCardBed}</li>
              <li>Average size of {this.qwRoomDetailCardSquareMeter}</li>
            </ul>
          </div>
        </qw-card>
      </Host>
    );
  }
}
