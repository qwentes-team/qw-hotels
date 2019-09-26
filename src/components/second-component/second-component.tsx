import {Component, h} from '@stencil/core';

@Component({
  tag: 'second-component',
  styleUrl: 'second-component.css',
  shadow: true
})
export class SecondComponent {
  render() {
    return <div>Second component!</div>;
  }
}
