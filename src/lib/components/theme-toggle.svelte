<script>
  import { _, waitLocale } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { theme } from '$stores/theme';

  /** @type {Array<{ value: 'light' | 'dark' | 'hc'; label: string; icon: 'sun' | 'moon' | 'contrast' }>} */
  const themeOptions = [
    {
      value: 'light',
      label: 'settings.theme.light',
      icon: 'sun'
    },
    {
      value: 'dark',
      label: 'settings.theme.dark',
      icon: 'moon'
    },
    {
      value: 'hc',
      label: 'settings.theme.contrast',
      icon: 'contrast'
    }
  ];

  let isReady = false;
  onMount(async () => {
    await waitLocale();
    isReady = true;
  });

  /**
   * @param {'light' | 'dark' | 'hc'} value
   */
  const selectTheme = (value) => {
    theme.set(value);
  };

  $: activeOption = themeOptions.find((option) => option.value === $theme) ?? themeOptions[0];
</script>

<div class="theme-switcher" role="radiogroup" aria-label={$_('settings.theme.group')}>
  {#each themeOptions as option}
    <label class={`theme-option ${option.value === $theme ? 'active' : ''}`}>
      <input
        type="radio"
        name="color-mode"
        value={option.value}
        checked={option.value === $theme}
        on:change={() => selectTheme(option.value)}
      />
      <span class="theme-option__body">
        <span class="theme-option__icon" aria-hidden="true">
          {#if option.icon === 'sun'}
            <svg viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="4.5" stroke-width="1.8" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="10" y1="16" x2="10" y2="19" />
              <line x1="1" y1="10" x2="4" y2="10" />
              <line x1="16" y1="10" x2="19" y2="10" />
              <line x1="4.1" y1="4.1" x2="6.4" y2="6.4" />
              <line x1="13.6" y1="13.6" x2="15.9" y2="15.9" />
              <line x1="4.1" y1="15.9" x2="6.4" y2="13.6" />
              <line x1="13.6" y1="6.4" x2="15.9" y2="4.1" />
            </svg>
          {:else if option.icon === 'moon'}
            <svg viewBox="0 0 20 20">
              <path
                d="M15.8 13.6c-1.4 2.4-4 3.9-6.8 3.9c-4.4 0-8-3.6-8-8c0-3 1.7-5.6 4.2-7c-.3.7-.4 1.5-.4 2.3c0 3.7 3 6.7 6.7 6.7c.8 0 1.6-.2 2.3-.4z"
                stroke-width="1.6"
                fill="none"
              />
            </svg>
          {:else}
            <svg viewBox="0 0 20 20">
              <rect x="3" y="3" width="14" height="14" rx="3" ry="3" stroke-width="1.8" fill="none" />
              <line x1="6" y1="3" x2="6" y2="17" />
              <line x1="14" y1="3" x2="14" y2="17" />
            </svg>
          {/if}
        </span>
        <span class="theme-option__label">{$_(option.label)}</span>
      </span>
    </label>
  {/each}
</div>

{#if isReady}
  <span class="sr-only" aria-live="polite">{$_('settings.theme.selected', { values: { theme: $_(activeOption.label) } })}</span>
{/if}

<style>
  .theme-switcher {
    display: inline-flex;
    align-items: center;
    gap: clamp(0.35rem, 1vw, 0.65rem);
    padding: clamp(0.3rem, 1vw, 0.55rem);
    border-radius: var(--radius-pill);
    border: 1.5px solid var(--surface-pill-border);
    background: color-mix(in srgb, var(--surface-pill-bg) 90%, transparent 10%);
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: blur(calc(var(--glass-blur) * 0.65)) saturate(1.04);
    -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.65)) saturate(1.04);
    flex-shrink: 1;
    min-width: 0;
  }

  .theme-option {
    position: relative;
    display: inline-flex;
  }

  .theme-option input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    pointer-events: none;
  }

  .theme-option__body {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-xs);
    min-width: clamp(3.75rem, 9vw, 4.6rem);
    min-height: clamp(2.65rem, 7vw, 3.4rem);
    padding: clamp(0.35rem, 1vw, 0.55rem) clamp(0.6rem, 1.2vw, 0.85rem);
    border-radius: clamp(0.8rem, 2vw, 1rem);
    border: 1px solid color-mix(in srgb, var(--surface-chip-border) 70%, transparent 30%);
    background: color-mix(in srgb, var(--surface-chip-bg) 78%, transparent 22%);
    color: color-mix(in srgb, var(--text-secondary) 88%, rgba(var(--voyage-blue-rgb), 0.12) 12%);
    cursor: pointer;
    transition:
      transform var(--duration-normal) var(--ease-spring),
      background var(--duration-fast) ease,
      border-color var(--duration-fast) ease,
      color var(--duration-fast) ease,
      box-shadow var(--duration-fast) ease;
  }

  .theme-option__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .theme-option__label {
    font-size: clamp(0.75rem, 1vw, 0.82rem);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .theme-option__body:hover {
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--surface-chip-bg) 86%, transparent 14%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 65%, rgba(var(--voyage-blue-rgb), 0.42) 35%);
    color: var(--text);
    box-shadow: 0 14px 26px rgba(var(--ink-rgb), 0.16);
  }

  .theme-option.active .theme-option__body {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 55%, var(--surface-chip-bg) 45%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 60%, rgba(255, 255, 255, 0.5) 40%);
    color: color-mix(in srgb, var(--voyage-blue) 70%, var(--text) 30%);
    box-shadow: 0 16px 34px rgba(var(--voyage-blue-rgb), 0.24);
    font-weight: var(--weight-semibold);
  }

  .theme-option.active .theme-option__label {
    color: currentColor;
  }

  .theme-option input:focus-visible + .theme-option__body {
    outline: none;
    border-color: color-mix(in srgb, var(--surface-chip-border) 55%, rgba(var(--voyage-blue-rgb), 0.55) 45%);
    box-shadow: 0 18px 40px rgba(var(--ink-rgb), 0.22), var(--focus-ring-shadow);
  }

  svg {
    width: clamp(1.1rem, 2.4vw, 1.35rem);
    height: clamp(1.1rem, 2.4vw, 1.35rem);
    stroke: currentColor;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
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

  :global(html[data-theme='dark']) .theme-switcher {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.78) 64%, rgba(var(--voyage-blue-rgb), 0.28) 36%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.38) 60%, rgba(255, 255, 255, 0.14) 40%);
    box-shadow: 0 22px 58px rgba(2, 6, 18, 0.58);
  }

  :global(html[data-theme='dark']) .theme-option__body {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.82) 60%, rgba(var(--voyage-blue-rgb), 0.24) 40%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.34) 60%, rgba(255, 255, 255, 0.16) 40%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.78) 72%, rgba(var(--voyage-blue-rgb), 0.36) 28%);
  }

  :global(html[data-theme='dark']) .theme-option__body:hover {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 65%, rgba(255, 255, 255, 0.2) 35%);
    color: rgba(255, 255, 255, 0.92);
  }

  :global(html[data-theme='dark']) .theme-option.active .theme-option__body {
    color: color-mix(in srgb, rgba(255, 255, 255, 0.9) 72%, rgba(var(--voyage-blue-rgb), 0.5) 28%);
    box-shadow: 0 20px 44px rgba(var(--voyage-blue-rgb), 0.36);
  }

  :global(html[data-theme='hc']) .theme-switcher {
    background: var(--surface-pill-hc-bg);
    border-color: var(--surface-pill-hc-border);
    box-shadow: var(--surface-pill-hc-shadow);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .theme-option__body,
  :global(html[data-theme='hc']) .theme-option__body:hover,
  :global(html[data-theme='hc']) .theme-option.active .theme-option__body {
    background: transparent;
    border-color: currentColor;
    box-shadow: none;
    color: currentColor;
  }

  :global(html[data-theme='hc']) .theme-option input:focus-visible + .theme-option__body {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    .theme-switcher {
      gap: clamp(0.25rem, 1.5vw, 0.4rem);
      padding: clamp(0.25rem, 1.2vw, 0.4rem) clamp(0.3rem, 2vw, 0.5rem);
    }

    .theme-option__body {
      min-width: clamp(3.1rem, 16vw, 3.7rem);
      min-height: clamp(2.2rem, 10vw, 2.6rem);
      padding: clamp(0.3rem, 1.5vw, 0.5rem) clamp(0.45rem, 2.4vw, 0.7rem);
    }

    .theme-option__label {
      font-size: clamp(0.7rem, 2.2vw, 0.78rem);
      letter-spacing: 0.05em;
    }

    svg {
      width: clamp(1rem, 3vw, 1.2rem);
      height: clamp(1rem, 3vw, 1.2rem);
    }
  }

  @media (max-width: 560px) {
    .theme-switcher {
      gap: clamp(0.2rem, 1.6vw, 0.35rem);
      padding: 0.25rem clamp(0.25rem, 1.8vw, 0.4rem);
    }

    .theme-option__body {
      min-width: clamp(2.6rem, 22vw, 3.1rem);
      min-height: clamp(1.9rem, 9vw, 2.2rem);
      padding: clamp(0.25rem, 1vw, 0.35rem) clamp(0.35rem, 4vw, 0.55rem);
      gap: 0.2rem;
      border-radius: clamp(0.65rem, 3vw, 0.85rem);
    }

    .theme-option__label {
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

    svg {
      width: clamp(0.95rem, 4vw, 1.05rem);
      height: clamp(0.95rem, 4vw, 1.05rem);
    }
  }

  @media (max-width: 480px) {
    .theme-switcher {
      gap: 0.18rem;
      padding: 0.22rem 0.3rem;
    }

    .theme-option__body {
      min-width: clamp(2.45rem, 24vw, 2.9rem);
      min-height: clamp(1.85rem, 10vw, 2.15rem);
      padding: 0.26rem clamp(0.3rem, 5vw, 0.5rem);
    }

    .theme-option__label {
      letter-spacing: 0.045em;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-option__body {
      transition: border-color var(--duration-fast) ease, background var(--duration-fast) ease, color var(--duration-fast) ease;
    }
  }
</style>
