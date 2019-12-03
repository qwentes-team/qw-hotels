# qw-book-guest-detail



<!-- Auto Generated Below -->


## Properties

| Property                        | Attribute                 | Description | Type                     | Default     |
| ------------------------------- | ------------------------- | ----------- | ------------------------ | ----------- |
| `qwBookFormShowError`           | `qw-book-form-show-error` |             | `boolean`                | `undefined` |
| `qwBookGuestDetailTitleOptions` | --                        |             | `RoomMetadata<string>[]` | `[]`        |


## Events

| Event                         | Description | Type                           |
| ----------------------------- | ----------- | ------------------------------ |
| `qwBookGuestDetailChangeForm` |             | `CustomEvent<QuoteCreateBody>` |


## Dependencies

### Used by

 - [qw-book](..)

### Depends on

- [qw-input](../../shared/qw-input)

### Graph
```mermaid
graph TD;
  qw-book-guest-detail --> qw-input
  qw-book --> qw-book-guest-detail
  style qw-book-guest-detail fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
