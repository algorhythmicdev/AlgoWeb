// @ts-nocheck
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const createThemeStore = () => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    if (!browser) return 'light';
    
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  const { subscribe, set, update } = writable(getInitialTheme());
  
  return {
    subscribe,
    toggle: () => {
      update(theme => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        if (browser) {
          localStorage.setItem('theme', newTheme);
          applyThemeAttributes(newTheme);
        }

        return newTheme;
      });
    },
    set: (theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);
        applyThemeAttributes(theme);
      }
      set(theme);
    }
  };
};

export const theme = createThemeStore();

function applyThemeAttributes(value) {
  if (!browser) return;
  document.body.setAttribute('data-theme', value);
  document.documentElement.setAttribute('data-theme', value);
}
