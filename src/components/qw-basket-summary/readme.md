# qw-basket-summary



<!-- Auto Generated Below -->


## Events

| Event                       | Description | Type                                               |
| --------------------------- | ----------- | -------------------------------------------------- |
| `qwBasketChange`            |             | `CustomEvent<BasketModel>`                         |
| `removeInsuranceAcceptance` |             | `CustomEvent<{ insurance: any; amount: number; }>` |


## Dependencies

### Depends on

- [qw-counter](../shared/qw-counter)

### Graph
```mermaid
graph TD;
  qw-basket-summary --> qw-counter
  style qw-basket-summary fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
