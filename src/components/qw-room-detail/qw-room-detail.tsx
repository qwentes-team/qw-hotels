import {Component, h, Host} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwImage} from '../shared/qw-image/qw-image';

@Component({
  tag: 'qw-room-detail',
  styleUrl: 'qw-room-detail.css',
  shadow: false
})
export class QwRoomDetail {

  render() {
    return (
      <Host>
        <h1>Sono il dettaglio</h1>
        <QwButton buttonLabel="Press me again" />
        <qw-card card-title="Sono la card del dettaglio">
          <p>Sono il contenuto della card del dettaglio</p>
        </qw-card>
        <QwImage imageUrl="https://via.placeholder.com/200"/>
      </Host>
    );
  }

}
