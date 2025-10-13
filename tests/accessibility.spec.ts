import { render } from '@testing-library/svelte/svelte5';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';

import HomePage from '../src/routes/+page.svelte';
import ServicesPage from '../src/routes/services/+page.svelte';
import ContactPage from '../src/routes/contact/+page.svelte';

async function ensureAccessible(Component: any, label: string) {
  const { container } = render(Component);
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: true },
      region: { enabled: false }
    }
  });
  expect(results.violations, `${label} should not have accessibility violations`).toHaveLength(0);
}

describe('core surfaces meet accessibility expectations', () => {
  it('home page renders without axe violations', async () => {
    await ensureAccessible(HomePage, 'home page');
  });

  it('services page renders without axe violations', async () => {
    await ensureAccessible(ServicesPage, 'services page');
  });

  it('contact page renders without axe violations', async () => {
    await ensureAccessible(ContactPage, 'contact page');
  });
});


