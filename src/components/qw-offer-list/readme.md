# qw-offer-list



<!-- Auto Generated Below -->


## Properties

| Property                             | Attribute                                | Description | Type                                                                  | Default                 |
| ------------------------------------ | ---------------------------------------- | ----------- | --------------------------------------------------------------------- | ----------------------- |
| `qwOfferListType`                    | `qw-offer-list-type`                     |             | `QwRoomListType.Card \| QwRoomListType.Grid \| QwRoomListType.Inline` | `QwRoomListType.Inline` |
| `qwOffersImageTransformationOptions` | `qw-offers-image-transformation-options` |             | `string`                                                              | `undefined`             |


## Dependencies

### Depends on

- [qw-image](../shared/qw-image)
- [qw-room-rate](../qw-room-rate)

### Graph
```mermaid
graph TD;
  qw-offer-list --> qw-image
  qw-offer-list --> qw-room-rate
  qw-room-rate --> qw-counter
  style qw-offer-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
