<script lang="ts">
  import ThemeToggle from './theme-toggle.svelte';
  import { theme } from '$stores/theme';
  import { _ } from 'svelte-i18n';

  const labelByTheme: Record<'light' | 'dark' | 'hc', string> = {
    light: 'settings.theme.light',
    dark: 'settings.theme.dark',
    hc: 'settings.theme.contrast'
  };

  $: activeLabelKey = labelByTheme[$theme as keyof typeof labelByTheme] ?? labelByTheme.light;
  $: activeLabel = $_(activeLabelKey);
</script>

<aside
  class="floating-theme-switcher os-window"
  aria-label={$_('settings.theme.group')}
>
  <header class="floating-theme-switcher__header">
    <span class="floating-theme-switcher__title">{$_('settings.theme.group')}</span>
    <span class="floating-theme-switcher__status" aria-live="polite">{activeLabel}</span>
  </header>

  <ThemeToggle />

  <p class="floating-theme-switcher__hint">
    {$_('settings.theme.selected', { values: { theme: activeLabel } })}
  </p>
</aside>

<style>
  .floating-theme-switcher {
    position: fixed;
    inset: auto clamp(1rem, 4vw, 1.75rem) clamp(1rem, 4vw, 1.75rem) auto;
    display: grid;
    gap: 0.75rem;
    width: min(320px, 92vw);
    border-radius: var(--radius-xl);
    padding: clamp(0.9rem, 2vw, 1.2rem);
    background: color-mix(in srgb, var(--surface-glass-bg) 68%, transparent 32%);
    box-shadow: var(--surface-glass-shadow);
    backdrop-filter: var(--surface-glass-blur) saturate(1.18);
    color: var(--text-primary);
    z-index: calc(var(--z-overlay, 900));
    border: 1px solid color-mix(in srgb, var(--surface-glass-border) 72%, transparent 28%);
  }

  .floating-theme-switcher__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .floating-theme-switcher__title {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.01em;
  }

  .floating-theme-switcher__status {
    font-size: var(--text-small);
    color: var(--text-secondary);
  }

  .floating-theme-switcher__hint {
    margin: 0;
    font-size: var(--text-tiny, 0.75rem);
    color: var(--text-tertiary);
  }

  :global(.floating-theme-switcher .theme-switcher) {
    width: 100%;
    justify-content: space-between;
  }

  :global(.floating-theme-switcher .theme-option__body) {
    width: clamp(40px, 9vw, 48px);
    height: clamp(40px, 9vw, 48px);
  }

  :global(.floating-theme-switcher .theme-option.active .theme-option__body) {
    box-shadow: 0 18px 36px rgba(var(--voyage-blue-rgb), 0.24);
  }

  @media (max-width: 900px) {
    .floating-theme-switcher {
      inset: auto clamp(0.75rem, 4vw, 1.25rem) clamp(0.75rem, 4vw, 1.25rem) auto;
      width: min(280px, 90vw);
    }
  }

  @media (max-width: 640px) {
    .floating-theme-switcher {
      inset: auto 50% clamp(0.75rem, 4vw, 1.25rem) auto;
      transform: translateX(-50%);
      text-align: center;
      gap: 0.6rem;
    }

    .floating-theme-switcher__header {
      flex-direction: column;
      gap: 0.3rem;
    }

    .floating-theme-switcher__status {
      color: var(--text-secondary);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .floating-theme-switcher {
      transition: none;
      box-shadow: 0 18px 36px color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.28) 60%, transparent 40%);
    }
  }

  :global(html[data-theme='hc']) .floating-theme-switcher {
    background: color-mix(in srgb, var(--bg) 92%, rgba(0, 0, 0, 0.12) 8%);
    border-color: var(--border-strong);
    box-shadow: 0 0 0 1px var(--border-strong);
  }

  :global(html[data-theme='hc']) .floating-theme-switcher__status,
  :global(html[data-theme='hc']) .floating-theme-switcher__hint {
    color: var(--text-primary);
  }
</style>
