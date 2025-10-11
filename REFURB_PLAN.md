Here’s a **properly formatted, full Markdown issue tracker** for the Algorhythmics website — incorporating everything from our repo analysis, UX/UI audits, and your design directives.
It’s structured for direct handoff to your web team — with **clear instructions for progress tracking**.

---

# 🧭 AlgoRhythmics Website – Complete Issue & Progress Tracker

> **Instructions:**
>
> * Each row = one actionable item.
> * Once an issue is fixed, **delete the entire row**.
> * Keep sections grouped by **priority** (Critical → Moderate → Cosmetic).
> * Developers must confirm fixes via visual and accessibility validation (AAA contrast, responsiveness, motion reduction).

---

## 🚨 Critical Issues (Affecting UX/UI or Functionality)

| ID | Area                      | Issue                                                    | Root Cause                                               | Proposed Fix                                                                                                         | Status         |
| -- | ------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------- |
| C1 | Theme System              | Light/Dark/HC themes inconsistent, some pages white-only | Incomplete import of theme variables and tailwind tokens | Unify `theme.css` imports, consolidate all color tokens under `theme-tokens.css`, validate each mode in `App.svelte` | 🔧 Pending     |
| C2 | Navigation                | “Products” submenu redundant (NodeVoyage & Ideonautix)   | Duplicate routes and outdated nav JSON                   | Merge both into one “Platforms” page with scroll anchors for each                                                    | 🔧 Pending     |
| C3 | Hero Sections             | Missing animations except Consulting page                | Local hero component versions diverged                   | Refactor shared `Hero.svelte` with unified animation (fade+grain+halo), parameterize per page                        | 🔧 Pending     |
| C4 | Background Effects        | Missing halo & motion background                         | Missing import of `backgroundFX.js` and CSS overlay      | Reinstate `HaloFX.svelte` and `AnimatedBackground.svelte` across all layouts, respect `prefers-reduced-motion`       | 🔧 Pending     |
| C5 | Contrast Compliance       | Multiple low-contrast areas (white on pastel gradients)  | Ignored WCAG AAA rules                                   | Use overlay neutral backgrounds (e.g., `rgba(10,13,20,0.7)`), validate with contrast checker                         | 🔧 Pending     |
| C6 | Inconsistent Layout Grids | Consulting page uses new grid, others old                | Mixed Tailwind spacing and custom CSS                    | Unify under `layout-grid.css` (12-col responsive, 4pt base spacing)                                                  | 🔧 Pending     |
| C7 | Translations              | English JSON text poor, random placeholders              | Old dummy en.json content                                | Rewrite content based on company copy (see below)                                                                    | 🟢 In progress |

---

## ⚙️ Moderate Issues (Affecting Design Consistency)

| ID | Area          | Issue                                            | Proposed Fix                                                                                 | Status     |
| -- | ------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- | ---------- |
| M1 | Buttons/CTAs  | Some buttons inconsistent (rounded vs square)    | Use shared `Button.svelte` with theme tokens and state indicators (focus ring 3:1)           | 🔧 Pending |
| M2 | Cards         | Card styling inconsistent, missing glass & grain | Reintroduce glass-layer and grain textures from `/assets/ui/textures` with `backdrop-filter` | 🔧 Pending |
| M3 | Typography    | Heading margins inconsistent, spacing off        | Use standard type ramp: H1=2.25rem/700, H2=1.75rem/600, body=1rem/500                        | 🔧 Pending |
| M4 | Animations    | Some transitions abrupt or missing               | Add fade/reveal via IntersectionObserver, hover elevation, scroll-linked animations          | 🔧 Pending |
| M5 | Accessibility | Keyboard navigation focus not visible            | Add focus ring (`outline-offset: 3px`, `color: var(--focus-ring)`) to all interactives       | 🔧 Pending |
| M6 | SEO           | Meta tags missing on subpages                    | Add `load` function with `<svelte:head>` per route                                           | 🔧 Pending |

---

## 🎨 Design Refinements (Visual Polish)

