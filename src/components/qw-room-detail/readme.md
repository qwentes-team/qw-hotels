# qw-room-detail



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                      | Description | Type     | Default     |
| -------------------------- | ------------------------------ | ----------- | -------- | ----------- |
| `qwRoomDetailAlertMessage` | `qw-room-detail-alert-message` |             | `string` | `undefined` |
| `qwRoomDetailId`           | `qw-room-detail-id`            |             | `string` | `undefined` |


## Events

| Event                            | Description | Type                                          |
| -------------------------------- | ----------- | --------------------------------------------- |
| `qwRoomDetailAddAnotherRoom`     |             | `CustomEvent<void>`                           |
| `qwRoomDetailAddToBasketSuccess` |             | `CustomEvent<QwRoomDetailAddToBasketEmitter>` |
| `qwRoomDetailProceed`            |             | `CustomEvent<void>`                           |


## Dependencies

### Depends on

- [qw-room-detail-card](qw-room-detail-card)

### Graph
```mermaid
graph TD;
  qw-room-detail --> qw-room-detail-card
  qw-room-detail-card --> qw-card
  qw-room-detail-card --> qw-room-base-info
  qw-room-detail-card --> qw-room-rate
  qw-room-rate --> qw-counter
  style qw-room-detail fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
