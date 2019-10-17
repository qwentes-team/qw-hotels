import {Component, h, Prop} from '@stencil/core';

@Component({
  tag: 'qw-loading',
  styleUrl: 'qw-loading.css',
  shadow: false
})
export class QwLoading {
  @Prop() QwLoadingSize: string;

  render() {
    return (
      <div class="loader" style={{width: `${this.QwLoadingSize}px`}}>
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" stroke="black" stroke-width="5" stroke-miterlimit="10"/>
        </svg>
      </div>
    );
  }
}
