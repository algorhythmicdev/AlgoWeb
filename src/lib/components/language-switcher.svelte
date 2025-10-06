<script>
  // @ts-nocheck
  import { language } from '$stores/language';

  let isOpen = false;
  let trigger;

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'lv', label: 'LV', name: 'Latviešu' },
    { code: 'ru', label: 'RU', name: 'Русский' },
    { code: 'uk', label: 'UK', name: 'Українська' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'es', label: 'ES', name: 'Español' }
  ];

  $: currentLanguage = languages.find((lang) => lang.code === $language) || languages[0];

  function selectLanguage(code) {
    language.set(code);
    isOpen = false;
    trigger?.focus();
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      isOpen = false;
      trigger?.focus();
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function handleFocusOut(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      isOpen = false;
    }
  }
</script>

<div class="language-switcher" role="group" on:focusout={handleFocusOut}>
  <button
    bind:this={trigger}
    class="current-lang"
    on:click={() => (isOpen = !isOpen)}
    on:keydown={handleKeydown}
    aria-label="Select language"
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="language-menu"
  >
    {currentLanguage.label}
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>

  {#if isOpen}
    <div class="dropdown" id="language-menu" role="listbox" tabindex="-1" on:keydown={handleKeydown}>
      {#each languages as lang}
        <button
          class="lang-option"
          class:active={lang.code === $language}
          role="option"
          aria-selected={lang.code === $language}
          on:click={() => selectLanguage(lang.code)}
        >
          <span class="label">{lang.label}</span>
          <span class="name">{lang.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .language-switcher {
    position: relative;
  }

  .current-lang {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-3);
    background: var(--control-surface);
    border: 1px solid var(--control-border);
    border-radius: var(--radius-md);
    font-weight: var(--weight-medium);
    color: var(--text-primary);
    cursor: pointer;
    box-shadow: 0 14px 30px rgba(var(--voyage-blue-rgb), 0.12);
    transition:
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out);
  }

  .current-lang:hover,
  .current-lang:focus-visible {
    outline: none;
    background: var(--control-surface-hover);
    border-color: var(--control-border-strong);
    color: var(--voyage-blue);
    box-shadow: 0 0 0 4px var(--control-ring);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    min-width: 180px;
    background: var(--bg-elevated);
    border: 1px solid var(--control-border);
    border-radius: var(--radius-lg);
    box-shadow: 0 32px 60px rgba(15, 23, 42, 0.18);
    padding: var(--space-2);
    z-index: var(--z-overlay);
  }

  .lang-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    text-align: left;
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .lang-option:hover,
  .lang-option:focus-visible {
    background: var(--control-surface-hover);
  }

  .lang-option.active {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.18) 70%, var(--control-surface) 30%);
    color: var(--voyage-blue);
  }

  .label {
    font-weight: var(--weight-semibold);
    font-size: var(--text-small);
  }

  .name {
    font-size: var(--text-caption);
    color: var(--text-secondary);
  }

  svg { pointer-events: none; }
</style>
