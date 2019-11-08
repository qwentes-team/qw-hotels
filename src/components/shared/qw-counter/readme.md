# qw-counter



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute              | Description | Type     | Default     |
| ------------------- | ---------------------- | ----------- | -------- | ----------- |
| `qwCounterMaxValue` | `qw-counter-max-value` |             | `number` | `undefined` |
| `qwCounterName`     | `qw-counter-name`      |             | `string` | `undefined` |
| `qwCounterValue`    | `qw-counter-value`     |             | `number` | `0`         |


## Events

| Event                  | Description | Type                            |
| ---------------------- | ----------- | ------------------------------- |
| `qwCounterChangeValue` |             | `CustomEvent<QwCounterEmitter>` |


## Dependencies

### Used by

 - [qw-guest](../../qw-guest)
 - [qw-room-rate](../../qw-room-rate)

### Graph
```mermaid
graph TD;
  qw-guest --> qw-counter
  qw-room-rate --> qw-counter
  style qw-counter fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
