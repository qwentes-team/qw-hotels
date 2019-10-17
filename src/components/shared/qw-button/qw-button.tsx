import {FunctionalComponent, h} from '@stencil/core';

interface QwButtonProps {
  QwButtonLabel: string;
  QwButtonOnClick?: () => any;
}

export const QwButton: FunctionalComponent<QwButtonProps> = (props) => (
  <div onClick={() => props.QwButtonOnClick()} class="qw-button">{props.QwButtonLabel}</div>
);
