<script>
  import { theme } from '$stores/theme';
</script>

<button 
  class="theme-toggle" 
  on:click={() => theme.toggle()}
  aria-label="Toggle theme"
>
  {#if $theme === 'light'}
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 4.343L17.071 2.929M2.929 17.071L4.343 15.657M15.657 15.657L17.071 17.071M2.929 2.929L4.343 4.343" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="2"/>
    </svg>
  {:else}
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17 10.5C16.1 13.8 13.1 16.3 9.5 16.3C5.4 16.3 2 12.9 2 8.8C2 5.2 4.5 2.2 7.8 1.3C7.3 2.1 7 3 7 4C7 7.3 9.7 10 13 10C14 10 14.9 9.7 15.7 9.2C16.4 10.5 17 11.9 17 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    background: var(--control-surface);
    border: 1px solid var(--control-border);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    box-shadow: 0 16px 34px rgba(var(--voyage-blue-rgb), 0.12);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }

  .theme-toggle:hover {
    background: var(--control-surface-hover);
    border-color: var(--control-border-strong);
    color: var(--voyage-blue);
    transform: translateY(-1px);
  }

  .theme-toggle:focus-visible {
    outline: none;
    border-color: var(--control-border-strong);
    box-shadow: 0 0 0 4px var(--control-ring);
  }

  svg { pointer-events: none; }
</style>
