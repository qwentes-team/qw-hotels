# qw-extra



<!-- Auto Generated Below -->


## Events

| Event                      | Description | Type                  |
| -------------------------- | ----------- | --------------------- |
| `basketHotelExtraQuantity` |             | `CustomEvent<number>` |
| `basketRoomExtraLoaded`    |             | `CustomEvent<void>`   |
| `hotelExtraQuantity`       |             | `CustomEvent<number>` |
| `noRoomExtraLoaded`        |             | `CustomEvent<void>`   |


## Dependencies

### Used by

 - [qw-book](../qw-book)

### Depends on

- [qw-extra-card](qw-extra-card)

### Graph
```mermaid
graph TD;
  qw-extra --> qw-extra-card
  qw-extra-card --> qw-image
  qw-book --> qw-extra
  style qw-extra fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
