// @ts-nocheck
import { afterEach, beforeAll, expect } from 'vitest';
import { cleanup } from '@testing-library/svelte/svelte5';
import { addMessages, init } from 'svelte-i18n';
import en from '$lib/i18n/en.json';

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  });
}

if (typeof window !== 'undefined') {
  const originalGetComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = (element, pseudo) => originalGetComputedStyle(element, undefined);
  window.computedStyle = window.getComputedStyle;
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    clip: () => {},
    arc: () => {},
    quadraticCurveTo: () => {},
    fill: () => {},
    stroke: () => {},
    rotate: () => {},
    scale: () => {},
    translate: () => {},
    transform: () => {},
    rect: () => {},
    fillText: () => {},
    strokeText: () => {},
    measureText: () => ({ width: 0 }),
    getLineDash: () => [],
    setLineDash: () => {},
    createLinearGradient: () => ({}),
    createPattern: () => ({}),
    createRadialGradient: () => ({})
  });
}

beforeAll(() => {
  addMessages('en', en);
  init({ fallbackLocale: 'en', initialLocale: 'en' });
});

afterEach(() => {
  cleanup();
});
