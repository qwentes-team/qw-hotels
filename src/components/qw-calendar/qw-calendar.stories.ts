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
