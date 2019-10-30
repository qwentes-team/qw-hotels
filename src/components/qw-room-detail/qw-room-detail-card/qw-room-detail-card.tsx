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
  @Prop() qwRoomDetailCardAvailability: string;
  @Prop() qwRoomDetailCardRates: Rate[];
  @Event() qwRoomDetailCardAddToBasket: EventEmitter<QwRoomRateAddToBasketEmitter>;

  @Listen('qwRoomRateAddToBasket')
  public addToBasket(e: CustomEvent<QwRoomRateAddToBasketEmitter>) {
    this.qwRoomDetailCardAddToBasket.emit(e.detail);
  }

  render() {
    return (
      <Host>
        <div class="qw-room-detail-card__image">
          <QwImage imageUrl={this.qwRoomDetailCardImage} alt={this.qwRoomDetailCardTitle}/>
        </div>

        <div class="qw-room-detail-card__title">
          <h4>{this.qwRoomDetailCardTitle}</h4>
          <p>{this.qwRoomDetailCardAvailability}</p>
        </div>

        <div class="qw-room-detail-card__rates">
          {this.qwRoomDetailCardRates.map(rate => {
            return <qw-room-rate qwRoomRateRate={rate}/>;
          })}
        </div>

        <div class="qw-room-detail-card__services">
          - TODO
        </div>
      </Host>
    );
  }
}
