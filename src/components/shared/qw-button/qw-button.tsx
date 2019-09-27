import {FunctionalComponent, h} from '@stencil/core';

interface QwButtonProps {
  buttonLabel: string;
}

export const QwButton: FunctionalComponent<QwButtonProps> = ({buttonLabel}) => (
  <button class="qw-button">{buttonLabel}</button>
);
