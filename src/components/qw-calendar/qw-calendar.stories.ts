import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Calendar & Guest/Calendar'
}

export const base = () => `
  <qw-calendar></qw-calendar>
`;

export const notResponsive = () => `
  <qw-calendar qw-calendar-responsive="false"></qw-calendar>
`;

export const notResponsiveMoreMonths = () => `
  <qw-calendar qw-calendar-responsive="false" qw-calendar-number-of-months="3"></qw-calendar>
`;

export const notSync = () => `
  <qw-calendar qw-calendar-responsive="false" qw-calendar-sync-on-change="false"></qw-calendar>
`;

export const customConfiguration = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  const currentDateString = currentDate.toISOString().split('T')[0];
  return `
    <qw-calendar qw-calendar-config='{"minDate": "${currentDateString}"}'></qw-calendar>
  `
};

window.addEventListener('qwCalendarChange', logEvent);
window.addEventListener('qwCalendarChangeSuccess', logEvent);
window.addEventListener('qwBasketWillBeReset', logEvent);
