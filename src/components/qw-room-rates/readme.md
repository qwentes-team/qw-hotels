# qw-room-rates



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                        | Description | Type                                                                  | Default                 |
| --------------------------- | -------------------------------- | ----------- | --------------------------------------------------------------------- | ----------------------- |
| `qwRoomRatesForceRoomsCall` | `qw-room-rates-force-rooms-call` |             | `boolean`                                                             | `undefined`             |
| `qwRoomRatesPlaceholders`   | `qw-room-rates-placeholders`     |             | `string`                                                              | `undefined`             |
| `qwRoomRatesRateHighlight`  | `qw-room-rates-rate-highlight`   |             | `string`                                                              | `undefined`             |
| `qwRoomRatesRoomId`         | `qw-room-rates-room-id`          |             | `number`                                                              | `undefined`             |
| `qwRoomRatesType`           | `qw-room-rates-type`             |             | `QwRoomListType.Card \| QwRoomListType.Grid \| QwRoomListType.Inline` | `QwRoomListType.Inline` |


## Dependencies

### Used by

 - [qw-room-detail-card](../qw-room-detail/qw-room-detail-card)
 - [qw-room-list-card](../qw-room-list/qw-room-list-card)

### Depends on

- [qw-room-rate](../qw-room-rate)
- [qw-placeholder](../shared/qw-placeholder)
- [qw-error](../shared/qw-error)

### Graph
```mermaid
graph TD;
  qw-room-rates --> qw-room-rate
  qw-room-rates --> qw-placeholder
  qw-room-rates --> qw-error
  qw-room-rate --> qw-counter
  qw-room-rate --> qw-image
  qw-room-detail-card --> qw-room-rates
  qw-room-list-card --> qw-room-rates
  style qw-room-rates fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
