import {h, FunctionalComponent} from '@stencil/core';

interface QwImageProps {
  imageUrl?: string;
  alt?: string;
}

export const QwImage: FunctionalComponent<QwImageProps> = (props) => {
  const normalizedProps = props || {} as QwImageProps;
  const fallBackUrl = 'https://hotels-booking-engine.qwentes.it/versions/v1/img/no-image.png';
  return <div class={`
    qw-image
    ${!normalizedProps.imageUrl ? 'qw-image__no-image' : ''}
  `}>
    <img src={normalizedProps.imageUrl || fallBackUrl} alt={normalizedProps.alt}/>
  </div>
};
