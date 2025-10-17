Audit Report: AlgoRhythmics Website
Phase 1: Visual / Layout Issues

Hero Aside Not Centered on Mobile (file: Hero.svelte) – On narrow screens the hero’s aside content (e.g. founder image or highlights) remains left-aligned. The fix is to center the hero aside in mobile view. For example, in Hero.svelte’s <style>, add a media rule:

/* Hero.svelte: center aside content on small screens */
@media (max-width: 600px) {
  .hero--align-center .hero__aside {
    justify-self: center;
    text-align: center;
  }
}


This ensures the .hero__aside grid cell is centered under the hero on mobile
GitHub
.

Hero Overlay Too Light (file: Hero.svelte) – The semi-transparent overlay behind hero text is too weak, making text hard to read. Increase its opacity or color mix. For example, replace the existing overlay in Hero.svelte with a stronger mix:

/* Hero.svelte: stronger overlay for text legibility */
.hero {
  /* Use ~95% solid background for higher contrast */
  --hero-overlay: color-mix(in srgb, var(--bg) 95%, transparent 5%);
}
.hero__background {
  background: var(--hero-overlay);
  opacity: 0.82; /* thicker overlay than before */
}


This change (using about 95% of the background color) ensures text meets contrast recommendations
GitHub
.

Missing Card Corner Rounding (file: GlassCard.svelte) – The GlassCard component has square corners by default. According to the design, cards should be rounded. In GlassCard.svelte, change the CSS rule to use the theme’s large radius token:

/* GlassCard.svelte: apply design token for rounded corners */
.glass-card {
  /* use theme token for border radius (e.g., ~1.6rem ≈ 25.6px) */
  border-radius: var(--radius-lg);
}


Using var(--radius-lg) (≈24px) on all cards adds smooth rounded corners
GitHub
.

Phase 2: Mobile Responsiveness

Toolbar Items Overlap on Small Screens (file: Navigation.svelte or global CSS) – The top toolbar (“Keep it light/Go dark/Contrast” toggles and language switcher) can wrap awkwardly. Hide or abbreviate text on very small screens. For example:

/* Navigation.svelte or global CSS: prevent overlap on tiny viewports */
@media (max-width: 500px) {
  .nav-toggle-text { display: none; } /* hide "Keep it light"/"Go dark" labels */
  .nav-menu { flex-direction: column; }
}


This stacks or hides extra labels on mobile, preventing overlap
GitHub
.

Hero Content Overflow (file: Hero.svelte) – Some hero headings or buttons may overflow on mobile. Constrain them with a max-width and center alignment. For instance, in Hero.svelte add:

/* Hero.svelte: contain hero text on small screens */
.hero__content {
  max-width: 90%;
  margin: 0 auto;
}


This confines the hero text and buttons to the viewport width
GitHub
.

Platform Cards Not Stacking (relevant page CSS or component) – In the “Platform lineup” section (NodeVoyage and Ideonautix), ensure cards stack vertically under 640px. For example, wrap the card components in a responsive grid:

<!-- e.g. in src/routes/... -->
<div class="grid gap-6 md:grid-cols-2">
  <!-- NodeVoyage card -->
  <!-- Ideonautix card -->
</div>


This Tailwind-style grid gives two columns on medium+ screens and one column on mobile, so cards stack on small viewports
GitHub
.

Phase 3: Theming & Accessibility

Low-Contrast Text/Buttons – Verify all text and buttons meet WCAG contrast. Avoid hard-coded colors like #000 on dark backgrounds. Use theme tokens such as var(--text) or var(--cta-primary-text) for button labels. For example, ensure button text is var(--cta-primary-text) on dark backgrounds
GitHub
.

