// @ts-nocheck

/**
 * AlgoRhythmics i18n Configuration
 * Internationalization setup for 6 languages
 */

import { register, init, getLocaleFromNavigator, locale, t, time, date, number } from 'svelte-i18n';

// Register all translation files
register('en', () => import('./en.json'));
register('lv', () => import('./lv.json'));
register('ru', () => import('./ru.json'));
register('uk', () => import('./uk.json'));
register('fr', () => import('./fr.json'));
register('es', () => import('./es.json'));

// Get stored language or default to browser language
function getInitialLocale() {
  if (typeof window === 'undefined') {
    return 'en'; // SSR default
  }
  
  // Check localStorage first
  const stored = localStorage.getItem('language');
  if (stored && ['en', 'lv', 'ru', 'uk', 'fr', 'es'].includes(stored)) {
    return stored;
  }
  
  // Fall back to browser language
  const browserLang = getLocaleFromNavigator();
  
  // Map browser locales to supported languages
  const langMap = {
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'lv': 'lv',
    'lv-LV': 'lv',
    'ru': 'ru',
    'ru-RU': 'ru',
    'uk': 'uk',
    'uk-UA': 'uk',
    'fr': 'fr',
    'fr-FR': 'fr',
    'es': 'es',
    'es-ES': 'es'
  };
  
  return langMap[browserLang] || 'en';
}

// Initialize i18n
init({
  fallbackLocale: 'en',
  initialLocale: getInitialLocale(),
  loadingDelay: 200,
  formats: {
    number: {
      currency: {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }
    },
    date: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      },
      monthYear: {
        year: 'numeric',
        month: 'long'
      }
    }
  }
});

// Export locale utilities
export { locale, t as _, time, date, number };

/**
 * Available languages configuration
 */
export const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isDefault: true
  },
  {
    code: 'lv',
    name: 'Latvian',
    nativeName: 'Latviešu',
    isDefault: false
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    isDefault: false
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    isDefault: false
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isDefault: false
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    isDefault: false
  }
];

/**
 * Set locale and persist to localStorage
 */
export function setLocale(lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
  locale.set(lang);
}

/**
 * Get current locale
 */
export function getCurrentLocale() {
  let currentLang = 'en';
  locale.subscribe(value => {
    if (value) currentLang = value;
  })();
  return currentLang;
}

/**
 * Direction helper (for RTL languages in future)
 */
export function getDirection(lang) {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
}
