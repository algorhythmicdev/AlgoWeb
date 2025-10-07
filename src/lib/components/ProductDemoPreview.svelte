<script>
  import { onDestroy, onMount } from 'svelte';

  export let title = '';
  export let description = '';
  export let href = '';
  export let host = '';
  export let cta = '';
  export let accent = /** @type {'aurora' | 'voyage'} */ ('voyage');

  /** @type {HTMLElement | null} */
  let container = null;
  let shouldLoad = false;
  let hasMounted = false;
  /** @type {IntersectionObserver | null} */
  let observer = null;
  /** @type {MediaQueryList | null} */
  let mediaQuery = null;

  const accentClass = accent === 'aurora' ? 'demo-preview--aurora' : 'demo-preview--voyage';

  const loadPreview = () => {
    if (!shouldLoad) {
      shouldLoad = true;
    }
  };

  /**
   * @param {IntersectionObserverEntry[]} entries
   */
  const handleIntersect = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        loadPreview();
        if (observer && container) {
          observer.unobserve(container);
          observer.disconnect();
          observer = null;
        }
        break;
      }
    }
  };

  const attachObserver = () => {
    if (observer || !container || typeof IntersectionObserver === 'undefined') return;
    observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.35
    });
    observer.observe(container);
  };

  const updateMotionPreference = () => {
    // no-op: we rely on CSS prefers-reduced-motion queries but keep listener for future enhancements
  };

  onMount(() => {
    hasMounted = true;

    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updateMotionPreference);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(updateMotionPreference);
      }
    }

    if (!shouldLoad) {
      if (typeof IntersectionObserver === 'undefined') {
        shouldLoad = true;
      } else {
        attachObserver();
      }
    }

    return () => {
      if (observer && container) {
        observer.unobserve(container);
        observer.disconnect();
      }
      if (mediaQuery) {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', updateMotionPreference);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(updateMotionPreference);
        }
      }
    };
  });

  onDestroy(() => {
    if (observer && container) {
      observer.unobserve(container);
      observer.disconnect();
    }
    if (mediaQuery) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMotionPreference);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(updateMotionPreference);
      }
    }
  });
</script>

