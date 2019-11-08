/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  PricesForStayPeriod,
  Rate,
  RateModel,
  RoomModel,
  SessionGuests,
  SessionStayPeriod,
} from 'booking-state-manager';
import {
  QwCalendarGuestInlineInputType,
  QwRoomListCardButtonType,
  QwRoomListType,
} from './index';
import {
  QwCounterEmitter,
} from './components/shared/qw-counter/qw-counter';
import {
  QwRoomRateAddToBasketEmitter,
} from './components/qw-room-rate/qw-room-rate';
import {
  MoneyPrice,
} from 'booking-state-manager/src/core/money/money';
import {
  QwRoomRateAddToBasketEmitter as QwRoomRateAddToBasketEmitter1,
} from './components/qw-room-rate/qw-room-rate';

export namespace Components {
  interface QwBasket {
    'qwBasketShowEmptyButton': boolean;
  }
  interface QwBasketSummary {}
  interface QwCalendar {
    'qwCalendarDesktopLimit': number;
    'qwCalendarNumberOfMonths': number;
    'qwCalendarResponsive': boolean;
    'qwCalendarSyncOnChange': boolean;
  }
  interface QwCalendarGuestInline {
    'qwCalendarGuestInlineShowCheckButton': boolean;
  }
  interface QwCalendarPicker {
    'qwCalendarPickerDesktopLimit': number;
    'qwCalendarPickerDisabled': boolean;
    'qwCalendarPickerNumberOfMonths': number;
    'qwCalendarPickerResponsive': boolean;
    'qwCalendarPickerStayPeriod': SessionStayPeriod;
  }
  interface QwCard {}
  interface QwCounter {
    'qwCounterMaxValue': number;
    'qwCounterName': string;
    'qwCounterValue': number;
  }
  interface QwError {}
  interface QwGuest {
    'qwGuestCenter': boolean;
    'qwGuestSyncOnChange': boolean;
  }
  interface QwInput {
    'qwInputIsReadonly': boolean;
    'qwInputLabel': string;
    'qwInputName': string;
    'qwInputType': string;
    'qwInputValue': string;
  }
  interface QwLoading {
    'QwLoadingSize': string;
  }
  interface QwPrice {
    'qwPriceCaption': string;
    'qwPriceCrossedPrice': string;
    'qwPriceMainPrice': string;
  }
  interface QwRoomDetail {
    'qwRoomDetailId': string;
  }
  interface QwRoomDetailCard {
    'qwRoomDetailCardBed': string;
    'qwRoomDetailCardGuests': string;
    'qwRoomDetailCardImage': string;
    'qwRoomDetailCardIsLoading': boolean;
    'qwRoomDetailCardNumberOfNights': number;
    'qwRoomDetailCardRates': Rate[];
    'qwRoomDetailCardRatesModel': {[rateId: string]: RateModel};
    'qwRoomDetailCardSquareMeter': string;
    'qwRoomDetailCardTitle': string;
  }
  interface QwRoomList {
    'qwRoomListFilterRoomsWith': string;
    'qwRoomListHeaderMessage': string;
    'qwRoomListShowPrices': boolean;
    'qwRoomListType': QwRoomListType;
  }
  interface QwRoomListCard {
    'qwRoomListCardAveragePrice': string;
    'qwRoomListCardCrossedOutPrice': string;
    'qwRoomListCardDescription': string;
    'qwRoomListCardGuests': string;
    'qwRoomListCardId': RoomModel['roomId'];
    'qwRoomListCardImage': string;
    'qwRoomListCardIsLoading': boolean;
    'qwRoomListCardIsLoadingPrice': boolean;
    'qwRoomListCardOnClickBook': () => void;
    'qwRoomListCardOnClickChangeDate': () => void;
    'qwRoomListCardOnClickView': () => void;
    'qwRoomListCardPrice': string;
    'qwRoomListCardPrices': {[dateString: string]: MoneyPrice};
    'qwRoomListCardRangeDate': Date[];
    'qwRoomListCardRangeDateSession': Date[];
    'qwRoomListCardRates': Rate[];
    'qwRoomListCardShowPrices': boolean;
    'qwRoomListCardSquareMeter': string;
    'qwRoomListCardTitle': string;
  }
  interface QwRoomRate {
    'qwRoomRateIsLoading': boolean;
    'qwRoomRateName': string;
    'qwRoomRateRate': Rate;
  }
  interface QwWeekCalendar {
    'qwWeekCalendarPricesByRoom': PricesForStayPeriod[RoomModel['roomId']];
    'qwWeekCalendarRangeDate': Date[];
    'qwWeekCalendarRangeDateSession': Date[];
    'qwWeekCalendarSelectedRoomId': RoomModel['roomId'];
  }
}

