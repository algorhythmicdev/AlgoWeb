<script>
  import { onMount } from 'svelte';
  import TypewriterText from '$components/TypewriterText.svelte';

  const isBrowser = typeof window !== 'undefined';

  export let variant = /** @type {'typewriter' | 'slide' | 'glow' | 'pulse' | 'static'} */ ('typewriter');
  export let phrases = /** @type {string[]} */ ([]);
  export let text = '';
  export let holdDuration = 2400;
  export let typingSpeed = 45;
  export let className = '';
  export let ariaLabel = '';

  /**
   * @param {unknown} value
   * @returns {string[]}
   */
  const sanitize = (value) => {
    if (Array.isArray(value)) {
      const cleaned = value
        .map((phrase) => (typeof phrase === 'string' ? phrase.trim() : String(phrase)))
        .filter(Boolean);
      if (cleaned.length) {
        return cleaned;
      }
    }
    return [];
  };

  $: normalizedPhrases = sanitize(phrases);
  $: baseText = text || normalizedPhrases[0] || '';
  $: labelText = ariaLabel || baseText;

  let prefersReducedMotion = false;
  let slideIndex = 0;
  /** @type {ReturnType<typeof setInterval> | undefined} */
  let slideTimer;
  /** @type {MediaQueryList | undefined} */
  let motionQuery;
  let signature = '';

  $: totalPhrases = normalizedPhrases.length;
  $: animationDisabled = prefersReducedMotion || totalPhrases <= 1;

  function stopSlide() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = undefined;
    }
  }

  function startSlide() {
    stopSlide();
    if (!isBrowser || animationDisabled || variant !== 'slide' || totalPhrases <= 1) return;
    slideTimer = setInterval(() => {
      slideIndex = (slideIndex + 1) % totalPhrases;
    }, holdDuration);
  }

  $: if (variant !== 'slide') {
    stopSlide();
    signature = '';
    slideIndex = 0;
  }

  $: if (variant === 'slide' && !animationDisabled) {
    if (!slideTimer && isBrowser) {
      startSlide();
    }
  } else {
    stopSlide();
  }

  $: if (variant === 'slide') {
    const nextSignature = normalizedPhrases.join('||');
    if (signature !== nextSignature) {
      signature = nextSignature;
      slideIndex = 0;
      if (!animationDisabled) {
        startSlide();
      }
    }
  }

  onMount(() => {
    if (!isBrowser) return () => {};

    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = /** @type {(event: MediaQueryListEvent) => void} */ ((event) => {
      prefersReducedMotion = event.matches;
      if (prefersReducedMotion) {
        stopSlide();
      } else if (variant === 'slide') {
        startSlide();
      }
    });

    motionQuery.addEventListener?.('change', handleMotionChange);

    if (variant === 'slide' && !prefersReducedMotion) {
      startSlide();
    }

    return () => {
      stopSlide();
      motionQuery?.removeEventListener?.('change', handleMotionChange);
    };
  });
</script>

