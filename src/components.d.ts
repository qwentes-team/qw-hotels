/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface QwCard {
    'cardTitle': string;
  }
  interface QwRoomDetail {}
  interface QwRoomList {}
}

declare global {


  interface HTMLQwCardElement extends Components.QwCard, HTMLStencilElement {}
  var HTMLQwCardElement: {
    prototype: HTMLQwCardElement;
    new (): HTMLQwCardElement;
  };

  interface HTMLQwRoomDetailElement extends Components.QwRoomDetail, HTMLStencilElement {}
  var HTMLQwRoomDetailElement: {
    prototype: HTMLQwRoomDetailElement;
    new (): HTMLQwRoomDetailElement;
  };

  interface HTMLQwRoomListElement extends Components.QwRoomList, HTMLStencilElement {}
  var HTMLQwRoomListElement: {
    prototype: HTMLQwRoomListElement;
    new (): HTMLQwRoomListElement;
  };
  interface HTMLElementTagNameMap {
    'qw-card': HTMLQwCardElement;
    'qw-room-detail': HTMLQwRoomDetailElement;
    'qw-room-list': HTMLQwRoomListElement;
  }
}

declare namespace LocalJSX {
  interface QwCard {
    'cardTitle'?: string;
  }
  interface QwRoomDetail {}
  interface QwRoomList {}

  interface IntrinsicElements {
    'qw-card': QwCard;
    'qw-room-detail': QwRoomDetail;
    'qw-room-list': QwRoomList;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'qw-card': LocalJSX.QwCard & JSXBase.HTMLAttributes<HTMLQwCardElement>;
      'qw-room-detail': LocalJSX.QwRoomDetail & JSXBase.HTMLAttributes<HTMLQwRoomDetailElement>;
      'qw-room-list': LocalJSX.QwRoomList & JSXBase.HTMLAttributes<HTMLQwRoomListElement>;
    }
  }
}


