# AlgoWeb Refurbishment Plan

## Vision & Outcomes
Deliver the refreshed AlgoRhythmics experience outlined in `designUpdate.pdf`: unified story-driven hero moments, OS-inspired surfaces, and an accessible colour system that achieves WCAG AAA across light, dark, and high-contrast modes. The finished site should communicate the brand pillars (AlgoRhythmics, NodeVoyage, Ideonautix) with consistent voice, motion, and theming.

## Design Direction & Palette Notes
- Core surfaces: `Aurora Mist` (light), `Midnight Nebula` (dark), `Obsidian Matrix` (high-contrast) with glass overlays for depth.
- Brand primaries: `Voyage Blue` for navigation & CTAs, `Aurora Purple` accents, `Signal Yellow` highlight for key metrics; `Cherry Red` limited to alerts.
- Supporting neutrals follow new scale (`--neutral-050` … `--neutral-950`) to harmonise data visuals and copy blocks.
- Motion language: progressive parallax, halo drift, micro-interactions on CTA buttons, and OS-window focus shimmer; honour `prefers-reduced-motion` overrides.
- Typography: maintain Inter/Space Grotesk pairing with updated tracking and weight guidance per tokens file.

## Progress Snapshot (2025-02-15)
- [x] Refresh global design tokens with new brand palettes, neutral ramps, and typography guidance (`src/lib/styles/tokens.css`).
- [x] Apply frosted OS-window shell styling to shared layouts (`src/lib/styles/global.css`, hero/CTA components) and document usage.
- [x] Remove redundant hero badges/micro-titles; expand headline/body copy so each hero communicates the full product promise.
- [x] Enlarge product demo preview frames, add beam/orb treatment, and improve responsive behavior.
- [ ] Ship hero narrative polish (update storytelling beats, CTA hierarchy, and imagery references) per section checklist below.
- [ ] Resolve CSS minifier warnings in `ProductDemoPreview` keyframes and audit related animation utilities.
- [ ] Finish dark/high-contrast theme polish (background surfaces, cards, focus states, header text-fit issues).
- [ ] Final accessibility + visual regression pass across all modes/devices.

## Hero Overhaul Checklist
- [ ] Landing hero: align copy to "Think Faster. Ship Smarter." positioning, confirm gradient/readability across all themes.
- [ ] Community hero: ensure the manifest message loads on first paint, embed community metrics, and remove placeholder badge.
- [ ] Products hero: reinforce "Platform constellation" narrative; verify animated headline contrasts with background.
- [ ] Consulting hero: integrate client testimonial callout with new palette.
- [ ] Contact hero: harmonise CTA trio with OS-window shells and update map accent colours.

## Colour System Revamp
- [x] Map light theme surfaces/buttons/typography to new tokens.
- [ ] Dark theme: tune neutrals, nav background, and OS-window borders to hit AAA contrast.
- [ ] High-contrast: ensure base background swaps, CTA/button states, focus rings, and alerts satisfy AAA ratios and avoid colour clashes.
- [ ] Document palette usage in README/design notes for future contributors.

## Motion & Interaction Blueprint
### Global Principles
- [ ] Define timing curve set: `var(--ease-out-soft)` for hero entrances, `var(--ease-in-out)` for loops, `var(--ease-snappy)` for button feedback.
- [ ] Establish animation duration scale (120 ms micro, 240 ms UI, 420–640 ms hero reveals) and codify in tokens/utility classes.
- [ ] Expand reduced-motion strategy: provide static gradients/illustrations when animations disabled; ensure essential info remains visible.
- [ ] Build motion QA checklist (CPU/GPU profiling, jank budget <4 ms) for regression tests.

### Hero Systems
- [ ] Landing hero: implement layered parallax of background nebula + foreground product orbit; trigger once on load and on scroll into view.
- [ ] Community hero: add kinetic text reveal synced with participation metrics counter; include subtle background pulse tied to `Signal Yellow` accent.
- [ ] Products hero: animate constellation map nodes with staggered glow, CTA windows slide-in with OS chrome easing.
- [ ] Consulting hero: bring testimonial cards on with vertical float + fade; highlight key quote words via colour cycling (respecting AAA contrast).
- [ ] Contact hero: animate map/ping elements and CTA button focus rings; ensure cross-theme clarity.

### Supporting Components
- [ ] Navigation hover/active states: soften underline grow + glow accent; align with focus outlines.
- [ ] Buttons/CTAs: implement press depth effect via `transform` + shadow transition; keep accessible in high-contrast.
- [ ] Cards/OS windows: introduce idle shimmer using gradients; verify GPU-friendly (translate/opacity only) and throttle on low-power devices.
- [ ] Product demo preview: ensure orb/beam loops refined post-keyframe fix; add frame focus pulse on hover with easing tokens.
- [ ] Section dividers/footer: add scroll-triggered gradient sweep and icon micro-motions for continuity.

### Implementation Tasks
- [ ] Audit `src/lib/utils/animations.js` and related helpers; migrate reusable keyframes/timings into shared module.
- [ ] Create Svelte actions for intersection-triggered reveals (`useReveal`, `useParallax`) with built-in reduced-motion fallbacks.
- [ ] Document usage patterns in CONTRIBUTING or design notes to keep future components aligned.

## Remaining Workstreams & Tasks

### 1. Animation + Build Hygiene
- [ ] Fix malformed `@keyframes` definitions in `src/lib/components/ProductDemoPreview.svelte` to remove minifier warnings.
- [ ] Update `src/lib/utils/animations.js` (or dependent modules) to reference new `.os-window` class where `glass-card` was used.
- [ ] Create shared animation utilities (timing/duration tokens, reusable keyframes) and document usage in `global.css` or a new motion module.
- [ ] Re-run `npm run build`; ensure zero warnings and document results.

### 2. Theme Polish & Accessibility
- [ ] Dark theme: adjust neutral surfaces, card backgrounds, and header containers for consistent contrast (target WCAG AAA on primary text/buttons).
- [ ] High-contrast mode: ensure base background swaps, CTA/button colors, focus rings meet AAA ratios; verify nav hover/active states.
- [ ] Confirm hero sections (landing, community, products, consulting, contact) communicate full value without auxiliary badges.
- [ ] Verify header layout accommodates long labels in all breakpoints and themes.

### 3. QA & Documentation
- [ ] Visual smoke test per route (desktop + mobile) in light/dark/high-contrast modes; capture issues for follow-up.
- [ ] Accessibility sweep (keyboard focus order, reduced motion, screen reader landmarks).
- [ ] Summarize findings, confirm readiness for sign-off, and prep release notes.

## Next Checkpoint
After completing Workstream 1 and the hero overhaul checklist, regroup to review visual diffs/screenshots and confirm no regressions before final QA.
