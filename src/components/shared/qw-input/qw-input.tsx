import {Component, Host, h, Prop} from '@stencil/core';

@Component({
  tag: 'qw-input',
  styleUrl: 'qw-input.css',
  shadow: false,
})
export class QwInput {
  @Prop() qwInputName: string;
  @Prop() qwInputType: string;
  @Prop() qwInputValue: string;
  @Prop() qwInputLabel: string;
  @Prop() qwInputIsReadonly: boolean;

  render() {
    return (
      <Host>
        <label>
          <div class="qw-input__label">{this.qwInputLabel}</div>
          <input readonly={this.qwInputIsReadonly} type={this.qwInputType || 'text'} value={this.qwInputValue}/>
        </label>
      </Host>
    );
  }

}
