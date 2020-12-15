import {Component, Host, h, State, Prop} from '@stencil/core';
import {Rate, RateHelper, RoomModel, RoomService, SessionLoaded$, SessionModel, SessionService} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwRoomListType} from '../../index';

@Component({
  tag: 'qw-offer-list',
  styleUrl: 'qw-offer-list.css',
  shadow: false,
})
export class QwOfferList {
  @State() rooms: RoomModel[] = [];
  @State() session: SessionModel;
  @State() offers: Rate[];
  @State() isLoading: boolean = true;
  @Prop() qwOffersImageTransformationOptions: string;
  @Prop() qwOfferListType: QwRoomListType = QwRoomListType.Inline;

  public componentWillLoad() {
    // GET SESSION AND ROOMS
    SessionService.getSession().subscribe();

    SessionLoaded$.pipe(
      switchMap((session) => RoomService.getRooms(session.sessionId)),
    ).subscribe((rooms) => {
      this.rooms = rooms;
      const flatRates = this.flatRoomRates(this.getRoomRates());
      this.offers = this.getPossibleOffers(flatRates);
      this.isLoading = false;
    });
  }

  private getRoomRates() {
    return this.rooms.map(room => {
      return room.rates;
    });
  }

  private flatRoomRates(roomRates) {
    return roomRates.reduce((acc, val) => {
      return acc.concat(val);
    }, []);
  }

  private getPossibleOffers(flatRates) {
    return flatRates.reduce((acc, rate) => {
      if (rate !== undefined) {
        return acc.some(r => r.description.code === rate.description.code)
          ? acc
          : [...acc, rate];
      }
      return acc
    }, []);
  }

  private hasRoomOffer(room, offerCode) {
    return room.rates ? !!room.rates.find(rate => rate.description.code === offerCode) : false
  }

  render() {
    return (
      <Host>
        {this.isLoading && <slot>Loading offers...</slot>}
        {this.offers?.map(o => {
          return <div class="qw-offer-list__card-wrapper">
            <div class="qw-offer-list__offer">
              <h4>{o.description.name}</h4>
              <qw-image
                qwImageTransformationOptions={this.qwOffersImageTransformationOptions ? JSON.parse(this.qwOffersImageTransformationOptions) : {}}
                qwImageUrl={RateHelper.getCoverImage(o).url}
                qwImageAlt={o.description.name}/>
            </div>
            <div class={`
            qw-offer-list__room-wrapper
            qw-offer-list--${this.qwOfferListType}`}>
              {this.rooms?.map(room => {
                return this.hasRoomOffer(room, o.description.code) && <div class="qw-offer-list__room">
                  <h4 class="room__name">{room.name}</h4>
                  <div class="room__rate-wrapper">{room.rates.map(r => {
                    if (r && (r.description.code === o.description.code)) {
                      return r && (r.description.code === o.description.code) && <qw-room-rate
                        qwRoomRateType={this.qwOfferListType}
                        qwRoomRateRoomId={room.roomId}
                        qwRoomRateRate={r}
                        qwRoomRateShowConditions={true}/>;
                    }
                  })}</div>
                </div>;
              })}
            </div>
          </div>;
        })}
      </Host>
    );
  }

}
