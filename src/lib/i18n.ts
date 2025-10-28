import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import en from '$lib/translations/en.json';
import lv from '$lib/translations/lv.json';
import ru from '$lib/translations/ru.json';
import uk from '$lib/translations/uk.json';
import fr from '$lib/translations/fr.json';
import es from '$lib/translations/es.json';

export const LANGS = ['en','lv','ru','uk','fr','es'] as const;
export type Lang = typeof LANGS[number];

const dict: Record<Lang, any> = { en, lv, ru, uk, fr, es };

function getInitialLang(): Lang {
  if (!browser) return 'en';
  const stored = (localStorage.getItem('lang') as Lang) || 'en';
  return (LANGS as readonly string[]).includes(stored) ? stored as Lang : 'en';
}

export const lang = writable<Lang>(getInitialLang());
lang.subscribe((l) => {
  if (!browser) return;
  document.documentElement.lang = l;
  localStorage.setItem('lang', l);
});

function deepGet(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc && key in acc ? acc[key] : undefined), obj);
}

// reactive translator function
export const i18n = derived(lang, ($lang) => {
  return (key: string): string => {
    const inActive = deepGet(dict[$lang], key);
    if (typeof inActive === 'string') return inActive;
    const inEn = deepGet(dict.en, key);
    if (typeof inEn === 'string') return inEn;
    return key; // last-resort: show key
  };
});
