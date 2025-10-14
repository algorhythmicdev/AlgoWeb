<script lang="ts">
  type HeroVariant = 'aurora' | 'grid' | 'halo' | 'line' | 'particles';
  type HeroAlign = 'start' | 'center';

  const VALID_VARIANTS = new Set<HeroVariant>(['aurora', 'grid', 'halo', 'line', 'particles']);

  export let variant: HeroVariant | string = 'aurora';
  export let title = '';
  export let subtitle = '';
  export let align: HeroAlign = 'start';

  type $$Props = {
    class?: string;
    variant?: HeroVariant | string;
    title?: string;
    subtitle?: string;
    align?: HeroAlign;
  };

  const instanceId = Math.random().toString(36).slice(2, 8);
  $: resolvedVariant = VALID_VARIANTS.has(variant as HeroVariant) ? (variant as HeroVariant) : 'aurora';
  $: titleId = title.trim().length ? `hero-${instanceId}-title` : undefined;
  $: leadId = subtitle.trim().length ? `hero-${instanceId}-lead` : undefined;
  $: descriptionId = $$slots.description ? `hero-${instanceId}-description` : undefined;
  $: highlightsId = $$slots.highlights ? `hero-${instanceId}-highlights` : undefined;
  $: ariaLabelledBy = titleId ?? undefined;
  $: ariaDescribedBy = [leadId, descriptionId, highlightsId].filter(Boolean).join(' ') || undefined;
  $: alignmentClass = align === 'center' ? 'hero--align-center' : 'hero--align-start';
  $: hasAside = Boolean($$slots.aside);
  $: extraClass = typeof $$props.class === 'string' ? $$props.class.trim() : '';
  $: rootClass = ['hero', alignmentClass, hasAside ? 'hero--with-aside' : 'hero--solo', extraClass]
    .filter(Boolean)
    .join(' ');
</script>

<section
  class={rootClass}
  data-variant={resolvedVariant}
  aria-labelledby={ariaLabelledBy}
  aria-describedby={ariaDescribedBy}
