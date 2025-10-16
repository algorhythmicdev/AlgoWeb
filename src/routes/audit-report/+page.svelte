<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

  const hero = {
    titleKey: 'audit_report.page.hero.title',
    titleFallback: 'Comprehensive Bug and UI/UX Audit',
    subtitleKey: 'audit_report.page.hero.subtitle',
    subtitleFallback: 'AlgoRhythmics Website Design & Accessibility Review'
  } as const;

  const visualIssues = [
    {
      id: 'hero-mobile-center',
      titleKey: 'audit_report.visual.hero_mobile.title',
      titleFallback: 'Hero Aside Not Centered on Mobile',
      descKey: 'audit_report.visual.hero_mobile.desc',
      descFallback:
        'On narrow viewports, the <Hero> component\'s aside content (e.g. founder image or "highlights") remains left-aligned. For example, on the founders section the photo and text aren\'t centered under the hero on mobile.',
      fixKey: 'audit_report.visual.hero_mobile.fix',
      fixFallback: 'Add responsive centering in Hero.svelte. For instance, inside <style>:',
      codeSnippet: `@media (max-width: 600px) {
  .hero--align-center .hero__aside {
    justify-self: center;
    text-align: center;
  }
}`
    },
    {
      id: 'hero-overlay',
      titleKey: 'audit_report.visual.hero_overlay.title',
      titleFallback: 'Hero Overlay Opacity Too Low',
      descKey: 'audit_report.visual.hero_overlay.desc',
      descFallback:
        'The semi-transparent overlay behind hero text is too weak, making text hard to read.',
      fixKey: 'audit_report.visual.hero_overlay.fix',
      fixFallback:
        'In Hero.svelte, replace the 54% mix with a heavier overlay. For example:',
      codeSnippet: `.hero {
  /* Strong overlay for text legibility */
  --hero-overlay: color-mix(in srgb, var(--bg) 95%, transparent 5%);
}
.hero__background {
  background: var(--hero-overlay);
  opacity: 0.82;
}`
    },
    {
      id: 'glass-card-radius',
      titleKey: 'audit_report.visual.glass_card.title',
      titleFallback: 'Missing Glass-Card Corner Radius',
      descKey: 'audit_report.visual.glass_card.desc',
      descFallback:
        'The <GlassCard> default has no corner rounding (border-radius: 0). According to the design system, cards should have ~24px-40px radius.',
      fixKey: 'audit_report.visual.glass_card.fix',
      fixFallback: 'In GlassCard.svelte, change the CSS rule:',
      codeSnippet: `.glass-card {
  /* OLD: border-radius: var(--glass-card-radius, 0); */
  /* NEW: use design token radius */
  border-radius: var(--radius-lg);
  /* e.g., ~1.6rem (≈25.6px) for smooth rounded corners */
}`
    }
  ] as const;

  const mobileIssues = [
    {
      id: 'nav-overlap',
      titleKey: 'audit_report.mobile.nav_overlap.title',
      titleFallback: 'Navigation Items Overlap on Small Screens',
      descKey: 'audit_report.mobile.nav_overlap.desc',
      descFallback:
        'The top toolbar ("Keep it light / Go dark / High contrast" toggles and language switcher) can wrap oddly on very narrow screens.',
      fixKey: 'audit_report.mobile.nav_overlap.fix',
      fixFallback:
        'Ensure the toolbar stacks vertically or hides extra text. For example, in Navigation.svelte or global CSS:',
      codeSnippet: `@media (max-width: 500px) {
  .nav-toggle-text { display: none; }
  .nav-menu { flex-direction: column; }
}`
    },
    {
      id: 'hero-overflow',
      titleKey: 'audit_report.mobile.hero_overflow.title',
      titleFallback: 'Hero Content Overflows on Mobile',
      descKey: 'audit_report.mobile.hero_overflow.desc',
      descFallback:
        'Some hero headings or action buttons may extend beyond the viewport.',
      fixKey: 'audit_report.mobile.hero_overflow.fix',
      fixFallback: 'In Hero.svelte:',
      codeSnippet: `.hero__content {
  max-width: 90%;
  margin: 0 auto;
}`
    },
    {
      id: 'platform-cards',
      titleKey: 'audit_report.mobile.platform_cards.title',
      titleFallback: 'Platform Cards Not Stacking Properly',
      descKey: 'audit_report.mobile.platform_cards.desc',
      descFallback:
        'In the "Platform lineup" section, NodeVoyage and Ideonautix cards should stack under 640px.',
      fixKey: 'audit_report.mobile.platform_cards.fix',
      fixFallback:
        'Ensure their container uses a responsive grid or flex. For example, in the page CSS:',
      codeSnippet: `<div class="grid gap-6 md:grid-cols-2">
  <!-- NodeVoyage card -->
  <!-- Ideonautix card -->
</div>`
    }
  ] as const;

  const themingIssues = [
    {
      id: 'low-contrast',
      titleKey: 'audit_report.theming.low_contrast.title',
      titleFallback: 'Low-Contrast Text/Buttons',
      descKey: 'audit_report.theming.low_contrast.desc',
      descFallback:
        'Verify all text meets WCAG AAA. In particular, buttons and links must have >=7:1 contrast. Use theme tokens instead of hard-coded color.',
      fixKey: 'audit_report.theming.low_contrast.fix',
      fixFallback:
        'Replace any fixed color like color: #000 with color: var(--text) or var(--cta-primary-text) (white on primary).',
      codeSnippet: ''
    },
    {
      id: 'hard-coded-colors',
      titleKey: 'audit_report.theming.hard_coded.title',
      titleFallback: 'Hard-Coded Color Values',
      descKey: 'audit_report.theming.hard_coded.desc',
      descFallback:
        'Some CSS still uses fixed color values instead of tokens. For example, if any component sets background: #eef1f7; (light-gray "mist"), replace it with a token.',
      fixKey: 'audit_report.theming.hard_coded.fix',
      fixFallback: 'Use theme token:',
      codeSnippet: `/* Instead of fixed mist color, use theme token */
background-color: var(--mist);`
    },
    {
      id: 'missing-aria',
      titleKey: 'audit_report.theming.missing_aria.title',
      titleFallback: 'Missing ARIA/Focus Hints',
      descKey: 'audit_report.theming.missing_aria.desc',
      descFallback:
        'Ensure every interactive icon or image has appropriate aria-label or alt. Also ensure focus outlines are visible.',
      fixKey: 'audit_report.theming.missing_aria.fix',
      fixFallback: 'Add focus styles:',
      codeSnippet: `.btn:focus-visible {
  outline: 2px solid var(--border);
  outline-offset: 4px;
}`
    },
    {
      id: 'hc-contrast',
      titleKey: 'audit_report.theming.hc_contrast.title',
      titleFallback: 'Color Contrast in Dark/HC Themes',
      descKey: 'audit_report.theming.hc_contrast.desc',
      descFallback:
        'In high-contrast mode, backgrounds and text invert. Verify elements like cards revert to solid backgrounds without blur.',
      fixKey: 'audit_report.theming.hc_contrast.fix',
      fixFallback:
        'Ensure glass cards use pure var(--bg) with no transparency in HC mode. If any text/icons become gray on gray, switch to currentColor or high-contrast token.',
      codeSnippet: ''
    }
  ] as const;

  const codeQualityIssues = [
    {
      id: 'missing-wrappers',
      titleKey: 'audit_report.code.missing_wrappers.title',
      titleFallback: 'Missing Hero/GlassCard Wrappers',
      descKey: 'audit_report.code.missing_wrappers.desc',
      descFallback:
        'Some pages still hard-code layouts instead of using the reusable components. For consistency, wrap top sections in <Hero> and content blocks in <GlassCard>.',
      fixKey: 'audit_report.code.missing_wrappers.fix',
      fixFallback: 'For example, in src/routes/consulting/+page.svelte, use Hero and GlassCard components to wrap sections consistently.',
      codeSnippet: ''
    },
    {
      id: 'hard-coded-measurements',
      titleKey: 'audit_report.code.measurements.title',
      titleFallback: 'Hard-Coded Measurements',
      descKey: 'audit_report.code.measurements.desc',
      descFallback:
        'Replace any remaining fixed px values with spacing tokens. For example, if a component has padding: 24px;, use padding: var(--space-2xl);.',
      fixKey: 'audit_report.code.measurements.fix',
      fixFallback:
        'Similarly, font sizes should use var(--text-small), var(--text-caption), etc.',
      codeSnippet: ''
    },
    {
      id: 'inline-styles',
      titleKey: 'audit_report.code.inline_styles.title',
      titleFallback: 'Inline Styles/Animations',
      descKey: 'audit_report.code.inline_styles.desc',
      descFallback:
        'Remove any inline @ts-nocheck or JavaScript that bypasses safety. For instance, the ThemedBackground.svelte uses @ts-nocheck.',
      fixKey: 'audit_report.code.inline_styles.fix',
      fixFallback: 'Convert to proper TypeScript or annotate interfaces so linting passes.',
      codeSnippet: ''
    },
    {
      id: 'theme-toggle',
      titleKey: 'audit_report.code.theme_toggle.title',
      titleFallback: 'Theme Toggle Accessibility',
      descKey: 'audit_report.code.theme_toggle.desc',
      descFallback:
        'The keyboard shortcut for toggling theme ("t" key) should respect modal state. If a menu is open, pressing "t" should not inadvertently change theme.',
      fixKey: 'audit_report.code.theme_toggle.fix',
      fixFallback:
        'Ensure the event handler for keydown: t checks !document.body.classList.contains(\'modal-open\') before cycling themes.',
      codeSnippet: ''
    }
  ] as const;

  const animationIssues = [
    {
      id: 'background-layers',
      titleKey: 'audit_report.animation.background_layers.title',
      titleFallback: 'Background Layers Behind UI',
      descKey: 'audit_report.animation.background_layers.desc',
      descFallback:
        'Ensure all decorative layers are non-interactive and behind content. In ThemedBackground.svelte, the root <div class="background"> correctly has pointer-events: none; z-index: var(--z-background, -20);.',
      fixKey: 'audit_report.animation.background_layers.fix',
      fixFallback: 'Verify similar for <HaloFX> if used. For example, in HaloFX.svelte:',
      codeSnippet: `:global(.halo-fx) {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--z-background, -20);
}`
    },
    {
      id: 'distracting-animations',
      titleKey: 'audit_report.animation.distracting.title',
      titleFallback: 'Remove Distracting Animations',
      descKey: 'audit_report.animation.distracting.desc',
      descFallback:
        'Following the redesign recommendation, ensure gradient and hero-pan animations are disabled. For example, in ThemedBackground.svelte and Hero.svelte remove any animation: on gradients.',
      fixKey: 'audit_report.animation.distracting.fix',
      fixFallback: 'Use static gradients instead. Confirm CSS has no infinite keyframe loops.',
      codeSnippet: ''
    },
    {
      id: 'reduced-motion',
      titleKey: 'audit_report.animation.reduced_motion.title',
      titleFallback: 'prefers-reduced-motion Compliance',
      descKey: 'audit_report.animation.reduced_motion.desc',
      descFallback:
        'Check all interactive animations respect prefers-reduced-motion. The code already disables hero animations and card transforms under that media query.',
      fixKey: 'audit_report.animation.reduced_motion.fix',
      fixFallback: 'Ensure no rogue animations remain. For any particle or background effect, add:',
      codeSnippet: `@media (prefers-reduced-motion: reduce) {
  .background, .background * { animation: none !important; }
}`
    },
    {
      id: 'z-index',
      titleKey: 'audit_report.animation.z_index.title',
      titleFallback: 'Z-Index Consistency',
      descKey: 'audit_report.animation.z_index.desc',
      descFallback:
        'Use the design\'s Z-index scale. For example, navigation and dropdowns should use --z-sticky: 100 and --z-overlay: 400 from theme.css.',
      fixKey: 'audit_report.animation.z_index.fix',
      fixFallback: 'If any element (like a modal or menu) currently has inline z-index, replace with these tokens. Example fix in CSS:',
      codeSnippet: `.nav-bar { z-index: var(--z-sticky); }
.dropdown { z-index: var(--z-overlay); }`
    }
  ] as const;
