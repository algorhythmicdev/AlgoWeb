export const STORAGE_KEY = 'theme';

export const THEME_SEQUENCE = ['auto', 'light', 'dark', 'hc'] as const;
export type ThemeName = (typeof THEME_SEQUENCE)[number];

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
  return (THEME_SEQUENCE as readonly string[]).includes(candidate)
    ? (candidate as ThemeName)
    : fallback;
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

  const ensureColorScheme = (scheme: string) => {
    root.style.colorScheme = scheme;
    if (body.style) {
      body.style.colorScheme = scheme;
    }
  };

  const setResolvedTheme = (resolved: ThemeName) => {
    body.setAttribute('data-theme-resolved', resolved);
    root.setAttribute('data-theme-resolved', resolved);

    if (resolved === 'hc') {
      body.setAttribute('data-theme-legacy', 'contrast');
      root.setAttribute('data-theme-legacy', 'contrast');
    } else {
      body.removeAttribute('data-theme-legacy');
      root.removeAttribute('data-theme-legacy');
    }
  };

  if (theme === 'auto') {
    const resolved = detectPreferredTheme();
    setResolvedTheme(resolved);

    body.removeAttribute('data-theme');
    root.removeAttribute('data-theme');

    body.setAttribute('data-theme-mode', 'auto');
    root.setAttribute('data-theme-mode', 'auto');

    ensureColorScheme(resolved === 'dark' || resolved === 'hc' ? 'dark' : 'light');
    return;
  }

  setResolvedTheme(theme);

  body.setAttribute('data-theme', theme);
  root.setAttribute('data-theme', theme);

  body.setAttribute('data-theme-mode', 'manual');
  root.setAttribute('data-theme-mode', 'manual');

  ensureColorScheme(theme === 'dark' || theme === 'hc' ? 'dark' : 'light');
}
