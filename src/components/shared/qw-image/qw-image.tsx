import {h, FunctionalComponent} from '@stencil/core';

interface QwImageProps {
  imageUrl?: string;
  alt?: string;
}

export const QwImage: FunctionalComponent<QwImageProps> = (props) => {
  const normalizedProps = props || {} as QwImageProps; // todo capire come fare meglio - fa schifo
  const fallBackUrl = 'https://via.placeholder.com/400'; // todo to change
  return <img class="qw-image" src={normalizedProps.imageUrl || fallBackUrl} alt={normalizedProps.alt}/>;
};
