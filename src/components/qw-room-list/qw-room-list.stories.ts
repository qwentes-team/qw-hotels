export default {
  title: 'Room/Room list',
};

export const base = () => `
  <qw-room-list></qw-room-list>
`;

export const grid = () => `
  <qw-room-list qw-room-list-type="grid"></qw-room-list>
`;

export const gridMinimal = () => `
  <qw-room-list
    qw-room-list-type="grid"
    qw-room-list-show-prices="false"
    qw-room-list-show-cta="false"></qw-room-list>
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

export const orderedByDecreasingPrice = () => `
  <qw-room-list qw-room-list-order="desc"></qw-room-list>
`;

export const filteredList = () => `
  <qw-room-list qw-room-list-filter-rooms-with="[103252, 103251]"></qw-room-list>
`;
