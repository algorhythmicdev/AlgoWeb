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
    --halo-opacity-min: 0.0008;
    --halo-opacity-base: 0.0022;
    --halo-opacity-span: 0.008;
    --halo-opacity-max: 0.0048;
    --halo-filter: blur(120px) saturate(0.26) brightness(0.72);
    --halo-blend: screen;
    --halo-duration: 34s;
    position: fixed;
    inset: -16vh 0 0 0;
    pointer-events: none;
    z-index: calc(var(--z-background, -20) + 2);
    background:
      radial-gradient(circle at 50% 12%, color-mix(in srgb, var(--halo-color) 1%, transparent) 0%, transparent 66%),
      radial-gradient(circle at 18% 42%, color-mix(in srgb, var(--halo-color) 0.8%, transparent) 0%, transparent 72%),
      radial-gradient(circle at 84% 34%, color-mix(in srgb, var(--signal-yellow) 0.6%, transparent) 0%, transparent 70%);
    opacity: clamp(
      var(--halo-opacity-min),
      var(--halo-opacity-base) + var(--scroll-depth, 0) * var(--halo-opacity-span),
      var(--halo-opacity-max)
    );
    filter: var(--halo-filter);
    mix-blend-mode: var(--halo-blend, screen);
    transform: translate3d(0, 0, 0);
    animation: halo-drift var(--halo-duration, 36s) ease-in-out infinite alternate;
  }

  .halo--primary,
  .halo--aurora {
    --halo-opacity-base: 0.0026;
    --halo-opacity-max: 0.0055;
  }

  .halo--voyage {
    --halo-filter: blur(124px) saturate(0.28) brightness(0.72);
    --halo-opacity-max: 0.005;
  }

  .halo--citrus {
    --halo-opacity-base: 0.0028;
    --halo-opacity-max: 0.006;
    --halo-filter: blur(122px) saturate(0.3) brightness(0.74);
  }

  .halo--evergreen {
    --halo-filter: blur(120px) saturate(0.26) brightness(0.7);
    --halo-opacity-max: 0.005;
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
      transform: translate3d(0, -0.2%, 0) scale(1.0015);
      opacity: 0.022;
    }
    to {
      transform: translate3d(0, 0.4%, 0) scale(1.0035);
      opacity: 0.045;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .halo {
      animation: none;
    }
  }

  :global([data-base-theme='dark']) .halo {
    --halo-opacity-min: 0.0015;
    --halo-opacity-base: 0.0032;
    --halo-opacity-span: 0.009;
    --halo-opacity-max: 0.0065;
    --halo-filter: blur(132px) saturate(0.24) brightness(0.52);
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
