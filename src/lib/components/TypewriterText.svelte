<script>
  import { onDestroy, onMount } from 'svelte';

  export let phrases = /** @type {string[]} */ ([]);
  export let typingSpeed = 45;
  export let erasingSpeed = 24;
  export let holdDuration = 1800;
  export let className = '';

  const isBrowser = typeof window !== 'undefined';
  const prefersReducedMotion = isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  let displayText = sanitizedPhrases[0] ?? '';
  let liveAnnouncement = sanitizedPhrases[0] ?? '';
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timeoutId;
  let isTypingCycleActive = false;

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
    let stage = 'typing'; // typing | holding | erasing

    const tick = () => {
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

    // initialise typing
    displayText = '';
    charIndex = 0;
    stage = 'typing';
    schedule(tick, typingSpeed);
  }

  function stopTypewriter() {
    isTypingCycleActive = false;
    clearTimer();
  }

  onMount(() => {
    startTypewriter();
    return stopTypewriter;
  });

  $: sanitizedPhrases = sanitize(phrases);

  $: {
    const nextPhrase = sanitizedPhrases[0] ?? '';
    displayText = nextPhrase;
    liveAnnouncement = nextPhrase;
    if (!prefersReducedMotion) {
      stopTypewriter();
      startTypewriter();
    }
  }

  $: if (prefersReducedMotion) {
    stopTypewriter();
    const nextPhrase = sanitizedPhrases[0] ?? '';
    displayText = nextPhrase;
    liveAnnouncement = nextPhrase;
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
    font-weight: var(--weight-semibold);
    color: var(--text-primary);
  }

  .typewriter-text__visible {
    min-height: 1em;
    white-space: pre-wrap;
  }

  .typewriter-text__cursor {
    width: 0.6ch;
    height: 1.1em;
    background: currentColor;
    border-radius: 2px;
    display: inline-block;
    opacity: 0.65;
    animation: cursorBlink 1s steps(2, start) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .typewriter-text__cursor { animation: none; opacity: 0.35; }
  }

  @keyframes cursorBlink {
    0%, 49% { opacity: 0.65; }
    50%, 100% { opacity: 0; }
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
</style>
