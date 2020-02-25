import {Component, h, Listen, Prop, State} from '@stencil/core';
import {Rate, RoomModel} from '@qwentes/booking-state-manager';
import {QwRoomRateCounterChangedEmitter} from '../qw-room-rate/qw-room-rate';

@Component({
  tag: 'qw-room-rates',
  styleUrl: 'qw-room-rates.css',
  shadow: false
})
export class QwRoomRates {
  @Prop() qwRoomRatesRates: Rate[] = [];
  @Prop() qwRoomRatesRoomId: RoomModel['roomId'];
  @State() qwRoomRatesActiveRate: Rate['rateId'];

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

  render() {
    return this.qwRoomRatesRates.map(r => {
      return <qw-room-rate
        qwRoomRateRoomId={this.qwRoomRatesRoomId}
        qwRoomRateRate={r}
        qwRoomRateIsDisabled={this.isRateDisabled(r.rateId)}
        qwRoomRateShowConditions={this.qwRoomRatesRates.length === 1}/>
    });
  }
}
