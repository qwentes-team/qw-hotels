# qw-room-list



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                        | Description | Type                                                                        | Default                              |
| --------------------------- | -------------------------------- | ----------- | --------------------------------------------------------------------------- | ------------------------------------ |
| `qwRoomListFilterRoomsWith` | `qw-room-list-filter-rooms-with` |             | `string`                                                                    | `undefined`                          |
| `qwRoomListOrder`           | `qw-room-list-order`             |             | `QwRoomListOrderType.AscendingPrice \| QwRoomListOrderType.DescendingPrice` | `QwRoomListOrderType.AscendingPrice` |
| `qwRoomListPlaceholders`    | `qw-room-list-placeholders`      |             | `string`                                                                    | `undefined`                          |
| `qwRoomListShowCta`         | `qw-room-list-show-cta`          |             | `boolean`                                                                   | `true`                               |
| `qwRoomListShowPrices`      | `qw-room-list-show-prices`       |             | `boolean`                                                                   | `true`                               |
| `qwRoomListShowRates`       | `qw-room-list-show-rates`        |             | `boolean`                                                                   | `false`                              |
| `qwRoomListType`            | `qw-room-list-type`              |             | `QwRoomListType.Card \| QwRoomListType.Grid \| QwRoomListType.Inline`       | `QwRoomListType.Inline`              |


## Events

| Event                 | Description | Type                                                                |
| --------------------- | ----------- | ------------------------------------------------------------------- |
| `qwRoomListClickRoom` |             | `CustomEvent<{ type: QwRoomListCardButtonType; room: RoomModel; }>` |


## Dependencies

### Depends on

- [qw-room-list-card](qw-room-list-card)

### Graph
```mermaid
graph TD;
  qw-room-list --> qw-room-list-card
  qw-room-list-card --> qw-card
  qw-room-list-card --> qw-image
  qw-room-list-card --> qw-room-base-info
  qw-room-list-card --> qw-price
  qw-room-list-card --> qw-week-calendar
  qw-room-list-card --> qw-room-rates
  qw-room-list-card --> qw-counter
  qw-price --> qw-loading
  qw-room-rates --> qw-room-rate
  qw-room-rates --> qw-error
  qw-room-rate --> qw-counter
  style qw-room-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
