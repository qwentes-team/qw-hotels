import {h, FunctionalComponent} from '@stencil/core';

export const QwImage: FunctionalComponent<any> = ({imageUrl}) => (
  <img class="qw-image" src={imageUrl}/>
);

