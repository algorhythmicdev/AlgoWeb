<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import HeroBackdrop from './hero/HeroBackdrop.svelte';

  type HeroAlign = 'start' | 'center';
  type BackdropVariant =
    | 'aurora-flow'
    | 'glass-parallax'
    | 'grid-ripple'
    | 'particle-drift'
    | 'line-sweep'
    | 'spotlight';

  const VARIANT_ALIASES: Record<string, BackdropVariant> = {
    aurora: 'aurora-flow',
    halo: 'glass-parallax',
    grid: 'grid-ripple',
    mesh: 'grid-ripple',
    nodes: 'particle-drift',
    particles: 'particle-drift',
    line: 'line-sweep',
    prism: 'glass-parallax',
    wave: 'line-sweep'
  };

  const VALID_VARIANTS = new Set<BackdropVariant>([
    'aurora-flow',
    'glass-parallax',
    'grid-ripple',
    'particle-drift',
    'line-sweep',
    'spotlight'
  ]);

  export let variant: string = 'aurora-flow';
  export let tone: 'primary' | 'aurora' | 'citrus' | 'crimson' | 'atlantic' | 'evergreen' = 'primary';
  export let intensity: 'soft' | 'balanced' | 'bold' = 'soft';
  export let title = '';
  export let subtitle = '';
  export let align: HeroAlign = 'start';

  let asideContainer: HTMLElement | null = null;
  let hasAside = false;
  let asideObserver: MutationObserver | null = null;

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

  $: resolvedVariant = (() => {
    if (VALID_VARIANTS.has(variant as BackdropVariant)) {
      return variant as BackdropVariant;
    }
    return VARIANT_ALIASES[variant] ?? 'aurora-flow';
  })();

  $: alignClass = align === 'center' ? 'hero--align-center' : 'hero--align-start';
  $: asideClass = hasAside ? 'hero--with-aside' : 'hero--no-aside';
  $: showLead = subtitle.trim().length > 0;
</script>

<section class={`hero ${alignClass} ${asideClass}`}>
  <div class="hero__container">
    <div class="hero__surface">
      <HeroBackdrop class="hero__backdrop" variant={resolvedVariant} tone={tone} intensity={intensity} />
      <div class="hero__intro">
        <slot name="status" />
        <slot name="title">
          {#if title.trim().length}
            <h1 class="hero__title">{title}</h1>
          {/if}
        </slot>
        <slot name="lead">
          {#if showLead}
            <p class="hero__lead">{subtitle}</p>
          {/if}
        </slot>
        <slot name="description" />
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
</section>

<style>
  .hero {
    position: relative;
    padding-block: clamp(5.5rem, 12vw, 8.5rem);
    isolation: isolate;
  }

  .hero__container {
    width: min(100%, var(--container-xl, 1200px));
    margin-inline: auto;
    padding-inline: clamp(1.5rem, 5vw, 3rem);
  }

  .hero__surface {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: clamp(2rem, 5vw, 3.2rem);
    border-radius: clamp(28px, 6vw, 36px);
    padding: clamp(2rem, 5vw, 3.25rem);
    --hero-surface-bg: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.54) 22%, transparent 78%);
    --hero-surface-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 60%, rgba(255, 255, 255, 0.3) 40%);
    --hero-surface-shadow: 0 30px 64px rgba(var(--voyage-blue-rgb), 0.24);
    background: var(--hero-surface-bg);
    border: 1px solid var(--hero-surface-border);
    box-shadow: var(--hero-surface-shadow);
    backdrop-filter: blur(28px) saturate(1.08);
    -webkit-backdrop-filter: blur(28px) saturate(1.08);
    overflow: hidden;
  }

  .hero__surface::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: var(--grain, none);
    opacity: clamp(0.04, 0.08, 0.08);
    pointer-events: none;
    mix-blend-mode: soft-light;
  }

  :global([data-base-theme='dark']) .hero__surface {
    --hero-surface-bg: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.62) 26%, transparent 74%);
    --hero-surface-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.56) 58%, rgba(255, 255, 255, 0.22) 42%);
    --hero-surface-shadow: 0 36px 74px rgba(var(--aurora-purple-rgb), 0.32);
  }

  :global(html[data-theme='hc']) .hero__surface {
    background: color-mix(in srgb, var(--bg) 94%, rgba(var(--voyage-blue-rgb), 0.14) 6%);
    border-color: var(--border-strong, var(--text));
    box-shadow: none;
  }

  .hero__backdrop {
    position: absolute;
    inset: clamp(-6rem, -12vw, -3rem);
    z-index: -1;
    opacity: 0.82;
    mix-blend-mode: screen;
  }

  :global([data-base-theme='dark']) .hero__backdrop {
    opacity: 0.68;
    mix-blend-mode: lighten;
  }

  :global(html[data-theme='hc']) .hero__backdrop {
    opacity: 0.55;
    mix-blend-mode: normal;
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
    background: var(--gradient-heading, var(--grad));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .hero__lead {
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.6vw, 1.32rem);
    line-height: 1.6;
    text-wrap: balance;
  }

  .hero__aside {
    position: relative;
    display: grid;
    gap: clamp(1.3rem, 3vw, 2rem);
  }

  .hero__aside:empty {
    display: none;
  }

  .hero--no-aside .hero__aside {
    display: none;
  }

  .hero--no-aside .hero__surface {
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
    .hero__surface {
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
      padding: clamp(1.6rem, 6vw, 2.4rem);
      gap: clamp(1.6rem, 5vw, 2.4rem);
    }

    .hero__title {
      font-size: clamp(2rem, 9vw, 3rem);
    }
  }
</style>
