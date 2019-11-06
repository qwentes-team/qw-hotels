import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'qw-hotels',
  commonjs: {
    namedExports: {
      'booking-state-manager': [
        'SessionService', 'SessionLoaded$', 'SessionQuery', 'SessionIsLoading$', 'SessionHelper',
        'RoomService', 'RoomHelper', 'RoomQuery', 'RoomLoaded$', 'RoomIsLoading$', 'RoomDefaultLabel',
        'BasketQuery', 'BasketService', 'BasketHelper', 'BasketWithPrice$', 'BasketIsLoading$',
        'DateUtil', 'DateFormat', 'MONEY_SYMBOLS', 'RateHelper', 'RateService',
      ]
    }
  },
  bundles: [
    { components: ['qw-room-list'] },
    { components: ['qw-calendar'] },
    { components: ['qw-basket'] },
  ],
  hashFileNames: true, // todo rimuovere in prod
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
