import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'qw-hotels',
  commonjs: {
    namedExports: {
      '@qwentes/booking-state-manager': [
        'SessionService', 'SessionHelper', 'SessionLoaded$', 'SessionIsLoading$',
        'RoomService', 'RoomHelper', 'RoomLoaded$', 'RoomIsLoading$', 'RoomDefaultLabel', 'RoomSummaryType',
        'BasketService', 'BasketHelper', 'BasketWithPrice$', 'BasketIsLoading$',
        'DateUtil', 'DateFormat', 'MONEY_SYMBOLS', 'RateHelper', 'createRateFromRoomBasketOccupancy',
        'ExtraService', 'ExtraLoaded$', 'ExtraHelper', 'ExtraIsLoading$',
        'QuoteService', 'QuoteHelper',
      ]
    }
  },
  // todo fare bundles in prod
  bundles: [
    { components: ['qw-room-list'] },
    { components: ['qw-calendar'] },
    { components: ['qw-basket'] },
  ],
  hashFileNames: true, // todo rimuovere in prod
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'globals/img', dest: 'img' }
      ]
    }
  ],
  globalStyle: 'src/globals/app.css',
  globalScript: 'src/globals/app.ts'
};
