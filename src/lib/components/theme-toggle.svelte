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
    gap: var(--space-sm);
    background: var(--bg-elev-1);
    border: 2px solid var(--border);
    border-radius: 24px;
    padding: var(--space-sm);
    box-shadow: var(--shadow-md);
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
    min-width: 72px;
    min-height: 56px;
    padding: var(--space-sm) var(--space-md);
    border-radius: 16px;
    color: var(--text-secondary);
    cursor: pointer;
    transition:
      background var(--duration-fast) ease,
      color var(--duration-fast) ease,
      transform var(--duration-normal) var(--ease-spring);
  }

  .theme-option__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .theme-option__label {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .theme-option__body:hover {
    background: var(--bg-elev-2);
    color: var(--text);
    transform: var(--transform-hover-card);
  }

  .theme-option.active .theme-option__body {
    background: color-mix(in srgb, var(--voyage-blue) 10%, var(--bg-elev-2) 90%);
    color: var(--voyage-blue);
    font-weight: var(--weight-bold);
  }

  .theme-option.active .theme-option__label {
    color: var(--voyage-blue);
  }

  .theme-option input:focus-visible + .theme-option__body {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
  }

  svg {
    width: 20px;
    height: 20px;
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

  @media (max-width: 768px) {
    .theme-switcher {
      gap: 0.2rem;
      border-radius: var(--radius-md);
    }

    .theme-option__body {
      min-width: 54px;
      min-height: 42px;
      padding: 0.35rem 0.5rem;
    }

    .theme-option__label {
      font-size: var(--text-caption);
    }
  }

  @keyframes themeFocusPulse {
    0%,
    100% {
      box-shadow: var(--focus-ring-shadow);
    }

    50% {
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--focus-ring-color, var(--voyage-blue)) 70%, transparent 30%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-option input:focus-visible + .theme-option__body {
      animation: none;
    }
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .theme-switcher {
    box-shadow: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .theme-option__body {
    background: transparent;
    border: 2px solid currentColor;
    box-shadow: none;
    color: currentColor;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .theme-option.active .theme-option__body {
    border-width: 3px;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .theme-option input:focus-visible + .theme-option__body {
    box-shadow: var(--focus-ring-contrast);
    animation: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .theme-option__label {
    color: inherit;
  }
</style>
