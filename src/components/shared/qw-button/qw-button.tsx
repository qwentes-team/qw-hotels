import {FunctionalComponent, h} from '@stencil/core';

interface QwButtonProps {
  QwButtonLabel: string;
  QwButtonDisabled?: boolean;
  QwButtonOnClick?: () => any;
}

export const QwButton: FunctionalComponent<QwButtonProps> = (props) => {
  return (
    <div
      class={`qw-button ${props.QwButtonDisabled && 'qw-button--disabled'}`}
      onClick={() => props.QwButtonOnClick()}>
      {props.QwButtonLabel}
    </div>
  );
};
