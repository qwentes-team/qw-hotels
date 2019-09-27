import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'qw-hotels',
  bundles: [
    { components: ['qw-room-list'] },
    { components: ['qw-room-detail'] },
  ],
  hashFileNames: false, // rimuovere in prod
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  globalStyle: 'src/globals/app.css'
};
