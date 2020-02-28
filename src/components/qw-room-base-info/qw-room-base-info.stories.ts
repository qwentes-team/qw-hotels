export default {
  title: 'Room/Room base info',
};

export const base = () => `
  <qw-room-base-info
    qw-room-base-info-room-id="103252"
    qw-room-base-info-force-rooms-call="true">
  </qw-room-base-info>`;

export const list = () => `
  <qw-room-base-info
    qw-room-base-info-type="list"
    qw-room-base-info-room-id="103252"
    qw-room-base-info-force-rooms-call="true">
  </qw-room-base-info>`;

export const withPeopleText = () => `
  <qw-room-base-info
    qw-room-base-info-type="list"
    qw-room-base-info-guest-type="text"
    qw-room-base-info-room-id="103252"
    qw-room-base-info-force-rooms-call="true">
  </qw-room-base-info>`;
