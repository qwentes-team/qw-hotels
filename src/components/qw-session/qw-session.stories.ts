import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Session'
}

export const base = () => `
  <qw-session></qw-session>
  <hr>
  <h4>Use currency component to change the session</h4>
  <qw-currency></qw-currency>
`;

window.addEventListener('qwSessionChanged', logEvent);
