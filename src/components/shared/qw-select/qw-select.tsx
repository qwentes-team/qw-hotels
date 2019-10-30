import {FunctionalComponent, h } from '@stencil/core';

interface QwSelectProps {
  QwSelectLabel?: string;
  QwSelectOnChange?: (e) => any;
}

export const QwSelect: FunctionalComponent<QwSelectProps> = (props, children) => {
  return (
    <label>
      {props.QwSelectLabel && <div class="qw-select__label">{props.QwSelectLabel}</div>}
      <select onChange={(e) => props.QwSelectOnChange && props.QwSelectOnChange(e)}>
        {children.map(c => c)}
      </select>
    </label>
  )
};