| ID | Area             | Issue                              | Proposed Enhancement                                                                          | Status     |
| -- | ---------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- | ---------- |
| D1 | Hero Animations  | Static gradients                   | Add slow moving gradient with grain overlay and frosted glass window panes                    | 🔧 Pending |
| D2 | Page Backgrounds | Need variation per page            | Assign per-route dynamic gradient (NodeVoyage blue, Ideonautix purple-slate, Algo gold-white) | 🔧 Pending |
| D3 | Card Highlights  | Missing hover/halo fx              | Add subtle radial glow animation on hover                                                     | 🔧 Pending |
| D4 | Section Dividers | Abrupt color transitions           | Add frosted divider with blur and subtle noise texture                                        | 🔧 Pending |
| D5 | Footer           | Needs consistent layout & contrast | Use dark neutral variant with clear links + hover underline                                   | 🔧 Pending |
| D6 | Iconography      | Mixed sizes and stroke widths      | Standardize to 2px outline, rounded icons (Lucide set)                                        | 🔧 Pending |

---

## 📚 Content Updates (en.json / Text Audit)

| Section       | Current Issue                  | Proposed Text                                                                                      |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| Homepage hero | Placeholder “AI for everyone!” | “Where logic dances with creativity — building accessible AI for education, startups, and people.” |
| Consulting    | Overly generic                 | “From strategy to code — helping organizations embed AI responsibly, ethically, and effectively.”  |
| NodeVoyage    | Old copy                       | “Your AI-powered travel companion — plan, explore, and remember your journeys effortlessly.”       |
| Ideonautix    | Old copy                       | “The productivity suite for modern creators — where every idea gets momentum.”                     |
| Footer        | Random placeholders            | “© 2025 AlgoRhythmics — Shaping creative intelligence. Riga, Latvia.”                              |

---

## 🧱 Structural Cleanup Tasks

| ID | File                    | Action                           | Details                                                                   | Status         |
| -- | ----------------------- | -------------------------------- | ------------------------------------------------------------------------- | -------------- |
| S1 | `/routes/products/`     | Delete redundant subpages        | Replace with unified `Platforms` section                                  | 🔧 Pending     |
| S2 | `/lib/theme/`           | Remove old token files           | Keep only `theme-tokens.css`, `theme-utils.ts`                            | 🔧 Pending     |
| S3 | `/lib/components/`      | Merge duplicated Hero components | Consolidate into `/Hero.svelte` with props for title, subtitle, animation | 🔧 Pending     |
| S4 | `/assets/css/`          | Clean unused gradients           | Keep only AAA-tested backgrounds                                          | 🔧 Pending     |
| S5 | `/translations/en.json` | Rewrite per approved copy        | See table above                                                           | 🟢 In progress |
| S6 | `/components/cards/`    | Replace legacy shadows           | Use frosted glass variant with `backdrop-blur-md bg-opacity-40`           | 🔧 Pending     |

---

## 🧩 Future Enhancements

| Feature                | Description                                              | Planned Implementation               |
| ---------------------- | -------------------------------------------------------- | ------------------------------------ |
| Animated Hero Variants | Each page hero has unique gradient motion and halo fx    | CSS variables + IntersectionObserver |
| OS-like Shells         | Desktop-style layout for web, mobile-OS look for Flutter | Shared token system for shells       |
| Dynamic Grain Engine   | Subtle motion grain layer on neutral cards               | WebGL noise layer w/ opacity fade    |
| Accessibility Checker  | Auto run Lighthouse + axe-core                           | CI/CD step post-build                |

---

## ✅ Verification Checklist

* [ ] All pages conform to 3 theme modes
* [ ] Each text element passes AAA (or AA for large text)
* [ ] No duplicate routes or components remain
* [ ] All interactive elements have visible focus
* [ ] `prefers-reduced-motion` honored globally
* [ ] `en.json` replaced and tested
* [ ] Unified design (glassy, grainy, calm minimalism) consistent site-wide

---

Would you like me to export this tracker as a downloadable Markdown file (`algorhythmics_fix_tracker.md`) for your GitHub issue management? I can also include commit message suggestions and code file references for each fix.
