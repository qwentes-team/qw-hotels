import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'qw-hotels',
  commonjs: {
    namedExports: {
      'booking-state-manager': [
        'SessionService', 'SessionLoaded$', 'SessionQuery', 'SessionIsLoading$',
        'RoomService', 'RoomHelper', 'RoomQuery', 'RoomLoaded$', 'RoomIsLoading$', 'RoomDefaultLabel',
        'BasketQuery', 'BasketService', 'BasketHelper', 'BasketWithPrice$', 'BasketIsLoading$',
      ]
    }
  },
  bundles: [
    { components: ['qw-room-list'] },
    { components: ['qw-room-detail'] },
    { components: ['qw-basket'] },
  ],
  hashFileNames: false, // todo rimuovere in prod
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
