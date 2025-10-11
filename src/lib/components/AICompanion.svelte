<script>
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { json, locale } from 'svelte-i18n';
  import { Icon } from '$lib/components';

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
    <div class="panel os-window" role="dialog" aria-label={profile.dialogLabel}>
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
        <button type="submit" class="send" disabled={loading || !input.trim()}>
          {profile.actions.send}
        </button>
      </form>
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
    outline: 3px solid rgba(var(--voyage-blue-rgb), 0.4);
    outline-offset: 4px;
  }

  .orb__halo {
    position: absolute;
    inset: -28%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent 70%);
    filter: blur(10px);
    opacity: 0.8;
  }

  .orb__glow {
    position: absolute;
    inset: -18%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(var(--voyage-blue-rgb), 0.32), rgba(var(--voyage-blue-rgb), 0));
    filter: blur(18px);
    opacity: 0.9;
    animation: pulse 4.5s var(--ease-in-out) infinite;
  }

  .orb__core {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(var(--signal-yellow-rgb), 0.24), rgba(var(--aurora-purple-rgb), 0.68));
    box-shadow: 0 0 24px rgba(var(--voyage-blue-rgb), 0.45), 0 0 64px rgba(var(--aurora-purple-rgb), 0.32);
    transition: transform var(--duration-normal) var(--ease-spring), box-shadow var(--duration-normal) var(--ease-out),
      opacity var(--duration-normal) var(--ease-out);
    opacity: 0.9;
  }

  .orb:hover .orb__core,
  .orb:focus-visible .orb__core {
    transform: scale(1.06);
    box-shadow: 0 0 32px rgba(var(--voyage-blue-rgb), 0.58), 0 0 72px rgba(var(--aurora-purple-rgb), 0.42);
    opacity: 1;
  }

  .panel {
    width: min(360px, calc(100vw - 2 * var(--space-2)));
    display: grid;
    grid-template-rows: auto minmax(0, 1fr) auto;
    pointer-events: auto;
    gap: 0;
    --surface-glass-blur: blur(24px);
    --surface-glass-bg:
      linear-gradient(
        140deg,
        color-mix(in srgb, var(--grad-a) 16%, transparent) 0%,
        color-mix(in srgb, var(--grad-b) 12%, transparent) 100%
      ),
      color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--voyage-blue-rgb), 0.18) 12%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.4) 60%, rgba(255, 255, 255, 0.36) 40%);
    --surface-glass-shadow: 0 32px 62px rgba(var(--voyage-blue-rgb), 0.26);
    --grain-opacity: 0.06;
    --grain-blend-mode: soft-light;
    --os-window-hc-bg: color-mix(in srgb, var(--bg) 96%, rgba(var(--voyage-blue-rgb), 0.12) 4%);
    --os-window-hc-border: color-mix(in srgb, var(--border-strong) 68%, rgba(var(--voyage-blue-rgb), 0.24) 32%);
    --os-window-hc-shadow: 0 0 0 1px color-mix(in srgb, var(--border-strong) 58%, rgba(var(--voyage-blue-rgb), 0.28) 42%);
    --companion-header-bg: linear-gradient(
      135deg,
      color-mix(in srgb, var(--grad-a) 74%, transparent) 0%,
      color-mix(in srgb, var(--grad-b) 70%, transparent) 100%
    );
    --companion-header-color: var(--pure-white);
    --companion-message-bg: color-mix(in srgb, var(--bg-elev-1) 70%, rgba(var(--voyage-blue-rgb), 0.18) 30%);
    --companion-message-color: color-mix(in srgb, var(--text) 86%, rgba(255, 255, 255, 0.88) 14%);
    --companion-user-bg: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.84) 72%, rgba(255, 255, 255, 0.16) 28%);
    --companion-user-color: color-mix(in srgb, var(--pure-white) 92%, rgba(6, 12, 24, 0.12) 8%);
    --companion-divider: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.28) 58%, rgba(255, 255, 255, 0.3) 42%);
    --companion-input-bg: color-mix(in srgb, var(--bg-elev-1) 68%, rgba(var(--voyage-blue-rgb), 0.18) 32%);
    --companion-input-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 62%, rgba(255, 255, 255, 0.32) 38%);
    --companion-send-bg: linear-gradient(
      135deg,
      color-mix(in srgb, var(--grad-a) 78%, transparent) 0%,
      color-mix(in srgb, var(--grad-b) 72%, transparent) 100%
    );
    --companion-send-bg-hover: linear-gradient(
      135deg,
      color-mix(in srgb, var(--grad-a) 84%, transparent) 0%,
      color-mix(in srgb, var(--grad-b) 78%, transparent) 100%
    );
    --companion-send-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.52) 60%, rgba(255, 255, 255, 0.34) 40%);
    --companion-send-shadow: 0 18px 36px rgba(var(--voyage-blue-rgb), 0.28);
  }

  :global([data-base-theme='dark']) .panel {
    --surface-glass-bg:
      linear-gradient(
        140deg,
        color-mix(in srgb, var(--grad-a) 18%, transparent) 0%,
        color-mix(in srgb, var(--grad-b) 14%, transparent) 100%
      ),
      color-mix(in srgb, var(--bg-elev-2) 72%, rgba(var(--voyage-blue-rgb), 0.34) 28%);
    --surface-glass-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 58%, rgba(255, 255, 255, 0.22) 42%);
    --surface-glass-shadow: 0 36px 68px rgba(var(--voyage-blue-rgb), 0.34);
    --grain-opacity: 0.08;
    --companion-message-bg: color-mix(in srgb, rgba(12, 16, 28, 0.86) 62%, rgba(var(--voyage-blue-rgb), 0.34) 38%);
    --companion-message-color: color-mix(in srgb, var(--text) 92%, rgba(255, 255, 255, 0.88) 8%);
    --companion-user-bg: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.82) 70%, rgba(8, 14, 26, 0.4) 30%);
    --companion-user-color: color-mix(in srgb, var(--pure-white) 94%, rgba(0, 0, 0, 0.18) 6%);
    --companion-divider: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.46) 60%, rgba(255, 255, 255, 0.18) 40%);
    --companion-input-bg: color-mix(in srgb, rgba(10, 14, 28, 0.9) 70%, rgba(var(--voyage-blue-rgb), 0.32) 30%);
    --companion-input-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.5) 58%, rgba(255, 255, 255, 0.2) 42%);
    --companion-send-shadow: 0 24px 44px rgba(var(--voyage-blue-rgb), 0.36);
  }

  :global(html[data-theme='hc']) .panel {
    --companion-header-bg: var(--bg);
    --companion-header-color: var(--text);
    --companion-message-bg: transparent;
    --companion-message-color: var(--text);
    --companion-user-bg: transparent;
    --companion-user-color: var(--text);
    --companion-divider: var(--border-strong);
    --companion-input-bg: transparent;
    --companion-input-border: var(--border-strong);
    --companion-send-bg: transparent;
    --companion-send-border: var(--border-strong);
    --companion-send-shadow: none;
  }

  :global(html[data-theme='hc']) .panel__header {
    border-bottom: 2px solid currentColor;
  }

  :global(html[data-theme='hc']) .close {
    background: transparent;
    border: 1px solid currentColor;
    color: var(--text);
  }

  :global(html[data-theme='hc']) .close:hover,
  :global(html[data-theme='hc']) .close:focus-visible {
    background: currentColor;
    color: var(--bg);
  }

  .panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.2rem;
    background: var(--companion-header-bg);
    color: var(--companion-header-color);
    border-bottom: 1px solid color-mix(in srgb, var(--companion-divider) 70%, transparent 30%);
  }

  .panel__identity {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .panel__identity h2 {
    margin: 0;
    font-size: 1.05rem;
    font-family: var(--font-display);
    font-weight: var(--weight-semibold);
  }

  .panel__identity p {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.85;
  }

  .panel__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--gradient-secondary);
    box-shadow: 0 0 16px rgba(var(--signal-yellow-rgb), 0.45);
  }

  .close {
    background: color-mix(in srgb, rgba(255, 255, 255, 0.12) 55%, transparent 45%);
    border: 1px solid color-mix(in srgb, rgba(255, 255, 255, 0.32) 58%, transparent 42%);
    color: var(--companion-header-color);
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: var(--radius-full);
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    transition:
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      transform var(--duration-fast) var(--ease-out);
  }

  .close:hover,
  .close:focus-visible {
    background: color-mix(in srgb, rgba(255, 255, 255, 0.24) 70%, transparent 30%);
    border-color: color-mix(in srgb, rgba(255, 255, 255, 0.4) 65%, transparent 35%);
    transform: translateY(-1px);
  }

  .panel__body {
    padding: 1.15rem 1.2rem;
    display: grid;
    gap: 1rem;
    max-height: 340px;
    grid-template-rows: minmax(0, 1fr) auto;
    color: var(--companion-message-color);
  }

  .messages {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.75rem;
    align-content: start;
    overflow-y: auto;
    padding-right: 0.35rem;
    min-height: 0;
  }

  .messages li {
    max-width: 85%;
    font-size: 0.95rem;
    line-height: 1.45;
    color: var(--companion-message-color);
    background: var(--companion-message-bg);
    padding: 0.65rem 0.9rem;
    border-radius: 1.1rem 1.1rem 1.1rem 0.45rem;
    border: 1px solid color-mix(in srgb, var(--companion-divider) 55%, transparent 45%);
    box-shadow: 0 16px 32px rgba(var(--voyage-blue-rgb), 0.08);
    transition: border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
  }

  .messages li.from-user {
    justify-self: end;
    background: var(--companion-user-bg);
    color: var(--companion-user-color);
    border-radius: 1.1rem 0.45rem 1.1rem 1.1rem;
    border-color: color-mix(in srgb, var(--companion-divider) 68%, transparent 32%);
    box-shadow: 0 18px 36px rgba(var(--voyage-blue-rgb), 0.18);
  }

  :global(html[data-theme='hc']) .messages li {
    border: 1px solid currentColor;
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .messages li.from-user {
    border-color: currentColor;
  }

  .typing {
    display: inline-flex;
    gap: 0.3rem;
    padding: 0.65rem 0.85rem;
    background: var(--companion-message-bg);
    border-radius: 1.1rem;
    border: 1px solid color-mix(in srgb, var(--companion-divider) 55%, transparent 45%);
  }

  .typing span {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--companion-message-color) 80%, transparent 20%);
    animation: blink 1.2s ease-in-out infinite;
  }

  :global(html[data-theme='hc']) .typing {
    border: 1px solid currentColor;
  }

  :global(html[data-theme='hc']) .typing span {
    background: currentColor;
  }

  .typing span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing span:nth-child(3) {
    animation-delay: 0.4s;
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .suggestions button {
    background: color-mix(in srgb, var(--companion-message-bg) 76%, rgba(255, 255, 255, 0.06) 24%);
    color: var(--companion-message-color);
    border: 1px solid color-mix(in srgb, var(--companion-divider) 62%, transparent 38%);
    border-radius: var(--radius-lg);
    padding: 0.5rem 0.85rem;
    font-size: 0.85rem;
    cursor: pointer;
    transition:
      transform var(--duration-fast) var(--ease-out),
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .suggestions button:hover,
  .suggestions button:focus-visible {
    background: color-mix(in srgb, var(--companion-message-bg) 60%, rgba(var(--voyage-blue-rgb), 0.22) 40%);
    border-color: color-mix(in srgb, var(--companion-divider) 72%, rgba(var(--voyage-blue-rgb), 0.2) 28%);
    transform: translateY(-1px);
  }

  :global(html[data-theme='hc']) .suggestions button {
    background: transparent;
    border: 1px solid currentColor;
    color: var(--text);
  }

  :global(html[data-theme='hc']) .suggestions button:hover,
  :global(html[data-theme='hc']) .suggestions button:focus-visible {
    background: currentColor;
    color: var(--bg);
  }

  .panel__input {
    display: flex;
    align-items: flex-end;
    gap: 0.65rem;
    padding: 1rem 1.2rem 1.2rem;
    background: color-mix(in srgb, var(--companion-input-bg) 76%, rgba(255, 255, 255, 0.04) 24%);
    border-top: 1px solid color-mix(in srgb, var(--companion-divider) 65%, transparent 35%);
  }

  .panel__input textarea {
    flex: 1;
    min-height: 56px;
    max-height: 124px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--companion-input-border);
    background: var(--companion-input-bg);
    color: var(--companion-message-color);
    font-family: var(--font-body);
    font-size: 0.95rem;
    padding: 0.65rem 0.85rem;
    resize: vertical;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
    transition:
      border-color var(--duration-fast) var(--ease-out),
      box-shadow var(--duration-fast) var(--ease-out),
      background var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .panel__input textarea::placeholder {
    color: color-mix(in srgb, var(--companion-message-color) 64%, transparent 36%);
  }

  .panel__input textarea:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--grad-a) 60%, var(--grad-b) 40%);
    outline-offset: 2px;
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.46) 62%, rgba(255, 255, 255, 0.34) 38%);
  }

  :global(html[data-theme='hc']) .panel__input {
    background: transparent;
    border-top: 2px solid currentColor;
  }

  :global(html[data-theme='hc']) .panel__input textarea {
    background: transparent;
    color: var(--text);
    border: 1px solid currentColor;
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .panel__input textarea::placeholder {
    color: var(--text);
    opacity: 1;
  }

  .send {
    background: var(--companion-send-bg);
    border: 1px solid var(--companion-send-border);
    color: var(--pure-white);
    padding: 0.65rem 1.05rem;
    border-radius: var(--radius-lg);
    font-weight: var(--weight-semibold);
    cursor: pointer;
    box-shadow: var(--companion-send-shadow);
    transition:
      transform var(--duration-fast) var(--ease-spring),
      box-shadow var(--duration-fast) var(--ease-out),
      background var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out),
      color var(--duration-fast) var(--ease-out);
  }

  .send:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }

  .send:not(:disabled):hover,
  .send:not(:disabled):focus-visible {
    transform: translateY(-1px);
    background: var(--companion-send-bg-hover);
    border-color: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.58) 62%, rgba(255, 255, 255, 0.34) 38%);
    box-shadow: 0 22px 48px rgba(var(--voyage-blue-rgb), 0.34);
  }

  :global(html[data-theme='hc']) .send {
    background: transparent;
    color: var(--text);
    border: 2px solid currentColor;
    box-shadow: none;
  }

  :global(html[data-theme='hc']) .send:not(:disabled):hover,
  :global(html[data-theme='hc']) .send:not(:disabled):focus-visible {
    background: currentColor;
    color: var(--bg);
  }

  :global(html[data-theme='hc']) .send:disabled {
    opacity: 1;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.75;
    }

    50% {
      transform: scale(1.08);
      opacity: 1;
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 0.35;
    }

    50% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .orb__glow {
      animation: none;
    }

    .typing span {
      animation: none;
    }
  }

  @media (max-width: 540px) {
    .panel {
      width: min(92vw, 360px);
      right: 0;
      left: auto;
    }
  }
</style>
