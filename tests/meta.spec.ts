import { describe, expect, test } from 'vitest';

import { buildMeta } from '$lib/meta';

const fallback = { title: 'Fallback', description: 'Fallback description' } as const;

describe('buildMeta', () => {
  test('uses fallback strings when translation missing', () => {
    const meta = buildMeta((key) => key, 'home', fallback, 'en');

    expect(meta.title).toBe('Fallback');
    expect(meta.description).toBe('Fallback description');
    expect(meta.lang).toBe('en');
  });

  test('prefers translated values when provided', () => {
    const translator = (key: string) => {
      if (key === 'meta.home.title') return 'Translated Title';
      if (key === 'meta.home.description') return 'Translated Description';
      return key;
    };

    const meta = buildMeta(translator, 'home', fallback, 'lv');

    expect(meta.title).toBe('Translated Title');
    expect(meta.description).toBe('Translated Description');
    expect(meta.lang).toBe('lv');
  });
});
