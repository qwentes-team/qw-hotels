import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Basket/Basket room counter',
};

export const base = () => `
  <qw-basket-room-counter></qw-basket-room-counter>
`;

window.addEventListener('qwBasketRoomCounterNumber', logEvent);
