# qw-room-list



<!-- Auto Generated Below -->


## Properties

| Property                               | Attribute                                   | Description | Type                                                                                             | Default                              |
| -------------------------------------- | ------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------ |
| `qwRoomListBaseInfoType`               | `qw-room-list-base-info-type`               |             | `QwRoomBaseInfoType.Inline \| QwRoomBaseInfoType.List`                                           | `QwRoomBaseInfoType.Inline`          |
| `qwRoomListCalendarType`               | `qw-room-list-calendar-type`                |             | `QwRoomListCalendarType.Default \| QwRoomListCalendarType.None \| QwRoomListCalendarType.WebSdk` | `QwRoomListCalendarType.Default`     |
| `qwRoomListExcludeRooms`               | `qw-room-list-exclude-rooms`                |             | `string`                                                                                         | `undefined`                          |
| `qwRoomListFilterRoomsWith`            | `qw-room-list-filter-rooms-with`            |             | `string`                                                                                         | `undefined`                          |
| `qwRoomListImageTransformationOptions` | `qw-room-list-image-transformation-options` |             | `string`                                                                                         | `undefined`                          |
| `qwRoomListOrder`                      | `qw-room-list-order`                        |             | `QwRoomListOrderType.AscendingPrice \| QwRoomListOrderType.DescendingPrice`                      | `QwRoomListOrderType.AscendingPrice` |
| `qwRoomListPlaceholders`               | `qw-room-list-placeholders`                 |             | `string`                                                                                         | `undefined`                          |
| `qwRoomListRateHighlight`              | `qw-room-list-rate-highlight`               |             | `string`                                                                                         | `undefined`                          |
| `qwRoomListRateListTitle`              | `qw-room-list-rate-list-title`              |             | `string`                                                                                         | `undefined`                          |
| `qwRoomListShowAvailabilityMessage`    | `qw-room-list-show-availability-message`    |             | `boolean`                                                                                        | `false`                              |
| `qwRoomListShowCarouselInCard`         | `qw-room-list-show-carousel-in-card`        |             | `boolean`                                                                                        | `false`                              |
| `qwRoomListShowCta`                    | `qw-room-list-show-cta`                     |             | `boolean`                                                                                        | `true`                               |
| `qwRoomListShowOnlyNames`              | `qw-room-list-show-only-names`              |             | `boolean`                                                                                        | `false`                              |
| `qwRoomListShowPrices`                 | `qw-room-list-show-prices`                  |             | `boolean`                                                                                        | `true`                               |
| `qwRoomListShowRates`                  | `qw-room-list-show-rates`                   |             | `boolean`                                                                                        | `false`                              |
| `qwRoomListType`                       | `qw-room-list-type`                         |             | `QwRoomListType.Card \| QwRoomListType.Grid \| QwRoomListType.Inline`                            | `QwRoomListType.Inline`              |


## Events

| Event                 | Description | Type                                                                |
| --------------------- | ----------- | ------------------------------------------------------------------- |
| `qwRoomListClickRoom` |             | `CustomEvent<{ type: QwRoomListCardButtonType; room: RoomModel; }>` |
| `qwRoomListOnLoad`    |             | `CustomEvent<{ session: SessionModel; listRooms: RoomModel[]; }>`   |


## Dependencies

### Depends on

- [qw-error](../shared/qw-error)
- [qw-room-list-card](qw-room-list-card)

### Graph
```mermaid
graph TD;
  qw-room-list --> qw-error
  qw-room-list --> qw-room-list-card
  qw-room-list-card --> qw-card
  qw-room-list-card --> qw-image
  qw-room-list-card --> qw-carousel
  qw-room-list-card --> qw-room-base-info
  qw-room-list-card --> qw-placeholder
  qw-room-list-card --> qw-price
  qw-room-list-card --> qw-error
  qw-room-list-card --> qw-week-calendar
  qw-room-list-card --> qw-price-calendar
  qw-room-list-card --> qw-room-rates
  qw-room-list-card --> qw-counter
  qw-carousel --> qw-image
  qw-price --> qw-loading
  qw-price-calendar --> qw-loading
  qw-room-rates --> qw-room-rate
  qw-room-rates --> qw-placeholder
  qw-room-rates --> qw-error
  qw-room-rate --> qw-counter
  qw-room-rate --> qw-image
  style qw-room-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
