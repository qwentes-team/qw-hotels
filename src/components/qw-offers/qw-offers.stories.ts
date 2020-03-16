import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Offer/Offers',
}

export const base = () => `<qw-offers></qw-offers>`;

export const maximumNumber = () => `<qw-offers qw-offers-max="5"></qw-offers>`;

export const card = () => `<qw-offers qw-offers-type="card"></qw-offers>`;

export const imageResized = () => `
  <qw-offers
    qw-offers-type="card"
    qw-offers-image-transformation-options='{"width": 300, "height": 200}'>
  </qw-offers>
`;

window.addEventListener('qwOffersOfferClick', logEvent);
window.addEventListener('qwOffersOnLoad', logEvent);
