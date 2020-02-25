import {FunctionalComponent, h} from '@stencil/core';

interface QwWrapInDivProps {
  wrapIt: boolean;
  wrapperClass?: string;
}

export const QwWrapInDiv: FunctionalComponent<QwWrapInDivProps> = (props, children) => {
  return (
    props.wrapIt
      ? <div class={props.wrapperClass || ''}>{children.map(c => c)}</div>
      : children.map(c => c)
  );
};
