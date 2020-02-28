export default {
  title: 'Calendar & Guest/Calendar Guest inline'
}

export const base = () => `
  <qw-calendar-guest-inline></qw-calendar-guest-inline>
`;

export const noCheckButton = () => `
  <qw-calendar-guest-inline qw-calendar-guest-inline-show-check-button="false"></qw-calendar-guest-inline>
`;
