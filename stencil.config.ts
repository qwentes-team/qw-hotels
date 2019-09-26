import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'qwentes',
  bundles: [
    { components: ['my-component'] },
    { components: ['second-component'] }
  ],
  hashFileNames: false, // per ora così capiamo i file che genera per i vari componenti
  outputTargets: [
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
