import {Component, h, Host, Listen, Prop, State} from '@stencil/core';
import {
  BasketHelper, BasketIsLoading$, BasketWithPrice$,
  createRateFromRoomBasketOccupancy, Language, Rate,
  RoomBasketModel, RoomIsLoading$, RoomLoaded$, RoomModel,
} from '@qwentes/booking-state-manager';
import {QwRoomRateCounterChangedEmitter} from '../qw-room-rate/qw-room-rate';
import {QwRoomListType} from '../../index';
import {switchMap} from 'rxjs/operators';

@Component({
  tag: 'qw-room-rates',
  styleUrl: 'qw-room-rates.css',
  shadow: false
})
export class QwRoomRates {
  @Prop() qwRoomRatesType: QwRoomListType = QwRoomListType.Inline;
  @Prop() qwRoomRatesRates: Rate[] = [];
  @Prop() qwRoomRatesRoomId: RoomModel['roomId'];
  @State() mergedRates: Rate[] = [];
  @State() basketRooms: RoomBasketModel[] = [];
  @State() qwRoomRatesActiveRate: Rate['rateId'];
  @State() basketIsLoading: boolean;
  @State() roomIsLoading: boolean;

  public componentWillLoad() {
    BasketWithPrice$.pipe(
      switchMap(basket => {
        this.basketRooms = basket.rooms;
        return RoomLoaded$;
      })
    ).subscribe((rooms) => this.mergedRates = this.mergeRatesAndBasketRoomRate(rooms));

    BasketIsLoading$.subscribe(isLoading => this.basketIsLoading = isLoading);
    RoomIsLoading$.subscribe(isLoading => this.roomIsLoading = isLoading);
  }

  private getBasketRoom() {
    return this.basketRooms.find(r => r.roomId === this.qwRoomRatesRoomId);
  }

  private getBasketRoomRate() {
    const basketRoom = this.getBasketRoom();
    const occupancyId = basketRoom && BasketHelper.getFirstOccupancyIdInBasketRoom(basketRoom);
    return basketRoom && createRateFromRoomBasketOccupancy(basketRoom.occupancies[occupancyId]);
  }

  private mergeRatesAndBasketRoomRate(rooms: RoomModel[]) {
    const rates = rooms.find(room => room.roomId === this.qwRoomRatesRoomId).rates || [];
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
    return !this.basketIsLoading && !this.roomIsLoading && !this.mergedRates.length;
  }

  render() {
    return (
      <Host class={`qw-room-rates--${this.qwRoomRatesType}`}>
        <div class="qw-room-rates__wrapper">
          {this.mergedRates.map(r => {
            return <qw-room-rate
              qwRoomRateRoomId={this.qwRoomRatesRoomId}
              qwRoomRateRate={r}
              qwRoomRateType={this.qwRoomRatesType}
              qwRoomRateIsDisabled={this.isRateDisabled(r.rateId)}
              qwRoomRateShowConditions={this.mergedRates.length === 1}/>
          })}
        </div>

        {this.isRateError()
          ? <qw-error>{Language.getTranslation('roomListCardErrorMessage')}</qw-error>
          : ''
        }
      </Host>
    )
  }
}
