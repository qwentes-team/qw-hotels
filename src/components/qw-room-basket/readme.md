# qw-room-basket



<!-- Auto Generated Below -->


## Properties

| Property                            | Attribute                                  | Description | Type     | Default     |
| ----------------------------------- | ------------------------------------------ | ----------- | -------- | ----------- |
| `qwRoomBasketBackToRoomListMessage` | `qw-room-basket-back-to-room-list-message` |             | `string` | `undefined` |
| `qwRoomBasketShowDescription`       | `qw-room-basket-show-description`          |             | `any`    | `undefined` |


## Events

| Event                        | Description | Type                |
| ---------------------------- | ----------- | ------------------- |
| `qwRoomBasketBackToRoomList` |             | `CustomEvent<void>` |


## Dependencies

### Depends on

- [qw-room-list-card](../qw-room-list/qw-room-list-card)

### Graph
```mermaid
graph TD;
  qw-room-basket --> qw-room-list-card
  qw-room-list-card --> qw-card
  qw-room-list-card --> qw-error
  qw-room-list-card --> qw-price
  qw-room-list-card --> qw-week-calendar
  qw-room-list-card --> qw-counter
  qw-price --> qw-loading
  style qw-room-basket fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
