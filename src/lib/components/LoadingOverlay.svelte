<script>
  import '$lib/i18n';
  import { _, waitLocale } from 'svelte-i18n';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import en from '$lib/i18n/en.json';

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
      <div class="loading-spinner" aria-hidden="true">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text">{loadingText}</div>
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    padding: clamp(2.5rem, 6vw, 4rem);
    background: radial-gradient(
        120% 120% at 15% 15%,
        color-mix(in srgb, var(--aurora-purple) 26%, transparent) 0%,
        transparent 55%
      ),
      radial-gradient(
        90% 90% at 85% 20%,
        color-mix(in srgb, var(--voyage-blue) 34%, transparent) 0%,
        transparent 62%
      ),
      linear-gradient(
        160deg,
        color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.14) 12%) 0%,
        color-mix(in srgb, var(--bg-elev-2) 92%, rgba(var(--aurora-purple-rgb), 0.12) 8%) 45%,
        color-mix(
          in srgb,
          var(--bg-elevated, var(--bg-elev-2)) 88%,
          rgba(var(--voyage-blue-rgb), 0.18) 12%
        ) 100%
      );
    color: var(--text);
    isolation: isolate;
    z-index: 9999;
  }

  .loading-shell {
    position: relative;
    width: min(420px, 100%);
    padding: clamp(2rem, 4.5vw, 2.75rem);
    border-radius: var(--radius-2xl);
    border: 1px solid var(--glass-border);
    background: color-mix(in srgb, var(--glass-bg-lightest) 90%, transparent 10%);
    box-shadow: var(--shadow-2xl);
    backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
    -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(var(--glass-saturate));
    display: grid;
    justify-items: center;
    gap: clamp(1.5rem, 4vw, 2rem);
  }

  .loading-shell::before {
    content: "";
    position: absolute;
    inset: 12px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.12), rgba(var(--aurora-purple-rgb), 0.1));
    opacity: 0.65;
    filter: blur(18px);
    z-index: -1;
  }

  .loading-spinner {
    position: relative;
    width: 80px;
    height: 80px;
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
    text-align: center;
    background: linear-gradient(120deg, var(--voyage-blue), var(--aurora-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: pulse 2.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-overlay::after {
      opacity: 0.02;
    }

    .loading-spinner,
    .spinner-ring {
      animation: none !important;
    }

    .loading-text {
      animation: none;
    }
  }

  :global(html[data-theme='dark']) .loading-overlay {
    background: radial-gradient(
        120% 120% at 18% 18%,
        color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.42) 60%, transparent 40%) 0%,
        transparent 55%
      ),
      radial-gradient(
        90% 90% at 82% 18%,
        color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.46) 68%, transparent 32%) 0%,
        transparent 58%
      ),
      linear-gradient(
        155deg,
        color-mix(in srgb, var(--bg-elevated, var(--bg-elev-2)) 84%, rgba(var(--voyage-blue-rgb), 0.24) 16%) 0%,
        color-mix(in srgb, var(--bg-elevated, var(--bg-elev-2)) 86%, rgba(var(--aurora-purple-rgb), 0.2) 14%) 45%,
        color-mix(in srgb, var(--bg-elevated, var(--bg-elev-2)) 80%, rgba(var(--voyage-blue-rgb), 0.32) 20%) 100%
      );
  }

  :global(html[data-theme='dark']) .loading-shell {
    background: color-mix(
      in srgb,
      var(--bg-elevated, var(--bg-elev-2)) 78%,
      rgba(var(--voyage-blue-rgb), 0.26) 22%
    );
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 70%, rgba(255, 255, 255, 0.32) 30%);
    box-shadow: 0 38px 88px rgba(6, 8, 20, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  :global(html[data-theme='hc']) .loading-overlay,
  :global(html[data-theme='contrast']) .loading-overlay,
  :global(html[data-theme-legacy='contrast']) .loading-overlay {
    background: var(--bg);
  }

  :global(html[data-theme='hc']) .loading-overlay::after,
  :global(html[data-theme='contrast']) .loading-overlay::after,
  :global(html[data-theme-legacy='contrast']) .loading-overlay::after {
    display: none;
  }

  :global(html[data-theme='hc']) .loading-shell,
  :global(html[data-theme='contrast']) .loading-shell,
  :global(html[data-theme-legacy='contrast']) .loading-shell {
    background: var(--bg);
    border-color: currentColor;
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .spinner-ring,
  :global(html[data-theme='contrast']) .spinner-ring,
  :global(html[data-theme-legacy='contrast']) .spinner-ring {
    border-color: currentColor;
    border-top-color: currentColor;
    opacity: 0.8;
  }

  :global(html[data-theme='hc']) .loading-text,
  :global(html[data-theme='contrast']) .loading-text,
  :global(html[data-theme-legacy='contrast']) .loading-text {
    background: none;
    -webkit-text-fill-color: currentColor;
    letter-spacing: 0.03em;
  }
</style>
