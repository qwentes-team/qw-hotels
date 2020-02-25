import {Component, h, Host, Listen, Prop, State} from '@stencil/core';
import {Rate, RoomModel} from '@qwentes/booking-state-manager';
import {QwRoomRateCounterChangedEmitter} from '../qw-room-rate/qw-room-rate';
import {QwRoomListType} from '../../index';

@Component({
  tag: 'qw-room-rates',
  styleUrl: 'qw-room-rates.css',
  shadow: false
})
export class QwRoomRates {
  @Prop() qwRoomRatesType: QwRoomListType = QwRoomListType.Inline;
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
    return (
      <Host class={`qw-room-rates--${this.qwRoomRatesType}`}>
        <div class="qw-room-rates__wrapper">
          {this.qwRoomRatesRates.map(r => {
            return <qw-room-rate
              qwRoomRateRoomId={this.qwRoomRatesRoomId}
              qwRoomRateRate={r}
              qwRoomRateType={this.qwRoomRatesType}
              qwRoomRateIsDisabled={this.isRateDisabled(r.rateId)}
              qwRoomRateShowConditions={this.qwRoomRatesRates.length === 1}/>
          })}
        </div>
      </Host>
    )
  }
}
