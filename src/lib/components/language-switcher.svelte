<script>
  // @ts-nocheck
  import { onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { language } from '$stores/language';

  let isOpen = false;
  let trigger;
  let optionRefs = [];
  let focusedIndex = -1;
  let typeaheadTerm = '';
  let typeaheadTimeout;

  const TYPEAHEAD_RESET_MS = 500;

  const languages = [
    { code: 'en', label: 'language_switcher.languages.en.short', name: 'language_switcher.languages.en.name' },
    { code: 'lv', label: 'language_switcher.languages.lv.short', name: 'language_switcher.languages.lv.name' },
    { code: 'ru', label: 'language_switcher.languages.ru.short', name: 'language_switcher.languages.ru.name' },
    { code: 'uk', label: 'language_switcher.languages.uk.short', name: 'language_switcher.languages.uk.name' },
    { code: 'fr', label: 'language_switcher.languages.fr.short', name: 'language_switcher.languages.fr.name' },
    { code: 'es', label: 'language_switcher.languages.es.short', name: 'language_switcher.languages.es.name' }
  ];

  $: currentLanguage = languages.find((lang) => lang.code === $language) || languages[0];
  $: activeIndex = languages.findIndex((lang) => lang.code === $language);

  function clampIndex(index) {
    if (index < 0) return languages.length - 1;
    if (index >= languages.length) return 0;
    return index;
  }

  function focusOption(index) {
    focusedIndex = clampIndex(index);
    optionRefs[focusedIndex]?.focus();
  }

  function resetTypeahead() {
    typeaheadTerm = '';
    clearTimeout(typeaheadTimeout);
    typeaheadTimeout = undefined;
  }

  function queueTypeaheadReset() {
    clearTimeout(typeaheadTimeout);
    typeaheadTimeout = setTimeout(resetTypeahead, TYPEAHEAD_RESET_MS);
  }

  function findTypeaheadMatch(term, startIndex = 0) {
    if (!term) return -1;

    const normalizedTerm = term.toLowerCase();
    const total = languages.length;
    const translate = get(_);

    for (let offset = 0; offset < total; offset += 1) {
      const index = (startIndex + offset) % total;
      const lang = languages[index];
      const label = translate(lang.name)?.toLowerCase?.();
      const shortLabel = translate(lang.label)?.toLowerCase?.();
      if (label?.startsWith(normalizedTerm) || shortLabel?.startsWith(normalizedTerm)) {
        return index;
      }
    }

    return -1;
  }

  function handleTypeahead(key, startIndex = 0) {
    typeaheadTerm += key.toLowerCase();
    queueTypeaheadReset();

    const matchIndex = findTypeaheadMatch(typeaheadTerm, startIndex);
    if (matchIndex !== -1) {
      focusOption(matchIndex);
    } else {
      resetTypeahead();
      const fallbackIndex = findTypeaheadMatch(key, startIndex);
      if (fallbackIndex !== -1) {
        focusOption(fallbackIndex);
      }
    }
  }

  async function openMenu(startIndex = 0) {
    optionRefs = [];
    isOpen = true;
    focusedIndex = clampIndex(startIndex);
    resetTypeahead();
    await tick();
    optionRefs[focusedIndex]?.focus();
  }

  function trackOption(node, index) {
    optionRefs[index] = node;

    return {
      destroy() {
        optionRefs[index] = undefined;
      },
      update(newIndex) {
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
    resetTypeahead();
    if (restoreFocus) {
      await tick();
      trigger?.focus();
    }
  }

  async function selectLanguage(code) {
    language.set(code);
    await closeMenu();
  }

  async function handleTriggerKeydown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const start = event.key === 'ArrowDown'
        ? activeIndex !== -1 ? activeIndex : 0
        : activeIndex !== -1 ? activeIndex : languages.length - 1;
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

    if (
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      event.key.length === 1 &&
      event.key.match(/\S/)
    ) {
      event.preventDefault();
      const start = activeIndex !== -1 ? activeIndex : 0;
      await openMenu(start);
      handleTypeahead(event.key, focusedIndex);
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      await closeMenu();
    }
  }

  function handleOptionKeydown(event, index) {
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
      focusOption(languages.length - 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectLanguage(languages[index].code);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      event.key.length === 1 &&
      event.key.match(/\S/)
    ) {
      event.preventDefault();
      handleTypeahead(event.key, index + 1);
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

  function handleFocusOut(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      isOpen = false;
      focusedIndex = -1;
      resetTypeahead();
    }
  }

  onDestroy(() => {
    clearTimeout(typeaheadTimeout);
  });
</script>

<div class="language-switcher" role="group" aria-label={$_('language_switcher.group_label')} on:focusout={handleFocusOut}>
  <button
    bind:this={trigger}
    class="current-lang"
    on:click={toggleMenu}
    on:keydown={handleTriggerKeydown}
    aria-label={$_('language_switcher.trigger_label')}
    aria-haspopup="listbox"
    aria-expanded={isOpen}
    aria-controls="language-menu"
  >
    {$_(currentLanguage.label)}
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
  </button>

  {#if isOpen}
    <div class="dropdown" id="language-menu" role="listbox" aria-label={$_('language_switcher.menu_label')} tabindex="-1">
      {#each languages as lang, index}
        <button
          type="button"
          class="lang-option"
          class:active={lang.code === $language}
          role="option"
          aria-selected={lang.code === $language}
          use:trackOption={index}
          tabindex={focusedIndex === index ? 0 : -1}
          on:click={() => selectLanguage(lang.code)}
          on:keydown={(event) => handleOptionKeydown(event, index)}
        >
          <span class="label">{$_(lang.label)}</span>
          <span class="name">{$_(lang.name)}</span>
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
