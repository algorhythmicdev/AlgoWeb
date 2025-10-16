Comprehensive Bug and UI/UX Audit of AlgoRhythmics Website

Visual/Layout Issues

Hero Aside Not Centered on Mobile: On narrow viewports, the <Hero> component’s aside content (e.g. founder image or “highlights”) remains left-aligned. For example, on the founders section the photo and text aren’t centered under the hero on mobile. Fix: Add responsive centering in Hero.svelte. For instance, inside <style>:

@media (max-width: 600px) {
  .hero--align-center .hero__aside {
    justify-self: center;
    text-align: center;
  }
}


This ensures the .hero__aside grid cell is centered in “center” alignment mode.

Hero Overlay Opacity Too Low: The semi‑transparent overlay behind hero text is too weak, making text hard to read
GitHub
. In Hero.svelte, replace the 54% mix with a heavier overlay. For example:

.hero {
  /* Strong overlay for text legibility */
  --hero-overlay: color-mix(in srgb, var(--bg) 95%, transparent 5%);
}
.hero__background {
  background: var(--hero-overlay);
  opacity: 0.82;
}


This change (from ~54% to ~95% solid color) matches the recommended contrast fix
GitHub
.

Missing Glass-Card Corner Radius: The <GlassCard> default has no corner rounding (border-radius: 0). According to the design system, cards should have ~24px–40px radius
GitHub
. In GlassCard.svelte, change the CSS rule:

.glass-card {
  /* OLD: border-radius: var(--glass-card-radius, 0); */
  /* NEW: use design token radius */
  border-radius: var(--radius-lg);
  /* e.g., ~1.6rem (≈25.6px) for smooth rounded corners */
}


This applies the theme’s --radius-lg token (24px) to all cards.

Mobile Responsiveness Bugs

Navigation Items Overlap on Small Screens: The top toolbar (“Keep it light / Go dark / High contrast” toggles and language switcher) can wrap oddly on very narrow screens. Ensure the toolbar stacks vertically or hides extra text. For example, in Navigation.svelte or global CSS:

@media (max-width: 500px) {
  .nav-toggle-text { display: none; } /* hide “Keep it light”/“Go dark” text on tiny screens */
  .nav-menu { flex-direction: column; }
}


This prevents overlap by hiding or rearranging elements on mobile. (Alternatively use icons or shorter labels.)

Hero Content Overflows on Mobile: Some hero headings or action buttons may extend beyond the viewport. For example, if <Hero align="center"> is used, add max-width and center alignment. In Hero.svelte:

.hero__content {
  max-width: 90%;
  margin: 0 auto;
}


This confines the hero text and buttons to fit on small screens.

Platform Cards Not Stacking Properly: In the “Platform lineup” section, NodeVoyage and Ideonautix cards should stack under 640px. Ensure their container uses a responsive grid or flex. For example, in the page CSS:

<div class="grid gap-6 md:grid-cols-2">
  <!-- NodeVoyage card -->
  <!-- Ideonautix card -->
</div>


This Tailwind-style grid ensures two columns on medium+ widths and one column on mobile.

Theming & Accessibility Issues

Low-Contrast Text/Buttons: Verify all text meets WCAG AAA. In particular, buttons and links must have ≥7:1 contrast. Use theme tokens instead of hard-coded color. For example, replace any fixed color like color: #000 with color: var(--text) or var(--cta-primary-text) (white on primary). The UI redesign report shows contrast ratios after fixes. Ensure e.g. .btn text uses var(--cta-primary-text) on dark backgrounds.

Hard-Coded Color Values: Some CSS still uses fixed color values instead of tokens. For example, if any component sets background: #eef1f7; (light-gray “mist”), replace it with a token:

/* Instead of fixed mist color, use theme token */
background-color: var(--mist);


Confirm all colors come from theme.css tokens (e.g. --bg, --text, --aurora, --voyage, etc) as intended
GitHub
GitHub
.

