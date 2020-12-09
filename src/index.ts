import {ExtraModel, RoomBasketModel} from '@qwentes/booking-state-manager';

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

console.log('version 1.1.1');
