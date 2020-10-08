import {Component, Host, h, State, Event, EventEmitter} from '@stencil/core';
import {BasketHelper, BasketService, BasketWithPrice$, SessionLoaded$, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-basket-room-counter',
  styleUrl: 'qw-basket-room-counter.css',
  shadow: false
})
export class QwBasketRoomCounter {
  @State() roomNumber: number;
  @Event() qwBasketRoomCounterNumber: EventEmitter<number>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap(BasketService.getBasket)).subscribe();

    BasketWithPrice$.subscribe(basket => {
      this.roomNumber = BasketHelper.getNumberOfRooms(basket);
      this.qwBasketRoomCounterNumber.emit(this.roomNumber);
    });
  }

  render() {
    return (
      <Host>
        {this.roomNumber || 0}
      </Host>
    );
  }
}
