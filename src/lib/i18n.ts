import { browser } from '$app/environment';
import {
  init as i18nInit,
  register,
  getLocaleFromNavigator,
  locale,
  waitLocale,
  _ as translate,
  t,
  number,
  date,
  time
} from 'svelte-i18n';

const SUPPORTED_LOCALES = ['en', 'lv', 'ru'] as const;
const COOKIE_NAME = 'locale';

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

let initialised = false;

register('en', () => import('$lib/translations/en.json'));
register('lv', () => import('$lib/translations/lv.json'));
register('ru', () => import('$lib/translations/ru.json'));

function readLocaleCookie(): string | null {
  if (!browser || typeof document === 'undefined') {
    return null;
  }

  try {
    return (
      document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${COOKIE_NAME}=`))
        ?.split('=')[1] ?? null
    );
  } catch {
    return null;
  }
}

function writeLocaleCookie(value: string, days = 365) {
  if (!browser || typeof document === 'undefined') {
    return;
  }

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=${value};expires=${date.toUTCString()};path=/`;
}

function resolveStartLocale(defaultLocale?: SupportedLocale | string): SupportedLocale {
  if (defaultLocale && SUPPORTED_LOCALES.includes(defaultLocale as SupportedLocale)) {
    return defaultLocale as SupportedLocale;
  }

  const cookieLocale = readLocaleCookie();
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as SupportedLocale)) {
    return cookieLocale as SupportedLocale;
  }

  if (browser) {
    try {
      const stored = localStorage.getItem('language');
      if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
        return stored as SupportedLocale;
      }
    } catch {
      // ignore storage errors
    }
  }

  const navigatorLocale = getLocaleFromNavigator();
  if (navigatorLocale) {
    const normalised = navigatorLocale.split('-')[0]?.toLowerCase();
    if (normalised && SUPPORTED_LOCALES.includes(normalised as SupportedLocale)) {
      return normalised as SupportedLocale;
    }
  }

  return 'en';
}

export async function initI18n(defaultLocale: SupportedLocale | string = 'en'): Promise<void> {
  if (initialised && browser) {
    return;
  }

  const start = resolveStartLocale(defaultLocale);

  i18nInit({
    fallbackLocale: 'en',
    initialLocale: start
  });

  locale.set(start);
  writeLocaleCookie(start);

  await waitLocale();

  if (browser) {
    initialised = true;
  }
}

export function setLocale(next: SupportedLocale): void {
  if (!SUPPORTED_LOCALES.includes(next)) {
    return;
  }

  if (browser) {
    writeLocaleCookie(next);
  }

  locale.set(next);
}

export function getSupportedLocales(): SupportedLocale[] {
  return [...SUPPORTED_LOCALES];
}

export { locale, translate as _, t, number, date, time, waitLocale };
