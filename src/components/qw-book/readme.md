# qw-book



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                     | Description | Type     | Default     |
| ------------------------- | ----------------------------- | ----------- | -------- | ----------- |
| `qwBookErrorQuoteMessage` | `qw-book-error-quote-message` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [qw-book-guest-detail](qw-book-guest-detail)
- [qw-extra](../qw-extra)
- [qw-textarea](../shared/qw-textarea)
- [qw-input](../shared/qw-input)

### Graph
```mermaid
graph TD;
  qw-book --> qw-book-guest-detail
  qw-book --> qw-extra
  qw-book --> qw-textarea
  qw-book --> qw-input
  qw-book-guest-detail --> qw-input
  qw-extra --> qw-extra-card
  qw-extra-card --> qw-counter
  style qw-book fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
