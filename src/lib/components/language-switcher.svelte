<script>
  // @ts-nocheck
  import { get } from 'svelte/store';
  import { onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { language } from '$stores/language';

  let isOpen = false;
  let trigger;
  let optionRefs = [];
  let listbox;
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

  const getOptionId = (code) => `language-option-${code}`;

  function updateActiveDescendant(index) {
    if (!listbox) return;
    const languageEntry = languages[index];
    if (languageEntry) {
      listbox.setAttribute('aria-activedescendant', getOptionId(languageEntry.code));
    } else {
      listbox.removeAttribute('aria-activedescendant');
    }
  }

  function focusOption(index) {
    focusedIndex = clampIndex(index);
    updateActiveDescendant(focusedIndex);
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
    updateActiveDescendant(focusedIndex);
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
    listbox?.removeAttribute('aria-activedescendant');
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

    if (event.key === 'Tab') {
      closeMenu(false);
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
      listbox?.removeAttribute('aria-activedescendant');
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
    <div
      class="dropdown"
      id="language-menu"
      role="listbox"
      aria-label={$_('language_switcher.menu_label')}
      tabindex="-1"
      bind:this={listbox}
    >
      {#each languages as lang, index}
        <button
          type="button"
          class="lang-option"
          class:active={lang.code === $language}
          role="option"
          aria-selected={lang.code === $language}
          use:trackOption={index}
          id={getOptionId(lang.code)}
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
    justify-content: center;
    gap: var(--space-sm);
    padding: var(--space-md) var(--space-lg);
    min-width: 120px;
    background: var(--bg-elev-1);
    border: 2px solid var(--border);
    border-radius: 24px;
    font-weight: var(--weight-semibold);
    font-size: var(--text-body);
    color: var(--text);
    cursor: pointer;
    box-shadow: var(--shadow-md);
    transition:
      transform var(--duration-normal) var(--ease-spring),
      box-shadow var(--duration-normal) var(--ease-smooth),
      border-color var(--duration-fast) ease;
  }

  .current-lang:hover {
    transform: var(--transform-hover-lift);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-xl);
  }

  .current-lang:focus-visible {
    outline: none;
    transform: var(--transform-hover-lift);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-xl), var(--focus-ring-shadow);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + var(--space-md));
    right: 0;
    min-width: 220px;
    background: var(--bg-elev-1);
    border: 2px solid var(--border);
    border-radius: 24px;
    box-shadow: var(--shadow-2xl);
    padding: var(--space-md);
    z-index: var(--z-overlay);
  }

  .lang-option {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: var(--space-md);
    width: 100%;
    padding: var(--space-md) var(--space-lg);
    background: transparent;
    border: none;
    border-radius: 16px;
    text-align: left;
    cursor: pointer;
    transition:
      transform var(--duration-fast) var(--ease-spring),
      background var(--duration-fast) ease;
  }

  .lang-option:hover {
    background: var(--bg-elev-2);
    transform: var(--transform-hover-card);
  }

  .lang-option:focus-visible {
    background: var(--bg-elev-2);
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
  }

  .lang-option.active {
    background: color-mix(in srgb, var(--voyage-blue) 10%, var(--bg-elev-2) 90%);
    color: var(--voyage-blue);
    font-weight: var(--weight-bold);
  }

  .label {
    font-weight: var(--weight-semibold);
    font-size: var(--text-body);
    color: var(--text);
    white-space: nowrap;
  }

  .name {
    font-size: var(--text-small);
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  svg { pointer-events: none; }

  @keyframes switcherFocusPulse {
    0%,
    100% {
      box-shadow:
        var(--focus-ring-shadow),
        0 0 0 5px color-mix(in srgb, var(--control-ring) 70%, transparent 30%),
        0 18px 36px rgba(var(--voyage-blue-rgb), 0.18);
    }

    50% {
      box-shadow:
        0 0 0 4px color-mix(in srgb, var(--focus-ring-color, var(--voyage-blue)) 75%, transparent 25%),
        0 0 0 8px color-mix(in srgb, var(--control-ring) 70%, transparent 30%),
        0 18px 36px rgba(var(--voyage-blue-rgb), 0.18);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .current-lang:focus-visible {
      animation: none;
    }
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .current-lang:focus-visible {
    box-shadow: var(--focus-ring-contrast);
    animation: none;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .lang-option:focus-visible {
    outline: 2px solid currentColor;
  }
</style>
