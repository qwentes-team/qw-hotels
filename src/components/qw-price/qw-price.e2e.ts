import { newE2EPage } from '@stencil/core/testing';

describe('qw-price', () => {
  it('renders', async () => {
    debugger;
    const page = await newE2EPage();
    await page.setContent('<qw-price></qw-price>');

    const element = await page.find('qw-price');
    expect(element).toHaveClass('hydrated');
  });
});