</script>

<Hero
  class="hero--audit-report"
  variant="grid"
  title={t(hero.titleKey, hero.titleFallback)}
  subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
>
  <svelte:fragment slot="description">
    <p class="hero-description">
      {t(
        'audit_report.page.hero.description',
        'This comprehensive audit identifies visual inconsistencies, mobile responsiveness issues, accessibility gaps, code quality concerns, and animation problems. Each item includes context and recommended fixes using the 2026 design tokens and WCAG guidelines.'
      )}
    </p>
  </svelte:fragment>
</Hero>

<section class="section audit-section" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('audit_report.visual.eyebrow', 'Category 1')}</span>
      <h2>{t('audit_report.visual.title', 'Visual/Layout Issues')}</h2>
    </header>

    <div class="issue-grid" use:staggerReveal>
      {#each visualIssues as issue (issue.id)}
        <GlassCard class="issue-card" padding="lg">
          <h3>{t(issue.titleKey, issue.titleFallback)}</h3>
          <div class="issue-section">
            <h4>{t('audit_report.common.problem', 'Problem')}</h4>
            <p>{t(issue.descKey, issue.descFallback)}</p>
          </div>
          <div class="issue-section">
            <h4>{t('audit_report.common.solution', 'Solution')}</h4>
            <p>{t(issue.fixKey, issue.fixFallback)}</p>
            {#if issue.codeSnippet}
              <pre><code>{issue.codeSnippet}</code></pre>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="section audit-section" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('audit_report.mobile.eyebrow', 'Category 2')}</span>
      <h2>{t('audit_report.mobile.title', 'Mobile Responsiveness Bugs')}</h2>
    </header>

    <div class="issue-grid" use:staggerReveal>
      {#each mobileIssues as issue (issue.id)}
        <GlassCard class="issue-card" padding="lg">
          <h3>{t(issue.titleKey, issue.titleFallback)}</h3>
          <div class="issue-section">
            <h4>{t('audit_report.common.problem', 'Problem')}</h4>
            <p>{t(issue.descKey, issue.descFallback)}</p>
          </div>
          <div class="issue-section">
            <h4>{t('audit_report.common.solution', 'Solution')}</h4>
            <p>{t(issue.fixKey, issue.fixFallback)}</p>
            {#if issue.codeSnippet}
              <pre><code>{issue.codeSnippet}</code></pre>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="section audit-section" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('audit_report.theming.eyebrow', 'Category 3')}</span>
      <h2>{t('audit_report.theming.title', 'Theming & Accessibility Issues')}</h2>
    </header>

    <div class="issue-grid" use:staggerReveal>
      {#each themingIssues as issue (issue.id)}
        <GlassCard class="issue-card" padding="lg">
          <h3>{t(issue.titleKey, issue.titleFallback)}</h3>
          <div class="issue-section">
            <h4>{t('audit_report.common.problem', 'Problem')}</h4>
            <p>{t(issue.descKey, issue.descFallback)}</p>
          </div>
          <div class="issue-section">
            <h4>{t('audit_report.common.solution', 'Solution')}</h4>
            <p>{t(issue.fixKey, issue.fixFallback)}</p>
            {#if issue.codeSnippet}
              <pre><code>{issue.codeSnippet}</code></pre>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="voyage" />

<section class="section audit-section" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('audit_report.code.eyebrow', 'Category 4')}</span>
      <h2>{t('audit_report.code.title', 'Code Quality & Structure Problems')}</h2>
    </header>

    <div class="issue-grid" use:staggerReveal>
      {#each codeQualityIssues as issue (issue.id)}
        <GlassCard class="issue-card" padding="lg">
          <h3>{t(issue.titleKey, issue.titleFallback)}</h3>
          <div class="issue-section">
            <h4>{t('audit_report.common.problem', 'Problem')}</h4>
            <p>{t(issue.descKey, issue.descFallback)}</p>
          </div>
          <div class="issue-section">
            <h4>{t('audit_report.common.solution', 'Solution')}</h4>
            <p>{t(issue.fixKey, issue.fixFallback)}</p>
            {#if issue.codeSnippet}
              <pre><code>{issue.codeSnippet}</code></pre>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="signal" />

<section class="section audit-section" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('audit_report.animation.eyebrow', 'Category 5')}</span>
      <h2>{t('audit_report.animation.title', 'Animation & Background Layering Bugs')}</h2>
    </header>

    <div class="issue-grid" use:staggerReveal>
      {#each animationIssues as issue (issue.id)}
        <GlassCard class="issue-card" padding="lg">
          <h3>{t(issue.titleKey, issue.titleFallback)}</h3>
          <div class="issue-section">
            <h4>{t('audit_report.common.problem', 'Problem')}</h4>
            <p>{t(issue.descKey, issue.descFallback)}</p>
          </div>
          <div class="issue-section">
            <h4>{t('audit_report.common.solution', 'Solution')}</h4>
            <p>{t(issue.fixKey, issue.fixFallback)}</p>
            {#if issue.codeSnippet}
              <pre><code>{issue.codeSnippet}</code></pre>
            {/if}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<section class="section audit-conclusion" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <GlassCard class="conclusion-card" halo padding="lg">
      <h2>{t('audit_report.conclusion.title', 'Implementation Notes')}</h2>
      <p>
        {t(
          'audit_report.conclusion.text',
          'Each fix above uses the 2026 design tokens and accessibility guidelines. Be sure to rebuild and test in all themes (light, dark, high-contrast) and both desktop/mobile viewports. The snippets given can be copy-pasted into the respective component files to address the issues systematically.'
        )}
      </p>
      <p class="sources">
        {t(
          'audit_report.conclusion.sources',
          'Sources: Audit and design requirements drawn from the internal design documentation and the existing codebase (e.g. GlassCard.svelte, Hero.svelte). All fixes conform to the 2026 design tokens (--bg, --text, --space-*, etc.) and WCAG/UX guidelines.'
        )}
      </p>
    </GlassCard>
  </div>
</section>

<style>
  .hero-description {
    max-width: 70ch;
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.6vw, 1.3rem);
    line-height: 1.6;
  }

  .section.audit-section,
  .section.audit-conclusion {
    isolation: isolate;
  }

  .section-heading {
    margin-block-end: clamp(2rem, 6vw, 3rem);
  }

  .section-eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.8rem;
    font-size: var(--text-small);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .issue-grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.issue-card) {
    display: grid;
    gap: clamp(1rem, 2vw, 1.4rem);
  }

  :global(.issue-card) h3 {
    color: var(--voyage-blue);
    font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  }

  .issue-section {
    display: grid;
    gap: 0.75rem;
  }

  .issue-section h4 {
    font-size: var(--text-small);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
    margin: 0;
  }

  .issue-section p {
    margin: 0;
    color: var(--text-secondary);
  }

  .issue-section pre {
    margin: 0;
    padding: 1rem;
    background: color-mix(in srgb, var(--bg) 90%, var(--text) 10%);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    overflow-x: auto;
  }

  .issue-section code {
    font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 0.9em;
    line-height: 1.5;
    color: var(--text);
  }

  :global(.conclusion-card) {
    display: grid;
    gap: 1.2rem;
  }

  :global(.conclusion-card) h2 {
    color: var(--aurora-purple);
  }

  :global(.conclusion-card) p {
    margin: 0;
    color: var(--text-secondary);
  }

  .sources {
    font-size: var(--text-small);
    font-style: italic;
    color: var(--text-tertiary);
  }

  @media (min-width: 900px) {
    .issue-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .audit-section,
    .audit-conclusion {
      animation: none;
    }
  }
</style>