declare global {


  interface HTMLQwBasketElement extends Components.QwBasket, HTMLStencilElement {}
  var HTMLQwBasketElement: {
    prototype: HTMLQwBasketElement;
    new (): HTMLQwBasketElement;
  };

  interface HTMLQwBasketSummaryElement extends Components.QwBasketSummary, HTMLStencilElement {}
  var HTMLQwBasketSummaryElement: {
    prototype: HTMLQwBasketSummaryElement;
    new (): HTMLQwBasketSummaryElement;
  };

  interface HTMLQwCalendarElement extends Components.QwCalendar, HTMLStencilElement {}
  var HTMLQwCalendarElement: {
    prototype: HTMLQwCalendarElement;
    new (): HTMLQwCalendarElement;
  };

  interface HTMLQwCalendarGuestInlineElement extends Components.QwCalendarGuestInline, HTMLStencilElement {}
  var HTMLQwCalendarGuestInlineElement: {
    prototype: HTMLQwCalendarGuestInlineElement;
    new (): HTMLQwCalendarGuestInlineElement;
  };

  interface HTMLQwCalendarPickerElement extends Components.QwCalendarPicker, HTMLStencilElement {}
  var HTMLQwCalendarPickerElement: {
    prototype: HTMLQwCalendarPickerElement;
    new (): HTMLQwCalendarPickerElement;
  };

  interface HTMLQwCardElement extends Components.QwCard, HTMLStencilElement {}
  var HTMLQwCardElement: {
    prototype: HTMLQwCardElement;
    new (): HTMLQwCardElement;
  };

  interface HTMLQwCounterElement extends Components.QwCounter, HTMLStencilElement {}
  var HTMLQwCounterElement: {
    prototype: HTMLQwCounterElement;
    new (): HTMLQwCounterElement;
  };

  interface HTMLQwErrorElement extends Components.QwError, HTMLStencilElement {}
  var HTMLQwErrorElement: {
    prototype: HTMLQwErrorElement;
    new (): HTMLQwErrorElement;
  };

  interface HTMLQwGuestElement extends Components.QwGuest, HTMLStencilElement {}
  var HTMLQwGuestElement: {
    prototype: HTMLQwGuestElement;
    new (): HTMLQwGuestElement;
  };

  interface HTMLQwInputElement extends Components.QwInput, HTMLStencilElement {}
  var HTMLQwInputElement: {
    prototype: HTMLQwInputElement;
    new (): HTMLQwInputElement;
  };

  interface HTMLQwLoadingElement extends Components.QwLoading, HTMLStencilElement {}
  var HTMLQwLoadingElement: {
    prototype: HTMLQwLoadingElement;
    new (): HTMLQwLoadingElement;
  };

  interface HTMLQwPriceElement extends Components.QwPrice, HTMLStencilElement {}
  var HTMLQwPriceElement: {
    prototype: HTMLQwPriceElement;
    new (): HTMLQwPriceElement;
  };

  interface HTMLQwRoomDetailElement extends Components.QwRoomDetail, HTMLStencilElement {}
  var HTMLQwRoomDetailElement: {
    prototype: HTMLQwRoomDetailElement;
    new (): HTMLQwRoomDetailElement;
  };

  interface HTMLQwRoomDetailCardElement extends Components.QwRoomDetailCard, HTMLStencilElement {}
  var HTMLQwRoomDetailCardElement: {
    prototype: HTMLQwRoomDetailCardElement;
    new (): HTMLQwRoomDetailCardElement;
  };

  interface HTMLQwRoomListElement extends Components.QwRoomList, HTMLStencilElement {}
  var HTMLQwRoomListElement: {
    prototype: HTMLQwRoomListElement;
    new (): HTMLQwRoomListElement;
  };

  interface HTMLQwRoomListCardElement extends Components.QwRoomListCard, HTMLStencilElement {}
  var HTMLQwRoomListCardElement: {
    prototype: HTMLQwRoomListCardElement;
    new (): HTMLQwRoomListCardElement;
  };

  interface HTMLQwRoomRateElement extends Components.QwRoomRate, HTMLStencilElement {}
  var HTMLQwRoomRateElement: {
    prototype: HTMLQwRoomRateElement;
    new (): HTMLQwRoomRateElement;
  };

  interface HTMLQwWeekCalendarElement extends Components.QwWeekCalendar, HTMLStencilElement {}
  var HTMLQwWeekCalendarElement: {
    prototype: HTMLQwWeekCalendarElement;
    new (): HTMLQwWeekCalendarElement;
  };
  interface HTMLElementTagNameMap {
    'qw-basket': HTMLQwBasketElement;
    'qw-basket-summary': HTMLQwBasketSummaryElement;
    'qw-calendar': HTMLQwCalendarElement;
    'qw-calendar-guest-inline': HTMLQwCalendarGuestInlineElement;
    'qw-calendar-picker': HTMLQwCalendarPickerElement;
    'qw-card': HTMLQwCardElement;
    'qw-counter': HTMLQwCounterElement;
    'qw-error': HTMLQwErrorElement;
    'qw-guest': HTMLQwGuestElement;
    'qw-input': HTMLQwInputElement;
    'qw-loading': HTMLQwLoadingElement;
    'qw-price': HTMLQwPriceElement;
    'qw-room-detail': HTMLQwRoomDetailElement;
    'qw-room-detail-card': HTMLQwRoomDetailCardElement;
    'qw-room-list': HTMLQwRoomListElement;
    'qw-room-list-card': HTMLQwRoomListCardElement;
    'qw-room-rate': HTMLQwRoomRateElement;
    'qw-week-calendar': HTMLQwWeekCalendarElement;
  }
}

