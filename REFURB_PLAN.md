Here is a structured task list for a developer (Codex agent) to bring the Algorhythmics website into line with the design plan, fix existing bugs and inconsistencies, and remove obsolete code. Each task includes context, specific action items and sample code snippets to guide implementation.

---

## 1. Unify the theme system & remove the floating theme chooser

**Context:**
The current site mixes multiple ad‑hoc style sheets and uses a floating “Choose a theme” widget that overlaps content. Light/dark/high‑contrast modes are inconsistent.

**Actions:**

* Create a single `src/lib/styles/theme.css` defining neutral backgrounds (Cloud, Mist, Night), accent colours (Aurora Purple, Voyage Blue, Signal Yellow, Cherry Pop) and semantic tokens (e.g., `--bg`, `--text`, `--bg-elev-1`, `--border`, `--focus`).
* Import this file once in `src/routes/+layout.svelte` and remove `light.css`, `dark.css`, `hc.css` and other redundant theme files.
* Delete the floating theme chooser component; instead, add a small toggle in the header that switches the `data-theme` attribute on `<html>`.
* Ensure dark and high‑contrast modes override only the necessary tokens.

**Sample:**

```css
/* theme.css */
:root {
  --bg: #F5F7FB;
  --bg-elev-1: #FFFFFF;
  --bg-elev-2: #EEF1F7;
  --text: #0A0D14;
  --primary: #6A38FF; /* Aurora Purple */
  --secondary: #1351FF; /* Voyage Blue */
  --accent: #FFD339;
  --border: rgba(0,0,0,0.08);
  --radius: 16px;
}
[data-theme='dark'] {
  --bg: #0B0E13;
  --bg-elev-1: #121722;
  --bg-elev-2: #1A1D23;
  --text: #F2F5F9;
  --primary: #8A6BFF;
  --secondary: #3A71FF;
  --accent: #FFD339;
}
[data-theme='hc'] {
  --bg: #FFFFFF;
  --bg-elev-1: #FFFFFF;
  --bg-elev-2: #F0F3FA;
  --text: #000000;
  --primary: #4400FF;
  --secondary: #007A73;
  --accent: #B78300;
}
```

**Header toggle example (Svelte):**

```svelte
<script>
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
  }
</script>

<button on:click={() => setTheme('light')}>☀️</button>
<button on:click={() => setTheme('dark')}>🌙</button>
<button on:click={() => setTheme('hc')}>HC</button>
```

---

## 2. Simplify navigation and merge product pages

**Context:**
Navigation still lists separate NodeVoyage/Ideonautix pages and a “Pilot” link. The plan calls for a single “Platforms” page.

**Actions:**

* Remove `nodevoyage/+page.svelte` and `ideonautix/+page.svelte`.
* Create `src/routes/products/+page.svelte` (or `platforms/+page.svelte`) that showcases both NodeVoyage and Ideonautix using unified cards.
* Update the navigation menu (`src/lib/components/Nav.svelte` or `menu.js`) to use:

  ```js
  export const menu = [
    { label: 'Home', href: '/' },
    { label: 'Platforms', href: '/products' },
    { label: 'Consulting', href: '/consulting' },
    { label: 'Community', href: '/community' },
    { label: 'Contact', href: '/contact' }
  ];
  ```
* Remove any unused “Pilot” or “About” links if they no longer match the plan.

**Sample product page layout (Svelte):**

```svelte
<script>
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
</script>

<Hero variant="grid" title="Platforms" subtitle="Two paths to AI mastery" />

<section class="grid gap-6">
  <GlassCard halo>
    <h3>NodeVoyage</h3>
    <p>Self‑guided learning journeys that teach algorithms and data structures through interactive challenges.</p>
    <a class="btn" href="/platforms/nodevoyage">Learn more</a>
  </GlassCard>

  <GlassCard particles>
    <h3>Ideonautix</h3>
    <p>A collaborative sandbox for rapid prototyping and deploying AI ideas using modular components.</p>
    <a class="btn" href="/platforms/ideonautix">Learn more</a>
  </GlassCard>
</section>
```

---

## 3. Build reusable UI components (Hero, GlassCard, Button)

**Context:**
Various pages still have bespoke hero and card markup, with inconsistent gradients, shadows and spacing.  Only the consulting page uses the modern hero pattern.

**Actions:**

* **Hero component**: Create `src/lib/components/Hero.svelte` with props `{ variant, title, subtitle }`.  Implement variants: `aurora`, `grid`, `halo`, `line`, `particles`, respecting `prefers-reduced-motion` and high-contrast mode.  Use a neutral overlay behind text.
* **GlassCard component**: Create `src/lib/components/GlassCard.svelte` that applies a frosted translucent background (`backdrop-filter: blur(12px) saturate(1.2)`), subtle grain overlay (`background-image: var(--grain)`), border and shadow.  Accept props or `data-variant` attributes to add halo or particle underlays.
* **Button component**: Build `src/lib/components/Button.svelte` with a neutral surface and accent border; add focus ring and accessible text.

**Sample GlassCard:**

