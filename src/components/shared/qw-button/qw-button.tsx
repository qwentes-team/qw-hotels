import {FunctionalComponent, h} from '@stencil/core';

interface QwButtonProps {
  QwButtonLabel: string;
  QwButtonDisabled?: boolean;
  QwButtonClass?: string;
  QwButtonOnClick?: () => any;
}

export const QwButton: FunctionalComponent<QwButtonProps> = (props) => {
  return (
    <div
      class={`
        qw-button
        ${props.QwButtonDisabled ? 'qw-button--disabled' : ''}
        ${props.QwButtonClass || ''}
      `}
      onClick={() => props.QwButtonOnClick && props.QwButtonOnClick()}>
      {props.QwButtonLabel}
    </div>
  );
};
