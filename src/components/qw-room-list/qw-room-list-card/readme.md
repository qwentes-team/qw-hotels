# qw-room-card



<!-- Auto Generated Below -->


## Properties

| Property                          | Attribute                             | Description | Type                                    | Default     |
| --------------------------------- | ------------------------------------- | ----------- | --------------------------------------- | ----------- |
| `qwRoomListCardAveragePrice`      | `qw-room-list-card-average-price`     |             | `string`                                | `undefined` |
| `qwRoomListCardBasketRoom`        | --                                    |             | `RoomBasketModel`                       | `undefined` |
| `qwRoomListCardCrossedOutPrice`   | `qw-room-list-card-crossed-out-price` |             | `string`                                | `undefined` |
| `qwRoomListCardDescription`       | `qw-room-list-card-description`       |             | `string`                                | `undefined` |
| `qwRoomListCardGuests`            | `qw-room-list-card-guests`            |             | `string`                                | `undefined` |
| `qwRoomListCardId`                | `qw-room-list-card-id`                |             | `number`                                | `undefined` |
| `qwRoomListCardImage`             | `qw-room-list-card-image`             |             | `string`                                | `undefined` |
| `qwRoomListCardIsLoading`         | `qw-room-list-card-is-loading`        |             | `boolean`                               | `undefined` |
| `qwRoomListCardIsLoadingBasket`   | `qw-room-list-card-is-loading-basket` |             | `boolean`                               | `undefined` |
| `qwRoomListCardIsLoadingPrice`    | `qw-room-list-card-is-loading-price`  |             | `boolean`                               | `undefined` |
| `qwRoomListCardNights`            | `qw-room-list-card-nights`            |             | `number`                                | `undefined` |
| `qwRoomListCardOnChangeRoom`      | --                                    |             | `(e: QwChangeRoomEvent) => void`        | `undefined` |
| `qwRoomListCardOnClickBook`       | --                                    |             | `() => void`                            | `undefined` |
| `qwRoomListCardOnClickChangeDate` | --                                    |             | `() => void`                            | `undefined` |
| `qwRoomListCardOnClickView`       | --                                    |             | `() => void`                            | `undefined` |
| `qwRoomListCardPrice`             | `qw-room-list-card-price`             |             | `string`                                | `undefined` |
| `qwRoomListCardPrices`            | --                                    |             | `{ [dateString: string]: MoneyPrice; }` | `undefined` |
| `qwRoomListCardRangeDate`         | --                                    |             | `Date[]`                                | `undefined` |
| `qwRoomListCardRangeDateSession`  | --                                    |             | `Date[]`                                | `undefined` |
| `qwRoomListCardRates`             | --                                    |             | `Rate[]`                                | `undefined` |
| `qwRoomListCardShowCta`           | `qw-room-list-card-show-cta`          |             | `boolean`                               | `true`      |
| `qwRoomListCardShowPrice`         | `qw-room-list-card-show-price`        |             | `boolean`                               | `true`      |
| `qwRoomListCardShowPrices`        | `qw-room-list-card-show-prices`       |             | `boolean`                               | `true`      |
| `qwRoomListCardSquareMeter`       | `qw-room-list-card-square-meter`      |             | `string`                                | `undefined` |
| `qwRoomListCardTitle`             | `qw-room-list-card-title`             |             | `string`                                | `undefined` |


## Dependencies

### Used by

 - [qw-room-basket](../../qw-room-basket)
 - [qw-room-list](..)

### Depends on

- [qw-card](../../shared/qw-card)
- [qw-error](../../shared/qw-error)
- [qw-price](../../qw-price)
- [qw-week-calendar](../../qw-week-calendar)

### Graph
```mermaid
graph TD;
  qw-room-list-card --> qw-card
  qw-room-list-card --> qw-error
  qw-room-list-card --> qw-price
  qw-room-list-card --> qw-week-calendar
  qw-price --> qw-loading
  qw-room-basket --> qw-room-list-card
  qw-room-list --> qw-room-list-card
  style qw-room-list-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*