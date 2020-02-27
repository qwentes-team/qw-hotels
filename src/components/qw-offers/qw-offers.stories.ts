import {action} from '@storybook/addon-actions';

export default {
  title: 'Offer/Offers',
}

export const base = () => `<qw-offers></qw-offers>`;

export const maximumNumber = () => `<qw-offers qw-offers-max="5"></qw-offers>`;

export const card = () => `<qw-offers qw-offers-type="card"></qw-offers>`;

window.addEventListener('qwOffersOfferClick', action('logMyEvent'));
