import {ExtraModel, QwHotelEnv, RoomBasketModel} from '@qwentes/booking-state-manager';

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

declare global {
  interface Window {
    QW_HOTEL_ENV: QwHotelEnv;
  }
}
