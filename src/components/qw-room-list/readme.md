# qw-room-list



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                     | Description | Type      | Default |
| ------------------------- | ----------------------------- | ----------- | --------- | ------- |
| `QwRoomListTriggerBasket` | `qw-room-list-trigger-basket` |             | `boolean` | `false` |


## Dependencies

### Depends on

- [qw-room-card](qw-room-list-card)
- [qw-week-calendar](../qw-week-calendar)

### Graph
```mermaid
graph TD;
  qw-room-list --> qw-room-card
  qw-room-list --> qw-week-calendar
  qw-room-card --> qw-card
  qw-room-card --> qw-loading
  qw-week-calendar --> qw-loading
  style qw-room-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