declare namespace LocalJSX {
  interface QwBasket {
    'qwBasketShowEmptyButton'?: boolean;
  }
  interface QwBasketSummary {}
  interface QwCalendar {
    'onQwCalendarChange'?: (event: CustomEvent<SessionStayPeriod>) => void;
    'qwCalendarDesktopLimit'?: number;
    'qwCalendarNumberOfMonths'?: number;
    'qwCalendarResponsive'?: boolean;
    'qwCalendarSyncOnChange'?: boolean;
  }
  interface QwCalendarGuestInline {
    'onQwCalendarGuestInlineCheckAvailability'?: (event: CustomEvent<void>) => void;
    'onQwCalendarGuestInlineClickInput'?: (event: CustomEvent<QwCalendarGuestInlineInputType>) => void;
    'qwCalendarGuestInlineShowCheckButton'?: boolean;
  }
  interface QwCalendarPicker {
    'onQwCalendarPickerChangeDates'?: (event: CustomEvent<SessionStayPeriod>) => void;
    'qwCalendarPickerDesktopLimit'?: number;
    'qwCalendarPickerDisabled'?: boolean;
    'qwCalendarPickerNumberOfMonths'?: number;
    'qwCalendarPickerResponsive'?: boolean;
    'qwCalendarPickerStayPeriod'?: SessionStayPeriod;
  }
  interface QwCard {}
  interface QwCounter {
    'onQwCounterChangeValue'?: (event: CustomEvent<QwCounterEmitter>) => void;
    'qwCounterMaxValue'?: number;
    'qwCounterName'?: string;
    'qwCounterValue'?: number;
  }
  interface QwError {}
  interface QwGuest {
    'onQwGuestChange'?: (event: CustomEvent<SessionGuests>) => void;
    'qwGuestCenter'?: boolean;
    'qwGuestSyncOnChange'?: boolean;
  }
  interface QwInput {
    'qwInputIsReadonly'?: boolean;
    'qwInputLabel'?: string;
    'qwInputName'?: string;
    'qwInputType'?: string;
    'qwInputValue'?: string;
  }
  interface QwLoading {
    'QwLoadingSize'?: string;
  }
  interface QwPrice {
    'qwPriceCaption'?: string;
    'qwPriceCrossedPrice'?: string;
    'qwPriceMainPrice'?: string;
  }
  interface QwRoomDetail {
    'onQwRoomDetailAddToBasketSuccess'?: (event: CustomEvent<void>) => void;
    'qwRoomDetailId'?: string;
  }
  interface QwRoomDetailCard {
    'onQwRoomDetailCardAddToBasket'?: (event: CustomEvent<QwRoomRateAddToBasketEmitter>) => void;
    'qwRoomDetailCardBed'?: string;
    'qwRoomDetailCardGuests'?: string;
    'qwRoomDetailCardImage'?: string;
    'qwRoomDetailCardIsLoading'?: boolean;
    'qwRoomDetailCardNumberOfNights'?: number;
    'qwRoomDetailCardRates'?: Rate[];
    'qwRoomDetailCardRatesModel'?: {[rateId: string]: RateModel};
    'qwRoomDetailCardSquareMeter'?: string;
    'qwRoomDetailCardTitle'?: string;
  }
  interface QwRoomList {
    'onQwRoomListClickRoom'?: (event: CustomEvent<{type: QwRoomListCardButtonType, room: RoomModel}>) => void;
    'qwRoomListFilterRoomsWith'?: string;
    'qwRoomListHeaderMessage'?: string;
    'qwRoomListShowPrices'?: boolean;
    'qwRoomListType'?: QwRoomListType;
  }
  interface QwRoomListCard {
    'qwRoomListCardAveragePrice'?: string;
    'qwRoomListCardCrossedOutPrice'?: string;
    'qwRoomListCardDescription'?: string;
    'qwRoomListCardGuests'?: string;
    'qwRoomListCardId'?: RoomModel['roomId'];
    'qwRoomListCardImage'?: string;
    'qwRoomListCardIsLoading'?: boolean;
    'qwRoomListCardIsLoadingPrice'?: boolean;
    'qwRoomListCardOnClickBook'?: () => void;
    'qwRoomListCardOnClickChangeDate'?: () => void;
    'qwRoomListCardOnClickView'?: () => void;
    'qwRoomListCardPrice'?: string;
    'qwRoomListCardPrices'?: {[dateString: string]: MoneyPrice};
    'qwRoomListCardRangeDate'?: Date[];
    'qwRoomListCardRangeDateSession'?: Date[];
    'qwRoomListCardRates'?: Rate[];
    'qwRoomListCardShowPrices'?: boolean;
    'qwRoomListCardSquareMeter'?: string;
    'qwRoomListCardTitle'?: string;
  }
  interface QwRoomRate {
    'onQwRoomRateAddToBasket'?: (event: CustomEvent<QwRoomRateAddToBasketEmitter>) => void;
    'qwRoomRateIsLoading'?: boolean;
    'qwRoomRateName'?: string;
    'qwRoomRateRate'?: Rate;
  }
  interface QwWeekCalendar {
    'qwWeekCalendarPricesByRoom'?: PricesForStayPeriod[RoomModel['roomId']];
    'qwWeekCalendarRangeDate'?: Date[];
    'qwWeekCalendarRangeDateSession'?: Date[];
    'qwWeekCalendarSelectedRoomId'?: RoomModel['roomId'];
  }

