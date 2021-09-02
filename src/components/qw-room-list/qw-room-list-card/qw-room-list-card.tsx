import {Component, EventEmitter, h, Host, Listen, Prop, State, Event} from '@stencil/core';
import {QwButton} from '../../shared/qw-button/qw-button';
import {
  BasketHelper,
  BasketModel,
  Language,
  MoneyPrice, RateInformation,
  RoomBasketModel,
  RoomDefaultLabel, RoomImageMetadata,
  RoomModel,
  SessionDisplay,
} from '@qwentes/booking-state-manager';
import {
  PriceCalendarContext,
  QwChangeRoomEvent,
  QwCounterId,
  QwRoomBaseInfoGuestType,
  QwRoomBaseInfoType,
  QwRoomListCalendarType,
  QwRoomListType,
  QwWeekCalendarDirection,
} from '../../../index';
import {QwCounterEmitter} from '../../shared/qw-counter/qw-counter';
import {QwRoomRateAddedToBasketEmitter} from '../../qw-room-rate/qw-room-rate';
import {Transformation} from 'cloudinary-core';

@Component({
  tag: 'qw-room-list-card',
  styleUrl: 'qw-room-list-card.css',
  shadow: false,
})
export class QwRoomListCard {
  @Prop() qwRoomListCardCalendarType: QwRoomListCalendarType;
  @Prop() qwRoomListCardType: QwRoomListType = QwRoomListType.Inline;
  @Prop() qwRoomListCardBaseInfoType: QwRoomBaseInfoType = QwRoomBaseInfoType.Inline;
  @Prop() qwRoomListCardId: RoomModel['roomId'];
  @Prop() qwRoomListCardTitle: string;
  @Prop() qwRoomListCardCarouselImages: RoomImageMetadata[];
  @Prop() qwRoomListCardPrice: string;
  @Prop() qwRoomListCardCrossedOutPrice: string;
  @Prop() qwRoomListCardAveragePrice: string;
  @Prop() qwRoomListCardTaxes: string;
  @Prop() qwRoomListCardImage: string;
  @Prop() qwRoomListCardIsLoading: boolean;
  @Prop() qwRoomListCardDescription: string;
  @Prop() qwRoomListCardRangeDate: Date[];
  @Prop() qwRoomListCardRangeDateSession: Date[];
  @Prop() qwRoomListCardPrices: {[dateString: string]: MoneyPrice};
  @Prop() qwRoomListCardIsLoadingPrice: boolean;
  @Prop() qwRoomListCardNights: number;
  @Prop() qwRoomListCardShowPrices: boolean = true;
  @Prop() qwRoomListCardShowCta: boolean = true;
  @Prop() qwRoomListCardShowPrice: boolean = true;
  @Prop() qwRoomListCardShowDescription: boolean = true;
  @Prop() qwRoomListCardShowPriceAndTaxes: boolean;
  @Prop() qwRoomListCardShowActions: boolean;
  @Prop() qwRoomListCardShowRates: boolean;
  @Prop() qwRoomListCardBasketRoom: RoomBasketModel;
  @Prop() qwRoomListCardBasketIsEmpty: boolean;
  @Prop() qwRoomListCardAddableLeftover: number = 0;
  @Prop() qwRoomListCardNumberOfGuests: number;
  @Prop() qwRoomListCardNumberOfAccommodation: number;
  @Prop() qwRoomListCardPlaceholders: string;
  @Prop() qwRoomListCardLanguage: SessionDisplay['culture'];
  @Prop() qwRoomListCardImageTransformationOptions: Transformation.Options = {};
  @Prop() qwRoomListCardRateHighlight: RateInformation['code'];
  @Prop() qwRoomListCardOnClickBook: () => void;
  @Prop() qwRoomListCardOnClickView: () => void;
  @Prop() qwRoomListCardOnClickChangeDate: () => void;
  @Prop() qwRoomListCardOnProceedToCheckout: () => void;
  @Prop() qwRoomListCardOnChangeRoom: (e: QwChangeRoomEvent) => void;
  @Prop() qwRoomListCardOnChangeWeekDates: (e: QwWeekCalendarDirection) => void;
  @Prop() qwRoomListCardOnAddedToBasket: (e: BasketModel) => void;
  @Prop() qwRoomListCardRateListTitle: string;
  @Prop() qwRoomListCardShowCarouselInCard: boolean = false;
  @Prop() qwRoomListCardServices = [];
  @Prop() qwRoomListCardPriceCalendarContext: PriceCalendarContext;
  @State() qwBasketIsAccommodationSatisfy: boolean;
  @State() showRoomDetails: boolean = false;
  @Event() qwMoreInformation: EventEmitter<any>;

