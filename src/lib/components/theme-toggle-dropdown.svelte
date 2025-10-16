<script lang="ts">
  import { onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { theme } from '$stores/theme';

  let isOpen = false;
  let trigger: HTMLButtonElement | undefined;
  let optionRefs: (HTMLButtonElement | undefined)[] = [];
  let listbox: HTMLDivElement | undefined;
  let focusedIndex = -1;

  type ThemeOption = {
    value: 'light' | 'dark' | 'hc';
    label: string;
    icon: 'sun' | 'moon' | 'contrast';
  };

  const themeOptions: ThemeOption[] = [
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

  $: currentTheme = themeOptions.find((opt) => opt.value === $theme) || themeOptions[0];
  $: activeIndex = themeOptions.findIndex((opt) => opt.value === $theme);

  function clampIndex(index: number): number {
    if (index < 0) return themeOptions.length - 1;
    if (index >= themeOptions.length) return 0;
    return index;
  }

  const getOptionId = (value: string) => `theme-option-${value}`;

  function updateActiveDescendant(index: number) {
    if (!listbox) return;
    const themeEntry = themeOptions[index];
    if (themeEntry) {
      listbox.setAttribute('aria-activedescendant', getOptionId(themeEntry.value));
    } else {
      listbox.removeAttribute('aria-activedescendant');
    }
  }

  function focusOption(index: number) {
    focusedIndex = clampIndex(index);
    updateActiveDescendant(focusedIndex);
    optionRefs[focusedIndex]?.focus();
  }

  async function openMenu(startIndex = 0) {
    optionRefs = [];
    isOpen = true;
    focusedIndex = clampIndex(startIndex);
    await tick();
    optionRefs[focusedIndex]?.focus();
    updateActiveDescendant(focusedIndex);
  }

  function trackOption(node: HTMLButtonElement, index: number) {
    optionRefs[index] = node;

    return {
      destroy() {
        optionRefs[index] = undefined;
      },
      update(newIndex: number) {
        if (newIndex !== index) {
          optionRefs[index] = undefined;
          index = newIndex;
        }
        optionRefs[index] = node;
      }
    };
  }

  async function closeMenu(restoreFocus = true) {
    isOpen = false;
    focusedIndex = -1;
    listbox?.removeAttribute('aria-activedescendant');
    if (restoreFocus) {
      await tick();
      trigger?.focus();
    }
  }

  async function selectTheme(value: 'light' | 'dark' | 'hc') {
    theme.set(value);
    await closeMenu();
  }

  async function handleTriggerKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const start = event.key === 'ArrowDown'
        ? activeIndex !== -1 ? activeIndex : 0
        : activeIndex !== -1 ? activeIndex : themeOptions.length - 1;
      await openMenu(start);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isOpen) {
        await closeMenu();
      } else {
        const start = activeIndex !== -1 ? activeIndex : 0;
        await openMenu(start);
      }
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      await closeMenu();
    }
  }

  function handleOptionKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(index + 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(index - 1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      focusOption(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      focusOption(themeOptions.length - 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectTheme(themeOptions[index].value);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === 'Tab') {
      closeMenu(false);
      return;
    }
  }

  async function toggleMenu() {
    if (isOpen) {
      await closeMenu();
    } else {
      const start = activeIndex !== -1 ? activeIndex : 0;
      await openMenu(start);
    }
  }

  function handleFocusOut(event: FocusEvent) {
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (!currentTarget.contains(relatedTarget)) {
      isOpen = false;
      focusedIndex = -1;
      listbox?.removeAttribute('aria-activedescendant');
    }
  }
</script>

<div class="theme-switcher" role="group" aria-label={$_('settings.theme.group')} on:focusout={handleFocusOut}>
  <button
    bind:this={trigger}
    class="current-theme"
    on:click={toggleMenu}
    on:keydown={handleTriggerKeydown}
    aria-label={$_('settings.theme.trigger_label')}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="theme-menu"
  >
    <span class="theme-icon" aria-hidden="true">
      {#if currentTheme.icon === 'sun'}
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
      {:else if currentTheme.icon === 'moon'}
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
    <span class="theme-label">{$_(currentTheme.label)}</span>
    <svg class="chevron" width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>

  {#if isOpen}
    <div
      class="dropdown"
      id="theme-menu"
      role="listbox"
      aria-label={$_('settings.theme.menu_label')}
      tabindex="-1"
      bind:this={listbox}
    >
      {#each themeOptions as option, index}
        <button
          type="button"
          class="theme-option"
          class:active={option.value === $theme}
          role="option"
          aria-selected={option.value === $theme}
          use:trackOption={index}
          id={getOptionId(option.value)}
          tabindex={focusedIndex === index ? 0 : -1}
          on:click={() => selectTheme(option.value)}
          on:keydown={(event) => handleOptionKeydown(event, index)}
        >
          <span class="option-icon" aria-hidden="true">
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
          <span class="option-label">{$_(option.label)}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .theme-switcher {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    isolation: isolate;
    flex-shrink: 1;
    min-width: 0;
  }

  .current-theme {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: calc(var(--space-sm) + 0.15rem) clamp(1rem, 4vw, 1.45rem);
    min-width: clamp(6.5rem, 10vw, 7.75rem);
    border-radius: var(--radius-pill, 999px);
    border: 1.5px solid var(--surface-pill-border);
    background: color-mix(in srgb, var(--surface-pill-bg) 88%, transparent 12%);
    color: color-mix(in srgb, var(--surface-chip-color) 92%, var(--voyage-blue) 8%);
    font-weight: var(--weight-semibold);
    font-size: clamp(0.95rem, 1.2vw, 1.05rem);
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: var(--surface-pill-shadow);
    backdrop-filter: blur(calc(var(--glass-blur) * 0.65)) saturate(1.06);
    -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.65)) saturate(1.06);
    transition:
      transform var(--duration-normal) var(--ease-spring),
      box-shadow var(--duration-normal) var(--ease-smooth),
      border-color var(--duration-fast) ease,
      color var(--duration-fast) ease;
  }

  .theme-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .theme-icon svg {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .theme-label {
    white-space: nowrap;
  }

  .chevron {
    width: 14px;
    height: 9px;
    opacity: 0.72;
    pointer-events: none;
  }

  .current-theme:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--surface-pill-border) 70%, rgba(var(--voyage-blue-rgb), 0.45) 30%);
    box-shadow: 0 18px 36px rgba(var(--ink-rgb), 0.18);
    color: var(--text);
  }

  .current-theme:focus-visible {
    outline: none;
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--surface-pill-border) 70%, rgba(var(--voyage-blue-rgb), 0.5) 30%);
    box-shadow: 0 22px 40px rgba(var(--ink-rgb), 0.22), var(--focus-ring-shadow);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + clamp(0.4rem, 1.8vw, 0.85rem));
    right: 0;
    min-width: clamp(11rem, 28vw, 13.5rem);
    padding: clamp(0.75rem, 2vw, 1rem);
    border-radius: clamp(1.25rem, 3vw, 1.75rem);
    border: 1.5px solid var(--surface-panel-border);
    background: color-mix(in srgb, var(--surface-panel-bg) 92%, transparent 8%);
    box-shadow: var(--surface-panel-shadow);
    backdrop-filter: blur(calc(var(--glass-blur) * 0.75)) saturate(1.05);
    -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.75)) saturate(1.05);
    z-index: var(--z-overlay);
    display: grid;
    gap: clamp(0.35rem, 1.8vw, 0.6rem);
  }

  .theme-option {
    display: flex;
    align-items: center;
    gap: clamp(0.55rem, 2vw, 0.85rem);
    width: 100%;
    padding: clamp(0.6rem, 2.2vw, 0.9rem) clamp(0.8rem, 2.6vw, 1.15rem);
    border-radius: clamp(0.85rem, 2.4vw, 1.15rem);
    border: 1px solid color-mix(in srgb, var(--surface-chip-border) 70%, transparent 30%);
    background: color-mix(in srgb, var(--surface-chip-bg) 75%, transparent 25%);
    color: var(--text);
    text-align: left;
    cursor: pointer;
    transition:
      transform var(--duration-fast) var(--ease-spring),
      border-color var(--duration-fast) ease,
      box-shadow var(--duration-fast) ease,
      background var(--duration-fast) ease;
  }

  .theme-option:hover {
    background: color-mix(in srgb, var(--surface-chip-bg) 82%, transparent 18%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 60%, rgba(var(--voyage-blue-rgb), 0.4) 40%);
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(var(--ink-rgb), 0.16);
  }

  .theme-option:focus-visible {
    outline: none;
    background: color-mix(in srgb, var(--surface-chip-bg) 88%, transparent 12%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 55%, rgba(var(--voyage-blue-rgb), 0.5) 45%);
    box-shadow: 0 16px 34px rgba(var(--ink-rgb), 0.2), var(--focus-ring-shadow);
  }

  .theme-option.active {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.24) 55%, var(--surface-chip-bg) 45%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 60%, rgba(255, 255, 255, 0.48) 40%);
    box-shadow: 0 16px 36px rgba(var(--voyage-blue-rgb), 0.22);
    color: color-mix(in srgb, var(--voyage-blue) 70%, var(--text) 30%);
    font-weight: var(--weight-semibold);
  }

  .option-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .option-icon svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .option-label {
    font-weight: var(--weight-semibold);
    font-size: clamp(0.95rem, 1.1vw, 1.05rem);
    white-space: nowrap;
  }

  :global(html[data-theme='dark']) .current-theme {
    color: color-mix(in srgb, rgba(255, 255, 255, 0.92) 76%, rgba(var(--voyage-blue-rgb), 0.4) 24%);
    border-color: color-mix(in srgb, rgba(255, 255, 255, 0.16) 55%, rgba(var(--voyage-blue-rgb), 0.4) 45%);
    box-shadow: 0 18px 40px rgba(4, 10, 26, 0.48);
  }

  :global(html[data-theme='dark']) .dropdown {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.82) 68%, rgba(var(--voyage-blue-rgb), 0.28) 32%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 60%, rgba(255, 255, 255, 0.16) 40%);
    box-shadow: 0 26px 56px rgba(2, 6, 18, 0.6);
  }

  :global(html[data-theme='dark']) .theme-option {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.78) 62%, rgba(var(--voyage-blue-rgb), 0.22) 38%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.28) 55%, rgba(255, 255, 255, 0.12) 45%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.86) 70%, rgba(var(--voyage-blue-rgb), 0.3) 30%);
  }

  :global(html[data-theme='dark']) .theme-option:hover {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.8) 58%, rgba(var(--voyage-blue-rgb), 0.32) 42%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 60%, rgba(255, 255, 255, 0.16) 40%);
  }

  :global(html[data-theme='dark']) .theme-option.active {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(var(--graphite-rgb), 0.76) 40%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 65%, rgba(255, 255, 255, 0.24) 35%);
    box-shadow: 0 18px 42px rgba(var(--voyage-blue-rgb), 0.35);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.92) 72%, rgba(var(--voyage-blue-rgb), 0.46) 28%);
  }

  :global(html[data-theme='hc']) .current-theme {
    background: var(--surface-pill-hc-bg);
    border-color: var(--surface-pill-hc-border);
    box-shadow: var(--surface-pill-hc-shadow);
    color: var(--surface-pill-hc-color);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .dropdown {
    background: var(--surface-panel-hc-bg);
    border-color: var(--surface-panel-hc-border);
    box-shadow: var(--surface-panel-hc-shadow);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  :global(html[data-theme='hc']) .theme-option,
  :global(html[data-theme='hc']) .theme-option:hover,
  :global(html[data-theme='hc']) .theme-option:focus-visible,
  :global(html[data-theme='hc']) .theme-option.active {
    background: transparent;
    border-color: currentColor;
    box-shadow: none;
    color: currentColor;
  }

  :global(html[data-theme='hc']) .theme-option:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  @media (max-width: 720px) {
    .current-theme {
      min-width: clamp(4.5rem, 18vw, 5.75rem);
      padding: calc(var(--space-sm) + 0.1rem) clamp(0.75rem, 6vw, 1rem);
      font-size: clamp(0.88rem, 2.4vw, 0.95rem);
      gap: clamp(0.45rem, 2vw, 0.55rem);
    }

    .theme-icon svg {
      width: 14px;
      height: 14px;
    }

    .chevron {
      width: 12px;
      height: 8px;
    }

    .dropdown {
      inset-inline: auto 0;
      min-width: clamp(10rem, 55vw, 12.5rem);
    }
  }

  @media (max-width: 480px) {
    .current-theme {
      min-width: clamp(3.5rem, 28vw, 4.5rem);
      padding: 0.4rem clamp(0.6rem, 8vw, 0.9rem);
      letter-spacing: 0.015em;
      gap: 0.35rem;
    }

    .theme-icon svg {
      width: 13px;
      height: 13px;
    }

    .chevron {
      width: 11px;
      height: 7px;
    }

    .dropdown {
      min-width: clamp(9.5rem, 65vw, 11.5rem);
    }
  }

  @media (max-width: 420px) {
    .current-theme {
      min-width: clamp(3.15rem, 34vw, 3.9rem);
      padding: 0.35rem clamp(0.5rem, 8vw, 0.75rem);
      font-size: clamp(0.82rem, 3vw, 0.9rem);
      letter-spacing: 0.02em;
    }

    .theme-icon svg {
      width: 12px;
      height: 12px;
    }

    .chevron {
      width: 10px;
      height: 6px;
    }
  }

  @media (max-width: 380px) {
    .current-theme {
      min-width: clamp(2.9rem, 38vw, 3.4rem);
      padding-inline: clamp(0.45rem, 9vw, 0.65rem);
    }

    .dropdown {
      inset-inline-end: 0;
      min-width: clamp(9rem, 72vw, 10.5rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .current-theme,
    .theme-option {
      transition: border-color var(--duration-fast) ease, background var(--duration-fast) ease;
    }
  }
</style>
