import { expect, test } from 'vitest';
import { JSDOM } from 'jsdom';

test('nav has aria-current on active link', async () => {
  const dom = new JSDOM(`<nav aria-label="Primary"><a href="/" aria-current="page">Home</a></nav>`);
  const a = dom.window.document.querySelector('a[href="/"]');
  expect(a?.getAttribute('aria-current')).toBe('page');
});
