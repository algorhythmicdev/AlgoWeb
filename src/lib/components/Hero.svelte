<script>
  import { onMount } from 'svelte';
  /** @type {'halo' | 'grid' | 'line' | 'particles'} */
  export let variant = 'halo';
  export let title = 'Algo Hero — Big, modern, animated';
  export let subtitle = 'Single gradient logic + page-to-page variants.';

  /** @type {'light' | 'dark' | 'hc'} */
  let theme = 'light';
  let heroEl;

  // Simple store-free theme sync via <html data-theme>
  function readTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'hc') theme = t;
    else theme = 'light';
  }

  onMount(() => {
    const obs = new MutationObserver(() => {
      readTheme();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    readTheme(); // Initial theme read
    return () => {
      obs.disconnect();
    };
  });
</script>

<style>
  .hero {
    position: relative;
    border-radius: var(--radius);
    overflow: clip;
    padding: clamp(24px, 5vw, 56px);
    background: var(--bg-elev-1);
    color: var(--text);
    box-shadow: var(--shadow-1);
    isolation: isolate;
  }
  .content {
    position: relative;
    z-index: 1;
    max-width: 72ch;
  }
  h1 {
    margin: 0 0 12px;
    font-weight: 800;
    line-height: 1.08;
  }
  p {
    margin: 0 0 18px;
    color: var(--muted);
  }

  /* Gradient bar (accessible: behind solid text) */
  .gradbar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: clamp(10px, 3.2vw, 18px);
    background: var(--grad);
    opacity: 0.9;
    animation: bar-pan var(--slow) ease-in-out infinite alternate;
    z-index: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .gradbar {
      animation: none;
    }
  }

  /* Variant: HALO */
  .hero.a-halo::before,
  .hero.a-halo::after {
    content: '';
    position: absolute;
    inset: -10%;
    background: radial-gradient(
        600px 600px at 15% 20%,
        color-mix(in oklab, var(--grad-b) 60%, transparent) 0%,
        transparent 60%
      ),
      radial-gradient(
        700px 700px at 85% 60%,
        color-mix(in oklab, var(--grad-a) 55%, transparent) 0%,
        transparent 65%
      );
    z-index: 0;
    mix-blend-mode: screen;
    opacity: 0.55;
    animation: halo-move var(--med) ease-in-out infinite alternate;
  }
  :global([data-theme='dark'] .hero.a-halo)::before,
  :global([data-theme='dark'] .hero.a-halo)::after {
    mix-blend-mode: lighten;
  }
  :global([data-theme='hc'] .hero.a-halo)::before,
  :global([data-theme='hc'] .hero.a-halo)::after {
    display: none;
  }

  /* Variant: GRID RIPPLE */
  .hero.a-grid {
    background: linear-gradient(
      0deg,
      color-mix(in oklab, var(--bg-elev-1) 92%, var(--grad-a) 8%),
      color-mix(in oklab, var(--bg-elev-1) 92%, var(--grad-b) 8%)
    );
  }
  .hero.a-grid::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.55;
    background-image: radial-gradient(
        circle at var(--x, 50%) var(--y, 50%),
        color-mix(in oklab, var(--grad-a) 35%, transparent),
        transparent 35%
      ),
      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: auto, 40px 40px, 40px 40px;
    animation: grid-ripple var(--med) ease-in-out infinite alternate;
  }
  :global([data-theme='hc'] .hero.a-grid)::before {
    background-image: none;
  }

  /* Variant: LINE SWEEP */
  .hero.a-line::before {
    content: '';
    position: absolute;
    inset: -20% -60% -20% -60%;
    background: conic-gradient(
      from var(--rot, 45deg),
      transparent 0 30%,
      color-mix(in oklab, var(--grad-a) 40%, transparent) 50%,
      transparent 70%
    );
    animation: sweep var(--slow) linear infinite;
    z-index: 0;
    opacity: 0.6;
  }
  :global([data-theme='hc'] .hero.a-line)::before {
    display: none;
  }

  /* Variant: PARTICLE DRIFT */
  .hero.a-particles::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: radial-gradient(
        2px 2px at 10% 20%,
        color-mix(in oklab, var(--grad-a) 80%, transparent) 0,
        transparent 100%
      ),
      radial-gradient(
        2px 2px at 35% 60%,
        color-mix(in oklab, var(--grad-b) 80%, transparent) 0,
        transparent 100%
      ),
      radial-gradient(
        2px 2px at 70% 30%,
        color-mix(in oklab, var(--signal) 70%, transparent) 0,
        transparent 100%
      ),
      radial-gradient(
        2px 2px at 85% 75%,
        color-mix(in oklab, var(--voyage) 70%, transparent) 0,
        transparent 100%
      );
    animation: drift var(--med) ease-in-out infinite alternate;
    opacity: 0.5;
  }
  :global([data-theme='hc'] .hero.a-particles)::before {
    display: none;
  }
</style>

<div bind:this={heroEl} class="hero {`a-${variant}`}" role="region" aria-label="Animated hero">
  <div class="gradbar" aria-hidden="true"></div>
  <div class="content">
    <h1>{title}</h1>
    <p>{subtitle}</p>
    <slot />
  </div>
</div>
