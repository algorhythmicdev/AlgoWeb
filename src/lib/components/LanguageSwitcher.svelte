<script>
  // @ts-nocheck
  import { language } from '$stores/language';
  
  let isOpen = false;
  
  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'lv', label: 'LV', name: 'Latviešu' },
    { code: 'ru', label: 'RU', name: 'Русский' },
    { code: 'uk', label: 'UK', name: 'Українська' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'es', label: 'ES', name: 'Español' }
  ];
  
  $: currentLanguage = languages.find(lang => lang.code === $language) || languages[0];
  
  function selectLanguage(code) {
    language.set(code);
    isOpen = false;
  }
</script>

<div class="language-switcher">
  <button 
    class="current-lang" 
    on:click={() => isOpen = !isOpen}
    aria-label="Select language"
  >
    {currentLanguage.label}
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
  
  {#if isOpen}
    <div class="dropdown">
      {#each languages as lang}
        <button
          class="lang-option"
          class:active={lang.code === $language}
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
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-weight: var(--weight-medium);
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }
  
  .current-lang:hover {
    border-color: var(--voyage-blue);
    color: var(--voyage-blue);
  }
  
  .dropdown {
    position: absolute;
    top: calc(100% + var(--space-2));
    right: 0;
    min-width: 180px;
    background: var(--bg-surface);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
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
    transition: background var(--duration-fast) var(--ease-out);
  }
  
  .lang-option:hover {
    background: var(--bg-elevated);
  }
  
  .lang-option.active {
    background: rgba(var(--voyage-blue-rgb), 0.1);
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
</style>
