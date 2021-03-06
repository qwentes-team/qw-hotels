import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Calendar & Guest/Calendar shorthand'
}

export const base = () => `
  <qw-calendar-shorthand></qw-calendar-shorthand>
  <hr>
  <h4>Use calendar guest inline component to see dates changing</h4>
  <qw-calendar-guest-inline qw-calendar-guest-inline-show-check-button="false"></qw-calendar-guest-inline>
`;

window.addEventListener('qwCalendarShorthandTodaySuccess', logEvent);
window.addEventListener('qwCalendarShorthandTomorrowSuccess', logEvent);
window.addEventListener('qwCalendarShorthandOtherDates', logEvent);
window.addEventListener('qwBasketWillBeReset', logEvent);
