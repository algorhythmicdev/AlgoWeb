<script>
  import { _, waitLocale } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { theme } from '$stores/theme';

  /** @type {Array<{ value: 'light' | 'dark' | 'contrast'; label: string; icon: 'sun' | 'moon' | 'contrast' }>} */
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
      value: 'contrast',
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
   * @param {'light' | 'dark' | 'contrast'} value
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
        aria-label={$_(option.label)}
        on:change={() => selectTheme(option.value)}
      />
      <span class="theme-option__body">
        {#if option.icon === 'sun'}
          <svg viewBox="0 0 20 20" aria-hidden="true">
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
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M15.8 13.6c-1.4 2.4-4 3.9-6.8 3.9c-4.4 0-8-3.6-8-8c0-3 1.7-5.6 4.2-7c-.3.7-.4 1.5-.4 2.3c0 3.7 3 6.7 6.7 6.7c.8 0 1.6-.2 2.3-.4z"
              stroke-width="1.6"
              fill="none"
            />
          </svg>
        {:else}
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <rect x="3" y="3" width="14" height="14" rx="3" ry="3" stroke-width="1.8" fill="none" />
            <line x1="6" y1="3" x2="6" y2="17" />
            <line x1="14" y1="3" x2="14" y2="17" />
          </svg>
        {/if}
        <span class="sr-only">{$_(option.label)}</span>
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
    gap: 0.25rem;
    background: var(--control-surface);
    border: 1px solid var(--control-border);
    border-radius: var(--radius-lg);
    padding: 0.25rem;
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
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
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    transition:
      background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }

  .theme-option.active .theme-option__body {
    background: var(--control-surface-hover);
    color: var(--text-primary);
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.18);
    transform: translateY(-1px);
  }

  .theme-option input:focus-visible + .theme-option__body {
    outline: 2px solid var(--control-ring);
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
      width: 36px;
      height: 36px;
    }
  }
</style>