>
  <div class="hero__background" aria-hidden="true">
    <div class="hero__background-layer hero__background-layer--gradient"></div>
    <div class="hero__background-layer hero__background-layer--overlay"></div>
    <div class="hero__background-layer hero__background-layer--grain"></div>
  </div>

  <div class="hero__layout">
    <div class="hero__main">
      <div class="hero__content">
        {#if $$slots.status}
          <div class="hero__status">
            <slot name="status" />
          </div>
        {/if}

        {#if titleId}
          <h1 id={titleId} class="hero__title">{title}</h1>
        {/if}

        {#if leadId}
          <p id={leadId} class="hero__lead">{subtitle}</p>
        {/if}

        {#if $$slots.description}
          <div id={descriptionId} class="hero__description">
            <slot name="description" />
          </div>
        {/if}

        {#if $$slots.actions}
          <div class="hero__actions">
            <slot name="actions" />
          </div>
        {/if}
      </div>

      {#if $$slots.highlights}
        <div id={highlightsId} class="hero__highlights">
          <slot name="highlights" />
        </div>
      {/if}
    </div>

    {#if hasAside}
      <div class="hero__aside">
        <slot name="aside" />
      </div>
    {/if}
  </div>

  <div class="hero__accent" aria-hidden="true"></div>
</section>

<style>
  .hero {
    --hero-surface: color-mix(in srgb, var(--bg-elev-1) 92%, transparent 8%);
    --hero-surface-elev: color-mix(in srgb, var(--bg-elev-1) 95%, transparent 5%);
    --hero-text: var(--text);
    --hero-grad-start: var(--aurora-purple);
    --hero-grad-stop: var(--voyage-blue);
    --hero-overlay: color-mix(in srgb, var(--bg) 75%, transparent 25%);
    --hero-padding-block: var(--section-padding-desktop);
    --hero-padding-inline: var(--space-4xl);
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding-block: var(--hero-padding-block);
    padding-inline: var(--hero-padding-inline);
    color: var(--text);
    background: var(--hero-surface);
    border-radius: clamp(28px, 5vw, 48px);
    border: 1.5px solid color-mix(in srgb, rgba(255, 255, 255, 0.35) 85%, transparent 15%);
    box-shadow: 
      0 24px 72px rgba(10, 18, 32, 0.18),
      0 8px 24px rgba(10, 18, 32, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(10, 18, 32, 0.04);
    backdrop-filter: blur(48px) saturate(1.3) brightness(1.06);
    -webkit-backdrop-filter: blur(48px) saturate(1.3) brightness(1.06);
  }

  .hero__background {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .hero__background-layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transform: translate3d(0, 0, 0);
  }

  .hero__background-layer--gradient {
    background:
      radial-gradient(120% 150% at 18% 20%, color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.08) 78%, transparent 22%), transparent 72%),
      radial-gradient(140% 180% at 82% 0%, color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.06) 70%, transparent 30%), transparent 78%);
    filter: saturate(0.9);
    opacity: 0.5;
  }

  .hero__background-layer--overlay {
    background: var(--hero-overlay);
    mix-blend-mode: normal;
    opacity: 0.95;
  }

  .hero__background-layer--grain {
    background-image: var(--grain, var(--grain-texture));
    background-size: 320px 320px;
    opacity: 0.06;
    mix-blend-mode: soft-light;
  }

  .hero__accent {
    position: absolute;
    inset-inline: var(--space-xl);
    bottom: var(--space-lg);
    height: 3px;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--voyage-blue) 50%, var(--aurora-purple) 50%);
    opacity: 0.4;
    pointer-events: none;
    z-index: 1;
    box-shadow: 0 2px 8px color-mix(in srgb, var(--voyage-blue) 30%, transparent 70%);
  }

  @keyframes hero-pan {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.6;
    }
  }

  @keyframes hero-bar {
    0%, 100% {
      opacity: 0.9;
    }
    50% {
      opacity: 1;
    }
  }

  .hero__layout {
    position: relative;
    display: grid;
    gap: var(--space-2xl);
    align-items: start;
    z-index: 1;
  }

  .hero--with-aside .hero__layout {
    gap: var(--space-3xl);
  }

  @media (min-width: 960px) {
    .hero--with-aside .hero__layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
    }
  }

  .hero__main {
    display: grid;
    gap: var(--space-xl);
  }

  .hero__content {
    position: relative;
    display: grid;
    gap: var(--space-lg);
    padding: var(--space-3xl);
    border-radius: clamp(20px, 4vw, 36px);
    background: color-mix(in srgb, var(--bg-elev-1) 94%, transparent 6%);
    border: 1.5px solid color-mix(in srgb, rgba(255, 255, 255, 0.4) 80%, transparent 20%);
    box-shadow: 
      0 20px 56px rgba(10, 18, 32, 0.14),
      0 8px 20px rgba(10, 18, 32, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 -1px 0 rgba(10, 18, 32, 0.03);
    backdrop-filter: blur(32px) saturate(1.2) brightness(1.04);
    -webkit-backdrop-filter: blur(32px) saturate(1.2) brightness(1.04);
    overflow: hidden;
    isolation: isolate;
    animation: hero-entrance 680ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .hero__content::before {
    content: '';
    position: absolute;
    inset: -40%;
    background: radial-gradient(120% 120% at 12% 20%, rgba(var(--voyage-blue-rgb), 0.14), transparent 70%);
    opacity: 0.9;
    pointer-events: none;
    transform: translate3d(0, 0, 0);
  }

  .hero__content::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: var(--grain, var(--grain-texture));
    background-size: 280px 280px;
    opacity: 0.08;
    mix-blend-mode: soft-light;
    pointer-events: none;
  }

  .hero__status {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .hero__title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: var(--font-h1-weight, 700);
    font-size: var(--h1);
    line-height: var(--font-h1-line, 1.2);
    letter-spacing: -0.01em;
    color: var(--heading-color, var(--hero-text));
    text-wrap: balance;
  }

  .hero__lead {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--text-subtitle);
    line-height: var(--leading-relaxed);
    max-width: 48ch;
    text-wrap: balance;
  }

  .hero--align-center .hero__lead {
    margin-inline: auto;
  }

  .hero__description {
    display: grid;
    gap: var(--space-md);
    color: var(--text-secondary);
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
    max-width: 60ch;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
    margin-top: var(--space-xl);
  }

  .hero__actions :global(*) {
    flex-shrink: 0;
  }

  .hero__highlights {
    margin-top: var(--space-xl);
    padding: var(--space-3xl);
    border-radius: var(--radius-2xl, 32px);
    background: color-mix(in srgb, var(--hero-surface-elev) 60%, transparent 40%);
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.25) 70%, transparent 30%);
    box-shadow: 
      0 12px 36px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(24px) saturate(1.2) brightness(1.1);
    -webkit-backdrop-filter: blur(24px) saturate(1.2) brightness(1.1);
    display: grid;
    gap: var(--space-md);
    animation: hero-entrance 880ms cubic-bezier(0.23, 1, 0.32, 1) both;
    animation-delay: 120ms;
  }

  .hero__highlights :global(h2),
  .hero__highlights :global(h3) {
    margin: 0;
    font-size: var(--h3);
  }

  .hero__highlights :global(p) {
    margin: 0;
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  .hero__highlights :global(ul) {
    margin: 0;
    padding-inline-start: var(--space-xl);
    list-style: disc;
    display: grid;
    gap: var(--space-sm);
    color: var(--text-secondary);
  }

  .hero__aside {
    display: grid;
    gap: var(--space-lg);
    animation: hero-entrance 880ms cubic-bezier(0.23, 1, 0.32, 1) both;
    animation-delay: 160ms;
  }

  .hero--align-center .hero__main {
    text-align: center;
    align-items: center;
  }

  .hero--align-center .hero__actions {
    justify-content: center;
  }

  .hero--align-center .hero__highlights {
    text-align: left;
  }

  [data-variant='grid'] {
    --hero-grad-start: var(--voyage-blue);
    --hero-grad-stop: var(--signal-yellow);
  }

  [data-variant='halo'] {
    --hero-grad-start: color-mix(in srgb, var(--aurora-purple) 80%, var(--voyage-blue) 20%);
    --hero-grad-stop: color-mix(in srgb, var(--signal-yellow) 70%, var(--aurora-purple) 30%);
  }

  [data-variant='line'] {
    --hero-grad-start: var(--voyage-blue);
    --hero-grad-stop: var(--cherry-pop);
  }

  [data-variant='particles'] {
    --hero-grad-start: color-mix(in srgb, var(--aurora-purple) 60%, var(--voyage-blue) 40%);
    --hero-grad-stop: color-mix(in srgb, var(--voyage-blue) 40%, var(--signal-yellow) 60%);
  }

  @keyframes hero-entrance {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  :global(html[data-theme='hc'] .hero) {
    background: var(--bg);
    border: 2px solid currentColor;
    box-shadow: none;
  }

  :global(html[data-theme='hc'] .hero__background-layer) {
    display: none;
  }

  :global(html[data-theme='hc'] .hero__accent) {
    position: static;
    width: 100%;
    height: var(--space-sm);
    margin-top: var(--space-lg);
    background: currentColor;
    opacity: 1;
  }

  :global(html[data-theme='hc'] .hero__content),
  :global(html[data-theme='hc'] .hero__highlights) {
    background: transparent;
    border: 2px solid currentColor;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  @media (max-width: 640px) {
    .hero {
      --hero-padding-block: var(--section-padding-mobile);
      --hero-padding-inline: var(--space-2xl);
    }

    .hero__actions {
      flex-direction: column;
      align-items: stretch;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero__background-layer--gradient,
    .hero__accent {
      animation: none;
      background-position: 50% 50%;
    }

    .hero__actions,
    .hero__highlights,
    .hero__content,
    .hero__aside {
      transition: none;
      animation: none;
    }
  }
</style>
