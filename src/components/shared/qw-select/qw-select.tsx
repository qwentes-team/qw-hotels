import {FunctionalComponent, h } from '@stencil/core';

interface QwSelectProps {
  QwSelectLabel?: string;
  QwSelectDisabled?: boolean;
  QwSelectIsMandatory?: boolean;
  QwSelectHasError?: boolean;
  QwSelectOnChange?: (e) => any;
}

export const QwSelect: FunctionalComponent<QwSelectProps> = (props, children) => {
  return (
    <label class={`
      ${props.QwSelectIsMandatory ? 'qw-select--mandatory' : ''}
      ${props.QwSelectHasError ? 'qw-select--error' : ''}
    `}>
      {props.QwSelectLabel && <div class="qw-select__label">{props.QwSelectLabel}</div>}
      <select disabled={props.QwSelectDisabled} onChange={(e) => props.QwSelectOnChange && props.QwSelectOnChange(e)}>
        {children.map(c => c)}
      </select>
    </label>
  )
};
