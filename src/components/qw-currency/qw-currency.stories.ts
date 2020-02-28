export default {
  title: 'Currency',
}

export const base = () => `
  <qw-currency></qw-currency>
  <hr>
  <h4>Show the currency component changing the prices</h4>
  <qw-room-rates
    qw-room-rates-room-id="103252"
    qw-room-rates-force-rooms-call="true">
  </qw-room-rates>
`;
