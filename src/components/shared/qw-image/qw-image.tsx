import {h, Host, Component, Prop, State} from '@stencil/core';

@Component({
  tag: 'qw-image',
  styleUrl: 'qw-image.css',
  shadow: false
})
export class QwImage {
  @Prop() qwImageUrl: string;
  @Prop() qwImageAlt: string;
  @State() loaded: boolean = false;

  render() {
    return (
      <Host class={`
        qw-image
        ${this.loaded ? 'qw-image__loaded' : 'qw-image__loading'}
        ${!this.qwImageUrl ? 'qw-image__no-image' : ''}
      `}>
        <img onLoad={() => this.loaded = true} src={this.qwImageUrl} alt={this.qwImageAlt}/>
      </Host>
    );
  }
};