<div class={`demo-preview os-window ${accentClass}`} bind:this={container} data-mounted={hasMounted}>
  <div class="demo-preview__halo" aria-hidden="true">
    <span class="demo-preview__orb demo-preview__orb--primary"></span>
    <span class="demo-preview__orb demo-preview__orb--secondary"></span>
    <span class="demo-preview__beam"></span>
  </div>

  <div class="demo-preview__meta">
    {#if host}
      <span class="demo-preview__host">{host}</span>
    {/if}
    <h3>{title}</h3>
    <p>{description}</p>
    {#if href && cta}
      <a
        class="demo-preview__cta btn btn-secondary hover-lift"
        href={href}
        target="_blank"
        rel="noreferrer noopener"
      >
        {cta}
      </a>
    {/if}
  </div>

  <div class="demo-preview__frame" aria-hidden="true">
    {#if shouldLoad && href}
      <iframe
        src={href}
        title={title}
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    {:else}
      <div class="demo-preview__placeholder">
        <span>{title}</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .demo-preview {
    display: grid;
    gap: clamp(1.2rem, 3vw, 2rem);
    grid-template-columns: minmax(0, 1fr);
    padding: clamp(1.8rem, 3.4vw, 2.6rem);
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }

  .demo-preview::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .demo-preview__halo {
    position: absolute;
    inset: -40% -10% auto;
    height: 120%;
    pointer-events: none;
    z-index: -1;
    overflow: visible;
  }

  .demo-preview__orb {
    position: absolute;
    width: clamp(12rem, 24vw, 16rem);
    height: clamp(12rem, 24vw, 16rem);
    border-radius: 50%;
    filter: blur(78px);
    opacity: 0.55;
  }

  .demo-preview__orb--primary {
    inset: auto auto 10% -18%;
    background: linear-gradient(140deg, rgba(var(--voyage-blue-rgb), 0.9), rgba(var(--aurora-purple-rgb), 0.8));
    animation: demoOrbDrift 18s var(--ease-in-out) infinite alternate;
  }

  .demo-preview__orb--secondary {
    inset: -10% -24% auto auto;
    background: linear-gradient(150deg, rgba(var(--cherry-pop-rgb), 0.7), rgba(var(--signal-yellow-rgb), 0.65));
    animation: demoOrbDriftAlt 20s var(--ease-in-out) infinite alternate;
  }

  .demo-preview__beam {
    position: absolute;
    inset: 20% -40% auto;
    height: clamp(12rem, 24vw, 16rem);
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.12), transparent 72%);
    filter: blur(48px);
    opacity: 0.45;
    transform: skewX(-16deg);
    animation: demoBeamPulse 22s var(--ease-in-out) infinite alternate;
  }

  .demo-preview__meta {
    display: grid;
    gap: clamp(0.6rem, 1.8vw, 1.1rem);
    z-index: 1;
  }

  .demo-preview__host {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--voyage-blue) 54%, var(--aurora-purple) 46%);
  }

  .demo-preview h3 {
    margin: 0;
    line-height: 1.2;
  }

  .demo-preview p {
    margin: 0;
    color: var(--text-secondary);
  }

  .demo-preview__cta {
    justify-self: start;
  }

  .demo-preview__frame {
    position: relative;
    border-radius: clamp(1.6rem, 3vw, 2.6rem);
    overflow: hidden;
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.55) 60%, rgba(var(--voyage-blue-rgb), 0.25) 40%);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 32px 64px rgba(15, 23, 42, 0.25);
    aspect-ratio: 16 / 10;
    background: color-mix(in srgb, rgba(255, 255, 255, 0.14) 70%, rgba(var(--voyage-blue-rgb), 0.12) 30%);
  }

  .demo-preview__frame iframe {
    width: 100%;
    height: 100%;
    border: 0;
    transform: scale(1.02);
    transform-origin: center;
    transition: transform var(--duration-hero) var(--ease-in-out);
  }

  .demo-preview:hover .demo-preview__frame iframe {
    transform: scale(1.05);
  }

  .demo-preview__placeholder {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    color: rgba(255, 255, 255, 0.72);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.28), rgba(var(--aurora-purple-rgb), 0.24));
  }

  .demo-preview--aurora .demo-preview__host {
    color: color-mix(in srgb, var(--aurora-purple) 60%, var(--cherry-pop) 40%);
  }

  .demo-preview--aurora .demo-preview__orb--primary {
    background: linear-gradient(148deg, rgba(var(--aurora-purple-rgb), 0.88), rgba(var(--cherry-pop-rgb), 0.78));
  }

  .demo-preview--aurora .demo-preview__orb--secondary {
    background: linear-gradient(152deg, rgba(var(--voyage-blue-rgb), 0.74), rgba(var(--signal-yellow-rgb), 0.62));
  }

  @keyframes demoOrbDrift {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(0.92);
    }

    50% {
      transform: translate3d(8%, -6%, 0) scale(1.05);
    }
  }

  @keyframes demoOrbDriftAlt {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(0.94);
      opacity: 0.5;
    }

    50% {
      transform: translate3d(-6%, 6%, 0) scale(1.06);
      opacity: 0.65;
    }
  }

  @keyframes demoBeamPulse {
    0%,
    100% {
      opacity: 0.32;
      transform: skewX(-16deg) scale(0.96);
    }

    50% {
      opacity: 0.55;
      transform: skewX(-12deg) scale(1.06);
    }
  }

  @media (min-width: 900px) {
    .demo-preview {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
      align-items: center;
    }

    .demo-preview__meta {
      padding-right: clamp(1rem, 2.4vw, 1.8rem);
    }
  }

  @media (min-width: 1200px) {
    .demo-preview__frame {
      min-height: clamp(18rem, 30vw, 26rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .demo-preview__orb,
    .demo-preview__beam,
    .demo-preview__frame iframe {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
  }

  :global([data-base-theme='dark']) .demo-preview__frame {
    background: color-mix(in srgb, rgba(12, 18, 32, 0.82) 60%, rgba(var(--aurora-purple-rgb), 0.24) 40%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.36) 60%, rgba(255, 255, 255, 0.16) 40%);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06), 0 36px 72px rgba(0, 6, 18, 0.55);
  }

  :global([data-base-theme='dark']) .demo-preview__placeholder {
    color: rgba(236, 242, 255, 0.9);
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.35), rgba(var(--aurora-purple-rgb), 0.32));
  }
</style>










