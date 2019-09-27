import {Component, h, Host} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwImage} from '../shared/qw-image/qw-image';

@Component({
  tag: 'qw-room-list',
  styleUrl: 'qw-room-list.css',
  shadow: false
})
export class QwRoomList {

  render() {
    return (
      <Host>
        <h1>Sono la lista</h1>
        <QwButton buttonLabel="Press meeee" />
        <qw-card card-title="Sono la card della lista">
          <p>Sono il contenuto della card della lista</p>
        </qw-card>
        <QwImage imageUrl="https://via.placeholder.com/400"/>
      </Host>
    );
  }

}
