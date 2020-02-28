export default {
  title: 'Language',
}

export const base = () => `
  <qw-language></qw-language>
  <hr>
  <h4>Show the language component changing the language</h4>
  <qw-room-rates
    qw-room-rates-room-id="98868"
    qw-room-rates-force-rooms-call="true">
  </qw-room-rates>
`;

export const filterLanguages = () => `
  <qw-language qw-language-languages='["en-US", "fr-FR", "it-IT"]'></qw-language>
`;

export const preselected = () => `
  <qw-language qw-language-preselected="fr-FR"></qw-language>
`;
