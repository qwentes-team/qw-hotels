import { newE2EPage } from '@stencil/core/testing';

describe('qw-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<qw-button></qw-button>');

    const element = await page.find('qw-button');
    expect(element).toHaveClass('hydrated');
  });
});
