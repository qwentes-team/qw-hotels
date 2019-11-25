import {h, FunctionalComponent} from '@stencil/core';

interface QwImageProps {
  imageUrl?: string;
  alt?: string;
}

export const QwImage: FunctionalComponent<QwImageProps> = (props) => {
  const normalizedProps = props || {} as QwImageProps; // if props are empty, return null
  const fallBackUrl = 'img/no-image.png'; // todo to change
  return <div class={`
    qw-image
    ${!normalizedProps.imageUrl ? 'qw-image__no-image' : ''}
  `}>
    <img src={normalizedProps.imageUrl || fallBackUrl} alt={normalizedProps.alt}/>
  </div>
};
