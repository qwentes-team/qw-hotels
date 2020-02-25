# qw-room-basket



<!-- Auto Generated Below -->


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
  qw-room-list-card --> qw-room-rate
  qw-room-list-card --> qw-error
  qw-room-list-card --> qw-card
  qw-room-list-card --> qw-room-base-info
  qw-room-list-card --> qw-price
  qw-room-list-card --> qw-week-calendar
  qw-room-list-card --> qw-room-rates
  qw-room-list-card --> qw-counter
  qw-room-rate --> qw-counter
  qw-price --> qw-loading
  qw-room-rates --> qw-room-rate
  style qw-room-basket fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
