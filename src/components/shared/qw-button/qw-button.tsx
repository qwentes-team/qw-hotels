import {FunctionalComponent, h} from '@stencil/core';

interface QwButtonProps {
  QwButtonLabel?: string;
  QwButtonDisabled?: boolean;
  QwButtonClass?: string;
  QwButtonIcon?: boolean;
  QwButtonIconFileName?: string;
  QwButtonOnClick?: () => any;
}

export const QwButton: FunctionalComponent<QwButtonProps> = (props) => {
  return (
    <div
      class={`
        qw-button
        ${props.QwButtonDisabled ? 'qw-button--disabled' : ''}
        ${props.QwButtonIcon ? 'qw-button--icon' : ''}
        ${props.QwButtonClass || ''}
      `}
      style={{backgroundImage: "url(" + `https://hotels-booking-engine.qwentes.it/versions/v1/img/icons/${props.QwButtonIconFileName}` + ")"}}
      onClick={() => props.QwButtonOnClick && props.QwButtonOnClick()}>
      {props.QwButtonLabel}
    </div>
  );
};
