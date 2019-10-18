import {FunctionalComponent, h} from '@stencil/core';

interface QwButtonProps {
  QwButtonLabel: string;
  QwButtonIsLoading?: boolean;
  QwButtonOnClick?: () => any;
}

export const QwButton: FunctionalComponent<QwButtonProps> = (props) => {
  return (
    <div
      class={`qw-button ${props.QwButtonIsLoading && 'qw-button--disabled'}`}
      onClick={() => props.QwButtonOnClick()}>
      {props.QwButtonIsLoading && <qw-loading qw-loading-size="16"></qw-loading>}
      {props.QwButtonLabel}
    </div>
  );
}
