<script>
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { json, locale } from 'svelte-i18n';
  import Icon from '$lib/components/icons/Icon.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';

  import en from '$lib/i18n/en.json';

  const SUPPORTED_LOCALES = /** @type {const} */ (['en', 'lv', 'ru', 'uk', 'fr', 'es']);
  const DEFAULT_LOCALE = 'en';

  /** @typedef {typeof SUPPORTED_LOCALES[number]} SupportedLocale */
  /** @typedef {typeof en.ai_companion} CompanionProfile */
  /** @typedef {CompanionProfile['knowledgeBase'][number]} KnowledgeEntry */
  /** @typedef {{ sender: 'user' | 'companion'; text: string }} Message */

  const fallbackProfile = /** @type {CompanionProfile} */ (en.ai_companion);

  /**
   * @param {unknown} lang
   * @returns {lang is SupportedLocale}
   */
  const isSupportedLocale = (lang) =>
    typeof lang === 'string' && /** @type {readonly string[]} */ (SUPPORTED_LOCALES).includes(lang);

  /**
   * @param {unknown} value
   * @returns {value is CompanionProfile}
   */
  const isCompanionProfile = (value) => {
    if (!value || typeof value !== 'object') return false;
    const record = /** @type {Record<string, unknown>} */ (value);
    return (
      typeof record.name === 'string' &&
      typeof record.role === 'string' &&
      typeof record.greeting === 'string' &&
      typeof record.placeholder === 'string' &&
      typeof record.fallback === 'string' &&
      typeof record.dialogLabel === 'string' &&
      typeof record.languageSwitch === 'string' &&
      record.actions !== null &&
      typeof record.actions === 'object' &&
      typeof /** @type {Record<string, unknown>} */ (record.actions).send === 'string'
    );
  };

  let isOpen = false;
  let input = '';
  let loading = false;
  let hasUserInteracted = false;
  /** @type {SupportedLocale} */
  let currentLocale = DEFAULT_LOCALE;
  /** @type {CompanionProfile} */
  let profile = fallbackProfile;
  /** @type {CompanionProfile['suggestions']} */
  let suggestions = fallbackProfile.suggestions;
  /** @type {ReadonlyArray<KnowledgeEntry>} */
  let knowledgeBase = fallbackProfile.knowledgeBase;
  let simulatedLatency = typeof fallbackProfile.latency === 'number' ? fallbackProfile.latency : 520;
  /** @type {Message[]} */
  let messages = [
    {
      sender: 'companion',
      text: fallbackProfile.greeting
    }
  ];
  let shouldRefreshGreeting = true;
  let lastGreetingText = fallbackProfile.greeting;

  /** @type {HTMLTextAreaElement | null} */
  let inputEl = null;
  /** @type {HTMLUListElement | null} */
  let messagesEl = null;
  /** @type {HTMLButtonElement | null} */
  let launcherEl = null;

  $: {
    const maybeProfile = $json?.('ai_companion');
    if (isCompanionProfile(maybeProfile)) {
      profile = maybeProfile;
    } else {
      profile = fallbackProfile;
    }

    suggestions = Array.isArray(profile.suggestions) ? profile.suggestions : fallbackProfile.suggestions;
    knowledgeBase = Array.isArray(profile.knowledgeBase) ? profile.knowledgeBase : fallbackProfile.knowledgeBase;
    const nextLatency = typeof profile.latency === 'number' ? profile.latency : fallbackProfile.latency;
    simulatedLatency = typeof nextLatency === 'number' ? nextLatency : 520;

    const currentGreeting = profile.greeting;

    if (shouldRefreshGreeting || (!hasUserInteracted && currentGreeting !== lastGreetingText)) {
      messages = [
        {
          sender: 'companion',
          text: currentGreeting
        }
      ];
      shouldRefreshGreeting = false;
      lastGreetingText = currentGreeting;
    }
  }

  const unsubscribe = locale.subscribe((value) => {
    const nextLocale = isSupportedLocale(value)
      ? /** @type {SupportedLocale} */ (value)
      : DEFAULT_LOCALE;
    const localeChanged = nextLocale !== currentLocale;

    currentLocale = nextLocale;

    if (localeChanged) {
      if (!hasUserInteracted) {
        shouldRefreshGreeting = true;
      } else {
        messages = [
          ...messages,
          {
            sender: 'companion',
            text: profile.languageSwitch
          }
        ];
      }
    }
  });

  onDestroy(() => {
    unsubscribe();
  });

  onMount(() => {
    if (isOpen && inputEl) {
      inputEl.focus();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleGlobalKeydown);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleGlobalKeydown);
      }
    };
  });

  afterUpdate(() => {
    if (!isOpen || !messagesEl) return;

    messagesEl.scrollTop = messagesEl.scrollHeight;
  });

  const openPanel = () => {
    if (isOpen) return;

    isOpen = true;
    tickFocus();
  };

  const closePanel = (focusLauncher = false) => {
    if (!isOpen) return;

    isOpen = false;

    if (focusLauncher && launcherEl) {
      launcherEl.focus();
    }
  };

  const toggle = () => {
    if (isOpen) {
      closePanel(true);
    } else {
      openPanel();
    }
  };

  const tickFocus = async () => {
    await Promise.resolve();
    if (inputEl) {
      inputEl.focus();
    }
  };

  /**
   * @param {KeyboardEvent} event
   */
  const handleGlobalKeydown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closePanel(true);
    }
  };

  /**
   * @param {Message['sender']} sender
   * @param {string} text
   */
  const addMessage = (sender, text) => {
    messages = [...messages, { sender, text }];
  };

  /**
   * @param {string} question
   * @returns {string}
   */
  const matchAnswer = (question) => {
    const normalized = question.toLowerCase();

    const entry = knowledgeBase.find((item) =>
      item.keywords.some((keyword) => normalized.includes(keyword))
    );

    if (entry) return entry.answer;

    return profile.fallback;
  };

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || loading) return;

    addMessage('user', trimmed);
    input = '';
    loading = true;
    hasUserInteracted = true;

    const response = matchAnswer(trimmed);

    await new Promise((resolve) => setTimeout(resolve, simulatedLatency));

    addMessage('companion', response);
    loading = false;
    tickFocus();
  };

  /**
   * @param {KeyboardEvent} event
   */
  const handleKeydown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  /**
   * @param {string} prompt
   */
  const chooseSuggestion = (prompt) => {
    input = prompt;
    tickFocus();
  };
