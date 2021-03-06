import {Component, Host, h, Listen, State, Prop} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketService, BasketWithPrice$,
  Language, RoomBasketModel, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwRoomRateAddedToBasketEmitter} from '../qw-room-rate/qw-room-rate';

const POPUP_CLASS = 'qw-room-notification__popup';

@Component({
  tag: 'qw-room-notification',
  styleUrl: 'qw-room-notification.css',
  shadow: false
})
export class QwRoomNotification {
  @Prop() qwRoomNotificationShowPopupTime: number = 3000;
  @State() isLoading: boolean;
  @State() numberOfRooms: number;
  @State() lastAddedRoom: RoomBasketModel;

  public popupElement: HTMLElement;

  public componentWillLoad() {
    SessionService.getSession().subscribe();
    SessionLoaded$
      .pipe(switchMap((session) => BasketService.getBasket(session)))
      .subscribe();

    BasketWithPrice$.subscribe(basket => {
      this.numberOfRooms = BasketHelper.getNumberOfRooms(basket);
    });
    BasketIsLoading$.subscribe(isLoading => this.isLoading = isLoading);
  }

  public componentDidLoad() {
    this.popupElement = document.querySelector(`.${POPUP_CLASS}`);
  }

  @Listen('qwRoomRateAddedToBasket', { target: 'window' })
  public qwRoomRateAddedToBasket(event: CustomEvent<QwRoomRateAddedToBasketEmitter>) {
    this.lastAddedRoom = event.detail.basket.rooms.find(r => r.roomId === event.detail.roomId);
    const showPopupClass = `${POPUP_CLASS}--show`;
    const foregroundPopupClass = `${POPUP_CLASS}--foreground`;
    this.popupElement.classList.add(foregroundPopupClass);
    setTimeout(() => this.popupElement.classList.add(showPopupClass), 100);
    setTimeout(() => {
      this.popupElement.classList.remove(showPopupClass);
      setTimeout(() => this.popupElement.classList.remove(foregroundPopupClass), 1000);
    }, this.qwRoomNotificationShowPopupTime);
  }

  render() {
    return (
      <Host>
        <div class="qw-room-notification__box">
          <div class="qw-room-notification__box__label">Accommodation</div>
          {this.numberOfRooms
            ? `${this.numberOfRooms} ${Language.getTranslation(this.numberOfRooms === 1 ? 'room' : 'rooms')}`
            : <qw-separator />
          }
        </div>
        <div class={POPUP_CLASS}>
          <h4 class="qw-room-notification__popup__title">{Language.getTranslation('addedToYourCart')}</h4>
          {this.lastAddedRoom && <div class="qw-room-notification__popup__last-added">
            <qw-image
              qwImageTransformationOptions={{width: 80, height: 60}}
              qwImageAlt={this.lastAddedRoom.name}
              qwImageUrl={BasketHelper.getRoomCoverImage(this.lastAddedRoom).url}/>
            <h4 class="qw-room-notification__popup__last-added__title">{this.lastAddedRoom.name}</h4>
            <div class="qw-room-notification__popup__last-added__price">
              {this.lastAddedRoom.occupancies[BasketHelper.getFirstOccupancyIdInBasketRoom(this.lastAddedRoom)].price.converted.text}
            </div>
          </div>}
          <hr />
          <h4 class="qw-room-notification__popup__title">{Language.getTranslation('yourRooms')}</h4>
          <qw-room-basket qwRoomBasketHasImage={false} />
          <div class="qw-room-notification__popup__total">{Language.getTranslation('subtotal')}: <qw-basket /></div>
        </div>
      </Host>
    );
  }
}
