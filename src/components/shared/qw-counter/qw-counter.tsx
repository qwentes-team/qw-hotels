import {Component, Host, h, Prop, Event, EventEmitter, State} from '@stencil/core';
import {QwButton} from '../qw-button/qw-button';

enum QwCounterAction {
  Plus = '+',
  Minus = '-'
}

export interface QwCounterEmitter {
  id: string;
  name: string | number,
  value: number,
}

@Component({
  tag: 'qw-counter',
  styleUrl: 'qw-counter.css',
  shadow: false,
})
export class QwCounter {
  @Prop() qwCounterId: string;
  @Prop() qwCounterName: string | number;
  @Prop() qwCounterValue: number = 0;
  @Prop() qwCounterQuantity: number;
  @Prop() qwCounterMaxValue: number;
  @Prop() qwCounterMinValue: number;
  @Prop() qwCounterDisabled: boolean;
  @Event() qwCounterChangeValue: EventEmitter<QwCounterEmitter>;
  @State() qwBasketIsAccommodationSatisfy: boolean;

  public componentWillLoad() {
    if (this.checkIfIsGuestCounter(this.qwCounterName)) {
      window.addEventListener('qwBasketIsAccommodationSatisfy', (res: CustomEvent) => {
        this.qwBasketIsAccommodationSatisfy = res.detail.isAccommodationSatisfy;
      });
    }
  }

  private checkIfIsGuestCounter(qwCounterName) {
    return qwCounterName !== 'adults' && qwCounterName !== 'children' && qwCounterName !== 'infants';
  }

  private click(action: QwCounterAction) {
    this.qwCounterValue = action === QwCounterAction.Plus ? this.qwCounterValue + 1 : this.qwCounterValue - 1;
    this.qwCounterChangeValue.emit({
      id: this.qwCounterId,
      name: this.qwCounterName,
      value: this.qwCounterValue,
    });
  }

  private checkIfCounterIsDisabled() {
    if (this.qwBasketIsAccommodationSatisfy) {
      return true;
    } else if (this.qwCounterMaxValue !== undefined && this.qwCounterValue >= this.qwCounterMaxValue) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <Host class={this.qwCounterDisabled ? 'qw-counter--disabled' : ''}>
        <QwButton
          QwButtonDisabled={this.qwCounterMinValue !== undefined ? this.qwCounterValue <= this.qwCounterMinValue : this.qwCounterValue === 0}
          QwButtonLabel={QwCounterAction.Minus}
          QwButtonOnClick={() => this.click(QwCounterAction.Minus)}/>
        <div class="qw-counter__value">{this.qwCounterValue}</div>
        <QwButton
          QwButtonDisabled={this.checkIfCounterIsDisabled()}
          QwButtonLabel={QwCounterAction.Plus}
          QwButtonOnClick={() => this.click(QwCounterAction.Plus)}/>
      </Host>
    );
  }
}
