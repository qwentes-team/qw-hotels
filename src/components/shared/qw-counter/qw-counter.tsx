import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';
import {QwButton} from '../qw-button/qw-button';

enum QwCounterAction {
  Plus = '+',
  Minus = '-'
}

export interface QwCounterEmitter {
  name: string | number,
  value: number,
}

@Component({
  tag: 'qw-counter',
  styleUrl: 'qw-counter.css',
  shadow: false
})
export class QwCounter {
  @Prop() qwCounterName: string | number;
  @Prop() qwCounterValue: number = 0;
  @Prop() qwCounterMaxValue: number;
  @Event() qwCounterChangeValue: EventEmitter<QwCounterEmitter>;

  private click(action: QwCounterAction) {
    this.qwCounterValue = action === QwCounterAction.Plus ? this.qwCounterValue + 1 : this.qwCounterValue - 1;
    this.qwCounterChangeValue.emit({name: this.qwCounterName, value: this.qwCounterValue});
  }

  render() {
    return (
      <Host>
        <QwButton
          QwButtonDisabled={this.qwCounterValue === 0}
          QwButtonLabel={QwCounterAction.Minus}
          QwButtonOnClick={() => this.click(QwCounterAction.Minus)}/>
        <div class="qw-counter__value">{this.qwCounterValue}</div>
        <QwButton
          QwButtonDisabled={this.qwCounterMaxValue && this.qwCounterValue >= this.qwCounterMaxValue}
          QwButtonLabel={QwCounterAction.Plus}
          QwButtonOnClick={() => this.click(QwCounterAction.Plus)}/>
      </Host>
    );
  }
}
