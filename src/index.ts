import { ExtraModel, RoomBasketModel } from '@qwentes/booking-state-manager';

export * from './components';

export enum QwCalendarGuestInlineInputType {
  Guest = 'guest',
  Date = 'date',
}

export enum QwRoomListCardButtonType {
  BookNow = 'bookNow',
  ViewRoom = 'viewRoom',
  ChangeDate = 'changeDate',
  Checkout = 'checkout',
}

export enum QwRoomListType {
  Inline = 'inline',
  Grid = 'grid',
  Card = 'card',
}

export enum QwRoomBasketType {
  Classic = 'classic',
  Basic = 'basic',
}

export enum QwRoomBaseInfoType {
  List = 'list',
  Inline = 'inline',
}

export enum QwRoomBaseInfoGuestType {
  Icon = 'icon',
  Text = 'text',
}

export enum QwRoomListOrderType {
  AscendingPrice = 'ascendingPrice',
  DescendingPrice = 'descendingPrice',
}

export interface QwChangeRoomEvent {
  quantity: string;
  room: RoomBasketModel;
}

export interface QwChangeExtraEvent {
  quantity: string;
  extraId: ExtraModel['extraId'];
  roomId?: number
}

export enum GuestDetailFormProperty {
  FirstName = 'firstName',
  LastName = 'lastName',
  EmailAddress = 'emailAddress',
  PhoneNumber = 'phoneNumber',
  PhoneCountryCode = 'phoneCountryCode',
  Phone = 'phone',
  ConfirmConditions = 'confirmConditions',
  Title = 'title',
  CountryCode = 'countryCode',
  InsuranceAcceptance = 'insuranceAcceptance',
}

export enum QwWeekCalendarDirection {
  Left = 'left',
  Right = 'right',
}

export enum QwCounterId {
  QwRoomRateListCounter = 'qwRoomRateListCounter',
  QwBasketSummaryBasketRoomsCounter = 'qwBasketSummaryBasketRoomsCounter',
  QwBasketSummaryBasketExtrasCounter = 'qwBasketSummaryBasketExtrasCounter',
  QwRoomRateCounter = 'qwRoomRateCounter',
  QwExtraCardCounter = 'qwExtraCardCounter',
  QwGuestCounter = 'qwGuestCounter',
  QwRoomListCardCounter = 'qwRoomListCardCounter',
}

export enum QwOffersOrderType {
  OrderByPrice = 'orderByPrice',
  OrderByRoomType = 'orderByRoomType',
}

export enum QwCurrencyType {
  Classic = 'classic',
  Compact = 'compact',
}

export enum QwLanguageType {
  Select = 'select',
  DropDown = 'dropDown',
}

export const removeTimeFromDate = (date: string) => {
  if (date) {
    const dateElements = date.split('-');
    const year = parseInt(dateElements[0]);
    const month = parseInt(dateElements[1])-1;
    const day = parseInt(dateElements[2]);
    const utcDate = Date.UTC(year, month, day, 0,0,0,0);

    return new Date(utcDate);
  }
};

console.log('version 1.1.25');

//
// SessionService.getSession().pipe(
//   switchMap((session: SessionModel) => {
//     return of(session);
//   })
// ).subscribe((session) => {
//   console.log('session', session);
// });
// window.addEventListener('qwSessionLoaded', (e: CustomEvent) => {
//   console.log('session listener', e.detail);
//   window.QW_HOTEL_ENV.LINK_DECORATOR_FN = function(url) {
//     return url;
//   }
// })

