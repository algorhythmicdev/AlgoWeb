<script>
  import { onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import Icon from './icons/Icon.svelte';

  export let message = '';
  /** @type {'success' | 'error' | 'info'} */
  export let type = 'success';
  export let duration = 4000;
  /** @type {() => void} */
  export let onClose = () => {};

  let visible = true;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let hideTimer;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let cleanupTimer;

  const closeToast = () => {
    if (!visible) return;
    visible = false;
    clearTimeout(hideTimer);
    cleanupTimer = setTimeout(onClose, 300);
  };

  hideTimer = setTimeout(closeToast, duration);

  onDestroy(() => {
    clearTimeout(hideTimer);
    if (cleanupTimer) {
      clearTimeout(cleanupTimer);
    }
  });

  const icons = /** @type {Record<'success' | 'error' | 'info', string>} */ ({
    success: 'check',
    error: 'close',
    info: 'info'
  });
</script>

{#if visible}
  <div class="toast-wrapper" role="status" aria-live="polite">
    <button
      type="button"
      class="toast os-window toast-{type}"
      transition:fly={{ y: -50, duration: 300 }}
      on:click={closeToast}
    >
      <div class="toast-icon">
        <Icon name={icons[type]} size={18} />
      </div>
      <div class="toast-message">{message}</div>
    </button>
  </div>
{/if}

<style>
  .toast-wrapper {
    position: fixed;
    top: var(--space-6);
    right: var(--space-6);
    z-index: var(--z-toast);
    animation: slideInRight 0.3s var(--ease-spring);
  }

  .toast {
    --toast-accent: var(--voyage-blue);
    --toast-accent-rgb: var(--voyage-blue-rgb);
    --surface-glass-blur: blur(18px);
    --surface-glass-bg:
      color-mix(
        in srgb,
        var(--bg-elev-1) 86%,
        rgba(var(--voyage-blue-rgb), 0.22) 14%
      );
    --surface-glass-border: color-mix(
      in srgb,
      rgba(var(--voyage-blue-rgb), 0.46) 62%,
      rgba(255, 255, 255, 0.34) 38%
    );
    --surface-glass-shadow: 0 22px 44px rgba(var(--voyage-blue-rgb), 0.22);
    --grain-opacity: 0.06;
    --grain-blend-mode: soft-light;
    --os-window-hc-bg: var(--bg-elev-1);
    --os-window-hc-border: var(--toast-accent, currentColor);
    --os-window-hc-shadow: none;
    --card-padding-lg: clamp(1rem, 2.6vw, 1.25rem) clamp(1.5rem, 3.6vw, 2rem);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    max-width: 400px;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
    border-inline-start: 4px solid var(--toast-accent);
  }

  .toast-success {
    --toast-accent: var(--accent-1);
    --toast-accent-rgb: var(--accent-1-rgb);
    --surface-glass-bg:
      color-mix(
        in srgb,
        var(--bg-elev-1) 84%,
        rgba(var(--accent-1-rgb), 0.26) 16%
      );
    --surface-glass-border: color-mix(
      in srgb,
      rgba(var(--accent-1-rgb), 0.5) 60%,
      rgba(255, 255, 255, 0.34) 40%
    );
    --surface-glass-shadow: 0 22px 46px rgba(var(--accent-1-rgb), 0.22);
  }

  .toast-error {
    --toast-accent: var(--cherry-pop);
    --toast-accent-rgb: var(--cherry-pop-rgb);
    --surface-glass-bg:
      color-mix(
        in srgb,
        var(--bg-elev-1) 82%,
        rgba(var(--cherry-pop-rgb), 0.28) 18%
      );
    --surface-glass-border: color-mix(
      in srgb,
      rgba(var(--cherry-pop-rgb), 0.48) 60%,
      rgba(255, 255, 255, 0.32) 40%
    );
    --surface-glass-shadow: 0 22px 48px rgba(var(--cherry-pop-rgb), 0.24);
  }

  .toast-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 1.25rem;
    font-weight: var(--weight-bold);
    background: rgba(var(--toast-accent-rgb, var(--voyage-blue-rgb)), 0.12);
    color: var(--toast-accent, var(--voyage-blue));
  }

  .toast-message {
    flex: 1;
    color: var(--text-primary);
    font-weight: var(--weight-medium);
  }

  .toast:focus-visible {
    outline: 3px solid rgba(var(--voyage-blue-rgb), 0.4);
    outline-offset: 4px;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    .toast-wrapper {
      top: auto;
      bottom: var(--space-6);
      right: var(--space-4);
      left: var(--space-4);
    }

    .toast {
      width: 100%;
      max-width: none;
    }
  }
</style>
