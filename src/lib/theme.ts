export type Theme = 'light' | 'dark' | 'high-contrast';

const THEMES: Theme[] = ['light', 'dark', 'high-contrast'];
const LEGACY_ALIASES: Record<string, Theme> = {
  hc: 'high-contrast',
  contrast: 'high-contrast'
};
const STORAGE_KEY = 'theme';

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && THEMES.includes(value as Theme);
}

export function normalizeTheme(value: unknown, fallback: Theme = 'light'): Theme {
  if (typeof value !== 'string') return fallback;
  const key = value.trim().toLowerCase();
  if (!key) return fallback;

  const legacy = LEGACY_ALIASES[key];
  if (legacy) return legacy;

  return isTheme(key) ? (key as Theme) : fallback;
}

export function loadTheme(defaultTheme: Theme = 'light'): Theme {
  if (typeof localStorage === 'undefined') {
    return defaultTheme;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return normalizeTheme(stored, defaultTheme);
  } catch {
    return defaultTheme;
  }
}

export function applyTheme(theme: Theme): Theme {
  if (typeof document !== 'undefined') {
    const applied = theme === 'high-contrast' ? 'hc' : theme;
    document.documentElement.setAttribute('data-theme', applied);
    document.documentElement.style.colorScheme =
      theme === 'dark' || theme === 'high-contrast' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* no-op */
    }
  }

  return theme;
}

export function cycleTheme(current: Theme): Theme {
  const index = THEMES.indexOf(current);
  const next = THEMES[(index + 1) % THEMES.length];
  return applyTheme(next);
}
