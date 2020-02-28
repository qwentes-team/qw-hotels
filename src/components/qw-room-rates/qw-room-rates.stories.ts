export default {
  title: 'Room/Room rates'
}

export const base = () => `
  <qw-room-rates
    qw-room-rates-room-id="103252"
    qw-room-rates-force-rooms-call="true">
  </qw-room-rates>
  <hr>
  <h4>Use basket component to play and mutate the room rates behaviour</h4>
  <qw-basket
    qw-basket-show-price-if-empty="true"
    qw-basket-show-empty-button="true">
  </qw-basket>
`;

export const card = () => `
  <qw-room-rates
    qw-room-rates-room-id="103252"
    qw-room-rates-type="card"
    qw-room-rates-force-rooms-call="true">
  </qw-room-rates>
  <hr>
  <h4>Use basket component to play and mutate the room rates behaviour</h4>
  <qw-basket
    qw-basket-show-price-if-empty="true"
    qw-basket-show-empty-button="true">
  </qw-basket>
`;
