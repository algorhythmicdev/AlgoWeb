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

const SUPPORTED_LOCALES = ['en'] as const;

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

let initialised = false;

register('en', () => import('$lib/translations/en.json'));

function resolveStartLocale(defaultLocale?: SupportedLocale | string): SupportedLocale {
  if (defaultLocale && SUPPORTED_LOCALES.includes(defaultLocale as SupportedLocale)) {
    return defaultLocale as SupportedLocale;
  }

  if (browser) {
    const stored = localStorage.getItem('language');
    if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
      return stored as SupportedLocale;
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
    localStorage.setItem('language', next);
  }

  locale.set(next);
}

export function getSupportedLocales(): SupportedLocale[] {
  return [...SUPPORTED_LOCALES];
}

export { locale, translate as _, t, number, date, time, waitLocale };
