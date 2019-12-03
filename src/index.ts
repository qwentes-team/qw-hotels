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
