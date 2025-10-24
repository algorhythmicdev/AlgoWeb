# Algorhythmics Website — Source of Truth (SoT) v1.0

**Scope.** One canonical reference for the Algorhythmics marketing website and its adjacent UX. This file is self‑contained, agent‑ready, and free of external links. It merges the latest Canvas edits with repo‑verified facts and final decisions called out by the team.

**Audience.** Product owners, designers, engineers, QA, and agents.

**Status.** Living document. Changes require PR with a short rationale.

---

## 1) Brand, Voice, Positioning

* **What we are:** AI consulting plus two flagship products, **NodeVoyage** (AI travel planning) and **Ideonautix** (startup education/productivity toolkit).
* **Who we serve:** Businesses, schools/universities, creators, and early adopters.
* **Where we are:** Latvia‑based (Daugavpils). Local first, EU‑ready.
* **Voice:** Straight talk. Explain like to a smart 10‑year‑old. No whimsical words. Avoid marketing fluff.
* **Signage mention:** Only in team bio and partners; not a core site theme.
* **Primary outcomes/KPIs:** Traffic growth, trial signups, inbound consulting leads, repeat visits.

---

## 2) Information Architecture (IA)

**Primary navigation (production labels):** Home • Team • Ideonautix • NodeVoyage • Consulting • Contact • Education

**Pages and intent:**

* **Home.** Clear value/mission, product cards, consulting teaser, education teaser, testimonials, real timeline, primary CTA (“Let’s create something awesome”).
* **Team.** Latvia/Daugavpils emphasis, mission, background, partners (e.g., LIAA, current workplace reference), transparent contact.
* **Ideonautix.** Overview, mission, compact gallery/preview of the live platform snapshot, simple features.
* **NodeVoyage.** Overview, mission, compact gallery/preview of the live platform snapshot, simple features.
* **Consulting.** Services and process, practical outcomes, pilot application form with remaining spots indicator.
* **Education.** Plain info page to start; outlines programs for schools/universities; will grow.
* **Contact.** Intent‑aware form, calendar/slots if enabled, address and social.

**Footer.** Repeat nav + partner logos + legal. All images provided as transparent PNG with multiple densities.

---

## 3) Reusable Blocks & Components (site‑level)

* **Navigation bar.** Keyboard accessible, visible focus rings, active route state via `aria-current`.
* **Theme switcher.** Modes: Light, Dark, High‑Contrast. Persist user choice. No layout shift on toggle.
* **Language switcher.** Locale persisted; labels translated; no dropdown trap.
* **Hero with primary CTA.** Minimal motion; no parallax by default.
* **Feature grid.** 2–3 columns on desktop, single column on mobile; each item has icon, title, one‑line body.
* **FAQ accordion.** Semantic markup with proper button semantics and `aria-expanded`.
* **Pricing/plan table (optional).** Mobile‑first stacked layout; clear monthly/yearly toggle.
* **Testimonials carousel (optional).** Pausable and accessible; auto‑advance disabled by default.
* **Contact form (multi‑step).** Intent select → short fields → confirmation; inline validation; ARIA live errors.
* **Video lightbox.** Reduced‑motion fallback; includes visible close button and ESC support.
* **Footer columns.** Company, Products, Resources, Legal; partner logos with alt text.
* **Loading overlay.** Non‑blocking; avoid trapping focus.
* **Icon system.** **Lucide** icon set; consistent sizes; no emojis in UI.

---

## 4) Content & Microcopy Rules

* Write in plain English; short sentences; active voice.
* Use concrete labels: “Get a demo,” “Start planning,” “Contact consulting.”
* No metaphors; avoid buzzwords. Explain any technical term on first mention.
* Accessibility first: meaningful link text, input help text, and error summaries.
* Keep headings descriptive; avoid empty slogans.

**Standard CTAs:**

* Primary: “Get a demo” / “Start planning” / “Talk to us”
* Secondary: “See features” / “Read how it works” / “View roadmap”

**Form errors:**

* Title: “Please fix the highlighted fields.”
* Field pattern: “This field needs a valid email address.”

**Empty states:**

* “Nothing here yet. We’re building it in public—check back soon.”

