import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { _, initI18n } from '$lib/i18n';

describe('Navigation i18n hygiene', () => {
  it('does not expose raw translation keys', async () => {
    await initI18n('en');
    const translate = get(_);

    expect(translate('language_switcher.languages.en.short')).toBe('EN');
    expect(translate('settings.theme.light')).toBe('Light');
  });
});
