import {FunctionalComponent, h} from '@stencil/core';

interface QwButtonProps {
  QwButtonId?: string;
  QwButtonLabel?: string;
  QwButtonToAdd?: boolean;
  QwButtonDisabled?: boolean;
  QwButtonClass?: string;
  QwButtonIcon?: boolean;
  QwButtonIconFileName?: string;
  QwButtonOnClick?: () => any;
}

export const QwButton: FunctionalComponent<QwButtonProps> = (props) => {
  return (
    <div
      id={props.QwButtonId}
      class={`
        qw-button
        ${props.QwButtonToAdd ? 'qw-button--to-add': 'qw-button--to-remove'}
        ${props.QwButtonDisabled ? 'qw-button--disabled' : ''}
        ${props.QwButtonIcon ? 'qw-button--icon' : ''}
        ${props.QwButtonClass || ''}
      `}
      style={props.QwButtonIconFileName && {backgroundImage: "url(" + `https://hotels-booking-engine.qwentes.it/versions/v1/img/icons/${props.QwButtonIconFileName}` + ")"}}
      onClick={() => props.QwButtonOnClick && props.QwButtonOnClick()}>
      {props.QwButtonLabel}
    </div>
  );
};