  @Listen('qwCounterChangeValue')
  public counterChanged(event: CustomEvent<QwCounterEmitter>) {
    if (event.detail.id === QwCounterId.QwRoomRateCounter) {
      return;
    }

    this.qwRoomListCardOnChangeRoom({
      quantity: event.detail.value.toString(),
      room: this.qwRoomListCardBasketRoom,
    });
  }

  @Listen('qwWeekCalendarChangeDates')
  public weekDatesChanged(event: CustomEvent<QwWeekCalendarDirection>) {
    this.qwRoomListCardOnChangeWeekDates(event.detail);
  }

  @Listen('qwPriceCalendarChangeDates')
  public priceDatesChanged(event: CustomEvent<any>) {
    this.qwRoomListCardOnChangeWeekDates(event.detail);
  }

  @Listen('qwRoomRateAddedToBasket')
  public qwRoomRateAddedToBasket(event: CustomEvent<QwRoomRateAddedToBasketEmitter>) {
    this.qwRoomListCardOnAddedToBasket(event.detail.basket);
  }

  public getActionsCounterValues() {
    const occupancyId = BasketHelper.getFirstOccupancyIdInBasketRoom(this.qwRoomListCardBasketRoom);
    return {
      selectedQuantity: this.qwRoomListCardBasketRoom.occupancies[occupancyId].selectedQuantity,
      availableQuantity: this.qwRoomListCardBasketRoom.occupancies[occupancyId].availableQuantity,
    };
  }

  private getMaxValue(availableQuantity: number, selectedQuantity: number) {
    const leftover = this.qwRoomListCardAddableLeftover + selectedQuantity;
    return Math.min(availableQuantity, leftover);
  }

  private showProceedButton() {
    return this.qwRoomListCardNumberOfGuests <= this.qwRoomListCardNumberOfAccommodation;
  }

  private formatRoomListCardServices() {
    const services = this.qwRoomListCardServices.map(s => s.amenities);
    return services.reduce((acc, val) => acc.concat(val), []);
  }

  public onClickMoreInformation() {
    this.showRoomDetails = !this.showRoomDetails;
    this.qwMoreInformation.emit(this.qwRoomListCardId.toString());
  }

