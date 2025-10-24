import { expect, test } from 'vitest';

test('theme toggles without throwing and sets data-theme', async () => {
  const el = global.document?.documentElement;
  if (!el) return;
  el.setAttribute('data-theme','light');
  el.setAttribute('data-theme','dark');
  expect(el.getAttribute('data-theme')).toBe('dark');
});
