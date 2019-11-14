import {Component, Host, h, Prop} from '@stencil/core';
import {QwImage} from '../../shared/qw-image/qw-image';
import {QwButton} from '../../shared/qw-button/qw-button';
import {MoneyPrice, Rate, RoomBasketModel, RoomDefaultLabel, RoomModel} from '@qwentes/booking-state-manager';
import {QwChangeRoomEvent} from '../../../index';
import {QwSelect} from '../../shared/qw-select/qw-select';

@Component({
  tag: 'qw-room-list-card',
  styleUrl: 'qw-room-list-card.css',
  shadow: false
})
export class QwRoomListCard {
  @Prop() qwRoomListCardId: RoomModel['roomId'];
  @Prop() qwRoomListCardTitle: string;
  @Prop() qwRoomListCardPrice: string;
  @Prop() qwRoomListCardCrossedOutPrice: string;
  @Prop() qwRoomListCardAveragePrice: string;
  @Prop() qwRoomListCardSquareMeter: string;
  @Prop() qwRoomListCardGuests: string;
  @Prop() qwRoomListCardImage: string;
  @Prop() qwRoomListCardRates: Rate[];
  @Prop() qwRoomListCardIsLoading: boolean;
  @Prop() qwRoomListCardDescription: string;
  @Prop() qwRoomListCardRangeDate: Date[];
  @Prop() qwRoomListCardRangeDateSession: Date[];
  @Prop() qwRoomListCardPrices: {[dateString: string]: MoneyPrice};
  @Prop() qwRoomListCardIsLoadingPrice: boolean;
  @Prop() qwRoomListCardIsLoadingBasket: boolean;
  @Prop() qwRoomListCardNights: number;
  @Prop() qwRoomListCardShowPrices: boolean = true;
  @Prop() qwRoomListCardShowCta: boolean = true;
  @Prop() qwRoomListCardShowPrice: boolean = true;
  @Prop() qwRoomListCardBasketRoom: RoomBasketModel;
  @Prop() qwRoomListCardOnClickBook: () => void;
  @Prop() qwRoomListCardOnClickView: () => void;
  @Prop() qwRoomListCardOnClickChangeDate: () => void;
  @Prop() qwRoomListCardOnChangeRoom: (e: QwChangeRoomEvent) => void;

  private getMessageError() {
    // todo differenziare i due errori
    return 'This room is not available fot the dates selected, or the rate is not available with the one in your basket.'
  }

  render() {
    return (
      <Host>
        <qw-card>
          <div class="qw-room-list-card__image">
            <QwImage imageUrl={this.qwRoomListCardImage} alt={this.qwRoomListCardTitle}/>
          </div>

          <div class={`qw-room-list-card__title ${!this.qwRoomListCardPrice ? 'qw-room-list-card--has-error' : ''}`}>
            <div class="qw-room-list-card__title-content">
              <h4>{this.qwRoomListCardTitle}</h4>
              <h6 class="qw-room-list-card__caption">
                {this.qwRoomListCardGuests}{this.qwRoomListCardSquareMeter && ` / ${this.qwRoomListCardSquareMeter}`}
              </h6>
            </div>
            {this.qwRoomListCardShowPrice && (!this.qwRoomListCardPrice
              ? <qw-error>{this.getMessageError()}</qw-error>
              : <qw-price
                  qwPriceCrossedPrice={this.qwRoomListCardCrossedOutPrice || RoomDefaultLabel.NoPrice}
                  qwPriceMainPrice={this.qwRoomListCardPrice || RoomDefaultLabel.NoPrice}
                  qwPriceCaption={`Total for ${this.qwRoomListCardNights} ${this.qwRoomListCardNights > 1 ? 'nights' : 'night'}`}/>)
            }
          </div>

          <div class="qw-room-list-card__descriptions">
            <p>{this.qwRoomListCardDescription}</p>
          </div>

          {this.qwRoomListCardShowPrices && <div class="qw-room-list-card__prices">
            <div class="qw-room-list-card__prices-average">
              Best prices - Average per night: {this.qwRoomListCardAveragePrice || RoomDefaultLabel.NoPrice}
            </div>
            <qw-week-calendar
              qwWeekCalendarRangeDate={this.qwRoomListCardRangeDate}
              qwWeekCalendarRangeDateSession={this.qwRoomListCardRangeDateSession}
              qwWeekCalendarPricesByRoom={this.qwRoomListCardPrices}
              qwWeekCalendarSelectedRoomId={this.qwRoomListCardId}/>
          </div>}

          {this.qwRoomListCardBasketRoom && <div class="qw-room-list-card__basket-actions">
            <QwSelect
              QwSelectLabel="Room qty."
              QwSelectDisabled={this.qwRoomListCardIsLoadingBasket}
              QwSelectOnChange={(e) => this.qwRoomListCardOnChangeRoom({quantity: e.target.value, room: this.qwRoomListCardBasketRoom})}>
              {Array.from(Array(this.qwRoomListCardBasketRoom.occupancies[0].availableQuantity).keys()).map(o => {
                const value = o + 1;
                return (
                  <option
                    value={value}
                    // @ts-ignore
                    selected={this.qwRoomListCardBasketRoom.occupancies[0].selectedQuantity === value ? 'selected' : ''}>
                    {value}
                  </option>
                );
              })}
            </QwSelect>
            <QwButton
              QwButtonLabel="Remove"
              QwButtonOnClick={() => this.qwRoomListCardOnChangeRoom({quantity: '0', room: this.qwRoomListCardBasketRoom})}
              QwButtonDisabled={this.qwRoomListCardIsLoadingBasket}/>
          </div>}

          {this.qwRoomListCardShowCta && <div class="qw-room-list-card__cta">
            <QwButton QwButtonLabel="View room" QwButtonOnClick={() => this.qwRoomListCardOnClickView()}/>
            {this.qwRoomListCardPrice
              ? <QwButton QwButtonLabel="View rates" QwButtonOnClick={() => this.qwRoomListCardOnClickBook()}/>
              : <QwButton QwButtonLabel="Change dates" QwButtonOnClick={() => this.qwRoomListCardOnClickChangeDate()}/>
            }
          </div>}
        </qw-card>
      </Host>
    );
  }
}
