export default {
  title: 'Room/Room list',
};

export const base = () => `
  <qw-room-list></qw-room-list>
`;

export const grid = () => `
  <qw-room-list qw-room-list-type="grid"></qw-room-list>
`;

export const card = () => `
  <qw-room-list
    qw-room-list-show-rates="true"
    qw-room-list-type="card"></qw-room-list>
`;

export const cardWithoutPrice = () => `
  <qw-room-list
    qw-room-list-show-rates="true"
    qw-room-list-show-prices="false"
    qw-room-list-type="card"></qw-room-list>
`;

export const withoutCta = () => `
  <qw-room-list qw-room-list-show-cta="false"></qw-room-list>
`;
