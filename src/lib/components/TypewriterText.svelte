<script>
  import { onDestroy, onMount } from 'svelte';

  export let phrases = /** @type {string[]} */ ([]);
  export let typingSpeed = 45;
  export let erasingSpeed = 24;
  export let holdDuration = 1800;
  export let className = '';

  const isBrowser = typeof window !== 'undefined';

  /**
   * @param {unknown} value
   * @returns {string[]}
   */
  const sanitize = (value) => {
    if (Array.isArray(value) && value.length) {
      const mapped = value
        .map((phrase) => (typeof phrase === 'string' ? phrase : String(phrase)))
        .filter((phrase) => !!phrase && phrase.trim().length);
      if (mapped.length) {
        return mapped;
      }
    }
    return [''];
  };

  let sanitizedPhrases = sanitize(phrases);
  let phrasesSignature = sanitizedPhrases.join('||');
  let displayText = sanitizedPhrases[0] ?? '';
  let liveAnnouncement = sanitizedPhrases[0] ?? '';
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeoutId;
  let isTypingCycleActive = false;
  let prefersReducedMotion = false;
  /** @type {MediaQueryList | undefined} */
  let motionQuery;

  function clearTimer() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  /**
   * @param {() => void} fn
   * @param {number} delay
   */
  function schedule(fn, delay) {
    clearTimer();
    timeoutId = setTimeout(fn, delay);
  }

  function startTypewriter() {
    if (!isBrowser || prefersReducedMotion || sanitizedPhrases.length <= 1) {
      displayText = sanitizedPhrases[0] ?? '';
      liveAnnouncement = sanitizedPhrases[0] ?? '';
      return;
    }

    if (isTypingCycleActive) return;
    isTypingCycleActive = true;

    let phraseIndex = 0;
    let charIndex = 0;
    let currentPhrase = sanitizedPhrases[phraseIndex];
    let stage = 'typing';

    const tick = () => {
      if (!isTypingCycleActive) {
        clearTimer();
        return;
      }

      if (stage === 'typing') {
        displayText = currentPhrase.slice(0, charIndex);
        charIndex += 1;
        if (charIndex > currentPhrase.length) {
          stage = 'holding';
          liveAnnouncement = currentPhrase;
          schedule(tick, holdDuration);
        } else {
          schedule(tick, typingSpeed);
        }
        return;
      }

      if (stage === 'holding') {
        stage = 'erasing';
        charIndex = currentPhrase.length;
        schedule(tick, erasingSpeed);
        return;
      }

      if (stage === 'erasing') {
        charIndex -= 1;
        displayText = currentPhrase.slice(0, Math.max(0, charIndex));
        if (charIndex <= 0) {
          phraseIndex = (phraseIndex + 1) % sanitizedPhrases.length;
          currentPhrase = sanitizedPhrases[phraseIndex];
          stage = 'typing';
          schedule(tick, typingSpeed);
        } else {
          schedule(tick, erasingSpeed);
        }
      }
    };

    displayText = '';
    charIndex = 0;
    stage = 'typing';
    schedule(tick, typingSpeed);
  }

  function stopTypewriter() {
    isTypingCycleActive = false;
    clearTimer();
  }

  function resetCycle() {
    stopTypewriter();
    displayText = sanitizedPhrases[0] ?? '';
    liveAnnouncement = sanitizedPhrases[0] ?? '';
    if (!prefersReducedMotion) {
      startTypewriter();
    }
  }

  onMount(() => {
    if (!isBrowser) return;

    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = motionQuery.matches;

    const handleMotionChange = /** @type {(event: MediaQueryListEvent) => void} */ ((event) => {
      prefersReducedMotion = event.matches;
      resetCycle();
    });

    motionQuery.addEventListener?.('change', handleMotionChange);
    resetCycle();

    return () => {
      stopTypewriter();
      motionQuery?.removeEventListener?.('change', handleMotionChange);
    };
  });

  $: {
    sanitizedPhrases = sanitize(phrases);
    const nextSignature = sanitizedPhrases.join('||');
    if (phrasesSignature !== nextSignature) {
      phrasesSignature = nextSignature;
      resetCycle();
    }
  }

  onDestroy(stopTypewriter);
</script>

<span class={`typewriter-text ${className}`} aria-live="polite">
  <span class="typewriter-text__visible" aria-hidden="true">{displayText}</span>
  <span class="sr-only">{liveAnnouncement}</span>
  <span class="typewriter-text__cursor" aria-hidden="true"></span>
</span>

<style>
  .typewriter-text {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4ch;
    --typewriter-font-size: clamp(1.8rem, 5.5vw, 2.8rem);
    --typewriter-gradient: var(--gradient-heading);
    --typewriter-cursor-radius: var(--radius-xs);
    font-weight: var(--weight-semibold);
    font-size: var(--typewriter-font-size);
    background: var(--typewriter-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .typewriter-text__visible {
    min-height: 1em;
    white-space: pre-wrap;
  }

  .typewriter-text__cursor {
    width: 0.6ch;
    height: 1.1em;
    background: color-mix(
      in srgb,
      rgba(var(--voyage-blue-rgb), 0.82) 68%,
      rgba(var(--signal-yellow-rgb), 0.32) 32%
    );
    border-radius: var(--typewriter-cursor-radius);
    display: inline-block;
    opacity: 0.72;
    animation: cursorBlink 1s steps(2, start) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .typewriter-text__cursor {
      animation: none;
      opacity: 0.45;
    }
  }

  @keyframes cursorBlink {
    0%,
    49% {
      opacity: 0.7;
    }
    50%,
    100% {
      opacity: 0;
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  :global(
      :is(
        [data-theme='hc'],
        [data-theme-resolved='hc'],
        [data-theme='contrast'],
        [data-theme-legacy='contrast']
      )
    )
    .typewriter-text {
    --typewriter-gradient: linear-gradient(
      120deg,
      color-mix(in srgb, var(--text) 92%, var(--bg) 8%) 0%,
      color-mix(in srgb, var(--accent-2) 82%, var(--bg) 18%) 50%,
      color-mix(in srgb, var(--accent-1) 78%, var(--bg) 22%) 100%
    );
  }
</style>
