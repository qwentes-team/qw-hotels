import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';
import {QwInputEmitter} from '../qw-input/qw-input';

@Component({
  tag: 'qw-textarea',
  styleUrl: 'qw-textarea.css',
  shadow: false
})
export class QwTextarea {
  @Prop() qwTextareaValue: string;
  @Prop() qwTextareaName: string;
  @Event() qwTextareaChanged: EventEmitter<QwInputEmitter>;

  public textareaChange(event) {
    this.qwTextareaChanged.emit({
      value: event.target.value,
      name: this.qwTextareaName,
      event,
    })
  }

  render() {
    return (
      <Host>
        <textarea onInput={(event: any) => this.textareaChange(event)}>
          {this.qwTextareaValue}
        </textarea>
      </Host>
    );
  }
}