</script>

<div class="companion" aria-live="polite">
  <button
    class="orb"
    bind:this={launcherEl}
    on:click={toggle}
    aria-label={isOpen ? profile.actions.hide : profile.actions.open}
    aria-expanded={isOpen}
  >
    <span class="orb__halo"></span>
    <span class="orb__glow"></span>
    <span class="orb__core"></span>
  </button>

  {#if isOpen}
    <div class="panel-shell">
      <GlassCard as="section" halo padding="lg" role="dialog" aria-modal="true" aria-label={profile.dialogLabel}>
        <header class="panel__header">
          <div class="panel__identity">
            <div class="panel__avatar"></div>
            <div>
              <h2>{profile.name}</h2>
              <p>{profile.role}</p>
            </div>
          </div>
          <button class="close" on:click={() => closePanel(true)} aria-label={profile.actions.closePanel}>
            <Icon name="close" size={18} />
          </button>
        </header>

        <div class="panel__body">
          <ul class="messages" bind:this={messagesEl}>
            {#each messages as message, index (index)}
              <li class:from-user={message.sender === 'user'}>
                <span>{message.text}</span>
              </li>
            {/each}
            {#if loading}
              <li class="typing">
                <span></span>
                <span></span>
                <span></span>
              </li>
            {/if}
          </ul>

          <div class="suggestions" aria-label={profile.actions.suggestionLabel}>
            {#each suggestions as suggestion}
              <button type="button" on:click={() => chooseSuggestion(suggestion.prompt)}>
                <span>{suggestion.title}</span>
              </button>
            {/each}
          </div>
        </div>

        <form class="panel__input" on:submit|preventDefault={sendMessage} aria-label={profile.actions.formLabel}>
          <textarea
            bind:this={inputEl}
            bind:value={input}
            placeholder={profile.placeholder}
            rows="2"
            on:keydown={handleKeydown}
          ></textarea>
          <Button
            type="submit"
            variant="gradient"
            size="md"
            elevate
            disabled={loading || !input.trim()}
            loading={loading}
          >
            {profile.actions.send}
          </Button>
        </form>
      </GlassCard>
    </div>
  {/if}
</div>

<style>
  .companion {
    position: fixed;
    bottom: var(--space-2);
    right: var(--space-2);
    z-index: var(--z-overlay);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1rem;
    pointer-events: none;
  }

  .orb {
    position: relative;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
    padding: 0;
  }

  .orb:focus-visible {
    outline: 3px solid rgba(var(--voyage-blue-rgb), 0.45);
    outline-offset: 4px;
  }

  .orb__halo {
    position: absolute;
    inset: -28%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 70%);
    filter: blur(10px);
    opacity: 0.65;
    transition: opacity var(--duration-normal) var(--ease-smooth);
  }

  .orb__glow {
    position: absolute;
    inset: -12%;
    border-radius: 50%;
    background: radial-gradient(circle at 32% 32%, rgba(var(--voyage-blue-rgb), 0.42), transparent 68%);
    filter: blur(14px);
    opacity: 0.8;
    transition: opacity var(--duration-normal) var(--ease-smooth);
  }

  .orb__core {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.85), rgba(var(--voyage-blue-rgb), 0.22));
    display: grid;
    place-items: center;
    box-shadow:
      inset 0 6px 16px rgba(255, 255, 255, 0.28),
      inset 0 -10px 18px rgba(var(--voyage-blue-rgb), 0.35),
      0 18px 32px rgba(var(--voyage-blue-rgb), 0.28);
    transition: transform var(--duration-normal) var(--ease-smooth);
  }

  .orb__core::after {
    content: '';
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.95), rgba(var(--voyage-blue-rgb), 0.24));
    box-shadow:
      0 8px 18px rgba(var(--voyage-blue-rgb), 0.32),
      inset 0 -2px 6px rgba(var(--voyage-blue-rgb), 0.48);
  }

  .orb:hover .orb__halo,
  .orb:focus-visible .orb__halo {
    opacity: 0.85;
  }

  .orb:hover .orb__core,
  .orb:focus-visible .orb__core {
    transform: scale(1.03);
  }

  .panel-shell {
    pointer-events: auto;
    width: min(420px, 92vw);
    --card-gap: clamp(1.25rem, 3vw, 1.85rem);
    --glass-card-radius: clamp(1.85rem, 4vw, 2.75rem);
  }

  .panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(1rem, 2.5vw, 1.35rem);
    padding-bottom: clamp(0.85rem, 2vw, 1rem);
    border-bottom: 1px solid color-mix(in srgb, var(--surface-glass-border) 70%, transparent 30%);
  }

  .panel__identity {
    display: flex;
    align-items: center;
    gap: clamp(0.85rem, 2.2vw, 1.15rem);
  }

  .panel__avatar {
    width: clamp(48px, 6vw, 56px);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background: radial-gradient(circle at 32% 32%, rgba(var(--voyage-blue-rgb), 0.55), rgba(var(--aurora-purple-rgb), 0.3));
    position: relative;
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.38),
      0 18px 36px rgba(var(--voyage-blue-rgb), 0.28);
  }

  .panel__avatar::after {
    content: '';
    position: absolute;
    inset: 12px;
    border-radius: inherit;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.82), rgba(var(--voyage-blue-rgb), 0.3));
    filter: blur(6px);
    opacity: 0.85;
  }

  .panel__identity h2 {
    margin: 0;
    font-size: clamp(1.15rem, 2.8vw, 1.35rem);
    font-weight: var(--weight-semibold);
  }

  .panel__identity p {
    margin: 0;
    font-size: clamp(0.95rem, 2.4vw, 1.05rem);
    color: color-mix(in srgb, var(--text) 78%, rgba(var(--voyage-blue-rgb), 0.32) 22%);
  }

  .close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--surface-glass-border) 75%, transparent 25%);
    background: color-mix(in srgb, var(--surface-glass-bg) 90%, transparent 10%);
    color: color-mix(in srgb, var(--text) 82%, rgba(var(--voyage-blue-rgb), 0.24) 18%);
    cursor: pointer;
    pointer-events: auto;
    transition:
      transform var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .close:hover,
  .close:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(var(--ink-rgb), 0.16);
    color: var(--text);
  }

  .panel__body {
    display: grid;
    gap: clamp(1.1rem, 2.6vw, 1.6rem);
  }

  .messages {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: clamp(0.85rem, 2vw, 1.1rem);
    max-height: clamp(240px, 45vh, 340px);
    overflow-y: auto;
    padding-right: 0.35rem;
    scrollbar-width: thin;
  }

  .messages li {
    display: flex;
    justify-content: flex-start;
  }

  .messages li span {
    display: inline-flex;
    padding: 0.9rem 1.1rem;
    border-radius: clamp(1rem, 2vw, 1.2rem);
    background: color-mix(in srgb, var(--surface-glass-bg) 85%, rgba(var(--voyage-blue-rgb), 0.12) 15%);
    border: 1px solid color-mix(in srgb, var(--surface-glass-border) 78%, rgba(var(--voyage-blue-rgb), 0.2) 22%);
    color: color-mix(in srgb, var(--text) 90%, rgba(var(--voyage-blue-rgb), 0.22) 10%);
    box-shadow: 0 14px 34px rgba(var(--ink-rgb), 0.14);
    max-width: 100%;
    white-space: pre-wrap;
    line-height: var(--leading-relaxed, 1.65);
  }

  .messages li.from-user {
    justify-content: flex-end;
  }

  .messages li.from-user span {
    background: linear-gradient(
      135deg,
      color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.82) 92%, rgba(255, 255, 255, 0.08) 8%),
      color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.74) 92%, rgba(255, 255, 255, 0.08) 8%)
    );
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.62) 85%, transparent 15%);
    color: rgba(255, 255, 255, 0.96);
  }

  .messages li.typing {
    display: inline-flex;
    gap: 0.35rem;
    padding: 0.75rem 1rem;
    border-radius: clamp(1rem, 2vw, 1.2rem);
    background: color-mix(in srgb, var(--surface-glass-bg) 90%, transparent 10%);
    border: 1px solid color-mix(in srgb, var(--surface-glass-border) 75%, transparent 25%);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.2);
  }

  .messages li.typing span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(var(--voyage-blue-rgb), 0.65);
    animation: typing 1.2s ease-in-out infinite;
  }

  .messages li.typing span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .messages li.typing span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%,
    80%,
    100% {
      transform: translateY(0);
      opacity: 0.45;
    }
    40% {
      transform: translateY(-4px);
      opacity: 1;
    }
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(0.6rem, 1.8vw, 0.9rem);
  }

  .suggestions button {
    border: 1px solid color-mix(in srgb, var(--surface-chip-border) 80%, transparent 20%);
    border-radius: 999px;
    padding: 0.5rem 1rem;
    background: var(--surface-chip-bg);
    color: var(--surface-chip-color);
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    line-height: 1.1;
    cursor: pointer;
    pointer-events: auto;
    transition:
      transform var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .suggestions button:hover,
  .suggestions button:focus-visible {
    transform: translateY(-2px);
    background: color-mix(in srgb, var(--surface-chip-bg) 80%, rgba(var(--voyage-blue-rgb), 0.16) 20%);
    box-shadow: var(--surface-chip-shadow);
    color: var(--text);
  }

  .panel__input {
    display: flex;
    align-items: flex-end;
    gap: clamp(0.85rem, 2vw, 1.2rem);
    padding-top: clamp(1rem, 2.4vw, 1.4rem);
    border-top: 1px solid color-mix(in srgb, var(--surface-glass-border) 70%, transparent 30%);
  }

  .panel__input textarea {
    flex: 1;
    min-height: clamp(3.5rem, 12vw, 4.25rem);
    resize: vertical;
    border-radius: clamp(1rem, 2vw, 1.2rem);
    border: 1px solid var(--surface-field-border);
    background: var(--surface-field-bg);
    padding: 0.95rem 1.1rem;
    font-family: inherit;
    font-size: clamp(0.95rem, 2vw, 1rem);
    line-height: 1.6;
    color: color-mix(in srgb, var(--text) 92%, rgba(var(--voyage-blue-rgb), 0.18) 8%);
    box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.16);
  }

  .panel__input textarea:focus {
    outline: 3px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 70%, transparent 30%);
    outline-offset: 3px;
  }

  :global([data-theme='dark']) .panel-shell {
    --surface-chip-bg: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.22) 60%, rgba(8, 14, 24, 0.72) 40%);
    --surface-chip-color: color-mix(in srgb, rgba(255, 255, 255, 0.86) 82%, rgba(var(--voyage-blue-rgb), 0.3) 18%);
    --surface-field-bg: color-mix(in srgb, rgba(10, 16, 28, 0.85) 70%, rgba(var(--voyage-blue-rgb), 0.32) 30%);
    --surface-field-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 70%, transparent 30%);
    --surface-glass-bg: color-mix(in srgb, rgba(12, 18, 32, 0.82) 72%, rgba(var(--voyage-blue-rgb), 0.28) 28%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 68%, rgba(255, 255, 255, 0.18) 32%);
  }

  :global([data-theme='dark']) .panel__identity p {
    color: color-mix(in srgb, rgba(255, 255, 255, 0.82) 75%, rgba(var(--voyage-blue-rgb), 0.28) 25%);
  }

  :global([data-theme='dark']) .panel__avatar {
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.2),
      0 20px 38px rgba(var(--voyage-blue-rgb), 0.32);
  }

  :global([data-theme='dark']) .messages li span {
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.22) 65%, rgba(5, 10, 22, 0.76) 35%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.9) 88%, rgba(var(--voyage-blue-rgb), 0.28) 12%);
  }

  :global([data-theme='dark']) .messages li.typing {
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.35) 70%, transparent 30%);
  }

  :global([data-theme='dark']) .messages li.typing span {
    background: rgba(var(--voyage-blue-rgb), 0.75);
  }

  :global([data-theme='dark']) .close {
    background: color-mix(in srgb, rgba(10, 16, 28, 0.88) 70%, rgba(var(--voyage-blue-rgb), 0.3) 30%);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.45) 65%, transparent 35%);
    color: color-mix(in srgb, rgba(255, 255, 255, 0.82) 75%, rgba(var(--voyage-blue-rgb), 0.25) 25%);
  }

  :global([data-theme='dark']) .close:hover,
  :global([data-theme='dark']) .close:focus-visible {
    color: rgba(255, 255, 255, 0.96);
  }

  :global([data-theme='hc']) .panel-shell {
    background: var(--bg);
    border: 2px solid currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .panel__avatar {
    background: currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .messages li span {
    background: transparent;
    border: 2px solid currentColor;
    color: currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .messages li.from-user span {
    background: currentColor;
    color: var(--bg);
  }

  :global([data-theme='hc']) .messages li.typing {
    background: transparent;
    border-color: currentColor;
  }

  :global([data-theme='hc']) .messages li.typing span {
    background: currentColor;
  }

  :global([data-theme='hc']) .suggestions button {
    background: transparent;
    border: 2px solid currentColor;
    color: currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .panel__input textarea {
    background: transparent;
    border: 2px solid currentColor;
    color: currentColor;
    box-shadow: none;
  }

  :global([data-theme='hc']) .close {
    border: 2px solid currentColor;
    background: transparent;
    color: currentColor;
  }

  @media (max-width: 600px) {
    .companion {
      right: var(--space-1);
      bottom: var(--space-1);
    }

    .orb {
      width: 68px;
      height: 68px;
    }

    .panel-shell {
      width: min(360px, 94vw);
    }
  }
</style>

