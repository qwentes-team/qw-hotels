export default {
  title: 'Extra/Extra'
}

export const base = () => `
  <qw-extra></qw-extra>
  <hr>
  <h4>Add a room in your basket to have extras</h4>
  <qw-basket qw-basket-show-price-if-empty="true" qw-basket-show-empty-button="true"></qw-basket>
  <qw-room-detail qw-room-detail-id="103252"></qw-room-detail>
`;
