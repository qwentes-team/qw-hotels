import {Component, Host, h, State} from '@stencil/core';
import {BasketHelper, BasketQuery, BasketService, SessionLoaded$, SessionService} from 'booking-state-manager';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-basket-room-counter',
  styleUrl: 'qw-basket-room-counter.css',
  shadow: false
})
export class QwBasketRoomCounter {
  @State() roomNumber: number;

  public componentDidLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(switchMap(BasketService.getBasket)).subscribe();

    BasketQuery.select().subscribe(basket => {
      this.roomNumber = BasketHelper.getNumberOfRooms(basket);
    });
  }

  render() {
    return (
      <Host>
        {this.roomNumber}
      </Host>
    );
  }
}
