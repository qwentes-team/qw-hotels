# qw-book



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute                     | Description | Type     | Default     |
| ------------------------- | ----------------------------- | ----------- | -------- | ----------- |
| `qwBookErrorQuoteMessage` | `qw-book-error-quote-message` |             | `string` | `undefined` |


## Dependencies

### Depends on

- [qw-input](../shared/qw-input)
- [qw-extra](../qw-extra)
- [qw-textarea](../shared/qw-textarea)

### Graph
```mermaid
graph TD;
  qw-book --> qw-input
  qw-book --> qw-extra
  qw-book --> qw-textarea
  qw-extra --> qw-extra-card
  qw-extra-card --> qw-counter
  style qw-book fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
