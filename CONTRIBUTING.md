# Contributing Guidelines

Thank you for helping to keep the AlgoRhythmics site calm, accessible, and maintainable. This guide summarises the expectations for code changes.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Available commands**
   - `npm run check` – type-check the Svelte project.
   - `npm run lint` – validate localisation coverage and run ESLint.
   - `npm run test` – execute the Vitest suite, including automated accessibility checks powered by axe-core.

All three commands must pass before opening a pull request.

## Coding Standards

- **Design tokens first** – pull colours, spacing, motion timings, and typography from `src/lib/styles/theme.css`. Avoid hard-coded values unless you are introducing a new token.
- **Glass surfaces** – prefer `GlassCard` or the `os-window` shell for elevated panels. When you need motion helpers, import them from `src/lib/animations.js` rather than re-implementing effects.
- **Translations** – every user-facing string belongs in `src/lib/i18n/en.json` (and sibling locale files). Use the `$t`/`$_` helpers instead of hard-coded copy.
- **Components over duplication** – lean on the shared components in `src/lib/components` and `src/lib/sections` before adding new bespoke markup.
- **Type safety** – keep TypeScript annotations in new Svelte scripts and utility modules. When in doubt, favour explicit types and readonly data structures.

## Accessibility Expectations

- Respect user preferences such as `prefers-reduced-motion` and high-contrast mode. The shared animation helpers already handle these cases—reuse them.
- Validate colour contrast when adding new styles. The automated `axe` checks will flag common contrast issues, but manual verification is encouraged.
- Provide appropriate ARIA labels and ensure every interactive element is reachable with the keyboard.
- When creating custom actions or animations, degrade gracefully if browser APIs (e.g., `IntersectionObserver`) are unavailable.

## Pull Request Checklist

Before submitting, confirm the following:

- [ ] Code is formatted and linted (`npm run lint`).
- [ ] Type checks pass (`npm run check`).
- [ ] Tests, including accessibility checks, pass (`npm run test`).
- [ ] Relevant documentation (including this file) is updated if conventions change.
- [ ] Screenshots are provided for visual changes when practical.

By following these guidelines we can keep the refurbishments aligned with the calm, glassy aesthetic while ensuring an accessible experience for everyone.
