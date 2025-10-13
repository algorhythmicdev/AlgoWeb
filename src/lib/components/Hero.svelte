<script lang="ts">
  type HeroVariant = 'aurora' | 'grid' | 'halo' | 'line' | 'particles';
  type HeroAlign = 'start' | 'center';

  const VALID_VARIANTS = new Set<HeroVariant>(['aurora', 'grid', 'halo', 'line', 'particles']);

  export let variant: HeroVariant | string = 'aurora';
  export let title = '';
  export let subtitle = '';
  export let align: HeroAlign = 'start';

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
</script>

<section
  class={`hero ${alignmentClass} ${hasAside ? 'hero--with-aside' : 'hero--solo'}`}
  data-variant={resolvedVariant}
  aria-labelledby={ariaLabelledBy}
  aria-describedby={ariaDescribedBy}
>
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
    --hero-surface: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--ink-rgb), 0.06) 6%);
    --hero-surface-elev: color-mix(in srgb, var(--bg-elev-1) 96%, rgba(var(--ink-rgb), 0.08) 4%);
    --hero-text: var(--text);
    --hero-grad-start: var(--aurora-purple);
    --hero-grad-stop: var(--voyage-blue);
    --hero-overlay: color-mix(in srgb, var(--bg) 72%, transparent 28%);
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: clamp(3.5rem, 6vw, 5.5rem) clamp(1.5rem, 5vw, 3.5rem);
    color: var(--hero-text);
    background: var(--hero-surface);
    border-radius: clamp(24px, 5vw, 40px);
    border: 1px solid color-mix(in srgb, var(--border) 72%, transparent 28%);
    box-shadow: 0 26px 64px rgba(6, 20, 53, 0.12);
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: -12%;
    background:
      radial-gradient(120% 150% at 18% 20%, color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.55) 78%, transparent 22%), transparent 72%),
      radial-gradient(140% 180% at 82% 0%, color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.52) 70%, transparent 30%), transparent 78%),
      linear-gradient(130deg, color-mix(in srgb, var(--voyage-blue) 86%, transparent 14%), color-mix(in srgb, var(--aurora-purple) 72%, var(--signal-yellow) 28%)),
      var(--hero-overlay);
    filter: saturate(1.05);
    opacity: 0.94;
    pointer-events: none;
    transform: translate3d(0, 0, 0);
    animation: hero-pan 46s ease-in-out infinite alternate;
    z-index: 0;
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: -1px;
    background-image: var(--grain, var(--grain-texture));
    background-size: 320px 320px;
    opacity: 0.06;
    pointer-events: none;
    mix-blend-mode: soft-light;
    z-index: 0;
  }

  .hero__accent {
    position: absolute;
    inset-inline: clamp(1.2rem, 6vw, 3.2rem);
    bottom: clamp(1.2rem, 3vw, 2rem);
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--hero-grad-start), var(--hero-grad-stop));
    background-size: 200% 100%;
    opacity: 0.9;
    animation: hero-bar 18s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes hero-pan {
    from {
      transform: translate3d(-2%, -3%, 0) scale(1.05);
    }
    to {
      transform: translate3d(3%, 2%, 0) scale(1.05);
    }
  }

  @keyframes hero-bar {
    from {
      background-position: 0% 50%;
    }
    to {
      background-position: 100% 50%;
    }
  }

  .hero__layout {
    position: relative;
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    align-items: start;
    z-index: 1;
  }

  .hero--with-aside .hero__layout {
    gap: clamp(2.5rem, 5vw, 4rem);
  }

  @media (min-width: 960px) {
    .hero--with-aside .hero__layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
    }
  }

  .hero__main {
    display: grid;
    gap: clamp(1.4rem, 3.4vw, 2.2rem);
  }

  .hero__content {
    position: relative;
    display: grid;
    gap: clamp(1rem, 2.8vw, 1.8rem);
    padding: clamp(1.6rem, 3vw, 2.4rem);
    border-radius: clamp(22px, 4vw, 32px);
    background: color-mix(in srgb, var(--hero-surface) 82%, rgba(var(--ink-rgb), 0.08) 18%);
    border: 1px solid color-mix(in srgb, var(--border) 62%, transparent 38%);
    box-shadow: 0 26px 60px rgba(6, 20, 53, 0.16);
    backdrop-filter: blur(20px) saturate(1.08);
    -webkit-backdrop-filter: blur(20px) saturate(1.08);
    overflow: hidden;
    isolation: isolate;
    animation: hero-entrance 880ms cubic-bezier(0.23, 1, 0.32, 1) both;
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
    gap: 0.5rem;
  }

  .hero__title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: var(--font-h1-weight, 700);
    font-size: var(--font-h1-size, 2.25rem);
    line-height: var(--font-h1-line, 1.2);
    letter-spacing: -0.01em;
    color: var(--heading-color, var(--hero-text));
    text-wrap: balance;
  }

  .hero__lead {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.08rem, 2.6vw, 1.28rem);
    line-height: 1.6;
    max-width: 48ch;
    text-wrap: balance;
  }

  .hero--align-center .hero__lead {
    margin-inline: auto;
  }

  .hero__description {
    display: grid;
    gap: clamp(0.75rem, 2.4vw, 1.2rem);
    color: var(--text-secondary);
    font-size: clamp(1rem, 2.2vw, 1.1rem);
    line-height: 1.6;
    max-width: 60ch;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.85rem, 2vw, 1.2rem);
    margin-top: clamp(1.4rem, 3.6vw, 2.2rem);
  }

  .hero__actions :global(*) {
    flex-shrink: 0;
  }

  .hero__highlights {
    margin-top: clamp(1.6rem, 4vw, 2.6rem);
    padding: clamp(1.5rem, 3vw, 2.25rem);
    border-radius: var(--radius-lg, 24px);
    background: var(--hero-surface-elev);
    border: 1px solid color-mix(in srgb, var(--border) 70%, transparent 30%);
    box-shadow: 0 18px 42px rgba(12, 20, 40, 0.08);
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.2rem);
    animation: hero-entrance 880ms cubic-bezier(0.23, 1, 0.32, 1) both;
    animation-delay: 120ms;
  }

  .hero__highlights :global(h2),
  .hero__highlights :global(h3) {
    margin: 0;
    font-size: var(--font-h3-size, 1.5rem);
  }

  .hero__highlights :global(p) {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.55;
  }

  .hero__highlights :global(ul) {
    margin: 0;
    padding-left: 1.2rem;
    list-style: disc;
    display: grid;
    gap: 0.5rem;
    color: var(--text-secondary);
  }

  .hero__aside {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
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

  :global(html[data-theme='hc'] .hero::before),
  :global(html[data-theme='hc'] .hero::after) {
    display: none;
  }

  :global(html[data-theme='hc'] .hero__accent) {
    position: static;
    width: 100%;
    height: 0.4rem;
    margin-top: clamp(1.2rem, 3vw, 1.8rem);
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
      padding: clamp(3rem, 8vw, 4rem) clamp(1.25rem, 5vw, 2rem);
    }

    .hero__actions {
      flex-direction: column;
      align-items: stretch;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero::before,
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
