import { expect, test, vi } from 'vitest';

import { canonicalFor } from '$lib/canonical';
import { hreflangLinks } from '$lib/hreflang';

vi.mock('$env/static/public', () => ({ PUBLIC_SITE_URL: 'https://example.com/base/' }));

test('hreflang generator outputs x-default and locales', () => {
  const html = hreflangLinks('team');

  expect(html).toContain('hreflang="en"');
  expect(html).toContain('hreflang="lv"');
  expect(html).toContain('hreflang="ru"');
  expect(html).toContain('hreflang="x-default"');
  expect(html).toContain('https://example.com/base/team');
});

test('canonicalFor trims trailing slash and ensures leading slash', () => {
  expect(canonicalFor('')).toBe('https://example.com/base/');
  expect(canonicalFor('team')).toBe('https://example.com/base/team');
  expect(canonicalFor('/contact')).toBe('https://example.com/base/contact');
});
