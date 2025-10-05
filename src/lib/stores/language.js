// @ts-nocheck
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { locale } from 'svelte-i18n';

const SUPPORTED_LANGUAGES = ['en', 'lv', 'ru', 'uk', 'fr', 'es'];

const createLanguageStore = () => {
  const getInitialLanguage = () => {
    if (!browser) return 'en';
    
    // Check localStorage
    const stored = localStorage.getItem('language');
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }
    
    return 'en';
  };
  
  const { subscribe, set } = writable(getInitialLanguage());
  
  return {
    subscribe,
    set: (lang) => {
      if (!SUPPORTED_LANGUAGES.includes(lang)) {
        console.warn(`Unsupported language: ${lang}`);
        return;
      }
      
      if (browser) {
        localStorage.setItem('language', lang);
      }
      
      locale.set(lang);
      set(lang);
    },
    getSupportedLanguages: () => SUPPORTED_LANGUAGES
  };
};

export const language = createLanguageStore();
