import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../qw-image/qw-image';
import {QwButton} from '../qw-button/qw-button';

@Component({
  tag: 'qw-room-card',
  styleUrl: 'qw-room-card.css',
  shadow: false
})
export class QwRoomCard {
  @Prop() QwRoomCardTitle: string;
  @Prop() QwRoomCardCaption: string;
  @Prop() QwRoomCardGuests: string;
  @Prop() QwRoomCardBeds: string;
  @Prop() QwRoomCardImage: string;
  @Prop() QwRoomCardIsLoading: boolean;
  @Prop() QwRoomCardOnClickBook: () => void;

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-card__header">
            <h3 class="qw-room-card__title">{this.QwRoomCardTitle}</h3>
            <h6 class="qw-room-card__caption">{this.QwRoomCardCaption}</h6>
          </div>
          <QwImage imageUrl={this.QwRoomCardImage} alt={this.QwRoomCardTitle}/>
          <div class="qw-room-card__footer">
            <p>{this.QwRoomCardGuests}</p>
            <p>{this.QwRoomCardBeds}</p>
          </div>
          <div class="qw-room-card__cta">
            <QwButton
              QwButtonLabel="Book now"
              QwButtonIsLoading={this.QwRoomCardIsLoading}
              QwButtonOnClick={() => this.QwRoomCardOnClickBook()}/>
          </div>
        </qw-card>
      </Host>
    );
  }
}
