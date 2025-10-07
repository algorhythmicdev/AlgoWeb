// @ts-nocheck
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'theme';
const THEMES = /** @type {const} */ (['light', 'dark', 'hc']);
const LEGACY_ALIASES = /** @type {const} */ ({ contrast: 'hc' });
const DEFAULT_THEME = 'light';

const createThemeStore = () => {
  const getInitialTheme = () => {
    if (!browser) return DEFAULT_THEME;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const normalized = LEGACY_ALIASES[stored] ?? stored;
      if (THEMES.includes(normalized)) {
        return normalized;
      }
    }

    if (window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches) {
      return 'hc';
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return DEFAULT_THEME;
  };

  const apply = (value) => {
    const normalized = THEMES.includes(value) ? value : DEFAULT_THEME;
    if (browser) {
      localStorage.setItem(STORAGE_KEY, normalized);
      applyThemeAttributes(normalized);
    }
    return normalized;
  };

  const initialTheme = apply(getInitialTheme());
  const { subscribe, set: internalSet, update } = writable(initialTheme);

  return {
    subscribe,
    set: (value) => {
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

function applyThemeAttributes(value) {
  if (!browser) return;
  const baseTheme = value === 'light' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', value);
  document.body.setAttribute('data-base-theme', baseTheme);
  document.documentElement.setAttribute('data-theme', value);
  document.documentElement.setAttribute('data-base-theme', baseTheme);
  document.documentElement.style.colorScheme = baseTheme;

  if (value === 'hc') {
    document.body.setAttribute('data-theme-legacy', 'contrast');
    document.documentElement.setAttribute('data-theme-legacy', 'contrast');
  } else {
    document.body.removeAttribute('data-theme-legacy');
    document.documentElement.removeAttribute('data-theme-legacy');
  }
}
