import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';
import {QwImage} from '../shared/qw-image/qw-image';

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

  @Event() qwRoomCardClickHeader: EventEmitter;

  private handleClick() {
    this.qwRoomCardClickHeader.emit('EMETTO QW ROOM CARD');
  }

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-card__header" onClick={() => this.handleClick()}>
            <h3 class="qw-room-card__title">{this.QwRoomCardTitle}</h3>
            <h6 class="qw-room-card__caption">{this.QwRoomCardCaption}</h6>
          </div>
          <QwImage/>
          <div class="qw-room-card__footer">
            <p>{this.QwRoomCardGuests}</p>
            <p>{this.QwRoomCardBeds}</p>
          </div>
        </qw-card>
      </Host>
    );
  }
}
