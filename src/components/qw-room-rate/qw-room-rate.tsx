import {Component, Event, EventEmitter, h, Host, Listen, Prop, State} from '@stencil/core';
import {QwButton} from '../shared/qw-button/qw-button';
import {QwCounterEmitter} from '../shared/qw-counter/qw-counter';
import {
  BasketHelper,
  BasketModel,
  BasketService,
  Language,
  Rate,
  RateHelper,
  RateInformation,
  RateQualifierType,
  RoomModel, RoomSummaryType,
  SessionHelper,
  SessionLoaded$,
  SessionService,
} from '@qwentes/booking-state-manager';
import {switchMap} from 'rxjs/operators';
import {QwCounterId, QwRoomListType} from '../../index';
import {QwWrapInDiv} from '../shared/qw-wrap-in-div/qw-wrap-in-div';

export interface QwRoomRateAddedToBasketEmitter {
  basket: BasketModel;
  roomId: RoomModel['roomId'];
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
  @Prop() qwRoomRateType: QwRoomListType = QwRoomListType.Inline;
  @Prop() qwRoomRateRate: Rate;
  @Prop() qwRoomRateIsLoading: boolean;
  @Prop() qwRoomRateIsAddingToBasket: boolean;
  @Prop() qwRoomRateIsDisabled: boolean;
  @Prop() qwRoomRateShowConditions: boolean;
  @Prop() qwRoomRateDefaultToOne: boolean = false;
  @Prop() qwRoomRateRoomId: RoomModel['roomId'];
  @Prop() qwRoomRateHighlight: RateInformation['code'];
  @State() quantity: number = 0;
  @State() numberOfGuests: number = 0;
  @State() numberOfRooms: number = 0;
  @State() adultCount: number = 0;
  @State() childCount: number = 0;
  @State() infantCount: number = 0;
  @Event() qwRoomRateAddedToBasket: EventEmitter<QwRoomRateAddedToBasketEmitter>;
  @Event() qwRoomRateCounterChanged: EventEmitter<QwRoomRateCounterChangedEmitter>;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    this.quantity = event.detail.value;
    this.qwRoomRateCounterChanged.emit({quantity: this.quantity, rateId: this.qwRoomRateRate.rateId});
  }

  public componentWillLoad() {
    this.qwRoomRateShowConditions = false;
    SessionService.getSession().subscribe();
    SessionLoaded$.pipe(
      switchMap(session => {
        this.numberOfGuests = SessionHelper.getTotalGuests(session);
        return BasketService.getBasket(session);
      }),
    ).subscribe(basket => this.numberOfRooms = BasketHelper.getNumberOfRooms(basket));
  }

  addToBasket = () => {
    this.qwRoomRateIsAddingToBasket = true;
    BasketService.setRoomInBasket({
      roomId: this.qwRoomRateRoomId,
      rateId: this.qwRoomRateRate.rateId,
      occupancyId: this.qwRoomRateRate.occupancy.occupancyId,
      quantity: this.qwRoomRateDefaultToOne ? 1 : this.quantity,
    }).subscribe((basket) => {
      this.qwRoomRateIsAddingToBasket = false;
      this.qwRoomRateAddedToBasket.emit({basket, roomId: this.qwRoomRateRoomId});
    });
  };

  public hasBreakfast(qualifier: RateInformation['qualifier']) {
    return qualifier.value === RateQualifierType.BreakfastIncluded;
  }

  private getSummaryType(summary, type) {
    return summary.find(s => s.value === type);
  }

  public getRateSummary() {
    const summary = this.qwRoomRateRate?.description.summary;
    if (this.getSummaryType( summary, RoomSummaryType.Html)) {
      const htmlSummary = this.getSummaryType( summary, RoomSummaryType.Html)?.text;
      return <div innerHTML={htmlSummary}></div>;
    } else {
      return this.getSummaryType( summary, RoomSummaryType.PlainText)?.text
    }
  }

  private getMaxValue(currentValue = 0) {
    const numberOfRoomsStillAddable = (this.numberOfGuests - this.numberOfRooms) + currentValue;
    return Math.min(this.qwRoomRateRate.availableQuantity, numberOfRoomsStillAddable);
  }

  private isAddToCartDisabled() {
    if (this.notAddedWithDefaultToOne()) {
      return false;
    }

    return !this.quantity
      || this.quantity === this.qwRoomRateRate.selectedQuantity
      || this.qwRoomRateIsLoading;
  }

  private notAddedWithDefaultToOne() {
    return this.qwRoomRateDefaultToOne && this.qwRoomRateRate.selectedQuantity !== 1;
  }

  private isCardType() {
    return this.qwRoomRateType === QwRoomListType.Card;
  }

  private isHighlight(code: RateInformation['code']) {
    return this.qwRoomRateHighlight === code;
  }

  private formatOccupancySegment(peopleCount: number) {
    return Array.from(Array(peopleCount))
  }

  private getOccupancy() {
    const occupancyValue = this.qwRoomRateRate.occupancy.definition.value;
    const hasDetailedOccupancy = occupancyValue.isDetailed;
    if (hasDetailedOccupancy) {
      const adults = this.formatOccupancySegment(occupancyValue.adultCount).map(() => <span class="adult"/>);
      const children = this.formatOccupancySegment(occupancyValue.childCount).map(() => <span class="child"/>);
      const infants = this.formatOccupancySegment(occupancyValue.infantCount).map(() => <span class="infant"/>);
      return Array(adults, children, infants);
    } else {
      return Array.from(Array(occupancyValue.personCount)).map(() => <span/>);
    }
  }

  render() {
    return (
      <Host class={`
        qw-room-rate__offer-id-${this.qwRoomRateRate.description.code}
        qw-room-rate--${this.qwRoomRateType}
        ${this.isHighlight(this.qwRoomRateRate?.description.code) ? 'qw-room-rate__highlight' : ''}
        ${this.qwRoomRateIsDisabled ? 'qw-room-rate__disabled' : ''}
        ${this.qwRoomRateIsLoading ? 'qw-room-rate__is-loading' : ''}
        ${this.qwRoomRateIsAddingToBasket ? 'qw-room-rate__is-adding-to-basket' : ''}
      `}>
        {this.qwRoomRateRate && <div class="qw-room-rate__title">
          <div class="qw-room-rate__title-name">{this.qwRoomRateRate.description.name}</div>
          <div class="qw-room-rate__occupancy">
            {this.getOccupancy()}
            <div class="occupancy__label">{Language.getTranslation('numberOfGuests')}</div>
          </div>
        </div>}
        {this.qwRoomRateRate && <div class="qw-room-rate__price">
          {this.qwRoomRateRate.price?.crossedOutPrice &&
          <div class="qw-room-rate__price-crossed">{this.qwRoomRateRate.price.crossedOutPrice.converted.text}</div>
          }
          {this.qwRoomRateRate.price ?
            <div class="qw-room-rate__price-active">{this.qwRoomRateRate.price.totalPrice.converted.text}</div>
            : '--'
          }
          <div class="qw-room-rate__taxes">
            {this.qwRoomRateRate.taxes && RateHelper.getTaxesMessageFormatted(this.qwRoomRateRate.taxes)}
          </div>
        </div>}

        <QwWrapInDiv wrapIt={this.isCardType()} wrapperClass="qw-room-rate__counter-add-to-basket">
          {!this.qwRoomRateDefaultToOne && <div class="qw-room-rate__counter">
            <div class="qw-room-rate__counter-label">{Language.getTranslation('numberOfRooms')}</div>
            {this.qwRoomRateRate && <qw-counter
              qwCounterId={QwCounterId.QwRoomRateCounter}
              qwCounterName={this.qwRoomRateRate.description.name}
              qwCounterValue={this.qwRoomRateRate.selectedQuantity || 0}
              qwCounterMaxValue={this.getMaxValue(this.qwRoomRateRate.selectedQuantity)}/>}
            <div class="qw-room-rate__counter-availability">
              {this.qwRoomRateRate.availableQuantity - (this.qwRoomRateRate.selectedQuantity || 0)} {Language.getTranslation('available')}
            </div>
          </div>}

          {this.qwRoomRateRate && <QwButton
            QwButtonClass="qw-button--primary qw-button--add-to-basket"
            QwButtonLabel={Language.getTranslation('addToCart')}
            QwButtonDisabled={this.isAddToCartDisabled()}
            QwButtonOnClick={() => this.addToBasket()}/>}
        </QwWrapInDiv>

        {this.qwRoomRateRate && this.qwRoomRateRate.taxes.onSite.amount.text && <ul class="qw-room-rate__conditions">
          {this.qwRoomRateRate.taxes.onSite.amount.text && <li class="qw-room-rate--stay-tax">
            {RateHelper.getOnSiteTaxesMessageFormatted(this.qwRoomRateRate)}
          </li>}
          <li
            class={this.hasBreakfast(this.qwRoomRateRate.description.qualifier) ? 'qw-room-rate--has-breakfast' : 'qw-room-rate--has-not-breakfast'}>
            {this.qwRoomRateRate.description.qualifier.text}
          </li>
          <li class="qw-room-rate--cancel-condition-name">{RateHelper.getDefaultCancelConditionName(this.qwRoomRateRate)}</li>

          <div class="qw-room-rate__other-conditions">
            <div
              class="qw-room-rate__conditions-trigger"
              onClick={() => this.qwRoomRateShowConditions = !this.qwRoomRateShowConditions}>
              {this.qwRoomRateShowConditions ? '-' : '+'} {Language.getTranslation('viewMore')}
            </div>

            {this.qwRoomRateShowConditions && <div class="qw-room-rate__conditions-content">
              {<li>{this.getRateSummary()}</li>}
            </div>}
          </div>
        </ul>}
      </Host>
    );
  }
}
