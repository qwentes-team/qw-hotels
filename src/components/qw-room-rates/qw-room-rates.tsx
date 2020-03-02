import {Component, h, Host, Listen, Prop, State, Watch} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketService, BasketWithPrice$,
  createRateFromRoomBasketOccupancy, Language, Rate,
  RoomBasketModel, RoomIsLoading$, RoomLoaded$, RoomModel, RoomService, SessionLoaded$, SessionService,
} from '@qwentes/booking-state-manager';
import {QwRoomRateCounterChangedEmitter} from '../qw-room-rate/qw-room-rate';
import {QwRoomListType} from '../../index';
import {switchMap} from 'rxjs/operators';
import {of, zip} from 'rxjs';

@Component({
  tag: 'qw-room-rates',
  styleUrl: 'qw-room-rates.css',
  shadow: false,
})
export class QwRoomRates {
  @Prop() qwRoomRatesType: QwRoomListType = QwRoomListType.Inline;
  @Prop() qwRoomRatesRoomId: RoomModel['roomId'];
  @Prop() qwRoomRatesForceRoomsCall: boolean;
  @Prop() qwRoomRatesPlaceholders: string;
  @State() firstLoad: boolean = false;
  @State() mergedRates: Rate[];
  @State() rooms: RoomModel[];
  @State() basketRooms: RoomBasketModel[] = [];
  @State() qwRoomRatesActiveRate: Rate['rateId'];
  @State() basketIsLoading: boolean;
  @State() roomIsLoading: boolean;

  public componentWillLoad() {
    if (this.qwRoomRatesForceRoomsCall) {
      SessionService.getSession().subscribe();
      SessionLoaded$
        .pipe(switchMap(session => zip(of(session), BasketService.getBasket(session))))
        .pipe(switchMap(([session]) => RoomService.getRooms(session.sessionId)))
        .subscribe();
    }

    BasketWithPrice$.pipe(
      switchMap(basket => {
        this.basketRooms = basket.rooms;
        return RoomLoaded$;
      }),
    ).subscribe((rooms) => {
      this.rooms = rooms;
      this.mergedRates = this.mergeRatesAndBasketRoomRate();
      this.firstLoad = true;
    });

    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    RoomIsLoading$.subscribe(isLoading => this.roomIsLoading = isLoading);
  }

  @Watch('qwRoomRatesRoomId')
  watchHandler(newValue: RoomModel['roomId'], oldValue: RoomModel['roomId']) {
    if (oldValue && newValue !== oldValue) {
      this.mergedRates = this.mergeRatesAndBasketRoomRate();
    }
  }

  private getBasketRoom() {
    return this.basketRooms.find(r => r.roomId === this.qwRoomRatesRoomId);
  }

  private getBasketRoomRate() {
    const basketRoom = this.getBasketRoom();
    const occupancyId = basketRoom && BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
    return basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[occupancyId]);
  }

  private mergeRatesAndBasketRoomRate() {
    const rates = this.rooms.find(room => room.roomId === this.qwRoomRatesRoomId)?.rates || [];
    const basketRoomRate = this.getBasketRoomRate();
    return basketRoomRate ? [basketRoomRate, ...rates] : rates;
  }

  @Listen('qwRoomRateCounterChanged')
  public rateChanged(e: CustomEvent<QwRoomRateCounterChangedEmitter>) {
    this.qwRoomRatesActiveRate = e.detail.quantity && e.detail.rateId;
  }

  private isRateDisabled(rateId) {
    if (!this.qwRoomRatesActiveRate) {
      return false;
    }

    return this.qwRoomRatesActiveRate !== rateId;
  }

  private isRateError() {
    return !this.basketIsLoading && !this.roomIsLoading && !this.mergedRates.length && this.firstLoad;
  }

  render() {
    return (
      <Host class={`qw-room-rates--${this.qwRoomRatesType}`}>
        <div class="qw-room-rates__wrapper">
          {this.mergedRates?.map(r => {
            return <qw-room-rate
              qwRoomRateRoomId={this.qwRoomRatesRoomId}
              qwRoomRateRate={r}
              qwRoomRateType={this.qwRoomRatesType}
              qwRoomRateIsDisabled={this.isRateDisabled(r.rateId)}
              qwRoomRateShowConditions={this.mergedRates.length === 1}/>;
          })}
        </div>

        {!this.firstLoad && this.qwRoomRatesPlaceholders
          ? <div class="qw-placeholder__wrapper">
              {Array(parseInt(this.qwRoomRatesPlaceholders)).fill(null).map(() => {
                return <div class={`qw-placeholder qw-placeholder--${this.qwRoomRatesType}`}/>
              })}
            </div>
          : this.isRateError()
            ? <qw-error>{Language.getTranslation('roomListCardErrorMessage')}</qw-error>
            : ''
        }
      </Host>
    );
  }
}
