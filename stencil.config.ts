import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'qw-hotels',
  commonjs: {},
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
        { src: 'globals/img', dest: 'img' },
        { src: 'env.js', dest: 'env.js' }
      ]
    }
  ],
  globalStyle: 'src/globals/app.css',
  globalScript: 'src/globals/app.ts'
};
