# qw-room-detail-card



<!-- Auto Generated Below -->


## Properties

| Property                                | Attribute                                     | Description | Type     | Default     |
| --------------------------------------- | --------------------------------------------- | ----------- | -------- | ----------- |
| `qwRoomDetailCardImage`                 | `qw-room-detail-card-image`                   |             | `string` | `undefined` |
| `qwRoomDetailCardNumberOfAccommodation` | `qw-room-detail-card-number-of-accommodation` |             | `number` | `undefined` |
| `qwRoomDetailCardNumberOfGuests`        | `qw-room-detail-card-number-of-guests`        |             | `number` | `undefined` |
| `qwRoomDetailCardNumberOfNights`        | `qw-room-detail-card-number-of-nights`        |             | `number` | `undefined` |
| `qwRoomDetailCardRoomId`                | `qw-room-detail-card-room-id`                 |             | `number` | `undefined` |
| `qwRoomDetailCardTitle`                 | `qw-room-detail-card-title`                   |             | `string` | `undefined` |


## Events

| Event                            | Description | Type                                          |
| -------------------------------- | ----------- | --------------------------------------------- |
| `qwRoomDetailCardAddAnotherRoom` |             | `CustomEvent<void>`                           |
| `qwRoomDetailCardAddedToBasket`  |             | `CustomEvent<QwRoomRateAddedToBasketEmitter>` |
| `qwRoomDetailCardProceed`        |             | `CustomEvent<void>`                           |


## Dependencies

### Used by

 - [qw-room-detail](..)

### Depends on

- [qw-card](../../shared/qw-card)
- [qw-image](../../shared/qw-image)
- [qw-room-base-info](../../qw-room-base-info)
- [qw-room-rates](../../qw-room-rates)

### Graph
```mermaid
graph TD;
  qw-room-detail-card --> qw-card
  qw-room-detail-card --> qw-image
  qw-room-detail-card --> qw-room-base-info
  qw-room-detail-card --> qw-room-rates
  qw-room-rates --> qw-room-rate
  qw-room-rates --> qw-placeholder
  qw-room-rates --> qw-error
  qw-room-rate --> qw-counter
  qw-room-detail --> qw-room-detail-card
  style qw-room-detail-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
