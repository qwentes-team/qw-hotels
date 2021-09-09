# qw-room-notification



<!-- Auto Generated Below -->


## Properties

| Property                          | Attribute                              | Description | Type     | Default |
| --------------------------------- | -------------------------------------- | ----------- | -------- | ------- |
| `qwRoomNotificationShowPopupTime` | `qw-room-notification-show-popup-time` |             | `number` | `3000`  |


## Dependencies

### Depends on

- [qw-separator](../shared/qw-separator)
- [qw-image](../shared/qw-image)
- [qw-room-basket](../qw-room-basket)
- [qw-basket](../qw-basket)

### Graph
```mermaid
graph TD;
  qw-room-notification --> qw-separator
  qw-room-notification --> qw-image
  qw-room-notification --> qw-room-basket
  qw-room-notification --> qw-basket
  qw-room-basket --> qw-room-list-card
  qw-room-list-card --> qw-card
  qw-room-list-card --> qw-image
  qw-room-list-card --> qw-carousel
  qw-room-list-card --> qw-room-base-info
  qw-room-list-card --> qw-placeholder
  qw-room-list-card --> qw-price
  qw-room-list-card --> qw-error
  qw-room-list-card --> qw-week-calendar
  qw-room-list-card --> qw-price-calendar
  qw-room-list-card --> qw-room-rates
  qw-room-list-card --> qw-counter
  qw-carousel --> qw-image
  qw-price --> qw-loading
  qw-price-calendar --> qw-loading
  qw-room-rates --> qw-room-rate
  qw-room-rates --> qw-placeholder
  qw-room-rates --> qw-error
  qw-room-rate --> qw-counter
  qw-room-rate --> qw-image
  style qw-room-notification fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
