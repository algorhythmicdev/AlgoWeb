<script lang="ts">
  import { onMount } from 'svelte';

  type HaloTone = 'primary' | 'aurora' | 'voyage' | 'citrus' | 'evergreen';
  export let tone: HaloTone = 'primary';

  let prefersReduced = false;
  let prefersHighContrast = false;
  let prefersLessTransparency = false;
  let flattenHalo = false;

  function observePreference(query: string, setter: (value: boolean) => void) {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setter(false);
      return () => {};
    }

    const mediaQuery = window.matchMedia(query);
    const apply = (value: boolean) => setter(Boolean(value));
    const handleChange = (event: MediaQueryListEvent) => apply(event.matches);

    apply(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }

    return () => {};
  }

  onMount(() => {
    const unsubscribeReduced = observePreference('(prefers-reduced-motion: reduce)', (matches) => {
      prefersReduced = matches;
    });
    const unsubscribeContrast = observePreference('(prefers-contrast: more)', (matches) => {
      prefersHighContrast = matches;
    });
    const unsubscribeTransparency = observePreference('(prefers-reduced-transparency: reduce)', (matches) => {
      prefersLessTransparency = matches;
    });

    return () => {
      unsubscribeReduced();
      unsubscribeContrast();
      unsubscribeTransparency();
    };
  });

  const toneMap: Record<HaloTone, string> = {
    primary: 'var(--aurora-purple)',
    aurora: 'var(--aurora-purple)',
    voyage: 'var(--voyage-blue)',
    citrus: 'var(--signal-yellow)',
    evergreen: 'var(--accent-1)'
  };

  $: haloColor = toneMap[tone] ?? toneMap.primary;
  $: haloToneClass = `halo--${tone}`;
  $: flattenHalo = prefersHighContrast || prefersLessTransparency;
  $: haloClassName = ['halo', haloToneClass, prefersReduced ? 'halo--static' : '', flattenHalo ? 'halo--flat' : '']
    .filter(Boolean)
    .join(' ');
</script>

<div class={haloClassName} style={`--halo-color: ${haloColor};`} aria-hidden="true"></div>

<style>
  .halo {
    --halo-opacity-min: 0.0004;
    --halo-opacity-base: 0.0012;
    --halo-opacity-span: 0.0045;
    --halo-opacity-max: 0.0026;
    --halo-filter: blur(84px) saturate(0.22) brightness(0.78);
    --halo-blend: screen;
    --scroll-depth: 0;
    --halo-duration: 42s;
    position: fixed;
    inset: -12vh 0 0 0;
    pointer-events: none;
    z-index: calc(var(--z-background) + 2);
    background:
      radial-gradient(circle at 50% 18%, color-mix(in srgb, var(--halo-color) 0.6%, transparent) 0%, transparent 62%),
      radial-gradient(circle at 22% 48%, color-mix(in srgb, var(--halo-color) 0.5%, transparent) 0%, transparent 68%),
      radial-gradient(circle at 78% 60%, color-mix(in srgb, var(--signal-yellow) 0.35%, transparent) 0%, transparent 72%);
    opacity: clamp(
      var(--halo-opacity-min),
      var(--halo-opacity-base) + var(--scroll-depth) * var(--halo-opacity-span),
      var(--halo-opacity-max)
    );
    filter: var(--halo-filter);
    mix-blend-mode: var(--halo-blend);
    transform: translate3d(0, 0, 0);
    animation: halo-drift var(--halo-duration) ease-in-out infinite alternate;
  }

  .halo--primary,
  .halo--aurora {
    --halo-opacity-base: 0.0013;
    --halo-opacity-max: 0.0028;
  }

  .halo--voyage {
    --halo-filter: blur(88px) saturate(0.24) brightness(0.76);
    --halo-opacity-max: 0.0026;
  }

  .halo--citrus {
    --halo-opacity-base: 0.0014;
    --halo-opacity-max: 0.003;
    --halo-filter: blur(90px) saturate(0.25) brightness(0.78);
  }

  .halo--evergreen {
    --halo-filter: blur(86px) saturate(0.22) brightness(0.74);
    --halo-opacity-max: 0.0028;
  }

  .halo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.04), transparent 70%);
    mix-blend-mode: soft-light;
    opacity: 0.03;
  }

  .halo--static {
    animation: none;
  }

  @keyframes halo-drift {
    from {
      transform: translate3d(0, -0.12%, 0) scale(1.001);
      opacity: 0.016;
    }
    to {
      transform: translate3d(0, 0.28%, 0) scale(1.0025);
      opacity: 0.028;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .halo {
      animation: none;
    }
  }

  :global([data-base-theme='dark']) .halo {
    --halo-opacity-min: 0.0006;
    --halo-opacity-base: 0.0014;
    --halo-opacity-span: 0.0048;
    --halo-opacity-max: 0.0032;
    --halo-filter: blur(96px) saturate(0.24) brightness(0.58);
    --halo-blend: lighten;
  }

  :global(html[data-theme='hc']) .halo {
    display: none;
  }

  .halo--flat {
    --halo-opacity-min: 0;
    --halo-opacity-base: 0;
    --halo-opacity-span: 0;
    --halo-opacity-max: 0;
    opacity: 0;
    animation: none;
  }

  @media (prefers-contrast: more), (prefers-reduced-transparency: reduce) {
    .halo {
      display: none;
    }
  }
</style>
