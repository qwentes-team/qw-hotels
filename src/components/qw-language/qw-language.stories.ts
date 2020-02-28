export default {
  title: 'Language',
}

export const base = () => `
  <qw-language></qw-language>
`;

export const filterLanguages = () => `
  <qw-language qw-language-languages='["en-US", "fr-FR", "it-IT"]'></qw-language>
`;

export const preselected = () => `
  <qw-language qw-language-preselected="fr-FR"></qw-language>
`;
