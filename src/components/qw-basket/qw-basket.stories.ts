export default {
  title: 'Basket/Basket',
};

export const base = () => `
  <qw-basket></qw-basket>
  <hr>
  <h4>Use this room component to play and mutate the basket behaviour</h4>
  <qw-room-detail qw-room-detail-id="98868"></qw-room-detail>
`;

export const withPriceAlways = () => `
  <qw-basket qw-basket-show-price-if-empty="true"></qw-basket>
`;

export const withEmptyButton = () => `
  <qw-basket
    qw-basket-show-price-if-empty="true"
    qw-basket-show-empty-button="true">
  </qw-basket>
`;

export const withCheckoutButton = () => `
  <qw-basket
    qw-basket-show-price-if-empty="true"
    qw-basket-show-book-now-button="true">
  </qw-basket>
`;

export const withTaxes = () => `
  <qw-basket
    qw-basket-show-price-if-empty="true"
    qw-basket-show-taxes="true"
    qw-basket-show-on-site-taxes="true">
  </qw-basket>
`;