---

## 5) Design System

**Color principles (tokenized):**

* Keep AAA contrast for body text in all themes.
* Each theme defines a minimal set of base tokens: background, surface, border, text, subtle‑text, primary, primary‑text‑on, muted, success, warning, danger.
* Avoid glass effects on primary content blocks; use sparingly for cards/overlays.

**Typography:**

* Headings: Montserrat.
* Body: Inter.
* Code: JetBrains Mono.
* Reading comfort: generous line height; max line width for paragraphs; avoid center alignment for long text.

**Spacing, radius, shadows:**

* Spacing scale uses small, medium, large steps; keep vertical rhythm consistent.
* Radius scale for buttons/cards/dialogs; avoid mixed radii on siblings.
* Shadow scale: subtle elevation for interactive cards; no heavy drop shadows.

**Icons:**

* Lucide only; 1–2 px stroke; sizes snap to 16/20/24/32; accessible `aria-label` when stand‑alone.

**Motion:**

* Subtle; default durations short; easing gentle; respect `prefers-reduced-motion` and offer static fallbacks.

**Accessibility (WCAG 2.2 AA/AAA):**

* Semantic HTML, headings in order, visible focus outlines, keyboard navigation, skip links, alt text policy, logical tab order, ARIA live regions for validation.

---

## 6) Animations (Rules & Catalog)

**Rules:**

* Never rely on motion to convey essential information.
* Disable complex effects when reduced motion is requested.
* Prefer transform/opacity; avoid layout‑thrashing effects.

**Catalog (site‑wide primitives):**

* **Fade in/out.** Parameters: duration, delay.
* **Slide in (Y).** Parameters: offset, duration, easing.
* **Scale subtle.** Parameters: start scale, end scale, duration.
* **Stagger group.** Parameters: per‑item delay, easing; must cap total delay.

Each primitive documents: name, purpose, parameters, defaults, and reduced‑motion behavior.

---

## 7) Performance Budgets

* **LCP:** < 2.5 s (mobile).
* **INP:** < 200 ms.
* **CLS:** < 0.1.
* **TTI:** < 5 s.

**Practices:** route code‑splitting, responsive images (WebP/AVIF + `srcset`), lazy loading below the fold, prefetching on intent, cache‑first static assets, minimal third‑party scripts.

---

## 8) SEO & Structured Data

* Per‑page title and description; unique H1; canonical URL.
* OpenGraph/Twitter cards with language‑appropriate text.
* `hreflang` for all languages present.
* JSON‑LD where relevant: Organization, Product, Article, FAQ, Breadcrumb.
* Auto‑generated sitemap and robots.

**Meta template (abstract):**

* Title: “{Page} — Algorhythmics”
* Description: 140–160 chars; straight talk.
* OG: title, description, image (safe crop), type, locale.

---

## 9) Internationalization

* **Initial locales:** EN, LV, RU.
* **Future locales:** UK, FR, ES.
* **URL policy:** Language‑aware routes; consistent slugs per locale.
* **Switching:** Persist choice; do not reset theme.
* **Messages:** All UI strings externalized; no hard‑coded text in components.
* **Coverage:** Build must fail on missing critical keys.

---

## 10) Privacy, Security, Compliance

* **Consent:** Granular cookie categories: Essential, Analytics, Marketing. No analytics before consent.
* **Legal pages:** Privacy, Terms, Cookies (multilingual).
* **Forms:** Server‑side validation; rate limiting; basic bot mitigation; success confirmation page.
* **Security headers:** Strict transport, content security policy minimizing inline scripts, referrer policy, frame options for lightbox safety.
* **Backups:** Static artifacts retained per release; roll‑back plan documented.

---

## 11) Analytics & Experimentation

* **Events (baseline):** page_view, nav_click, cta_click, demo_start, form_start, form_submit, theme_toggle, locale_toggle, error_shown.
* **Attribution:** Preserve UTM parameters on session; include language and theme context.
* **A/B:** Small, reversible experiments; feature flags wrapped with accessible fallbacks.
* **Dashboards:** Weekly snapshot, monthly deep‑dive, quarterly strategy notes.

---

