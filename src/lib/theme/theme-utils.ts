export const STORAGE_KEY = 'theme';
export const THEMES = ['light', 'dark', 'hc'] as const;
export type ThemeName = (typeof THEMES)[number];

export const LEGACY_ALIASES: Record<string, ThemeName> = {
  contrast: 'hc'
};

export const DEFAULT_THEME: ThemeName = 'light';

export function normalizeTheme(value: unknown, fallback: ThemeName = DEFAULT_THEME): ThemeName {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const alias = LEGACY_ALIASES[trimmed];
  const candidate = (alias ?? trimmed) as string;
  return (THEMES as readonly string[]).includes(candidate) ? (candidate as ThemeName) : fallback;
}

export function detectPreferredTheme(): ThemeName {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  if (window.matchMedia?.('(prefers-contrast: more)').matches) {
    return 'hc';
  }

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return DEFAULT_THEME;
}

export function applyThemeAttributes(theme: ThemeName, doc?: Document): void {
  if (typeof document === 'undefined' && !doc) return;
  const targetDocument = doc ?? document;
  const body = targetDocument?.body;
  const root = targetDocument?.documentElement;
  if (!body || !root) return;

  const baseTheme = theme === 'light' ? 'light' : 'dark';

  body.setAttribute('data-theme', theme);
  body.setAttribute('data-base-theme', baseTheme);
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-base-theme', baseTheme);
  root.style.colorScheme = baseTheme;

  if (theme === 'hc') {
    body.setAttribute('data-theme-legacy', 'contrast');
    root.setAttribute('data-theme-legacy', 'contrast');
  } else {
    body.removeAttribute('data-theme-legacy');
    root.removeAttribute('data-theme-legacy');
  }
}
