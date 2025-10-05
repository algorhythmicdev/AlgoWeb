<script>
  import { onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';

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
    success: '✓',
    error: '✕',
    info: 'ℹ'
  });
</script>

{#if visible}
  <div class="toast-wrapper" role="status" aria-live="polite">
    <button
      type="button"
      class="toast toast-{type}"
      transition:fly={{ y: -50, duration: 300 }}
      on:click={closeToast}
    >
      <div class="toast-icon">{icons[type]}</div>
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
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-6);
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    cursor: pointer;
    max-width: 400px;
    font: inherit;
    color: inherit;
    text-align: left;
  }
  
  .toast-success {
    border-left: 4px solid #10B981;
  }
  
  .toast-error {
    border-left: 4px solid var(--cherry-red);
  }
  
  .toast-info {
    border-left: 4px solid var(--voyage-blue);
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
  }
  
  .toast-success .toast-icon {
    background: rgba(16, 185, 129, 0.1);
    color: #10B981;
  }
  
  .toast-error .toast-icon {
    background: rgba(224, 50, 44, 0.1);
    color: var(--cherry-red);
  }
  
  .toast-info .toast-icon {
    background: rgba(19, 81, 255, 0.1);
    color: var(--voyage-blue);
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
