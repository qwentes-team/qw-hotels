import { newE2EPage } from '@stencil/core/testing';

describe('qw-promo-code', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<qw-promo-code></qw-promo-code>');

    const element = await page.find('qw-promo-code');
    expect(element).toHaveClass('hydrated');
  });
});
