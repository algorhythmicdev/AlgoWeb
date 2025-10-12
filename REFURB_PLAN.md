1. Finalise the unified theme and remove gradient overload *(Status: ✅ Completed — hero, founders, partners, and timeline now sit on neutral grain surfaces with softened accents)*

Context:
Gradients still dominate many backgrounds (hero, founders, partners, timeline), reducing legibility
algorhythmics.dev
. The plan calls for neutral surfaces with grain and subtle gradients only in hero backgrounds.

Actions:

Consolidate all colour tokens in theme.css (light, dark, high‑contrast) and import once in +layout.svelte.

Create semantic variables (--bg, --bg-elev-1, etc.) and remove per-component gradient backgrounds. Apply these tokens throughout.

Replace gradient backgrounds in founders, partners, timeline and hero with neutral surfaces (var(--bg-elev-1)) and apply a subtle grain overlay via CSS.

Adjust accent gradients (Aurora Purple/Voyage Blue) to appear in hero bars or halo overlays rather than behind body text.

Example snippet:

/* apply neutral backgrounds on sections */
.section {
  background: var(--bg-elev-1);
  color: var(--text);
}
/* optional grain overlay */
.section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/assets/grain.png');
  opacity: 0.05;
  pointer-events: none;
}

2. Merge NodeVoyage & Ideonautix into one Platforms page *(Status: ✅ Completed — legacy routes removed, unified platforms hub live, and all internal links point to anchors on /platforms)*

Context:
Navigation uses a “Platforms” link, but the footer still lists NodeVoyage and Ideonautix as separate pages and their route files likely exist
algorhythmics.dev
.

Actions:

Delete src/routes/nodevoyage/+page.svelte and src/routes/ideonautix/+page.svelte.

Build a unified src/routes/platforms/+page.svelte featuring two GlassCard components for NodeVoyage and Ideonautix, each with a short description and CTA.

Update any internal links to point to /platforms instead of the old pages.

In the footer’s “Products” column, list only “Platforms” or use scroll anchors (#nodevoyage, #ideonautix) to jump within the unified page.

Example layout code:

<Hero variant="grid" title="Platforms" subtitle="Two paths to AI mastery" />
<section class="grid md:grid-cols-2 gap-6">
  <GlassCard halo>
    <h3>NodeVoyage</h3>
    <p>Your AI-powered travel companion — plan, explore and remember journeys effortlessly.</p>
    <Button href="/platforms#nodevoyage">Learn more</Button>
  </GlassCard>
  <GlassCard particles>
    <h3>Ideonautix</h3>
    <p>The productivity suite for modern creators — where every idea gets momentum.</p>
    <Button href="/platforms#ideonautix">Learn more</Button>
  </GlassCard>
</section>

3. Refactor founders and partners into reusable GlassCard components *(Status: ✅ Completed — shared GlassCard layout now powers founders and partners with deduped content and neutral frosted styling)*

Context:
Founders and partners sections use tinted gradient cards with duplicated bullets and inconsistent layouts
algorhythmics.dev
.

Actions:

Create a GlassCard.svelte component using a frosted background (backdrop-filter: blur(12px)) and soft border.

Move the founders’ content into two GlassCard instances with consistent formatting: header (role), name, contact buttons, one list of core strengths, one list of recent wins. Remove duplicate bullet points on Nikita’s card.

Similarly, represent each partner as a GlassCard with fields (Name, Description, Website, Focus). Shorten copy to avoid wall of text and maintain vertical rhythm.

Ensure text remains readable on neutral backgrounds and accent colors are used only for links or badges.

Example GlassCard skeleton:

<div class="glass-card">
  <h4 class="text-sm uppercase">{title}</h4>
  <h3 class="text-xl font-semibold">{name}</h3>
  <slot /> <!-- body content -->
</div>
<style>
.glass-card {
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  padding: 1.5rem;
}
</style>

4. Enhance the timeline with interactive filtering & neutral styling *(Status: ✅ Completed — timeline cards now sit on neutral glass surfaces with clickable status filters)*

Context:
The timeline has been simplified but still uses a tinted gradient; the category text (“Active / Development / Planned / Vision”) is not interactive
algorhythmics.dev
.

Actions:

Change the timeline section background to var(--bg-elev-1). Remove tinted overlays from milestone cards.

Represent each milestone as a GlassCard or neutral card with a left-aligned accent dot (colour-coded by status).

Implement a simple category filter: clicking a status badge filters the list by status. Use Svelte reactive variables or stores to manage state.

For accessibility, ensure the timeline is keyboard navigable and the filter is announced by screen readers.

Example filter snippet:

<script>
  let filter = 'all';
  const milestones = [...]; // array with { status: 'active', title, ... }

  $: filtered = filter === 'all'
    ? milestones
    : milestones.filter(m => m.status === filter);
</script>

<div class="filter flex gap-4">
  {#each ['all','active','development','planned','vision'] as status}
    <button
      class:selected={filter === status}
      on:click={() => filter = status}>
      {status}
    </button>
  {/each}
</div>

<ul class="timeline">
  {#each filtered as m}
    <li class="milestone">
      <span class="dot status-{m.status}"></span>
      <GlassCard>
        <h4>{m.title}</h4>
        <p>{m.description}</p>
      </GlassCard>
    </li>
  {/each}
</ul>

5. Polish content and translations *(Status: ✅ Completed — refreshed English copy, timeline statuses translated, and stray literals aligned with localisation)*

Context:
The English copy is mostly improved, but some filler remains (e.g. “AI products with a people-first beat” in the footer
algorhythmics.dev
) and some strings are hard-coded rather than pulled from localisation files.

Actions:

Update src/lib/i18n/en.json with refined text. For example:

Footer tagline: replace “AI products with a people-first beat” with “AI products with a human‑centred approach”.

Founder bios: ensure bullet lists are unique and succinct.

Partners: shorten long paragraphs.

Audit components for literal strings and replace them with $t('key').

Remove obsolete bullet lists (e.g., duplicated strengths).

Provide translation keys for timeline statuses (“active”, “development”, etc.) to ease future localisation.

Example en.json update:

{
  "footer": {
    "tagline": "AI products with a human-centred approach",
    "address": "Daugavpils, Latvia",
    "rights": "© 2025 AlgoRhythmics. All rights reserved."
  },
  "founders": {
    "nikita": {
      "coreStrengths": [
        "Narrative-led product strategy",
        "Experience design and quality assurance",
        "Partnership and education outreach"
      ],
      "recentWins": [
        "Leads brand and product direction with accessibility-first, multilingual delivery",
        "Contributes to signage R&D with next-gen LED neon tubes and custom coatings"
      ]
    }
  }
}

6. Clean up unused code and files *(Status: ✅ Completed — retired legacy partner assets, trimmed unused components, and documented the surviving design tokens)*

Context:
The repo may still contain old page components (e.g., nodevoyage/+page.svelte, ideonautix/+page.svelte), outdated CSS or JS, and placeholder assets.

Actions:

Delete all unused route folders and components related to the old site structure.

Remove legacy CSS files (light.css, dark.css etc.) and merge relevant rules into theme.css.

Consolidate animation helpers in animations.js and remove duplicate functions.

Prune unused assets from /static (old images, icons, backgrounds).

Run ESLint/Prettier to tidy imports and remove unused variables.

Document new component usage and design tokens in a README or CONTRIBUTING guide to prevent regression.
