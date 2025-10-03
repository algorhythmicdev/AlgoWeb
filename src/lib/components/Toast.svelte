<script>
  import { fade, fly } from 'svelte/transition';
  
  export let message = '';
  export let type = 'success'; // success, error, info
  export let duration = 4000;
  export let onClose = () => {};
  
  let visible = true;
  
  setTimeout(() => {
    visible = false;
    setTimeout(onClose, 300);
  }, duration);
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
</script>

{#if visible}
  <div 
    class="toast toast-{type}" 
    transition:fly={{ y: -50, duration: 300 }}
    on:click={() => { visible = false; setTimeout(onClose, 300); }}
  >
    <div class="toast-icon">{icons[type]}</div>
    <div class="toast-message">{message}</div>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: var(--space-6);
    right: var(--space-6);
    z-index: var(--z-toast);
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
    animation: slideInRight 0.3s var(--ease-spring);
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
    .toast {
      top: auto;
      bottom: var(--space-6);
      right: var(--space-4);
      left: var(--space-4);
      max-width: none;
    }
  }
</style>
