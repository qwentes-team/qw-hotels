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
  @Event() trackingDataRoomAddedToBasket: EventEmitter<any>;
  @Event() trackingDataExtraAddedToBasket: EventEmitter<any>;
  @Event() trackingDataRoomRemovedFromBasket: EventEmitter<any>;
  @Event() trackingDataExtraRemovedFromBasket: EventEmitter<any>;




  @Listen('qwRoomListOnLoad', {target: 'window'})
  trackingEventRoomList(data: CustomEvent<any>) {
    console.log('Tracking event room list loaded', data.detail);
    this.trackingDataRoomList.emit(data)
  }

  @Listen('qwSessionLoaded', {target: 'window'})
  trackingEventProperty(data: CustomEvent<any>) {
    const session: SessionModel = data.detail;
    ConfigurationService.getConfigurationEngine(session.sessionId).subscribe((res) => {
      console.log('Tracking event Engine:',res);
      this.trackingDataProperty.emit(res)
    })

    ConfigurationService.getConfigurationPlugin(session.sessionId).subscribe((res) => {
      console.log('Tracking event Plugin:', res);
      this.trackingDataPlugin.emit(res)
    })
  }

  @Listen('qwMoreInformation', {target: 'window'})
  trackingEventMoreInfo(data: CustomEvent<any>) {
    console.log('Tracking event moreInfo:', data.detail);
    this.trackingDataRoomId.emit(data.detail)
  }

  @Listen('qwExtraDetails', {target: 'window'})
  trackingEventExtra(data: CustomEvent<any>) {
    console.log('Tracking event viewMore:', data.detail);
    this.trackingDataExtraId.emit(data.detail)
  }

  @Listen('qwViewRoom', {target: 'window'})
  trackingEventRateId(data: CustomEvent<any>) {
    console.log('Tracking event showRoom on offerList:', data.detail);
    this.trackingDataRateId.emit(data.detail)
  }

  @Listen('qwRoomAddedToBasket', {target: 'window'})
  trackingEventBasketAddRoom(data: CustomEvent<any>) {
    console.log('Tracking room added to basket:', data.detail);
    this.trackingDataRoomAddedToBasket.emit(data.detail)
  }

  @Listen('qwRoomRemovedFromBasket', {target: 'window'})
  trackingEventBasketRemoveRoom(data: CustomEvent<any>) {
    console.log('Tracking room removed from basket:', data.detail);
    this.trackingDataRoomRemovedFromBasket.emit(data.detail)
  }


  @Listen('qwExtraAddedToBasket', {target: 'window'})
  trackingEventBasketAddExtra(data: CustomEvent<any>) {
    console.log('Tracking extra added to basket:', data.detail);
    this.trackingDataExtraAddedToBasket.emit(data.detail)
  }


  @Listen('qwBasketChange', {target: 'window'})
  trackingEventBasketRemovedElement(data: CustomEvent<any>) {
    let trackingData = data.detail;
    if(trackingData.type === 'Room') {
      console.log('qwBasketChange ==> Tracking removed room basket:', data.detail);
      this.trackingDataRoomRemovedFromBasket.emit(data.detail)
    } else if(trackingData.type === 'Extra') {
      console.log('qwBasketChange ==> Tracking removed extra basket:', data.detail);
      this.trackingDataExtraRemovedFromBasket.emit(data.detail)
    }
  }

  @Listen('qwExtraRemovedFromBasket', {target: 'window'})
  trackingEventRemovedExtra(data: CustomEvent<any>) {
    console.log('Tracking extra removed from select/button:', data.detail);
    this.trackingDataExtraRemovedFromBasket.emit(data.detail)
  }

  @Listen('qwOnClickPayNow', {target: 'window'})
  trackingEventPayNow(data: CustomEvent<any>) {
    console.log('Tracking event pay:', data.detail);
    this.trackingDataPayment.emit(data.detail)
  }

}
