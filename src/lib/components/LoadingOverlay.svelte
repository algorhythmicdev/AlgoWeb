<script>
  import { _, waitLocale } from '$lib/i18n';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import en from '$lib/translations/en.json';

  let visible = true;
  const fallbackLoadingText = en.site.title;
  let loadingText = fallbackLoadingText;
  
  onMount(() => {
    // Hide loading spinner after page loads
    const timer = setTimeout(() => {
      visible = false;
    }, 1000);
    
    waitLocale()
      .then(() => {
        const translate = get(_);
        if (typeof translate === 'function') {
          loadingText = translate('site.title');
        } else {
          loadingText = fallbackLoadingText;
        }
      })
      .catch(() => {
        loadingText = fallbackLoadingText;
      });

    return () => clearTimeout(timer);
  });
</script>

{#if visible}
  <div class="loading-overlay">
    <div class="loading-shell">
      <GlassCard as="div" class="loading-card" halo padding="lg">
        <div class="loading-spinner" aria-hidden="true">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-text">{loadingText}</div>
      </GlassCard>
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    padding: clamp(2.5rem, 6vw, 4rem);
    background: color-mix(in srgb, var(--bg) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%);
    color: var(--text);
    isolation: isolate;
    z-index: var(--z-modal);
  }

  .loading-overlay::before {
    content: '';
    position: absolute;
    inset: -20%;
    background:
      radial-gradient(38% 38% at 20% 25%, rgba(var(--voyage-blue-rgb), 0.18), transparent 70%),
      radial-gradient(42% 42% at 80% 20%, rgba(var(--aurora-purple-rgb), 0.16), transparent 72%),
      radial-gradient(55% 55% at 50% 80%, rgba(var(--signal-yellow-rgb), 0.12), transparent 80%);
    opacity: 0.35;
    filter: blur(60px);
    pointer-events: none;
    z-index: -1;
  }

  .loading-overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.12) 30%, transparent 70%) 0%, transparent 100%);
    opacity: 0.4;
    pointer-events: none;
    z-index: -1;
  }

  .loading-shell {
    --card-gap: clamp(1.5rem, 4vw, 2.2rem);
    --glass-card-radius: clamp(1.85rem, 4vw, 2.6rem);
    width: min(420px, 100%);
    display: grid;
    justify-items: center;
  }

  :global(.loading-card) {
    width: 100%;
    display: grid;
    justify-items: center;
    gap: var(--card-gap);
    text-align: center;
  }

  .loading-spinner {
    position: relative;
    width: 82px;
    height: 82px;
    display: grid;
    place-items: center;
    --ring-duration: 1.2s;
  }

  .spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid var(--voyage-blue);
    border-radius: 50%;
    animation: spin var(--ring-duration) cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 50% 50%;
  }

  .spinner-ring:nth-child(1) {
    animation-delay: calc(-0.45 * var(--ring-duration));
    border-top-color: color-mix(in srgb, var(--voyage-blue) 82%, rgba(255, 255, 255, 0.35) 18%);
  }

  .spinner-ring:nth-child(2) {
    animation-delay: calc(-0.3 * var(--ring-duration));
    border-top-color: color-mix(in srgb, var(--aurora-purple) 78%, rgba(255, 255, 255, 0.36) 22%);
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
  }

  .spinner-ring:nth-child(3) {
    animation-delay: calc(-0.15 * var(--ring-duration));
    border-top-color: color-mix(in srgb, var(--signal-yellow) 72%, rgba(255, 255, 255, 0.32) 28%);
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
  }

  .spinner-ring:nth-child(4) {
    border-top-color: color-mix(in srgb, var(--cherry-pop) 78%, rgba(255, 255, 255, 0.24) 22%);
    width: 40%;
    height: 40%;
    top: 30%;
    left: 30%;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    font-size: clamp(1.35rem, 3vw, 1.75rem);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--text) 88%, rgba(var(--voyage-blue-rgb), 0.24) 12%);
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-overlay::before,
    .loading-overlay::after {
      opacity: 0.1;
      filter: none;
    }

    .loading-spinner,
    .spinner-ring {
      animation: none !important;
    }
  }
</style>

