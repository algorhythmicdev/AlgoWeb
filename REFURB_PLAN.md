# AlgoWeb Refurbishment Plan

## Goal
Complete the design overhaul per `designUpdate.pdf`, resolve outstanding UI/UX defects, and ensure WCAG AAA compliance across light, dark, and high-contrast themes before release.

## Progress Snapshot (2025-02-15)
- [x] Refresh global design tokens with new brand palettes and typography guidance (`src/lib/styles/tokens.css`).
- [x] Apply frosted OS-window shell styling to shared layouts (`src/lib/styles/global.css`, hero/CTA components).
- [x] Remove redundant hero badges / micro-titles and expand hero copy across marketing pages.
- [x] Enlarge product demo preview frames and improve responsive behavior.
- [ ] Resolve CSS minifier warnings in `ProductDemoPreview` keyframes and audit related animation utilities.
- [ ] Finish dark / high-contrast theme polish (background surfaces, cards, focus states, header text-fit issues).
- [ ] Validate community hero messaging/content alignment with design brief.
- [ ] Final accessibility + visual regression pass across all modes/devices.

## Remaining Workstreams & Tasks

### 1. Animation + Build Hygiene
- [ ] Fix malformed `@keyframes` definitions in `src/lib/components/ProductDemoPreview.svelte` to remove minifier warnings.
- [ ] Update `src/lib/utils/animations.js` (or dependent modules) to reference new `.os-window` class where `glass-card` was used.
- [ ] Re-run `npm run build`; ensure zero warnings and document results.

### 2. Theme Polish & Accessibility
- [ ] Dark theme: adjust neutral surfaces, card backgrounds, and header containers for consistent contrast (target WCAG AAA on primary text/buttons).
- [ ] High-contrast mode: ensure base background swaps, CTA/button colors, and focus rings meet AAA ratios; verify nav hover/active states.
- [ ] Confirm hero sections (landing, community, products, consulting, contact) communicate full value without auxiliary badges.
- [ ] Verify header layout accommodates long labels in all breakpoints and themes.

### 3. QA & Documentation
- [ ] Visual smoke test per route (desktop + mobile) in light/dark/high-contrast modes; capture issues for follow-up.
- [ ] Accessibility sweep (keyboard focus order, reduced motion, screen reader landmarks).
- [ ] Summarize findings, confirm readiness for sign-off, and prep release notes.

## Next Checkpoint
After completing Workstream 1 and initial theme adjustments, regroup to review visual diffs/screenshots and confirm no regressions before final QA.