  render() {
    // @ts-ignore
    return (
      <Host class={this.qwRoomListCardIsLoading ? 'qw-room-list-card__is-loading' : ''}>
        <qw-card>
          <div class="qw-room-list-card__image" onClick={() => this.qwRoomListCardOnClickView()}>
            {(!this.qwRoomListCardShowCarouselInCard || this.qwRoomListCardCarouselImages.length === 1) && <qw-image
              qwImageTransformationOptions={this.qwRoomListCardImageTransformationOptions}
              qwImageUrl={this.qwRoomListCardImage}
              qwImageAlt={this.qwRoomListCardTitle}/>}
            {this.qwRoomListCardShowCarouselInCard && this.qwRoomListCardCarouselImages && this.qwRoomListCardCarouselImages.length > 1 && <div>
              <qw-carousel qwCarouselImagesUrl={this.qwRoomListCardCarouselImages}></qw-carousel>
            </div>}
          </div>

          {this.showRoomDetails &&
          <div class="qw-room-list-card__details-popup-wrapper">
            <div class="qw-room-list-card__details-popup-content">
              <span class="close-icon" onClick={() => this.showRoomDetails = !this.showRoomDetails}/>
              <div class="content-info">
                <h2>{this.qwRoomListCardTitle}</h2>
                <p innerHTML={this.qwRoomListCardDescription}/>
                <div class="content-info__room-details">
                  <h3>{Language.getTranslation('roomDetails')}</h3>
                  <qw-room-base-info
                    qw-room-base-info-guest-type={this.qwRoomListCardBaseInfoType === QwRoomBaseInfoType.List
                      ? QwRoomBaseInfoGuestType.Text
                      : QwRoomBaseInfoGuestType.Icon}
                    qw-room-base-info-type={this.qwRoomListCardBaseInfoType}
                    qw-room-base-info-room-id={this.qwRoomListCardId.toString()}/>
                </div>
                {!!this.formatRoomListCardServices().length && <div class="content-info__services">
                  <h3>{Language.getTranslation('equipments')}</h3>
                  <ul class="qw-room-base-info-list qw-room-list-card--services">{this.formatRoomListCardServices().map(s => {
                    return <li class={`qw-room-base-info__item qw-room-base-info__item--${s.value}`}>
                      <p>{s.text}</p>
                    </li>;
                  })}</ul>
                </div>}
              </div>
              <div class="content-carousel">
                {(!this.qwRoomListCardShowCarouselInCard || this.qwRoomListCardCarouselImages.length === 1) && <qw-image
                  qwImageTransformationOptions={this.qwRoomListCardImageTransformationOptions}
                  qwImageUrl={this.qwRoomListCardImage}
                  qwImageAlt={this.qwRoomListCardTitle}/>}
                {this.qwRoomListCardShowCarouselInCard && this.qwRoomListCardCarouselImages && this.qwRoomListCardCarouselImages.length > 1 && <div>
                  <qw-carousel qwCarouselImagesUrl={this.qwRoomListCardCarouselImages}></qw-carousel>
                </div>}
              </div>
            </div>
          </div>}


          <div class={`qw-room-list-card__title ${!this.qwRoomListCardPrice ? 'qw-room-list-card--has-error' : ''}`}>
            {this.qwRoomListCardTitle
              ? <div class="qw-room-list-card__title-content" onClick={() => this.qwRoomListCardOnClickView()}>
                <h4>{this.qwRoomListCardTitle}</h4>
                <h6 class="qw-room-list-card__caption">
                  <qw-room-base-info
                    qw-room-base-info-guest-type={this.qwRoomListCardBaseInfoType === QwRoomBaseInfoType.List
                      ? QwRoomBaseInfoGuestType.Text
                      : QwRoomBaseInfoGuestType.Icon}
                    qw-room-base-info-type={this.qwRoomListCardBaseInfoType}
                    qw-room-base-info-room-id={this.qwRoomListCardId.toString()}/>
                </h6>
              </div>
              : <qw-placeholder/>
            }
            {this.qwRoomListCardShowPrice && (this.qwRoomListCardPrice
                ? <qw-price
                  onClick={() => this.qwRoomListCardOnClickBook()}
                  qwPriceCrossedPrice={this.qwRoomListCardCrossedOutPrice || RoomDefaultLabel.NoPrice}
                  qwPriceMainPrice={this.qwRoomListCardPrice || RoomDefaultLabel.NoPrice}
                  qwPriceCaption={`
                    ${Language.getTranslation('totalFor')} ${this.qwRoomListCardNights} ${Language.getTranslation('nights')}
                  `}/>
                : !this.qwRoomListCardIsLoading
                  ? <qw-error>{Language.getTranslation('roomListCardErrorMessage')}</qw-error>
                  : ''
            )}
          </div>

          {this.qwRoomListCardShowDescription && <div class="qw-room-list-card__descriptions">
            <p innerHTML={this.qwRoomListCardDescription}/>
          </div>}

          {this.qwRoomListCardShowPrices && <div class="qw-room-list-card__prices">
            {this.qwRoomListCardBasketIsEmpty && <div class="qw-room-list-card__prices-container">
              <div class="qw-room-list-card__prices-average">
                {Language.getTranslation('bestPrices')} - {Language.getTranslation('averagePerNight')}: {this.qwRoomListCardAveragePrice || RoomDefaultLabel.NoPrice}
              </div>
              {this.qwRoomListCardCalendarType === QwRoomListCalendarType.Default &&
                <qw-week-calendar
                  qwWeekCalendarRangeDate={this.qwRoomListCardRangeDate}
                  qwWeekCalendarRangeDateSession={this.qwRoomListCardRangeDateSession}
                  qwWeekCalendarPricesByRoom={this.qwRoomListCardPrices}
                  qwWeekCalendarIsLoading={this.qwRoomListCardIsLoadingPrice}
                  qwWeekCalendarLanguage={this.qwRoomListCardLanguage}
                  qwWeekCalendarSelectedRoomId={this.qwRoomListCardId}/>}
              {this.qwRoomListCardCalendarType === QwRoomListCalendarType.WebSdk &&
                <qw-price-calendar
                  rangeDate={this.qwRoomListCardRangeDate}
                  rangeDateSession={this.qwRoomListCardRangeDateSession}
                  language={this.qwRoomListCardLanguage}
                  context={this.qwRoomListCardPriceCalendarContext}
                  roomId={this.qwRoomListCardId}/>}
            </div>}

            {!this.qwRoomListCardBasketIsEmpty
              ? <qw-room-rates
                qwRoomRatesType={QwRoomListType.Inline}
                qwRoomRatesRateHighlight={this.qwRoomListCardRateHighlight}
                qwRoomRatesRoomId={this.qwRoomListCardId}/>
              : ''
            }
          </div>}

          {this.qwRoomListCardShowRates
            ? <div class="qw-room-list-card__rates">
              <h4>{this.qwRoomListCardRateListTitle ? this.qwRoomListCardRateListTitle : Language.getTranslation('rateList')}</h4>
              <qw-room-rates
                qwRoomRatesType={this.qwRoomListCardType}
                qwRoomRatesRateHighlight={this.qwRoomListCardRateHighlight}
                qwRoomRatesPlaceholders={this.qwRoomListCardPlaceholders}
                qwRoomRatesRoomId={this.qwRoomListCardId}/>
            </div>
            : ''
          }

          {this.qwRoomListCardBasketRoom && this.qwRoomListCardShowActions && <div class="qw-room-list-card__basket-actions">
            <div class="qw-room-list-card__basket-actions-counter">
              <div class="qw-room-list-card__basket-actions-counter-label">
                {Language.getTranslation('roomQuantity')}
              </div>
              <qw-counter
                qwCounterId={QwCounterId.QwRoomListCardCounter}
                qwCounterValue={this.getActionsCounterValues().selectedQuantity}
                qwCounterName={this.qwRoomListCardId}
                qwCounterMaxValue={this.getMaxValue(this.getActionsCounterValues().availableQuantity, this.getActionsCounterValues().selectedQuantity)}/>
            </div>

            {this.qwRoomListCardShowPriceAndTaxes && <div class="qw-room-list-card__prices-with-taxes">
              <div class="qw-room-list-card__prices-with-taxes--amount">
                {this.qwRoomListCardPrice}
                <div class="qw-room-list-card__room-taxes">{this.qwRoomListCardTaxes}</div>
              </div>
            </div>}
          </div>}

          {this.qwRoomListCardShowCta && <div class="qw-room-list-card__cta">
            {this.showProceedButton()
              ? <QwButton
                QwButtonLabel={Language.getTranslation('viewRoom')}
                QwButtonOnClick={() => this.qwRoomListCardOnProceedToCheckout()}/>
              : <QwButton
                QwButtonLabel={Language.getTranslation('viewRoom')}
                QwButtonOnClick={() => this.qwRoomListCardOnClickView()}/>
            }
            {this.qwRoomListCardPrice
              ? <QwButton
                QwButtonLabel={Language.getTranslation('viewAllRates')}
                QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
              : <QwButton
                QwButtonLabel={Language.getTranslation('changeDates')}
                QwButtonOnClick={() => this.qwRoomListCardOnClickChangeDate()}/>
            }
            <QwButton
              QwButtonLabel={Language.getTranslation('moreInformation')}
              QwButtonOnClick={() => {this.onClickMoreInformation() }}/>
          </div>}
        </qw-card>
      </Host>
    );
  }
}