Missing ARIA/Focus Hints: Ensure every interactive icon or image has appropriate aria-label or alt. For example, social icons (LinkedIn/GitHub) should have aria-label="Visit LinkedIn" if they are <button>, or alt text if <img>. Also ensure focus outlines are visible: no element should use outline: none without replacement. The design system requires visible focus (3:1 contrast)
GitHub
. If needed, add focus styles:

.btn:focus-visible { outline: 2px solid var(--border); outline-offset: 4px; }


Color Contrast in Dark/HC Themes: In high-contrast mode, backgrounds and text invert. Verify elements like cards revert to solid backgrounds without blur (GlassCard already does this). E.g. ensure glass cards use pure var(--bg) with no transparency in HC mode (as done in GlassCard.svelte
GitHub
). If any text/icons become gray on gray, switch to currentColor or high-contrast token.

Code Quality & Structure Problems

Missing Hero/GlassCard Wrappers: Some pages still hard-code layouts instead of using the reusable components. For consistency, wrap top sections in <Hero> and content blocks in <GlassCard>. For example, in src/routes/consulting/+page.svelte:

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


This ensures uniform styling (rounded glass background, padding) across pages. Update any pages that currently use plain <section> or custom CSS to use these components.

Hard-Coded Measurements: Replace any remaining fixed px values with spacing tokens. For example, if a component has padding: 24px;, use padding: var(--space-2xl);. Similarly, font sizes should use var(--text-small), var(--text-caption), etc
GitHub
.

Inline Styles/Animations: Remove any inline @ts-nocheck or JavaScript that bypasses safety. For instance, the ThemedBackground.svelte uses @ts-nocheck; convert to proper TypeScript or annotate interfaces so linting passes.

Theme Toggle Accessibility: The keyboard shortcut for toggling theme (“t” key) should respect modal state. If a menu is open, pressing “t” should not inadvertently change theme. Ensure the event handler for keydown: t checks !document.body.classList.contains('modal-open') before cycling themes.

Animation & Background Layering Bugs

Background Layers Behind UI: Ensure all decorative layers are non-interactive and behind content. In ThemedBackground.svelte, the root <div class="background"> correctly has pointer-events: none; z-index: var(--z-background, -20);
GitHub
. Verify similar for <HaloFX> if used. For example, in HaloFX.svelte add at top of its <style>:

:global(.halo-fx) {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-background, -20);
}


so that any halo animation sits behind all content.

Remove Distracting Animations: Following the redesign recommendation
GitHub
, ensure gradient and hero-pan animations are disabled. For example, in ThemedBackground.svelte and Hero.svelte remove any animation: on gradients. Use static gradients instead. Confirm CSS has no infinite keyframe loops.

prefers-reduced-motion Compliance: Check all interactive animations respect prefers-reduced-motion. The code already disables hero animations and card transforms under that media query
GitHub
GitHub
. Ensure no rogue animations remain. For any particle or background effect, add:

@media (prefers-reduced-motion: reduce) {
  .background, .background * { animation: none !important; }
}


Z-Index Consistency: Use the design’s Z-index scale
GitHub
. For example, navigation and dropdowns should use --z-sticky: 100 and --z-overlay: 400 from theme.css. If any element (like a modal or menu) currently has inline z-index, replace with these tokens. Example fix in CSS:

.nav-bar { z-index: var(--z-sticky); }
.dropdown { z-index: var(--z-overlay); }


This guarantees the background (--z-background: -20) stays at the back, content at 0–10, and overlays above (and so on) as per design system.

Each fix above uses the 2026 design tokens and accessibility guidelines. Be sure to rebuild and test in all themes (light, dark, high-contrast) and both desktop/mobile viewports. The snippets given can be copy-pasted into the respective component files to address the issues systematically.

 

Sources: Audit and design requirements drawn from the internal design documentation
GitHub
GitHub
 and the existing codebase (e.g. GlassCard.svelte, Hero.svelte). All fixes conform to the 2026 design tokens (--bg, --text, --space-*, etc.) and WCAG/UX guidelines.