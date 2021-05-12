# qw-room-basket



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute                  | Description | Type                                                 | Default                    |
| ---------------------- | -------------------------- | ----------- | ---------------------------------------------------- | -------------------------- |
| `qwRoomBasketHasImage` | `qw-room-basket-has-image` |             | `boolean`                                            | `true`                     |
| `qwRoomBasketType`     | `qw-room-basket-type`      |             | `QwRoomBasketType.Basic \| QwRoomBasketType.Classic` | `QwRoomBasketType.Classic` |


## Events

| Event                        | Description | Type                |
| ---------------------------- | ----------- | ------------------- |
| `qwRoomBasketBackToRoomList` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [qw-room-notification](../qw-room-notification)

### Depends on

- [qw-room-list-card](../qw-room-list/qw-room-list-card)

### Graph
```mermaid
graph TD;
  qw-room-basket --> qw-room-list-card
  qw-room-list-card --> qw-card
  qw-room-list-card --> qw-image
  qw-room-list-card --> qw-carousel
  qw-room-list-card --> qw-room-base-info
  qw-room-list-card --> qw-placeholder
  qw-room-list-card --> qw-price
  qw-room-list-card --> qw-error
  qw-room-list-card --> qw-week-calendar
  qw-room-list-card --> qw-room-rates
  qw-room-list-card --> qw-counter
  qw-carousel --> qw-image
  qw-price --> qw-loading
  qw-room-rates --> qw-room-rate
  qw-room-rates --> qw-placeholder
  qw-room-rates --> qw-error
  qw-room-rate --> qw-counter
  qw-room-notification --> qw-room-basket
  style qw-room-basket fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
