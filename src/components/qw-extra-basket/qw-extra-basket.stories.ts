export default {
  title: 'Extra/Extra basket'
}

export const base = () => `
  <qw-extra-basket></qw-extra-basket>
`;

export const noImages = () => `
  <qw-extra-basket qw-extra-basket-has-image="false"></qw-extra-basket>
`;

export const basic = () => `
  <qw-extra-basket qw-extra-basket-has-image="false" qw-extra-basket-type="basic"></qw-extra-basket>
`;
