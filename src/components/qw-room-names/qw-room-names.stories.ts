import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Room/Room names'
}

export const base = () => `<qw-room-names></qw-room-names>`;

window.addEventListener('qwRoomNamesClick', logEvent);
