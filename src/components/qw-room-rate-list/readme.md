# qw-room-rate-list



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute                          | Description | Type      | Default     |
| ---------------------------- | ---------------------------------- | ----------- | --------- | ----------- |
| `qwRoomRateListDefaultToOne` | `qw-room-rate-list-default-to-one` |             | `boolean` | `false`     |
| `qwRoomRateListId`           | `qw-room-rate-list-id`             |             | `string`  | `undefined` |


## Events

| Event                          | Description | Type                |
| ------------------------------ | ----------- | ------------------- |
| `qwRoomRateListAddAnotherRoom` |             | `CustomEvent<void>` |
| `qwRoomRateListProceed`        |             | `CustomEvent<void>` |


## Dependencies

### Depends on

- [qw-room-rate](../qw-room-rate)
- [qw-counter](../shared/qw-counter)

### Graph
```mermaid
graph TD;
  qw-room-rate-list --> qw-room-rate
  qw-room-rate-list --> qw-counter
  qw-room-rate --> qw-counter
  qw-room-rate --> qw-image
  style qw-room-rate-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
