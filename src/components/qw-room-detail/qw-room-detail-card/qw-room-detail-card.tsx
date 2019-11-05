import {Component, Host, h, Prop, Listen, EventEmitter, Event} from '@stencil/core';
import {Rate} from 'booking-state-manager';
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
  @Prop() qwRoomDetailCardRates: Rate[];
  @Prop() qwRoomDetailCardSquareMeter: string;
  @Prop() qwRoomDetailCardGuests: string;
  @Prop() qwRoomDetailCardBed: string;
  @Event() qwRoomDetailCardAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;

  @Listen('qwRoomRateAddToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    this.qwRoomDetailCardAddToBasket.emit(e.detail);
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
          </div>

          <div class="qw-room-detail-card__rates">
            {this.qwRoomDetailCardRates.length
              ? this.qwRoomDetailCardRates.map(rate => <qw-room-rate qwRoomRateRate={rate}/>)
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
