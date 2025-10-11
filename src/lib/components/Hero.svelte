<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { nextId } from '$lib/utils/uid';
  import HeroBackdrop from './hero/HeroBackdrop.svelte';

  type HeroAlign = 'start' | 'center';
  type HeroTone = 'primary' | 'aurora' | 'citrus' | 'crimson' | 'atlantic' | 'evergreen';
  type HeroIntensity = 'soft' | 'balanced' | 'bold';
  type BackdropVariant =
    | 'aurora-flow'
    | 'glass-parallax'
    | 'grid-ripple'
    | 'connected-nodes'
    | 'particle-drift'
    | 'line-sweep'
    | 'spotlight';

  const VARIANT_ALIASES: Record<string, BackdropVariant> = {
    aurora: 'aurora-flow',
    halo: 'glass-parallax',
    grid: 'grid-ripple',
    mesh: 'grid-ripple',
    nodes: 'connected-nodes',
    particles: 'particle-drift',
    line: 'line-sweep',
    prism: 'glass-parallax',
    wave: 'line-sweep'
  };

  const VALID_VARIANTS = new Set<BackdropVariant>([
    'aurora-flow',
    'glass-parallax',
    'grid-ripple',
    'connected-nodes',
    'particle-drift',
    'line-sweep',
    'spotlight'
  ]);

  const VALID_TONES = new Set<HeroTone>([
    'primary',
    'aurora',
    'citrus',
    'crimson',
    'atlantic',
    'evergreen'
  ]);
  const VALID_INTENSITIES = new Set<HeroIntensity>(['soft', 'balanced', 'bold']);

  export let variant: string = 'aurora-flow';
  export let tone: HeroTone = 'primary';
  export let intensity: HeroIntensity = 'soft';
  export let title = '';
  export let subtitle = '';
  export let align: HeroAlign = 'start';

  declare const $$slots: Record<string, unknown>;

  let asideContainer: HTMLElement | null = null;
  let hasAside = false;
  let asideObserver: MutationObserver | null = null;

  const heroInstanceId = nextId('hero');
  const heroTitleId = `${heroInstanceId}-title`;
  const heroLeadId = `${heroInstanceId}-lead`;
  const heroDescriptionId = `${heroInstanceId}-description`;

  const updateAside = () => {
    if (!asideContainer) {
      hasAside = false;
      return;
    }
    hasAside = Array.from(asideContainer.childNodes).some((node) => {
      if (node.nodeType === 1) return true;
      if (node.nodeType === 3) return Boolean(node.textContent?.trim());
      return false;
    });
  };

  onMount(() => {
    updateAside();
    if (typeof window !== 'undefined') {
      asideObserver = new MutationObserver(updateAside);
      if (asideContainer) {
        asideObserver.observe(asideContainer, { childList: true, subtree: true });
      }
    }
    return () => {
      asideObserver?.disconnect();
      asideObserver = null;
    };
  });

  afterUpdate(updateAside);

  $: if (asideObserver && asideContainer) {
    asideObserver.disconnect();
    asideObserver.observe(asideContainer, { childList: true, subtree: true });
  }

  $: resolvedTone = VALID_TONES.has(tone) ? tone : 'primary';
  $: resolvedIntensity = VALID_INTENSITIES.has(intensity) ? intensity : 'soft';
  $: resolvedVariant = (() => {
    if (VALID_VARIANTS.has(variant as BackdropVariant)) {
      return variant as BackdropVariant;
    }
    return VARIANT_ALIASES[variant] ?? 'aurora-flow';
  })();

  $: alignClass = align === 'center' ? 'hero--align-center' : 'hero--align-start';
  $: asideClass = hasAside ? 'hero--with-aside' : 'hero--no-aside';
  $: toneClass = `hero--tone-${resolvedTone}`;
  $: intensityClass = `hero--intensity-${resolvedIntensity}`;
  $: showLead = subtitle.trim().length > 0;
  const hasTitleSlot = Boolean($$slots.title);
  const hasLeadSlot = Boolean($$slots.lead);
  const hasDescriptionSlot = Boolean($$slots.description);
  $: heroHasTitle = hasTitleSlot || title.trim().length > 0;
  $: heroHasLead = hasLeadSlot || showLead;
  $: heroHasDescription = hasDescriptionSlot;
  $: heroLabelledBy = heroHasTitle ? heroTitleId : undefined;
  $: heroDescribedBy = (() => {
    const references: string[] = [];
    if (heroHasLead) references.push(heroLeadId);
    if (heroHasDescription) references.push(heroDescriptionId);
    return references.join(' ') || undefined;
  })();
  $: heroAriaLabel = heroLabelledBy ? undefined : (title.trim() || subtitle.trim() || undefined);
