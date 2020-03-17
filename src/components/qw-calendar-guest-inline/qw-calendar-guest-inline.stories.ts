import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Calendar & Guest/Calendar Guest inline'
}

export const base = () => `
  <qw-calendar-guest-inline></qw-calendar-guest-inline>
`;

export const noCheckButton = () => `
  <qw-calendar-guest-inline qw-calendar-guest-inline-show-check-button="false"></qw-calendar-guest-inline>
`;

export const noInputs = () => `
  <qw-calendar-guest-inline qw-calendar-guest-inline-show-inputs="false"></qw-calendar-guest-inline>
`;

window.addEventListener('qwCalendarGuestInlineCheckAvailability', logEvent);
window.addEventListener('qwCalendarGuestInlineClickInput', logEvent);
