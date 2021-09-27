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
  @Event() trackingDataPayment: EventEmitter<any>;
  @Event() trackingDataRoomAddedToBasket: EventEmitter<any>;
  @Event() trackingDataExtraAddedToBasket: EventEmitter<any>;
  @Event() trackingDataRoomRemovedFromBasket: EventEmitter<any>;
  @Event() trackingDataExtraRemovedFromBasket: EventEmitter<any>;
  @Event() trackingDataSessionChanged: EventEmitter<any>;
  @Event() trackingDataCalendarChanged: EventEmitter<any>;




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
    let dataFromatted;

    console.log('basketChange')
    
    if(trackingData.type === 'Room') {
      dataFromatted = {
        id: trackingData.element.room.roomId,
        category: trackingData.type,
        name: trackingData.element.room.name,
        price: trackingData.element.room.occupancies[0].price.original.value.amount,
        currency: trackingData.basket.currency,
        quantity : trackingData.quantityChanged,
        rate: trackingData.element.room.occupancies[0].rateId,
        offerId: trackingData.element.room.occupancies[0].offerId,
      };
      if(trackingData.increase == false) {
        console.log('Tracking removed room from basket:', dataFromatted);
        this.trackingDataRoomAddedToBasket.emit(dataFromatted)
      } else {
        console.log(' Tracking added room basket:', dataFromatted);
        this.trackingDataRoomRemovedFromBasket.emit(dataFromatted)
      }
    } else if(trackingData.type === 'Extra') {
      let priceFromBasket = this.getPriceOnExtraCounter(trackingData.basket.hotelExtras, trackingData.element.extraId);

      let priceCheck = trackingData.element.extraPrice !== null  ? trackingData.element.extraPrice.original.value.amount : priceFromBasket.price.original.value.amount;
      dataFromatted = {
        id: trackingData.element.extraId,
        category: trackingData.type,
        name: trackingData.element.extraName,
        price: priceCheck,
        currency: trackingData.basket.currency,
        quantity : trackingData.quantityChanged,
      };
      if(trackingData.increase == false) {
        console.log(' Tracking removed extra from basket:', dataFromatted);
        this.trackingDataExtraRemovedFromBasket.emit(dataFromatted)
      } else {
        console.log(' Tracking added extra basket:', dataFromatted);
        this.trackingDataExtraAddedToBasket.emit(dataFromatted)
      }
    }
  }

  getPriceOnExtraCounter(array, value) {
    return array.find(obj => {
      return obj.extraId === value;
    })
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

  @Listen('qwSessionChangedTrackingData', {target: 'window'})
  trackingSessionChanged(data: CustomEvent<any>) {
    console.log('Tracking session changed:', data.detail);
    this.trackingDataSessionChanged.emit(data.detail)
  }

  @Listen('qwCalendarChangeTrackingData', {target: 'window'})
  trackingCalendarChanged(data: CustomEvent<any>) {
    console.log('Tracking calendar changed:', data.detail);
    this.trackingDataCalendarChanged.emit(data.detail)
  }

}
