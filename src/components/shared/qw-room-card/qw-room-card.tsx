import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../qw-image/qw-image';

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
        </qw-card>
      </Host>
    );
  }
}
