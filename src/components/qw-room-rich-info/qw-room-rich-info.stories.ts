import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Room/Room rich info'
}

export const base = () => `
  <qw-room-rich-info
    qw-room-rich-info-room-id="103252"
    qw-room-rich-info-force-rooms-call="true">
  </qw-room-rich-info>
`;

export const list = () => `
  <qw-room-rich-info
    qw-room-rich-info-room-id="103252"
    qw-room-rich-info-base-info-type="list"
    qw-room-rich-info-force-rooms-call="true">
  </qw-room-rich-info>
`;

window.addEventListener('qwRoomRichInfoOnLoad', logEvent);
