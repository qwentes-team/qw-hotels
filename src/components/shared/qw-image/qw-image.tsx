import {h, Host, Component, Prop, State} from '@stencil/core';
import cloudinary, {Transformation} from 'cloudinary-core';

const cl = new (cloudinary as any).Cloudinary({
  cloud_name: window.QW_HOTEL_ENV.CLOUDINARY_ID || 'd-edge-web',
  secure: true,
});

@Component({
  tag: 'qw-image',
  styleUrl: 'qw-image.css',
  shadow: false,
})
export class QwImage {
  @Prop() qwImageUrl: string;
  @Prop() qwImageAlt: string;
  @Prop() qwImageTransformationOptions: Transformation.Options = {};
  @State() loaded: boolean = false;

  private transform(url) {
    if (!url) {
      return;
    }

    return cl.url(url, {
      fetchFormat: 'auto',
      type: 'fetch',
      width: 800,
      height: 600,
      crop: 'fill',
      ...this.qwImageTransformationOptions,
    });
  }

  render() {
    return (
      <Host class={`
        qw-image
        ${this.loaded ? 'qw-image__loaded' : 'qw-image__loading'}
        ${!this.qwImageUrl ? 'qw-image__no-image' : ''}
      `}>
        <img onLoad={() => this.loaded = true} src={this.transform(this.qwImageUrl)} alt={this.qwImageAlt}/>
      </Host>
    );
  }
};
