// @ts-nocheck

/**
 * AlgoRhythmics i18n Configuration
 * Internationalization setup for English
 */

import { register, init, getLocaleFromNavigator, locale, t, time, date, number, addMessages } from 'svelte-i18n';
import enMessages from './en.json';

// Register all translation files
register('en', () => import('./en.json'));

addMessages('en', enMessages);

// Get stored language or default to browser language
function getInitialLocale() {
  if (typeof window === 'undefined') {
    return 'en'; // SSR default
  }
  
  // Check localStorage first
  const stored = localStorage.getItem('language');
  if (stored && ['en'].includes(stored)) {
    return stored;
  }
  
  // Fall back to browser language
  const browserLang = getLocaleFromNavigator();
  
  // Map browser locales to supported languages
  const langMap = {
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
  };
  
  return langMap[browserLang] || 'en';
}

const initialLocale = getInitialLocale();

// Initialize i18n
init({
  fallbackLocale: 'en',
  initialLocale,
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

locale.set(initialLocale);

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
