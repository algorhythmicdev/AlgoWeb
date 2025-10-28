import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { applyTheme, isTheme, loadTheme, normalizeTheme } from '$lib/theme';

/** @typedef {import('$lib/theme').Theme} Theme */

const DEFAULT_THEME = /** @type {Theme} */ ('light');

const store = writable(DEFAULT_THEME);
const { subscribe, set: internalSet, update: internalUpdate } = store;

const resolveDocumentTheme = () => {
  if (!browser) return DEFAULT_THEME;
  const raw = document.documentElement.getAttribute('data-theme') ?? '';
  const normalized = raw === 'hc' ? 'high-contrast' : raw;
  return isTheme(normalized) ? normalized : DEFAULT_THEME;
};

const applyAndSet = (/** @type {Theme} */ value) => {
  const applied = browser ? applyTheme(value) : value;
  internalSet(applied);
  return applied;
};

let initialized = false;
/** @type {(() => void) | null} */
let cleanup = null;

if (browser && !initialized) {
  initialized = true;

  applyAndSet(loadTheme(DEFAULT_THEME));

  const observer = new MutationObserver(() => {
    internalSet(resolveDocumentTheme());
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  const handleStorage = (/** @type {StorageEvent} */ event) => {
    if (event.key !== 'theme') return;
    const next = normalizeTheme(event.newValue, DEFAULT_THEME);
    applyAndSet(next);
  };

  window.addEventListener('storage', handleStorage);

  cleanup = () => {
    observer.disconnect();
    window.removeEventListener('storage', handleStorage);
    cleanup = null;
  };

  window.addEventListener(
    'beforeunload',
    () => {
      if (cleanup) cleanup();
    },
    { once: true }
  );
}

export const theme = {
  subscribe,
  set(/** @type {Theme} */ value) {
    applyAndSet(value);
  },
  update(/** @type {(value: Theme) => Theme} */ updater) {
    internalUpdate((current) => {
      const next = updater(current);
      return browser ? applyTheme(next) : next;
    });
  }
};

export const __testing = {
  /**
   * Allow tests to trigger cleanup without waiting for window events.
   */
  reset() {
    if (cleanup) cleanup();
    initialized = false;
  }
};