</script>

<section
  class={`hero ${alignClass} ${asideClass} ${toneClass} ${intensityClass}`}
  data-hero-tone={resolvedTone}
  data-hero-intensity={resolvedIntensity}
  aria-labelledby={heroLabelledBy}
  aria-describedby={heroDescribedBy}
  aria-label={heroAriaLabel}
>
  <div class="hero__container">
    <div class="hero__surface" data-hero-layers>
      <div class="hero__layers" aria-hidden="true">
        <span class="hero__layer hero__layer--base"></span>
        <HeroBackdrop
          class="hero__layer hero__layer--backdrop"
          variant={resolvedVariant}
          tone={resolvedTone}
          intensity={resolvedIntensity}
        />
      </div>
      <div class="hero__content">
        <div class="hero__intro">
          <slot name="status" />
          <span class="hero__title-slot" id={heroHasTitle ? heroTitleId : undefined}>
            <slot name="title">
              {#if title.trim().length}
                <h1 class="hero__title">{title}</h1>
              {/if}
            </slot>
          </span>
          <span class="hero__lead-slot" id={heroHasLead ? heroLeadId : undefined}>
            <slot name="lead">
              {#if showLead}
                <p class="hero__lead">{subtitle}</p>
              {/if}
            </slot>
          </span>
          <span class="hero__description-slot" id={heroHasDescription ? heroDescriptionId : undefined}>
            <slot name="description" />
          </span>
          <slot name="actions" />
          <slot name="highlights" />
          <slot name="metrics" />
          <slot />
        </div>
        <aside class="hero__aside" bind:this={asideContainer}>
          <slot name="aside" />
        </aside>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding-block: clamp(5.5rem, 12vw, 8.5rem);
    isolation: isolate;
    --hero-tone-rgb: var(--voyage-blue-rgb);
    --hero-tone-secondary-rgb: var(--aurora-purple-rgb);
    --hero-tone-highlight-rgb: var(--signal-yellow-rgb);
    --hero-overlay-alpha: 0.5;
    --hero-border-alpha: 0.46;
    --hero-shadow-alpha: 0.22;
    --hero-overlay-strength: 26%;
    --hero-base-gradient-fallback: linear-gradient(
      134deg,
      rgb(var(--hero-tone-rgb)) 0%,
      rgb(var(--hero-tone-secondary-rgb)) 48%,
      rgb(var(--hero-tone-highlight-rgb)) 100%
    );
    --hero-heading-gradient: linear-gradient(
      128deg,
      rgba(var(--hero-tone-rgb), 0.94) 0%,
      rgba(var(--hero-tone-secondary-rgb), 0.92) 100%
    );
    --hero-accent: rgb(var(--hero-tone-rgb));
    --hero-secondary: rgb(var(--hero-tone-secondary-rgb));
    --hero-tertiary: rgb(var(--hero-tone-highlight-rgb));
    --hero-lead-color: rgba(var(--hero-tone-rgb), 0.72);
    --hero-base-gradient: var(--hero-base-gradient-fallback);
  }

  @supports (color: color-mix(in srgb, red 50%, blue 50%)) {
    .hero {
      --hero-heading-gradient: linear-gradient(
        128deg,
        color-mix(in srgb, rgb(var(--hero-tone-rgb)) 72%, rgb(var(--hero-tone-secondary-rgb)) 28%) 0%,
        color-mix(in srgb, rgb(var(--hero-tone-highlight-rgb)) 42%, rgb(var(--hero-tone-secondary-rgb)) 58%) 100%
      );
      --hero-accent: color-mix(in srgb, rgb(var(--hero-tone-rgb)) 68%, rgb(var(--hero-tone-secondary-rgb)) 32%);
      --hero-secondary: color-mix(in srgb, rgb(var(--hero-tone-secondary-rgb)) 58%, rgb(var(--hero-tone-rgb)) 42%);
      --hero-tertiary: color-mix(in srgb, rgb(var(--hero-tone-highlight-rgb)) 52%, rgb(var(--hero-tone-secondary-rgb)) 48%);
      --hero-ring-border: color-mix(
        in srgb,
        rgba(var(--hero-tone-secondary-rgb), 0.24) 68%,
        rgba(16, 24, 40, 0.12) 32%
      );
      --hero-lead-color: color-mix(in srgb, rgb(var(--hero-tone-rgb)) 18%, var(--text-secondary) 82%);
      --hero-base-gradient: linear-gradient(
        134deg,
        color-mix(in srgb, rgb(var(--hero-tone-rgb)) 82%, rgb(14, 18, 35) 18%) 0%,
        color-mix(in srgb, rgb(var(--hero-tone-secondary-rgb)) 74%, rgb(10, 14, 28) 26%) 48%,
        color-mix(in srgb, rgb(var(--hero-tone-highlight-rgb)) 70%, rgb(32, 42, 60) 30%) 100%
      );
    }
  }

  .hero__container {
    width: min(100%, var(--container-xl, 1200px));
    margin-inline: auto;
    padding-inline: clamp(1.5rem, 5vw, 3rem);
  }

  .hero__surface {
    position: relative;
    border-radius: clamp(28px, 6vw, 36px);
    --hero-surface-padding: clamp(2rem, 5vw, 3.25rem);
    padding: var(--hero-surface-padding);
    --hero-surface-border: color-mix(
      in srgb,
      rgba(var(--hero-tone-secondary-rgb), var(--hero-border-alpha)) 60%,
      rgba(255, 255, 255, 0.3) 40%
    );
    --hero-surface-shadow: 0 30px 64px rgba(var(--hero-tone-rgb), var(--hero-shadow-alpha));
    background: var(--hero-base-gradient);
    border: 1px solid var(--hero-surface-border);
    box-shadow: var(--hero-surface-shadow);
    backdrop-filter: blur(28px) saturate(1.08);
    -webkit-backdrop-filter: blur(28px) saturate(1.08);
    overflow: visible;
    isolation: isolate;
    --hero-layer-base: -1;
    --hero-layer-backdrop: 0;
    --hero-layer-content: 10;
    --hero-layer-aside: 12;
  }

  .hero__surface::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: var(--grain, none);
    opacity: clamp(0.04, 0.08, 0.08);
    pointer-events: none;
    mix-blend-mode: soft-light;
    z-index: var(--hero-layer-backdrop);
  }

  .hero__layers {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    overflow: hidden;
    pointer-events: none;
    z-index: var(--hero-layer-backdrop);
  }

  .hero__layer {
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .hero__layer--base {
    background: var(--hero-base-gradient);
    transform: translateZ(0);
    z-index: var(--hero-layer-base);
  }

  .hero__layer--backdrop {
    z-index: var(--hero-layer-backdrop);
  }

  :global(html[data-theme='hc']) .hero__surface {
    background: color-mix(in srgb, var(--bg) 94%, rgba(var(--voyage-blue-rgb), 0.14) 6%);
    border-color: var(--border-strong, var(--text));
    box-shadow: none;
  }

  .hero__layer--backdrop {
    position: absolute;
    inset: 0;
  }

  :global(html[data-theme='hc']) .hero__layer--backdrop {
    display: none;
  }

  :global(html[data-theme='hc']) .hero__layer--base {
    background: var(--bg-elev-1, var(--bg));
  }

  .hero__content {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: clamp(2rem, 5vw, 3.2rem);
    z-index: var(--hero-layer-content);
  }

  .hero__intro {
    position: relative;
    display: grid;
    gap: clamp(1.2rem, 3vw, 2.1rem);
    align-content: start;
    color: var(--text);
  }

  .hero__title {
    margin: 0;
    font-size: clamp(2.4rem, 6vw, 3.8rem);
    line-height: 1.05;
    font-weight: var(--weight-black, 800);
    letter-spacing: -0.01em;
    background: var(--hero-heading-gradient, var(--gradient-heading, var(--grad)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .hero__title-slot,
  .hero__lead-slot,
  .hero__description-slot {
    display: contents;
  }

  .hero__lead {
    margin: 0;
    color: var(--hero-lead-color);
    font-size: clamp(1.05rem, 2.6vw, 1.32rem);
    line-height: 1.6;
    text-wrap: balance;
  }

  :global(html[data-theme='hc']) .hero__lead {
    color: var(--text-secondary);
  }

  .hero--tone-aurora {
    --hero-tone-rgb: var(--aurora-purple-rgb);
    --hero-tone-secondary-rgb: var(--voyage-blue-rgb);
  }

  .hero--tone-citrus {
    --hero-tone-rgb: var(--signal-yellow-rgb);
    --hero-tone-secondary-rgb: var(--voyage-blue-rgb);
    --hero-tone-highlight-rgb: var(--aurora-purple-rgb);
    --hero-overlay-alpha: 0.46;
    --hero-border-alpha: 0.4;
    --hero-shadow-alpha: 0.18;
    --hero-overlay-strength: 22%;
  }

  .hero--tone-crimson {
    --hero-tone-rgb: var(--cherry-pop-rgb);
    --hero-tone-secondary-rgb: var(--aurora-purple-rgb);
    --hero-shadow-alpha: 0.28;
    --hero-overlay-strength: 24%;
  }

  .hero--tone-atlantic {
    --hero-tone-rgb: var(--atlantic-blue-rgb);
    --hero-tone-secondary-rgb: var(--voyage-blue-rgb);
    --hero-tone-highlight-rgb: var(--accent-1-rgb);
  }

  .hero--tone-evergreen {
    --hero-tone-rgb: var(--evergreen-rgb);
    --hero-tone-secondary-rgb: var(--voyage-blue-rgb);
    --hero-border-alpha: 0.44;
    --hero-overlay-strength: 24%;
  }

  .hero--intensity-soft {
    --hero-overlay-alpha: 0.42;
    --hero-border-alpha: 0.42;
    --hero-shadow-alpha: 0.18;
    --hero-overlay-strength: 20%;
  }

  .hero--intensity-balanced {
    --hero-overlay-alpha: 0.5;
    --hero-border-alpha: 0.46;
    --hero-shadow-alpha: 0.22;
    --hero-overlay-strength: 26%;
  }

  .hero--intensity-bold {
    --hero-overlay-alpha: 0.62;
    --hero-border-alpha: 0.58;
    --hero-shadow-alpha: 0.32;
    --hero-overlay-strength: 30%;
  }

  :global([data-base-theme='dark']) .hero.hero--intensity-soft {
    --hero-overlay-alpha: 0.5;
    --hero-border-alpha: 0.5;
    --hero-shadow-alpha: 0.24;
    --hero-overlay-strength: 22%;
  }

  :global([data-base-theme='dark']) .hero.hero--intensity-balanced {
    --hero-overlay-alpha: 0.58;
    --hero-border-alpha: 0.54;
    --hero-shadow-alpha: 0.3;
    --hero-overlay-strength: 28%;
  }

  :global([data-base-theme='dark']) .hero.hero--intensity-bold {
    --hero-overlay-alpha: 0.7;
    --hero-border-alpha: 0.62;
    --hero-shadow-alpha: 0.36;
    --hero-overlay-strength: 32%;
  }

  .hero__aside {
    position: relative;
    display: grid;
    gap: clamp(1.3rem, 3vw, 2rem);
    z-index: var(--hero-layer-aside);
  }

  .hero__aside:empty {
    display: none;
  }

  .hero--no-aside .hero__aside {
    display: none;
  }

  .hero--no-aside .hero__content {
    grid-template-columns: minmax(0, 1fr);
  }

  .hero--align-center .hero__surface {
    text-align: center;
  }

  .hero--align-center .hero__intro {
    justify-items: center;
  }

  .hero--align-center .hero__intro :global(.hero-actions) {
    justify-content: center;
  }

  .hero--align-center .hero__intro :global(.hero-highlights) {
    justify-items: center;
  }

  @media (max-width: 1024px) {
    .hero__content {
      grid-template-columns: minmax(0, 1fr);
    }

    .hero__aside {
      order: -1;
    }
  }

  @media (max-width: 720px) {
    .hero {
      padding-block: clamp(4.5rem, 18vw, 6rem);
    }

    .hero__surface {
      --hero-surface-padding: clamp(1.6rem, 6vw, 2.4rem);
    }

    .hero__content {
      gap: clamp(1.6rem, 5vw, 2.4rem);
    }

    .hero__title {
      font-size: clamp(2rem, 9vw, 3rem);
    }
  }
</style>
