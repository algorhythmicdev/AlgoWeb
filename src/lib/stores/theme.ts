import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  THEME_SEQUENCE,
  applyThemeAttributes,
  normalizeTheme,
  type ThemeName
} from '$lib/theme/theme-utils';

const createThemeStore = () => {
  let storageAvailable = true;

  const safeGetItem = (key: string): string | null => {
    if (!browser || !storageAvailable) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      storageAvailable = false;
      return null;
    }
  };

  const safeSetItem = (key: string, value: string) => {
    if (!browser || !storageAvailable) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      storageAvailable = false;
    }
  };

  const resolveInitial = (): ThemeName => {
    if (!browser) return 'auto';

    const stored = safeGetItem(STORAGE_KEY);
    if (stored) {
      return normalizeTheme(stored);
    }

    return 'auto';
  };

  const apply = (value: unknown): ThemeName => {
    const normalized = normalizeTheme(value, DEFAULT_THEME);

    if (browser) {
      safeSetItem(STORAGE_KEY, normalized);
      applyThemeAttributes(normalized);
    }

    return normalized;
  };

  const initialTheme = browser ? apply(resolveInitial()) : 'auto';
  const { subscribe, set: internalSet, update } = writable<ThemeName>(initialTheme);
  let currentValue: ThemeName = initialTheme;
  const unsubscribeTrack = subscribe((value) => {
    currentValue = value;
  });

  const syncPreferredMode = () => {
    if (!browser) return;
    applyThemeAttributes('auto');
  };

  let cleanup: (() => void) | null = null;

  if (browser) {
    const darkQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    const contrastQuery = window.matchMedia?.('(prefers-contrast: more)');

    const listener = () => {
      if (currentValue === 'auto') {
        syncPreferredMode();
      }
    };

    const attach = () => {
      darkQuery?.addEventListener?.('change', listener);
      contrastQuery?.addEventListener?.('change', listener);
      cleanup = () => {
        darkQuery?.removeEventListener?.('change', listener);
        contrastQuery?.removeEventListener?.('change', listener);
      };
    };

    attach();
  }

  return {
    subscribe,
    set: (value: ThemeName | string) => {
      internalSet(apply(value));
    },
    cycle: () => {
      update((current) => {
        const index = THEME_SEQUENCE.indexOf(current);
        const next = THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length];
        return apply(next);
      });
    },
    toggle: () => {
      update((current) => {
        const index = THEME_SEQUENCE.indexOf(current);
        const fallbackIndex = index === -1 ? 0 : index;
        const next = THEME_SEQUENCE[(fallbackIndex + 1) % THEME_SEQUENCE.length];
        return apply(next);
      });
    },
    destroy: () => {
      cleanup?.();
      unsubscribeTrack();
    }
  };
};

export const theme = createThemeStore();
export const availableThemes = THEME_SEQUENCE;
