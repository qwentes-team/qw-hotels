# qw-week-calendar



<!-- Auto Generated Below -->


## Properties

| Property                         | Attribute                           | Description | Type                                    | Default     |
| -------------------------------- | ----------------------------------- | ----------- | --------------------------------------- | ----------- |
| `qwWeekCalendarPricesByRoom`     | --                                  |             | `{ [dateString: string]: MoneyPrice; }` | `{}`        |
| `qwWeekCalendarRangeDate`        | --                                  |             | `Date[]`                                | `undefined` |
| `qwWeekCalendarRangeDateSession` | --                                  |             | `Date[]`                                | `undefined` |
| `qwWeekCalendarSelectedRoomId`   | `qw-week-calendar-selected-room-id` |             | `number`                                | `undefined` |


## Dependencies

### Used by

 - [qw-room-list-card](../qw-room-list/qw-room-list-card)

### Graph
```mermaid
graph TD;
  qw-room-list-card --> qw-week-calendar
  style qw-week-calendar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
