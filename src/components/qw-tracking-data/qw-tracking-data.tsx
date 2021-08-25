import { Component, Listen, Event, EventEmitter } from '@stencil/core';
import { ConfigurationService, SessionModel } from '@qwentes/booking-state-manager';

@Component({
  tag: 'qw-tracking-data',
  styleUrl: 'qw-tracking-data.css',
  shadow: true,
})
export class QwTrackingData {
  @Event() trackingDataRoomList: EventEmitter<any>;
  @Event() trackingDataProperty: EventEmitter<any>;
  @Event() trackingDataPlugin: EventEmitter<any>;
  @Event() trackingDataRoomId: EventEmitter<any>;
  @Event() trackingDataExtraId: EventEmitter<any>;
  @Event() trackingDataRateId: EventEmitter<any>;
  @Event() trackingDataBasket: EventEmitter<any>;
  @Event() trackingDataPayment: EventEmitter<any>;




  @Listen('qwRoomListOnLoad', {target: 'window'})
  trackingEventRoomList(data: CustomEvent<any>) {
    // console.log('Tracking event', data.detail);
    this.trackingDataRoomList.emit(data)
  }

  @Listen('qwSessionLoaded', {target: 'window'})
  trackingEventProperty(data: CustomEvent<any>) {
    const session: SessionModel = data.detail;
    ConfigurationService.getConfigurationEngine(session.sessionId).subscribe((res) => {
      // console.log('tracking event Engine:',res);
      this.trackingDataProperty.emit(res)
    })

    ConfigurationService.getConfigurationPlugin(session.sessionId).subscribe((res) => {
      // console.log('tracking event Plugin:', res);
      this.trackingDataPlugin.emit(res)
    })
  }

  @Listen('qwMoreInformation', {target: 'window'})
  trackingEventMoreInfo(data: CustomEvent<any>) {
    // console.log('Tracking event moreInfo:', data.detail);
    this.trackingDataRoomId.emit(data.detail)
  }

  @Listen('qwExtraDetails', {target: 'window'})
  trackingEventExtra(data: CustomEvent<any>) {
    // console.log('Tracking event viewMore:', data.detail);
    this.trackingDataExtraId.emit(data.detail)
  }

  @Listen('qwViewRoom', {target: 'window'})
  trackingEventRateId(data: CustomEvent<any>) {
    // console.log('Tracking event viewRoom:', data.detail);
    this.trackingDataRateId.emit(data.detail)
  }
  @Listen('qwBasketChange', {target: 'window'})
  trackingEventBasketChange(data: CustomEvent<any>) {
    // console.log('Tracking event basket:', data.detail);
    this.trackingDataBasket.emit(data.detail)
  }

  @Listen('qwOnClickPayNow', {target: 'window'})
  trackingEventPayNow(data: CustomEvent<any>) {
    // console.log('Tracking event pay:', data.detail);
    this.trackingDataPayment.emit(data.detail)
  }

}
