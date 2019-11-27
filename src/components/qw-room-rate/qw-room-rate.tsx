import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';
import {
  BasketModel,
  BasketService,
  Rate,
  RateHelper,
  RateInformation,
  RateQualifierType,
  RoomModel,
  RoomSummaryType,
} from '@qwentes/booking-state-manager';
import {RoomOccupancy} from '@qwentes/booking-state-manager/src/feature/room/model/room.interface';

export interface QwRoomRateAddedToBasketEmitter {
  basket: BasketModel;
}

export interface QwRoomRateCounterChangedEmitter {
  quantity: number;
  rateId: string;
}

@Component({
  tag: 'qw-room-rate',
  styleUrl: 'qw-room-rate.css',
  shadow: false,
})
export class QwRoomRate {
  @Prop() qwRoomRateRate: Rate;
  @Prop() qwRoomRateIsLoading: boolean;
  @Prop() qwRoomRateIsDisabled: boolean;
  @Prop() qwRoomRateShowConditions: boolean;
  @Prop() qwRoomRateRoomId: RoomModel['roomId'];
  @Prop() qwRoomRateRoomBasketOccupancyText: RoomOccupancy['definition']['text'];
  @State() quantity: number = 0;
  @Event() qwRoomRateAddedToBasket: EventEmitter<QwRoomRateAddedToBasketEmitter>;
  @Event() qwRoomRateCounterChanged: EventEmitter<QwRoomRateCounterChangedEmitter>;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    this.quantity = event.detail.value;
    this.qwRoomRateCounterChanged.emit({quantity: this.quantity, rateId: this.qwRoomRateRate.rateId});
  }

  addToBasket = () => {
    const occupancyId = this.qwRoomRateRate.occupancyId !== undefined
      ? this.qwRoomRateRate.occupancyId
      : this.qwRoomRateRate.occupancy.occupancyId;

    this.qwRoomRateIsLoading = true;
    BasketService.setRoomInBasket({
      roomId: this.qwRoomRateRoomId,
      rateId: this.qwRoomRateRate.rateId,
      occupancyId,
      quantity: this.quantity,
    }).subscribe((basket) => {
      this.qwRoomRateIsLoading = false;
      this.qwRoomRateAddedToBasket.emit({basket});
    });
  };

  public hasBreakfast(qualifier: RateInformation['qualifier']) {
    return qualifier.value === RateQualifierType.BreakfastIncluded;
  }

  public getRateSummary() {
    const summary = this.qwRoomRateRate.description.summary.find(summary => summary.value === RoomSummaryType.PlainText);
    return summary && summary.text;
  }

  render() {
    return (
      <Host class={`
        ${this.qwRoomRateIsDisabled ? 'qw-room-rate__disabled' : ''}
        ${this.qwRoomRateIsLoading ? 'qw-room-rate__is-loading' : ''}
      `}>
        {this.qwRoomRateRate && <div class="qw-room-rate__title">
          <div class="qw-room-rate__title-name">{this.qwRoomRateRate.description.name}</div>
          <div
            class="qw-room-rate__availability">{this.qwRoomRateRate.availableQuantity - (this.qwRoomRateRate.selectedQuantity || 0)} available
          </div>
          <div class="qw-room-rate__occupancy">
            {this.qwRoomRateRate.occupancy
              ? this.qwRoomRateRate.occupancy.definition.text
              : this.qwRoomRateRoomBasketOccupancyText}
          </div>
        </div>}
        {this.qwRoomRateRate && <div class="qw-room-rate__price">
          {this.qwRoomRateRate.price ? this.qwRoomRateRate.price.totalPrice.converted.text : '--'}
          <div class="qw-room-rate__taxes">
            {this.qwRoomRateRate.taxes && RateHelper.getTaxesMessageFormatted(this.qwRoomRateRate.taxes, 1)}
          </div>
        </div>}

        {this.qwRoomRateRate && <qw-counter
          qwCounterId="qwRoomRateCounter"
          qwCounterName={this.qwRoomRateRate.description.name}
          qwCounterValue={this.qwRoomRateRate.selectedQuantity || 0}
          qwCounterMaxValue={this.qwRoomRateRate.availableQuantity}/>}

        {this.qwRoomRateRate && <QwButton
          QwButtonLabel="Add to cart"
          QwButtonDisabled={!this.quantity || this.quantity === this.qwRoomRateRate.selectedQuantity || this.qwRoomRateIsLoading}
          QwButtonOnClick={() => this.addToBasket()}/>}

        {this.qwRoomRateRate && <div class="qw-room-rate__conditions">
          {this.qwRoomRateRate.taxes.onSite.amount.text && <li class="qw-room-rate--stay-tax">
            {RateHelper.getOnSiteTaxesMessageFormatted(this.qwRoomRateRate)}
          </li>}
          <li class={this.hasBreakfast(this.qwRoomRateRate.description.qualifier) ? 'qw-room-rate--has-breakfast' : 'qw-room-rate--has-not-breakfast'}>
            {this.qwRoomRateRate.description.qualifier.text}
          </li>
          <li class="qw-room-rate--cancel-condition-name">{RateHelper.getDefaultCancelConditionName(this.qwRoomRateRate)}</li>

          {this.getRateSummary() && <div class="qw-room-rate__other-conditions">
            <div
              class="qw-room-rate__conditions-trigger"
              onClick={() => this.qwRoomRateShowConditions = !this.qwRoomRateShowConditions}>
              {this.qwRoomRateShowConditions ? '-' : '+'} View more
            </div>

            {this.qwRoomRateShowConditions && <div class="qw-room-rate__conditions-content">
              {<li>{this.getRateSummary()}</li>}
            </div>}
          </div>}
        </div>}
      </Host>
    );
  }
}
