import {h, Host, Component, Prop, State} from '@stencil/core';
import {Transformation} from 'cloudinary-core';
import {RoomImageMetadata} from '@qwentes/booking-state-manager';
import Swiper from 'swiper';
import SwiperCore, { Navigation } from 'swiper';

@Component({
  tag: 'qw-carousel',
  styleUrl: 'qw-carousel.css',
  shadow: false,
})
export class QwCarousel {
  @Prop() qwCarouselImagesUrl: any;
  @Prop() qwRoomListCardImageTransformationOptions: Transformation.Options = {};
  @State() qwCarouselImagesUrlFormatted: RoomImageMetadata[];

  public componentWillLoad() {
    this.qwCarouselImagesUrl = JSON.parse(this.qwCarouselImagesUrl);
  }

  public componentDidLoad() {
    this.initCarousel();
  }

  private initCarousel() {
    SwiperCore.use([Navigation]);
    const swiper = new Swiper('.swiper-container', {
      loop: true,
      speed: 400,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    console.log(swiper);
  }

  render() {
    return (
      <Host class="qw-carousel swiper-container" data-flickity='{ "cellAlign": "left", "contain": true }'>
        <div class="swiper-wrapper">
          {this.qwCarouselImagesUrl && this.qwCarouselImagesUrl.map((i) => {
            return <qw-image
              class="swiper-slide"
              qwImageTransformationOptions={this.qwRoomListCardImageTransformationOptions}
              qwImageUrl={i.url}
              qwImageAlt={i.name}/>;
          })}
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </Host>
    );
  }
};
