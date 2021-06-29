# qw-room-detail



<!-- Auto Generated Below -->


## Properties

| Property                                 | Attribute                                     | Description | Type     | Default     |
| ---------------------------------------- | --------------------------------------------- | ----------- | -------- | ----------- |
| `qwRoomDetailId`                         | `qw-room-detail-id`                           |             | `string` | `undefined` |
| `qwRoomDetailImageTransformationOptions` | `qw-room-detail-image-transformation-options` |             | `string` | `undefined` |
| `qwRoomDetailRateHighlight`              | `qw-room-detail-rate-highlight`               |             | `string` | `undefined` |


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
  qw-room-detail-card --> qw-image
  qw-room-detail-card --> qw-room-base-info
  qw-room-detail-card --> qw-room-rates
  qw-room-rates --> qw-room-rate
  qw-room-rates --> qw-placeholder
  qw-room-rates --> qw-error
  qw-room-rate --> qw-counter
  qw-room-rate --> qw-image
  style qw-room-detail fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