```svelte
<script>
  export let halo = false;
  export let particles = false;
</script>

<div class={`glass-card ${halo ? 'halo' : ''} ${particles ? 'particles' : ''}`}>
  <slot />
</div>

<style>
.glass-card {
  position: relative;
  padding: 2rem;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
}
.glass-card.halo::before {
  /* radial halo effect */
}
.glass-card.particles::before {
  /* subtle particle noise */
}
</style>
```

**Refactor pages:** replace custom card markup with `<GlassCard>`. For each route, import the `Hero` component and choose the appropriate variant.

---

## 4. Redesign and declutter site sections

**Context:**
Several sections are overloaded: duplicate bullet lists (“calm delivery rhythm”), broken headings in “Stay in our orbit”, misaligned CTA buttons and busy timelines.

**Actions:**

* **Hero & tagline**: Move hero CTAs outside gradient overlays; ensure headings have enough padding and contrast.
* **Our story / vision**: Keep the mission and calm delivery rhythm once. Remove duplication. Use a two-column layout on large screens with neutral backgrounds instead of tinted gradients.
* **Founders and partners**: Use `GlassCard` and unify layout: image (or placeholder), name/role, description, and contact links. Remove the theme chooser from this area.
* **Timeline**: Simplify the timeline UI. Use neutral surfaces for each milestone, accent-coloured dots along a vertical line, and place the filter panel above. Avoid overlapping nodes.
* **Stay in our orbit**: Rewrite the heading to “Stay in our orbit”. Provide a short paragraph about joining the community and another about booking a chat. List benefits once. Align the two CTA buttons horizontally below the text.
* **Footer**: Replace the four dark gradient cards with a single dark neutral bar. Add three columns: Company, Platforms, Resources. Use light text and underline links on hover.

**Example timeline markup:**

```svelte
<div class="timeline">
  <div class="filter-panel glass-card">
    <button on:click={() => setFilter('all')}>All</button>
    <button on:click={() => setFilter('active')}>Active</button>
    <!-- etc. -->
  </div>
  <ul class="timeline-list">
    {#each milestones as m}
      <li class="milestone">
        <span class="dot" style="background: var(--primary)"></span>
        <div class="milestone-content glass-card">
          <h4>{m.title}</h4>
          <p>{m.description}</p>
        </div>
      </li>
    {/each}
  </ul>
</div>
```

---

## 5. Clean up content, translations and localisation

**Context:**
The site still contains placeholder copy (e.g., “AI products with a people-first beat”) and duplicated bullet lists. Localisation keys are not consistently used.

**Actions:**

* Rewrite the English localisation file (`src/lib/i18n/en.json`) using the approved text from your content strategy.  Organise by page (home, platforms, consulting, community, contact, footer).
* Replace hard‑coded strings in components with references to translation keys via your i18n helper (e.g., `$t('home.tagline')`).
* Remove duplicated bullets and filler paragraphs.  Keep the founder’s biography unchanged if you prefer.
* Add fallback keys for future languages; ensure every string is keyed.

**Example `en.json`:**

```json
{
  "home": {
    "title": "AlgoRhythmics",
    "tagline": "Where logic dances with creativity — building accessible AI for education, startups, and people.",
    "features": {
      "learn": "Learn at your pace",
      "collaborate": "Collaborate and create",
      "consult": "Expert consulting"
    }
  },
  "platforms": {
    "title": "Platforms",
    "nodevoyage": {
      "heading": "NodeVoyage",
      "body": "Interactive lessons and challenges guide you from fundamentals to advanced topics."
    },
    "ideonautix": {
      "heading": "Ideonautix",
      "body": "A collaborative sandbox for building, sharing and deploying algorithmic prototypes."
    }
  }
  /* ... */
}
```

---

## 6. Clean the repository and enforce accessibility

**Context:**
The codebase still contains unused CSS files, outdated hero components, duplicate animation scripts and unnecessary assets. The site also lacks systematic accessibility checks (e.g., contrast, motion reduction).

**Actions:**

* Delete unused files: `light.css`, `dark.css`, `hc.css`, old `Hero*.svelte` components, experimental scripts and unreferenced images.
* Consolidate animation helpers into `src/lib/animations.js` and import them as needed. Remove duplicate or unused classes from `animations.css`.
* Use ESLint/Stylelint to identify unused code and enforce consistent styling.
* Integrate automated accessibility tests (e.g., Lighthouse CI or `axe-core`) into the build pipeline: check colour contrast, keyboard navigation, focus visibility, and `prefers-reduced-motion`.
* Document coding standards and design guidelines in `CONTRIBUTING.md` so future changes remain consistent with the design system.

**Example script to clean unused imports (JS):**

```bash
# run in project root
npx eslint --rule 'no-unused-vars: error' --ext .js,.svelte src/ > unused.txt
# review unused.txt and remove obsolete imports and files
```

---

### Summary

By following these six tasks, the website will transition from a patchwork of conflicting styles and duplicate content to a coherent, accessible experience consistent with the brand’s calm minimalism and glassy grain aesthetic. Each task encapsulates several subtasks and includes code examples to help the developer get started.
