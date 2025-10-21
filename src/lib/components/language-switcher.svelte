<script lang="ts">
  import { get } from 'svelte/store';
  import { onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { language } from '$stores/language';

  let isOpen = false;
  let trigger: HTMLButtonElement | null = null;
  let optionRefs: Array<HTMLButtonElement | undefined> = [];
  let listbox: HTMLDivElement | null = null;
  let focusedIndex = -1;
  let typeaheadTerm = '';
  let typeaheadTimeout: ReturnType<typeof setTimeout> | undefined;

  const TYPEAHEAD_RESET_MS = 500;

  type LanguageOption = {
    code: string;
    label: string;
    name: string;
  };

  const languages: LanguageOption[] = [
    { code: 'en', label: 'language_switcher.languages.en.short', name: 'language_switcher.languages.en.name' },
    { code: 'lv', label: 'language_switcher.languages.lv.short', name: 'language_switcher.languages.lv.name' },
    { code: 'ru', label: 'language_switcher.languages.ru.short', name: 'language_switcher.languages.ru.name' },
    { code: 'uk', label: 'language_switcher.languages.uk.short', name: 'language_switcher.languages.uk.name' },
    { code: 'fr', label: 'language_switcher.languages.fr.short', name: 'language_switcher.languages.fr.name' },
    { code: 'es', label: 'language_switcher.languages.es.short', name: 'language_switcher.languages.es.name' }
  ];

  $: currentLanguage = languages.find((lang) => lang.code === $language) || languages[0];
  $: activeIndex = languages.findIndex((lang) => lang.code === $language);

  function clampIndex(index: number): number {
    if (index < 0) return languages.length - 1;
    if (index >= languages.length) return 0;
    return index;
  }

  const getOptionId = (code: string) => `language-option-${code}`;

  function updateActiveDescendant(index: number): void {
    if (!listbox) return;
    const languageEntry = languages[index];
    if (languageEntry) {
      listbox.setAttribute('aria-activedescendant', getOptionId(languageEntry.code));
    } else {
      listbox.removeAttribute('aria-activedescendant');
    }
  }

  function focusOption(index: number): void {
    focusedIndex = clampIndex(index);
    updateActiveDescendant(focusedIndex);
    optionRefs[focusedIndex]?.focus();
  }

  function resetTypeahead() {
    typeaheadTerm = '';
    clearTimeout(typeaheadTimeout);
    typeaheadTimeout = undefined;
  }

  function queueTypeaheadReset(): void {
    clearTimeout(typeaheadTimeout);
    typeaheadTimeout = setTimeout(resetTypeahead, TYPEAHEAD_RESET_MS);
  }

  function findTypeaheadMatch(term: string, startIndex = 0): number {
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

  function handleTypeahead(key: string, startIndex = 0): void {
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

  async function openMenu(startIndex = 0): Promise<void> {
    optionRefs = [];
    isOpen = true;
    focusedIndex = clampIndex(startIndex);
    resetTypeahead();
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

  async function closeMenu(restoreFocus = true): Promise<void> {
    isOpen = false;
    focusedIndex = -1;
    resetTypeahead();
    listbox?.removeAttribute('aria-activedescendant');
    if (restoreFocus) {
      await tick();
      trigger?.focus();
    }
  }

  async function selectLanguage(code: string): Promise<void> {
    language.set(code);
    await closeMenu();
  }

  async function handleTriggerKeydown(event: KeyboardEvent): Promise<void> {
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

  function handleOptionKeydown(event: KeyboardEvent, index: number): void {
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

  async function toggleMenu(): Promise<void> {
    if (isOpen) {
      await closeMenu();
    } else {
      const start = activeIndex !== -1 ? activeIndex : 0;
      await openMenu(start);
    }
  }

  function handleFocusOut(event: FocusEvent): void {
    const target = event.currentTarget as HTMLElement | null;
    const related = event.relatedTarget as Node | null;
    if (target && !target.contains(related)) {
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
    display: inline-flex;
    align-items: stretch;
    isolation: isolate;
    flex-shrink: 1;
    min-width: 0;
  }

  .current-lang {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding: calc(var(--space-sm) + 0.15rem) clamp(1rem, 4vw, 1.45rem);
    min-width: clamp(6.5rem, 10vw, 7.75rem);
    border-radius: var(--radius-pill);
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

  .current-lang svg {
    width: 14px;
    height: 9px;
    opacity: 0.72;
    pointer-events: none;
  }

  .current-lang:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--surface-pill-border) 70%, rgba(var(--voyage-blue-rgb), 0.45) 30%);
    box-shadow: 0 18px 36px rgba(var(--ink-rgb), 0.18);
    color: var(--text);
  }

  .current-lang:focus-visible {
    outline: none;
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--surface-pill-border) 70%, rgba(var(--voyage-blue-rgb), 0.5) 30%);
    box-shadow: 0 22px 40px rgba(var(--ink-rgb), 0.22), var(--focus-ring-shadow);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + clamp(0.4rem, 1.8vw, 0.85rem));
    right: 0;
    min-width: clamp(13rem, 32vw, 16rem);
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

  .lang-option {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: clamp(0.45rem, 2vw, 0.75rem);
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

  .lang-option:hover {
    background: color-mix(in srgb, var(--surface-chip-bg) 82%, transparent 18%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 60%, rgba(var(--voyage-blue-rgb), 0.4) 40%);
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(var(--ink-rgb), 0.16);
  }

  .lang-option:focus-visible {
    outline: none;
    background: color-mix(in srgb, var(--surface-chip-bg) 88%, transparent 12%);
    border-color: color-mix(in srgb, var(--surface-chip-border) 55%, rgba(var(--voyage-blue-rgb), 0.5) 45%);
    box-shadow: 0 16px 34px rgba(var(--ink-rgb), 0.2), var(--focus-ring-shadow);
  }

  .lang-option.active {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.24) 55%, var(--surface-chip-bg) 45%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.48) 60%, rgba(255, 255, 255, 0.48) 40%);
    box-shadow: 0 16px 36px rgba(var(--voyage-blue-rgb), 0.22);
    color: color-mix(in srgb, var(--voyage-blue) 70%, var(--text) 30%);
    font-weight: var(--weight-semibold);
  }

  .lang-option.active .label {
    color: currentColor;
  }

  .label {
    font-weight: var(--weight-semibold);
    font-size: clamp(0.95rem, 1.1vw, 1.05rem);
    color: color-mix(in srgb, var(--text) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%);
    white-space: nowrap;
  }

  .name {
    font-size: clamp(0.82rem, 1vw, 0.92rem);
    color: color-mix(in srgb, var(--text-secondary) 88%, rgba(var(--voyage-blue-rgb), 0.08) 12%);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(html[data-theme='dark']) .current-lang {
    color: color-mix(in srgb, rgba(255, 255, 255, 0.92) 76%, rgba(var(--voyage-blue-rgb), 0.4) 24%);
    border-color: color-mix(in srgb, rgba(255, 255, 255, 0.16) 55%, rgba(var(--voyage-blue-rgb), 0.4) 45%);
    box-shadow: 0 18px 40px rgba(4, 10, 26, 0.48);
  }

  :global(html[data-theme='dark']) .dropdown {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.82) 68%, rgba(var(--voyage-blue-rgb), 0.28) 32%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 60%, rgba(255, 255, 255, 0.16) 40%);
    box-shadow: 0 26px 56px rgba(2, 6, 18, 0.6);
  }

  :global(html[data-theme='dark']) .lang-option {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.78) 62%, rgba(var(--voyage-blue-rgb), 0.22) 38%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.28) 55%, rgba(255, 255, 255, 0.12) 45%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.86) 70%, rgba(var(--voyage-blue-rgb), 0.3) 30%);
  }

  :global(html[data-theme='dark']) .lang-option:hover {
    background: color-mix(in srgb, rgba(var(--graphite-rgb), 0.8) 58%, rgba(var(--voyage-blue-rgb), 0.32) 42%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 60%, rgba(255, 255, 255, 0.16) 40%);
  }

  :global(html[data-theme='dark']) .lang-option.active {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(var(--graphite-rgb), 0.76) 40%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 65%, rgba(255, 255, 255, 0.24) 35%);
    box-shadow: 0 18px 42px rgba(var(--voyage-blue-rgb), 0.35);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.92) 72%, rgba(var(--voyage-blue-rgb), 0.46) 28%);
  }

  :global(html[data-theme='hc']) .current-lang {
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

  :global(html[data-theme='hc']) .lang-option,
  :global(html[data-theme='hc']) .lang-option:hover,
  :global(html[data-theme='hc']) .lang-option:focus-visible,
  :global(html[data-theme='hc']) .lang-option.active {
    background: transparent;
    border-color: currentColor;
    box-shadow: none;
    color: currentColor;
  }

  :global(html[data-theme='hc']) .lang-option:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  @media (max-width: 720px) {
    .current-lang {
      min-width: clamp(4.5rem, 18vw, 5.75rem);
      padding: calc(var(--space-sm) + 0.1rem) clamp(0.75rem, 6vw, 1rem);
      font-size: clamp(0.88rem, 2.4vw, 0.95rem);
      gap: clamp(0.45rem, 2vw, 0.55rem);
    }

    .current-lang svg {
      width: 12px;
      height: 8px;
    }

    .dropdown {
      inset-inline: auto 0;
      min-width: clamp(12rem, 60vw, 15rem);
    }
  }

  @media (max-width: 480px) {
    .current-lang {
      min-width: clamp(3.5rem, 28vw, 4.5rem);
      padding: 0.4rem clamp(0.6rem, 8vw, 0.9rem);
      letter-spacing: 0.015em;
      gap: 0.35rem;
    }

    .current-lang svg {
      width: 11px;
      height: 7px;
    }

    .dropdown {
      min-width: clamp(11rem, 70vw, 14rem);
    }
  }

  @media (max-width: 420px) {
    .current-lang {
      min-width: clamp(3.15rem, 34vw, 3.9rem);
      padding: 0.35rem clamp(0.5rem, 8vw, 0.75rem);
      font-size: clamp(0.82rem, 3vw, 0.9rem);
      letter-spacing: 0.02em;
    }

    .current-lang svg {
      width: 10px;
      height: 6px;
    }
  }

  @media (max-width: 380px) {
    .current-lang {
      min-width: clamp(2.9rem, 38vw, 3.4rem);
      padding-inline: clamp(0.45rem, 9vw, 0.65rem);
    }

    .dropdown {
      inset-inline-end: 0;
      min-width: clamp(10.5rem, 74vw, 13rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .current-lang,
    .lang-option {
      transition: border-color var(--duration-fast) ease, background var(--duration-fast) ease;
    }
  }
</style>
