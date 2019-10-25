import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../qw-image/qw-image';
import {QwButton} from '../qw-button/qw-button';
import {Rate} from 'booking-state-manager';

@Component({
  tag: 'qw-room-card',
  styleUrl: 'qw-room-card.css',
  shadow: false
})
export class QwRoomCard {
  @Prop() qwRoomCardTitle: string;
  @Prop() qwRoomCardPrice: string;
  @Prop() qwRoomCardAvailability: number;
  @Prop() qwRoomCardGuests: string;
  @Prop() qwRoomCardBeds: string;
  @Prop() qwRoomCardImage: string;
  @Prop() qwRoomCardRates: Rate[];
  @Prop() qwRoomCardIsLoading: boolean;
  @Prop() qwRoomCardOnClickBook: () => void;

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-card__header">
            <h4 class="qw-room-card__title">{this.qwRoomCardTitle}</h4>
            <h6 class="qw-room-card__caption">
              <div>{this.qwRoomCardPrice}</div>
              <div>{`${this.qwRoomCardAvailability} availability`}</div>
            </h6>
          </div>
          <QwImage imageUrl={this.qwRoomCardImage} alt={this.qwRoomCardTitle}/>
          <div class="qw-room-card__footer">
            <div class="qw-room-card__footer-top">
              <p>{this.qwRoomCardGuests}</p>
              <p>{this.qwRoomCardBeds}</p>
            </div>
            {/*<div class="qw-room-card__footer-bottom">*/}
            {/*  {this.qwRoomCardRates && this.qwRoomCardRates.map(rate => {*/}
            {/*    return <div>RoomId: {rate.rateId} - Price: {rate.price.totalPrice.original.text}</div>*/}
            {/*  })}*/}
            {/*</div>*/}
          </div>
          <div class="qw-room-card__cta">
            <QwButton
              QwButtonLabel="Book now"
              QwButtonDisabled={this.qwRoomCardIsLoading}
              QwButtonOnClick={() => this.qwRoomCardOnClickBook()}/>
          </div>
        </qw-card>
      </Host>
    );
  }
}
