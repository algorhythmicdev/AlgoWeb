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
  <div class="hero__backdrop" aria-hidden="true">
    <span class="hero__layer hero__layer--base"></span>
    <span class="hero__layer hero__layer--glow"></span>
    <span class="hero__layer hero__layer--grid"></span>
    <span class="hero__layer hero__layer--particles"></span>
    <span class="hero__layer hero__layer--halo"></span>
    <span class="hero__layer hero__layer--lines"></span>
  </div>

  <div class="hero__layout">
    <div class="hero__main">
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
</section>

<style>
  .hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding-block: clamp(3.5rem, 6vw, 6rem);
    color: var(--hero-text, var(--text));
    background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--bg) 92%, rgba(var(--voyage-blue-rgb), 0.15) 8%),
        color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--aurora-purple-rgb), 0.12) 12%)
      )
      no-repeat;
    border-radius: clamp(28px, 5vw, 48px);
    border: 1px solid color-mix(in srgb, var(--border) 70%, transparent 30%);
    box-shadow: 0 32px 80px rgba(6, 20, 53, 0.18);
  }

  .hero__layout {
    position: relative;
    display: grid;
    gap: clamp(2.5rem, 4vw, 3.5rem);
  }

  .hero__backdrop {
    position: absolute;
    inset: -1px;
    overflow: hidden;
    border-radius: inherit;
    opacity: 0.92;
  }

  .hero__layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    transition: opacity var(--duration-slow, 600ms) ease, transform var(--duration-slow, 600ms) ease;
  }

  .hero__layer--base {
    background: radial-gradient(
        circle at top left,
        color-mix(in srgb, var(--bg-elev-2) 88%, rgba(var(--aurora-purple-rgb), 0.12) 12%),
        transparent 60%
      ),
      radial-gradient(
        circle at bottom right,
        color-mix(in srgb, var(--bg-elev-2) 78%, rgba(var(--voyage-blue-rgb), 0.2) 22%),
        transparent 55%
      ),
      var(--bg);
  }

  .hero__layer--glow {
    background: radial-gradient(
      circle at 20% 30%,
      color-mix(in srgb, var(--aurora-purple) 32%, transparent 68%),
      transparent 70%
    );
    opacity: 0.7;
    transform: translate3d(0, 0, 0);
  }

  .hero__layer--grid {
    background-image: linear-gradient(
        90deg,
        color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.2) 65%, transparent 35%),
        transparent 60%
      ),
      linear-gradient(
        0deg,
        color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.18) 70%, transparent 30%),
        transparent 60%
      );
    background-size: 120px 120px;
    opacity: 0.3;
    mix-blend-mode: soft-light;
  }

  .hero__layer--particles {
    background-image: radial-gradient(
      2px 2px at 20% 30%,
      rgba(var(--voyage-blue-rgb), 0.25),
      transparent 70%
    );
    background-size: 160px 160px;
    opacity: 0.25;
    filter: saturate(1.1);
    animation: heroParticles 32s linear infinite;
  }

  .hero__layer--halo {
    background: radial-gradient(
      circle at 80% 20%,
      color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.28) 60%, transparent 40%),
      transparent 65%
    );
    opacity: 0.45;
    transform: translate3d(0, 0, 0);
  }

  .hero__layer--lines {
    background-image: repeating-linear-gradient(
        75deg,
        color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.18) 65%, transparent 35%) 0 2px,
        transparent 2px 16px
      ),
      repeating-linear-gradient(
        -75deg,
        color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.22) 50%, transparent 50%) 0 2px,
        transparent 2px 18px
      );
    opacity: 0.2;
    mix-blend-mode: screen;
  }

  .hero__main {
    position: relative;
    display: grid;
    gap: 1.25rem;
    z-index: 1;
  }

  .hero__status {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.85rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--bg-elev-1) 84%, rgba(var(--aurora-purple-rgb), 0.2) 16%);
    border: 1px solid color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.5) 65%, rgba(255, 255, 255, 0.4) 35%);
    font-size: clamp(0.75rem, 1vw, 0.85rem);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .hero__title {
    font-size: clamp(2.35rem, 5vw, 3.75rem);
    line-height: 1.05;
    font-weight: var(--weight-extrabold, 700);
    letter-spacing: -0.02em;
  }

  .hero__lead {
    max-width: 38ch;
    font-size: clamp(1.05rem, 1.8vw, 1.35rem);
    color: color-mix(in srgb, var(--text) 82%, rgba(var(--voyage-blue-rgb), 0.1) 18%);
  }

  .hero__description {
    max-width: 60ch;
    display: grid;
    gap: 1rem;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .hero__highlights {
    display: grid;
    gap: 0.75rem;
  }

  .hero__aside {
    position: relative;
    display: grid;
    gap: 1rem;
    align-content: start;
    z-index: 1;
  }

  .hero--align-center .hero__layout {
    text-align: center;
    justify-items: center;
  }

  .hero--align-center .hero__actions {
    justify-content: center;
  }

  .hero--align-center .hero__lead,
  .hero--align-center .hero__description {
    margin-inline: auto;
  }

  .hero--with-aside .hero__layout {
    display: grid;
    gap: clamp(2rem, 5vw, 4rem);
  }

  @media (min-width: 960px) {
    .hero--with-aside .hero__layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
      align-items: center;
    }
  }

  @media (min-width: 1200px) {
    .hero--with-aside .hero__layout {
      grid-template-columns: minmax(0, 0.95fr) minmax(0, 0.85fr);
    }
  }

  [data-variant='grid'] .hero__layer--grid {
    opacity: 0.45;
    animation: heroGridPan 36s linear infinite;
  }

  [data-variant='grid'] .hero__layer--halo,
  [data-variant='grid'] .hero__layer--particles {
    opacity: 0.15;
  }

  [data-variant='halo'] .hero__layer--halo {
    opacity: 0.65;
    animation: heroHaloPulse 18s ease-in-out infinite;
  }

  [data-variant='halo'] .hero__layer--grid {
    opacity: 0.2;
  }

  [data-variant='line'] .hero__layer--lines {
    opacity: 0.45;
    animation: heroLinesSweep 28s linear infinite;
  }

  [data-variant='line'] .hero__layer--particles {
    opacity: 0.1;
  }

  [data-variant='particles'] .hero__layer--particles {
    opacity: 0.5;
  }

  [data-variant='particles'] .hero__layer--grid,
  [data-variant='particles'] .hero__layer--lines {
    opacity: 0.15;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero__layer--particles,
    .hero__layer--halo,
    .hero__layer--grid,
    .hero__layer--lines {
      animation: none !important;
      transform: none !important;
    }
  }

  @keyframes heroParticles {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-120px, -80px, 0);
    }
  }

  @keyframes heroGridPan {
    from {
      background-position: 0 0, 0 0;
    }
    to {
      background-position: 120px 120px, -120px -120px;
    }
  }

  @keyframes heroHaloPulse {
    0%,
    100% {
      opacity: 0.35;
      transform: scale(0.9);
    }
    50% {
      opacity: 0.75;
      transform: scale(1.08);
    }
  }

  @keyframes heroLinesSweep {
    from {
      background-position: 0 0, 0 0;
    }
    to {
      background-position: 320px 220px, -320px -220px;
    }
  }

  :global(html[data-theme='hc'] .hero) {
    background: var(--bg);
    box-shadow: none;
  }

  :global(html[data-theme='hc'] .hero__layer) {
    opacity: 0.18;
    mix-blend-mode: normal;
    animation: none !important;
  }

  :global(html[data-theme='hc'] .hero__status) {
    background: var(--bg);
    border-color: var(--border-strong);
  }
</style>
