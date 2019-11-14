# qw-room-detail



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute           | Description | Type     | Default     |
| ---------------- | ------------------- | ----------- | -------- | ----------- |
| `qwRoomDetailId` | `qw-room-detail-id` |             | `string` | `undefined` |


## Events

| Event                            | Description | Type                                          |
| -------------------------------- | ----------- | --------------------------------------------- |
| `qwRoomDetailAddToBasketSuccess` |             | `CustomEvent<QwRoomDetailAddToBasketEmitter>` |


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
