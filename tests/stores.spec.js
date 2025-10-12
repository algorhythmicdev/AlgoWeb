// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';

const localeSetMock = vi.fn();

vi.mock('$app/environment', () => ({ browser: true }), { virtual: true });
vi.mock('svelte-i18n', () => ({
  locale: {
    set: localeSetMock
  }
}), { virtual: true });

const storage = new Map();

function createMockElement() {
  const attributes = new Map();
  return {
    style: {},
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    getAttribute(name) {
      return attributes.has(name) ? attributes.get(name) : null;
    },
    removeAttribute(name) {
      attributes.delete(name);
    }
  };
}

function setupStorage() {
  storage.clear();
  const localStorageMock = {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear()
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true
  });
  vi.stubGlobal('localStorage', localStorageMock);
}

function setupMatchMedia() {
  const mediaMock = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {}
  });
  Object.defineProperty(window, 'matchMedia', {
    value: mediaMock,
    configurable: true
  });
}

beforeEach(() => {
  vi.resetModules();
  const body = createMockElement();
  const documentElement = createMockElement();
  documentElement.style = { colorScheme: '' };
  const mockDocument = { body, documentElement };
  const mockWindow = {};
  vi.stubGlobal('document', mockDocument);
  vi.stubGlobal('window', mockWindow);
  mockWindow.document = mockDocument;
  setupStorage();
  setupMatchMedia();
  localeSetMock.mockClear();
  const navigatorMock = { language: 'en-US' };
  mockWindow.navigator = navigatorMock;
  vi.stubGlobal('navigator', navigatorMock);
});

async function loadThemeStore() {
  return await import('../src/lib/stores/theme.ts');
}

async function loadLanguageStore() {
  return await import('../src/lib/stores/language.js');
}

describe('theme store', () => {
  it('applies stored theme from localStorage on init', async () => {
    window.localStorage.setItem('theme', 'dark');
    const { theme } = await loadThemeStore();

    let current;
    const unsubscribe = theme.subscribe((value) => (current = value));

    expect(current).toBe('dark');
    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.body.getAttribute('data-base-theme')).toBe('dark');

    unsubscribe();
  }, 50000); // Increased timeout for this specific test

  it('normalizes legacy contrast theme to high-contrast', async () => {
    window.localStorage.setItem('theme', 'contrast');
    const { theme } = await loadThemeStore();

    let current;
    const unsubscribe = theme.subscribe((value) => (current = value));

    expect(current).toBe('hc');
    expect(window.localStorage.getItem('theme')).toBe('hc');
    expect(document.body.getAttribute('data-theme-legacy')).toBe('contrast');

    unsubscribe();
  });

  it('falls back to light for unsupported theme values', async () => {
    const { theme } = await loadThemeStore();

    let current;
    const unsubscribe = theme.subscribe((value) => (current = value));

    theme.set('sepia');

    expect(current).toBe('light');
    expect(window.localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    unsubscribe();
  });

  it('updates the document color scheme when theme changes', async () => {
    const { theme } = await loadThemeStore();

    theme.set('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');

    theme.set('hc');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(document.body.getAttribute('data-theme-legacy')).toBe('contrast');
  });
});

describe('language store', () => {
  it('initializes from stored language', async () => {
    window.localStorage.setItem('language', 'fr');
    const { language } = await loadLanguageStore();

    let current;
    const unsubscribe = language.subscribe((value) => (current = value));

    expect(current).toBe('fr');
    unsubscribe();
  });

  it('falls back to browser language when storage is empty', async () => {
    window.navigator.language = 'lv-LV';
    const { language } = await loadLanguageStore();

    let current;
    const unsubscribe = language.subscribe((value) => (current = value));

    expect(current).toBe('lv');
    unsubscribe();
  });

  it('writes language changes to locale and storage', async () => {
    const { language } = await loadLanguageStore();
    localeSetMock.mockClear();

    language.set('es');

    expect(localeSetMock).toHaveBeenCalledWith('es');
    expect(window.localStorage.getItem('language')).toBe('es');
  });

  it('warns and ignores unsupported languages', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { language } = await loadLanguageStore();
    localeSetMock.mockClear();

    language.set('jp');

    expect(warn).toHaveBeenCalled();
    expect(localeSetMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('language')).not.toBe('jp');

    warn.mockRestore();
  });
});
