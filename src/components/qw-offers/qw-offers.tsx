import {Component, h, State, Host, Prop, Event, EventEmitter} from '@stencil/core';
import {
  Language,
  Rate,
  RateHelper,
  RoomLoaded$,
  RoomModel,
  RoomService,
  SessionLoaded$,
  SessionService,
} from '@qwentes/booking-state-manager';
import {first, switchMap} from 'rxjs/operators';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwRoomListType} from '../../index';

interface Offer extends Rate {
  roomId: RoomModel['roomId'];
}

export interface QwOfferClickEmitter {
  roomId: RoomModel['roomId'];
  rateId: Rate['rateId'];
}

@Component({
  tag: 'qw-offers',
  styleUrl: 'qw-offers.css',
  shadow: false
})
export class QwOffers {
  @Prop() qwOffersMax: number;
  @Prop() qwOffersType: QwRoomListType = QwRoomListType.Grid;
  @Prop() qwOffersImageTransformationOptions: string;
  @State() roomsFormatted: {[roomId: number]: RoomModel};
  @State() flatOffers: Offer[];
  @Event() qwOffersOfferClick: EventEmitter<QwOfferClickEmitter>;
  @Event() qwOffersOnLoad: EventEmitter<void>;

  public componentWillLoad() {
    SessionService.getSession().subscribe();

    SessionLoaded$.pipe(
      switchMap((session) => RoomService.getRooms(session.sessionId)),
    ).subscribe((rooms) => {
      this.roomsFormatted = rooms.reduce((acc, room) => ({...acc, [room.roomId]: room}), {});

      this.flatOffers = rooms
        .map(r => r.rates?.map(rate => ({...rate, roomId: r.roomId})) || [])
        .reduce((acc, val) => acc.concat(val), [])
        .sort(this.sortByPrice);

      if (this.qwOffersMax) {
        this.flatOffers = this.flatOffers.slice(0, this.qwOffersMax);
      }
    });

    RoomLoaded$.pipe(first()).subscribe(() => this.qwOffersOnLoad.emit());
  }

  private sortByPrice(a: Offer, b: Offer) {
    const priceA = a.price.totalPrice.converted.value.amount;
    const priceB = b.price.totalPrice.converted.value.amount;

    if (priceA > priceB) return 1;
    if (priceA < priceB) return -1;
    return 0;
  }

  public offerClick(e: QwOfferClickEmitter) {
    this.qwOffersOfferClick.emit(e);
  }

  render() {
    return (
      <Host class={`
        qw-offers--${this.qwOffersType}
        ${!this.flatOffers ? 'qw-offers--loading' : 'qw-offers--loaded'}
      `}>
        <div class="qw-offers__loading-wrapper">
          <slot name="qwOffersLoading"/>
        </div>
        <div class="qw-offers__wrapper">
          {this.flatOffers?.map(o => {
            return (
              <div class="qw-offers__offer">
                <h5 class="qw-offers__offer__caption">
                  {this.roomsFormatted[o.roomId].name} <qw-separator /> starting from <span class="qw-offers__offer__price">{o.price.totalPrice.converted.text}</span>
                </h5>
                <qw-image
                  qwImageTransformationOptions={this.qwOffersImageTransformationOptions ? JSON.parse(this.qwOffersImageTransformationOptions) : {}}
                  qwImageUrl={RateHelper.getCoverImage(o).url}
                  qwImageAlt={o.description.name} />
                <h3 class="qw-offers__offer__title">{o.description.name}</h3>
                <QwButton
                  QwButtonLabel={Language.getTranslation('bookNow')}
                  QwButtonOnClick={() => this.offerClick({roomId: o.roomId, rateId: o.rateId})}
                />
              </div>
            );
          })}
        </div>
      </Host>
    );
  }
}
