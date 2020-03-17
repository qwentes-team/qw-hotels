import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Basket/Basket',
};

export const base = () => `
  <qw-basket></qw-basket>
  <hr>
  <h4>Use room list component to play and mutate the basket behaviour</h4>
  <qw-room-detail qw-room-detail-id="103252"></qw-room-detail>
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

window.addEventListener('qwBasketBookNow', logEvent);
window.addEventListener('qwBasketClickPrice', logEvent);
window.addEventListener('qwBasketIsAccommodationSatisfy', logEvent);
