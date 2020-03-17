import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Calendar & Guest/Guest'
}

export const base = () => `
  <qw-guest></qw-guest>
  <hr>
  <h4>Use calendar guest inline component to see guest changing</h4>
  <qw-calendar-guest-inline qw-calendar-guest-inline-show-check-button="false"></qw-calendar-guest-inline>
`;

export const notSync = () => `
  <qw-guest qw-guest-sync-on-change="false"></qw-guest>
`;

export const center = () => `
  <qw-guest qw-guest-center="true"></qw-guest>
`;

window.addEventListener('qwGuestChange', logEvent);
