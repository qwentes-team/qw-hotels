import {logEvent} from 'storybook-events-logger';

export default {
  title: 'Book/Book',
};

export const base = () => `
  <qw-book>
    <div slot="qwBookLoading">Loading component...</div>
  </qw-book>
`;

window.addEventListener('qwBookIsLoaded', logEvent);
