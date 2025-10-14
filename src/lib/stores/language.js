// @ts-check
import { writable } from 'svelte/store';
import { browser, dev } from '$app/environment';
import { locale } from 'svelte-i18n';

/** @typedef {'en' | 'lv' | 'ru' | 'uk' | 'fr' | 'es'} SupportedLanguage */

/** @type {readonly SupportedLanguage[]} */
const SUPPORTED_LANGUAGES = ['en', 'lv', 'ru', 'uk', 'fr', 'es'];

const createLanguageStore = () => {
  /**
   * @returns {SupportedLanguage}
   */
  const getInitialLanguage = () => {
    if (!browser) return 'en';
    
    const stored = localStorage.getItem('language');
    if (stored && SUPPORTED_LANGUAGES.includes(/** @type {SupportedLanguage} */ (stored))) {
      return /** @type {SupportedLanguage} */ (stored);
    }
    
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(/** @type {SupportedLanguage} */ (browserLang))) {
      return /** @type {SupportedLanguage} */ (browserLang);
    }
    
    return 'en';
  };
  
  const { subscribe, set } = writable(getInitialLanguage());
  
  return {
    subscribe,
    /**
     * @param {string} lang
     */
    set: (lang) => {
      if (!SUPPORTED_LANGUAGES.includes(/** @type {SupportedLanguage} */ (lang))) {
        if (dev) {
          console.warn(`Unsupported language: ${lang}. Falling back to 'en'.`);
        }
        return;
      }
      
      if (browser) {
        localStorage.setItem('language', lang);
      }
      
      locale.set(lang);
      set(/** @type {SupportedLanguage} */ (lang));
    },
    getSupportedLanguages: () => SUPPORTED_LANGUAGES
  };
};

export const language = createLanguageStore();
