import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Offer/Offers List',
}

export const base = () => `<qw-offer-list qw-offer-list-type="card"></qw-offer-list>>`;


window.addEventListener('qwOffersListOnLoad', logEvent);
