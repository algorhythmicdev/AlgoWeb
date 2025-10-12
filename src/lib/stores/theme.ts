import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  THEMES,
  applyThemeAttributes,
  detectPreferredTheme,
  normalizeTheme,
  type ThemeName
} from '$lib/theme/theme-utils';

const createThemeStore = () => {
  const resolveInitial = (): ThemeName => {
    if (!browser) return DEFAULT_THEME;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return normalizeTheme(stored);
    }

    return detectPreferredTheme();
  };

  const apply = (value: unknown): ThemeName => {
    const normalized = normalizeTheme(value, DEFAULT_THEME);

    if (browser) {
      localStorage.setItem(STORAGE_KEY, normalized);
      applyThemeAttributes(normalized);
    }

    return normalized;
  };

  const initialTheme = browser ? apply(resolveInitial()) : DEFAULT_THEME;
  const { subscribe, set: internalSet, update } = writable<ThemeName>(initialTheme);

  return {
    subscribe,
    set: (value: ThemeName | string) => {
      internalSet(apply(value));
    },
    cycle: () => {
      update((current) => {
        const index = THEMES.indexOf(current);
        const next = THEMES[(index + 1) % THEMES.length];
        return apply(next);
      });
    },
    toggle: () => {
      update((current) => {
        const index = THEMES.indexOf(current);
        const fallbackIndex = index === -1 ? 0 : index;
        const next = THEMES[(fallbackIndex + 1) % THEMES.length];
        return apply(next);
      });
    }
  };
};

export const theme = createThemeStore();
export const availableThemes = THEMES;