## 12) Tech Stack & Hosting

* **Frontend:** SvelteKit + TypeScript.
* **Styling:** Tokenized design system; utility classes; custom CSS for reading comfort.
* **Icons:** Lucide.
* **Hosting:** Static export deployed to GitHub Pages under the base path `/AlgoWeb/`.
* **CI:** Preview builds for pull requests; secret scanning for safety.

**Acceptance for build/deploy:**

* Production build uses the correct base path so all assets resolve on Pages.
* PR previews comment back with a URL; smoke tests validate critical selectors.

---

## 13) Products on the Website

* **NodeVoyage:** Nodi‑aided planning, live map/timeline feel, collaboration, sustainability notes, mobile capture/AR ideas, community concept (Travel DNA, mentors).
* **Ideonautix:** Startup/Education toolkit—Pitch Assistant, Competitive Intelligence, Pomodoro Coach, Smart Standups, Revenue Dashboard.
* **Unified story:** Shared AI approach and cross‑insights. Demos appear as videos or static previews within the site’s constraints.

---

## 14) Testing & Quality

* **Unit/Integration:** Components render, navigation works, forms validate.
* **Accessibility tests:** Keyboard nav, focus order, `aria-current`, labels, error announcements, color contrast checks per theme.
* **Reduced‑motion:** Animations skip or simplify when requested.
* **Content checks:** Required selectors present on key pages; no missing i18n keys.

**Definition of Done (per ticket):**

* Meets acceptance criteria; no console errors; passes tests and linters; a11y score ≥ AA; copy checked; screenshots updated.

---

## 15) Contribution & Workflow

* **Branching:** Feature branches off `main`. Keep PRs small.
* **Commits:** Conventional commits (feat, fix, chore, docs, test, refactor, perf, ci).
* **PR checklist:** Screenshots/video for UI; a11y notes; i18n keys added; tests included; release notes line if user‑visible.
* **Labels:** area/ui, area/i18n, area/seo, area/a11y, perf, content, design, infra.

---

## 16) Backlog (Agent‑Ready)

**Epic A — IA & Navigation**

* A1. Confirm nav labels/order against page set.
* A2. Implement `aria-current` and keyboard order; add tests.
* A3. Footer: legal + partner logos with alt text.

**Epic B — Design System**

* B1. Tokenize colors/spacing/radius/shadows/motion; document in this file.
* B2. Typography rules documented; add examples for code, lists, quotes.
* B3. Themes enumerated; contrast pairs verified; add CI contrast checks.

**Epic C — Blocks & Components**

* C1. Build Hero, Feature grid, FAQ, Contact form, Video lightbox, Code block.
* C2. Make locale and theme switchers sticky (if desired) with full a11y.

**Epic D — Internationalization**

* D1. Add LV and RU translation stubs; ensure strict key coverage.
* D2. Add `hreflang` and language‑aware routes; verify canonical.
* D3. Expand tests for missing keys and mislabeled routes.

**Epic E — SEO**

* E1. Meta generators (title/description/OG/Twitter).
* E2. JSON‑LD blocks for Organization, Product, Article, FAQ, Breadcrumb.
* E3. Auto sitemap and robots; submit at release.

**Epic F — Analytics & Experimentation**

* F1. Wire baseline events; honor consent.
* F2. Implement A/B scaffold with accessible fallback.
* F3. Weekly snapshot job and monthly analysis template.

**Epic G — Performance & PWA**

* G1. Responsive image pipeline (WebP/AVIF + srcset) with size budgets.
* G2. Route code‑split and prefetch on hover/intent.
* G3. Cache‑first policy for static assets; verify no layout shift on interactions.

**Epic H — Deploy & CI**

* H1. Verify base path `/AlgoWeb/` everywhere; smoke test built site.
* H2. PR previews with auto comment; token/secrets guard green.
* H3. Release notes generated from conventional commits.

---

## 17) Open Decisions (with current resolutions)

* **Team page label vs. `about`:** Use **Team**.
* **Education visibility before content:** Keep **Education** visible with a minimal info page now; expand later.
* **Icon set:** **Lucide**.


**End of Source of Truth v1.0**