  interface IntrinsicElements {
    'qw-basket': QwBasket;
    'qw-basket-summary': QwBasketSummary;
    'qw-calendar': QwCalendar;
    'qw-calendar-guest-inline': QwCalendarGuestInline;
    'qw-calendar-picker': QwCalendarPicker;
    'qw-card': QwCard;
    'qw-counter': QwCounter;
    'qw-error': QwError;
    'qw-guest': QwGuest;
    'qw-input': QwInput;
    'qw-loading': QwLoading;
    'qw-price': QwPrice;
    'qw-room-detail': QwRoomDetail;
    'qw-room-detail-card': QwRoomDetailCard;
    'qw-room-list': QwRoomList;
    'qw-room-list-card': QwRoomListCard;
    'qw-room-rate': QwRoomRate;
    'qw-week-calendar': QwWeekCalendar;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'qw-basket': LocalJSX.QwBasket & JSXBase.HTMLAttributes<HTMLQwBasketElement>;
      'qw-basket-summary': LocalJSX.QwBasketSummary & JSXBase.HTMLAttributes<HTMLQwBasketSummaryElement>;
      'qw-calendar': LocalJSX.QwCalendar & JSXBase.HTMLAttributes<HTMLQwCalendarElement>;
      'qw-calendar-guest-inline': LocalJSX.QwCalendarGuestInline & JSXBase.HTMLAttributes<HTMLQwCalendarGuestInlineElement>;
      'qw-calendar-picker': LocalJSX.QwCalendarPicker & JSXBase.HTMLAttributes<HTMLQwCalendarPickerElement>;
      'qw-card': LocalJSX.QwCard & JSXBase.HTMLAttributes<HTMLQwCardElement>;
      'qw-counter': LocalJSX.QwCounter & JSXBase.HTMLAttributes<HTMLQwCounterElement>;
      'qw-error': LocalJSX.QwError & JSXBase.HTMLAttributes<HTMLQwErrorElement>;
      'qw-guest': LocalJSX.QwGuest & JSXBase.HTMLAttributes<HTMLQwGuestElement>;
      'qw-input': LocalJSX.QwInput & JSXBase.HTMLAttributes<HTMLQwInputElement>;
      'qw-loading': LocalJSX.QwLoading & JSXBase.HTMLAttributes<HTMLQwLoadingElement>;
      'qw-price': LocalJSX.QwPrice & JSXBase.HTMLAttributes<HTMLQwPriceElement>;
      'qw-room-detail': LocalJSX.QwRoomDetail & JSXBase.HTMLAttributes<HTMLQwRoomDetailElement>;
      'qw-room-detail-card': LocalJSX.QwRoomDetailCard & JSXBase.HTMLAttributes<HTMLQwRoomDetailCardElement>;
      'qw-room-list': LocalJSX.QwRoomList & JSXBase.HTMLAttributes<HTMLQwRoomListElement>;
      'qw-room-list-card': LocalJSX.QwRoomListCard & JSXBase.HTMLAttributes<HTMLQwRoomListCardElement>;
      'qw-room-rate': LocalJSX.QwRoomRate & JSXBase.HTMLAttributes<HTMLQwRoomRateElement>;
      'qw-week-calendar': LocalJSX.QwWeekCalendar & JSXBase.HTMLAttributes<HTMLQwWeekCalendarElement>;
    }
  }
}


