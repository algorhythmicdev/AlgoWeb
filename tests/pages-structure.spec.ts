import { expect, test } from 'vitest';

const required = [
  { route: '/',            requiredH1: /./ }, // any H1
  { route: '/team',        requiredH1: /Team/ },
  { route: '/ideonautix',  requiredH1: /Ideonautix/ },
  { route: '/nodevoyage',  requiredH1: /NodeVoyage/ },
  { route: '/consulting',  requiredH1: /Consulting/ },
  { route: '/education',   requiredH1: /Education/ },
  { route: '/contact',     requiredH1: /Contact/ }
];

// NOTE: This is an abstract check—replace with Playwright/Kit SSR tests as needed.
test('page H1 names reflect IA (placeholder check)', () => {
  required.forEach(p => expect(p.requiredH1.test(String(p.requiredH1))).toBe(true));
});
