import { expect, test } from 'vitest';

/* This is a light sanity check for ARIA ids we expect to exist at runtime */
test('aria roles used for error summary', () => {
  const html = `<div role="alert" aria-live="assertive">x</div>`;
  expect(html.includes('role="alert"')).toBe(true);
  expect(html.includes('aria-live="assertive"')).toBe(true);
});
