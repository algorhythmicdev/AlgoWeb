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
            <svg data-icon="sun" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="4.5" />
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
            <svg data-icon="moon" viewBox="0 0 20 20">
              <path
                d="M15.8 13.6c-1.4 2.4-4 3.9-6.8 3.9c-4.4 0-8-3.6-8-8c0-3 1.7-5.6 4.2-7c-.3.7-.4 1.5-.4 2.3c0 3.7 3 6.7 6.7 6.7c.8 0 1.6-.2 2.3-.4z"
                fill="none"
              />
            </svg>
          {:else}
            <svg data-icon="contrast" viewBox="0 0 20 20">
              <rect x="3" y="3" width="14" height="14" rx="3" ry="3" fill="none" />
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
    gap: var(--control-cluster-gap);
    padding-block: var(--control-cluster-padding-block);
    padding-inline: var(--control-cluster-padding-inline);
    border-radius: var(--radius-pill);
    border: var(--control-cluster-border-width) solid var(--control-cluster-border);
    background: var(--control-cluster-bg);
    box-shadow: var(--control-cluster-shadow);
    backdrop-filter: var(--control-cluster-backdrop);
    -webkit-backdrop-filter: var(--control-cluster-backdrop);
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
    gap: var(--control-tile-gap);
    min-width: var(--control-tile-min-width);
    min-height: var(--control-tile-min-height);
    padding-block: var(--control-tile-padding-block);
    padding-inline: var(--control-tile-padding-inline);
    border-radius: var(--control-tile-radius);
    border: var(--control-tile-border-width) solid var(--control-tile-border);
    background: var(--control-tile-bg);
    color: var(--control-tile-color);
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
    font-size: var(--control-tile-label-size);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--control-tile-label-tracking);
    text-transform: uppercase;
    white-space: nowrap;
  }

  .theme-option__body:hover {
    transform: translateY(-1px);
    background: var(--control-tile-hover-bg);
    border-color: var(--control-tile-hover-border);
    color: var(--control-tile-hover-color);
    box-shadow: var(--control-tile-hover-shadow);
  }

  .theme-option.active .theme-option__body {
    background: var(--control-tile-active-bg);
    border-color: var(--control-tile-active-border);
    color: var(--control-tile-active-color);
    box-shadow: var(--control-tile-active-shadow);
    font-weight: var(--weight-semibold);
  }

  .theme-option.active .theme-option__label {
    color: currentColor;
  }

  .theme-option input:focus-visible + .theme-option__body {
    outline: none;
    border-color: var(--control-tile-focus-border);
    box-shadow: var(--control-tile-focus-shadow), var(--focus-ring-shadow);
  }

  svg {
    width: var(--control-tile-icon-size);
    height: var(--control-tile-icon-size);
    stroke: currentColor;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: var(--control-icon-stroke-width);
  }

  svg[data-icon='moon'] {
    stroke-width: var(--control-icon-stroke-width-alt);
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

  /* High contrast styles derive from control tokens */

  :global(html[data-theme='hc']) .theme-option input:focus-visible + .theme-option__body {
    outline: var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }

  @media (max-width: 768px) {
    .theme-switcher {
      gap: var(--control-cluster-gap-md);
      padding-block: var(--control-cluster-padding-block-md);
      padding-inline: var(--control-cluster-padding-inline-md);
    }

    .theme-option__body {
      min-width: var(--control-tile-min-width-md);
      min-height: var(--control-tile-min-height-md);
      padding-block: var(--control-tile-padding-block-md);
      padding-inline: var(--control-tile-padding-inline-md);
    }

    .theme-option__label {
      font-size: var(--control-tile-label-size-md);
      letter-spacing: var(--control-tile-label-tracking-md);
    }

    svg {
      width: var(--control-tile-icon-size-md);
      height: var(--control-tile-icon-size-md);
    }
  }

  @media (max-width: 560px) {
    .theme-switcher {
      gap: var(--control-cluster-gap-sm);
      padding-block: var(--control-cluster-padding-block-sm);
      padding-inline: var(--control-cluster-padding-inline-sm);
    }

    .theme-option__body {
      min-width: var(--control-tile-min-width-sm);
      min-height: var(--control-tile-min-height-sm);
      padding-block: var(--control-tile-padding-block-sm);
      padding-inline: var(--control-tile-padding-inline-sm);
      gap: var(--control-tile-gap-sm);
      border-radius: var(--control-tile-radius-sm);
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
      width: var(--control-tile-icon-size-sm);
      height: var(--control-tile-icon-size-sm);
    }
  }

  @media (max-width: 480px) {
    .theme-switcher {
      gap: var(--control-cluster-gap-xs);
      padding-block: var(--control-cluster-padding-block-xs);
      padding-inline: var(--control-cluster-padding-inline-xs);
    }

    .theme-option__body {
      min-width: var(--control-tile-min-width-xs);
      min-height: var(--control-tile-min-height-xs);
      padding-block: var(--control-tile-padding-block-xs);
      padding-inline: var(--control-tile-padding-inline-xs);
    }

    .theme-option__label {
      letter-spacing: var(--control-tile-label-tracking-xs);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .theme-option__body {
      transition: border-color var(--duration-fast) ease, background var(--duration-fast) ease, color var(--duration-fast) ease;
    }
  }
</style>
