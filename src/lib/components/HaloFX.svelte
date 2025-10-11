<script lang="ts">
  type HaloTone = 'primary' | 'aurora' | 'voyage' | 'citrus' | 'evergreen';
  export let tone: HaloTone = 'primary';
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const toneMap: Record<HaloTone, string> = {
    primary: 'var(--aurora-purple)',
    aurora: 'var(--aurora-purple)',
    voyage: 'var(--voyage-blue)',
    citrus: 'var(--signal-yellow)',
    evergreen: 'var(--accent-1)'
  };

  $: haloColor = toneMap[tone] ?? toneMap.primary;
</script>

<div class={`halo ${prefersReduced ? 'halo--static' : ''}`} style={`--halo-color: ${haloColor};`} aria-hidden="true"></div>

<style>
  .halo {
    position: fixed;
    inset: -20vh 0 0 0;
    pointer-events: none;
    z-index: calc(var(--z-background, -1) + 1);
    background:
      radial-gradient(circle at 50% 10%, color-mix(in srgb, var(--halo-color) 32%, transparent) 0%, transparent 62%),
      radial-gradient(circle at 15% 40%, color-mix(in srgb, var(--halo-color) 18%, transparent) 0%, transparent 70%),
      radial-gradient(circle at 85% 35%, color-mix(in srgb, var(--signal-yellow) 16%, transparent) 0%, transparent 68%);
    opacity: 0.55;
    filter: blur(140px) saturate(1.05);
    mix-blend-mode: screen;
    transform: translate3d(0, 0, 0);
    animation: halo-drift 26s ease-in-out infinite alternate;
  }

  .halo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.14), transparent 70%);
    mix-blend-mode: soft-light;
    opacity: 0.4;
  }

  .halo--static {
    animation: none;
  }

  @keyframes halo-drift {
    from {
      transform: translate3d(0, -2%, 0) scale(1.02);
      opacity: 0.5;
    }
    to {
      transform: translate3d(0, 4%, 0) scale(1.08);
      opacity: 0.68;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .halo {
      animation: none;
    }
  }
</style>