<span class={`animated-headline ${className} animated-headline--${variant}`} aria-live="polite">
  {#if variant === 'typewriter'}
    <TypewriterText
      phrases={normalizedPhrases.length ? normalizedPhrases : [baseText]}
      holdDuration={holdDuration}
      typingSpeed={typingSpeed}
      className="animated-headline__typewriter"
    />
  {:else if (variant === 'slide')}
    <span class="animated-headline__slide" aria-label={labelText}>
      <span class="animated-headline__slide-track">
        {#if animationDisabled}
          <span class="animated-headline__slide-item is-active">{baseText}</span>
        {:else}
          {#each normalizedPhrases as phrase, index}
            <span class={`animated-headline__slide-item ${index === slideIndex ? 'is-active' : ''}`}>{phrase}</span>
          {/each}
        {/if}
      </span>
    </span>
  {:else if (variant === 'glow')}
    <span class="animated-headline__glow" aria-label={labelText}>{baseText}</span>
  {:else if (variant === 'pulse')}
    <span class="animated-headline__pulse" aria-label={labelText}>{baseText}</span>
  {:else}
    <span class="animated-headline__text" aria-label={labelText}>{baseText}</span>
  {/if}
</span>

<style>
  :global(:root) {
    --headline-gradient: var(--gradient-hero);
  }

  .animated-headline {
    display: inline-flex;
    flex-direction: column;
    gap: clamp(0.45rem, 1.4vw, 0.75rem);
    font-size: clamp(1.75rem, 5vw, 2.6rem);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-tight);
  }

  .animated-headline :global(.typewriter-text) {
    font-size: clamp(1.9rem, 5.5vw, 2.85rem);
  }

  .animated-headline__typewriter :global(.typewriter-text__cursor) {
    height: 1.4em;
  }

  .animated-headline--typewriter :global(.typewriter-text) {
    --typewriter-gradient: var(--headline-gradient);
    --typewriter-font-size: clamp(2.1rem, 6vw, 3.1rem);
  }

  .animated-headline__slide,
  .animated-headline__glow,
  .animated-headline__pulse,
  .animated-headline__text {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.6ch;
    font-size: clamp(2.1rem, 6vw, 3.1rem);
    font-weight: var(--weight-semibold);
    background: var(--headline-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.02em;
  }

  .animated-headline__slide {
    overflow: hidden;
  }

  .animated-headline__slide-track {
    display: grid;
    position: relative;
  }

  .animated-headline__slide-item {
    display: inline-flex;
    align-items: center;
    gap: 0.5ch;
    opacity: 0;
    transform: translateY(20%);
    transition: opacity var(--duration-normal, 0.45s) var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1)),
      transform var(--duration-normal, 0.45s) var(--ease-out, cubic-bezier(0.16, 1, 0.3, 1));
    min-height: 1.2em;
  }

  .animated-headline__slide-item.is-active {
    opacity: 1;
    transform: translateY(0);
  }

  .animated-headline__glow::after,
  .animated-headline__pulse::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--headline-gradient);
    filter: blur(36px);
    opacity: 0.35;
    transition: opacity 0.6s ease, filter 0.6s ease;
  }

  .animated-headline__glow {
    text-shadow: 0 18px 48px rgba(15, 18, 38, 0.28);
    animation: glowBreath 5.6s ease-in-out infinite;
  }

  .animated-headline__pulse {
    animation: pulseSweep 3.4s ease-in-out infinite;
  }

  .animated-headline__pulse::after {
    filter: blur(26px);
    opacity: 0.45;
  }

  @keyframes glowBreath {
    0%,
    100% {
      text-shadow: 0 12px 42px rgba(16, 23, 54, 0.26);
    }
    45% {
      text-shadow: 0 16px 60px rgba(16, 23, 54, 0.42);
    }
  }

  @keyframes pulseSweep {
    0%,
    100% {
      letter-spacing: -0.015em;
      filter: saturate(1);
    }
    50% {
      letter-spacing: -0.01em;
      filter: saturate(1.15);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .animated-headline,
    .animated-headline :global(.typewriter-text),
    .animated-headline__glow,
    .animated-headline__pulse {
      animation: none !important;
      transition: none !important;
      text-shadow: none;
    }

    .animated-headline__slide-item {
      opacity: 1;
      transform: none;
    }
  }

  :global([data-base-theme='dark']) .animated-headline,
  :global([data-theme='contrast']) .animated-headline {
    --headline-gradient: linear-gradient(
      128deg,
      rgba(187, 211, 255, 0.98) 0%,
      rgba(182, 196, 255, 0.96) 28%,
      rgba(255, 220, 173, 0.9) 68%,
      rgba(255, 177, 194, 0.9) 100%
    );
  }

  :global([data-theme='contrast']) .animated-headline {
    --headline-gradient: linear-gradient(
      128deg,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 223, 129, 1) 45%,
      rgba(255, 153, 0, 1) 100%
    );
  }
</style>
