import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'qw-hotels',
  commonjs: {
    namedExports: {
      '@qwentes/booking-state-manager': [
        'SessionService', 'SessionHelper', 'SessionLoaded$', 'SessionIsLoading$', 'SessionHasRooms$',
        'RoomService', 'RoomHelper', 'RoomLoaded$', 'RoomIsLoading$', 'RoomDefaultLabel', 'RoomSummaryType',
        'BasketService', 'BasketHelper', 'BasketWithPrice$', 'BasketIsLoading$',
        'DateUtil', 'DateFormat', 'MONEY_SYMBOLS', 'RateHelper', 'createRateFromRoomBasketOccupancy',
        'ExtraService', 'ExtraLoaded$', 'ExtraHelper', 'ExtraIsLoading$',
        'QuoteService', 'QuoteHelper', 'QuoteLoaded$', 'RateQualifierType',
      ]
    }
  },
  hashFileNames: true,
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
      serviceWorker: null,
      copy: [
        { src: 'globals/img', dest: 'img' }
      ]
    }
  ],
  globalStyle: 'src/globals/app.css',
  globalScript: 'src/globals/app.ts'
};