Replace Hard-Coded Colors – If any CSS uses fixed colors (e.g. background: #eef1f7;), replace them with theme tokens. For instance:

/* Instead of fixed gray, use the token */
background-color: var(--mist);


All colors (backgrounds, text, borders) should use the design system tokens (--bg, --text, --aurora, etc.) for consistency
GitHub
.

Missing ARIA/Alt Text and Focus Styles – Ensure every interactive element (links, icons, images) has an accessible name or alt text. For example, social icon <button>s should have aria-label="Visit LinkedIn", or <img>s should include alt. Also, do not remove focus outlines. If needed, add a visible focus style such as:

.btn:focus-visible {
  outline: 2px solid var(--border);
  outline-offset: 4px;
}


This ensures keyboard users can see which element is focused
GitHub
.

High-Contrast/Dark Theme Color Corrections – In high-contrast mode, ensure backgrounds and text invert appropriately. For example, GlassCard already switches to solid var(--bg) in HC mode. Check any component where gray-on-gray might happen; force such icons/text to currentColor or a high-contrast token. For instance, images or SVGs could use CSS color: var(--text) in dark mode. The goal is no element should have insufficient contrast in any theme
GitHub
.

Phase 4: Code Quality & Structure

Use Hero/GlassCard Components Uniformly (various pages) – Some pages manually code top sections instead of using the reusable <Hero> and <GlassCard> components. For consistency, wrap page headers in <Hero> and content in <GlassCard>. For example, in src/routes/consulting/+page.svelte:

<script>
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import { $_ } from '$lib/i18n';
</script>

<Hero title="{$_('consulting.title')}" subtitle="{$_('consulting.subtitle')}" align="center">
  <div slot="actions">
    <a href="/contact" class="btn btn-primary">{$_('consulting.cta')}</a>
  </div>
</Hero>

<GlassCard as="section">
  <h2>{$_('consulting.section1.heading')}</h2>
  <p>{$_('consulting.section1.text')}</p>
</GlassCard>


This enforces consistent styling (rounded glass background, padding) across pages
GitHub
GitHub
. Update any page using plain <section> to use these components.

Avoid Fixed Spacing (various CSS) – Replace remaining hard-coded px values with spacing tokens. E.g., instead of padding: 24px;, use padding: var(--space-2xl);. Similarly use tokens like var(--text-small) for font sizes. This keeps the design scalable and aligned with the theme
GitHub
.

Remove Inline Type Suppressions (e.g. @ts-nocheck) – Some files (e.g. ThemedBackground.svelte) use @ts-nocheck. Refactor these to proper TypeScript or add interfaces so linting passes. For example, annotate any stores or props with correct types instead of disabling checks
GitHub
.

Theme Toggle Keyboard Fix – The theme toggle shortcut (“t” key) should not fire when a modal or menu is open. Update the keydown handler (in theme-toggle or root layout) to check:

document.body.classList.contains('modal-open')


and ignore the “t” key if a modal is active. This prevents accidental theme changes when focus is in a dialog
GitHub
.

Phase 5: Animation & Background Fixes

Background Layers Behind Content (file: ThemedBackground.svelte, HaloFX.svelte) – Ensure decorative background layers do not intercept clicks and stay behind all UI. The .background div in ThemedBackground.svelte already has pointer-events: none; z-index: var(--z-background, -20). Do the same for any halo effects. For example, in HaloFX.svelte’s <style> add:

:global(.halo-fx) {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-background, -20);
}


This guarantees all animated backgrounds sit behind interactive content
GitHub
.

Remove Distracting Animations – As per design, disable any continuous background or gradient animations. In ThemedBackground.svelte and Hero.svelte, remove CSS animation: rules on gradients. Use static backgrounds instead. Also audit CSS for any infinite @keyframes loops and remove them. This stops unnecessarily looping animations
GitHub
.

Prefer-Reduced-Motion Compliance – Ensure any remaining animations respect the user’s reduced-motion preference. For example, add a global rule:

@media (prefers-reduced-motion: reduce) {
  .background, .background * { animation: none !important; }
}


Many animations (hero scroll, card transforms, etc.) should already be disabled under prefers-reduced-motion. Confirm no rogue animations persist
GitHub
.

Z-Index Consistency – Use the design’s z-index tokens instead of magic numbers. For instance, navigation bars and drop-downs should use z-index: var(--z-sticky) (100) or var(--z-overlay) (400). If any component (like a modal or menu) has an inline z-index, change it. For example:

.nav-bar    { z-index: var(--z-sticky); }
.dropdown   { z-index: var(--z-overlay); }


This ensures --z-background (e.g. –20) stays behind everything, main content is around 0, and overlays sit above as intended
GitHub
.

Each issue above includes the component file to edit and a code snippet fix. All fixes follow the project’s design tokens and meet WCAG guidelines. After implementing, rebuild and test in all themes (light, dark, high-contrast) and viewports.

Sources: Audit and fix suggestions are drawn from the project’s internal documentation and codebase, as summarized in the repository
GitHub
GitHub
. Each cited fix corresponds to the relevant component or stylesheet.
