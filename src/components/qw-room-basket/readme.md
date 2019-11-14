# qw-room-basket



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute                         | Description | Type  | Default     |
| ----------------------------- | --------------------------------- | ----------- | ----- | ----------- |
| `qwRoomBasketShowDescription` | `qw-room-basket-show-description` |             | `any` | `undefined` |


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
  qw-price --> qw-loading
  style qw-room-basket fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
