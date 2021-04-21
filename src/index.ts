import {ExtraModel, RoomBasketModel, SessionModel, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';


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

console.log('version 1.1.16');


SessionService.getSession().pipe(
  switchMap((session: SessionModel) => {
    return of(session);
  })
).subscribe((session) => {
  console.log('session', session);
});
window.addEventListener('qwSessionLoaded', (e: CustomEvent) => {
  console.log('session listener', e.detail);
  window.QW_HOTEL_UPDATE_SESSION_DATA(
    e.detail,
    {adults: 2, children: 1, infants: 0},
    {arrivalDate: '2021-05-10', departureDate: '2021-05-13'},
  ).then(session => console.log('session updated', session));
})
