import { expect, test } from 'vitest';
import { orgJsonLd } from '../src/lib/jsonld';

test('orgJsonLd emits a ld+json script with @context', () => {
  const html = orgJsonLd({ name: 'Algorhythmics', url: 'https://example.com' });
  expect(html).toContain('type="application/ld+json"');
  expect(html).toContain('"@context":"https://schema.org"');
});
