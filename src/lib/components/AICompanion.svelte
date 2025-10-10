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
    <div class="panel" role="dialog" aria-label={profile.dialogLabel}>
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
    background: rgba(10, 12, 24, 0.88);
    backdrop-filter: blur(20px);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(255, 255, 255, 0.12);
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow: hidden;
    pointer-events: auto;
  }

  .panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.2rem;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.8), rgba(var(--aurora-purple-rgb), 0.8));
    color: var(--pure-white);
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
    background: transparent;
    border: none;
    color: var(--pure-white);
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: var(--radius-full);
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .close:hover,
  .close:focus-visible {
    background: rgba(255, 255, 255, 0.14);
  }

  .panel__body {
    padding: 1.15rem 1.2rem;
    display: grid;
    gap: 1rem;
    max-height: 340px;
    grid-template-rows: minmax(0, 1fr) auto;
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
    color: rgba(244, 247, 255, 0.94);
    background: rgba(255, 255, 255, 0.06);
    padding: 0.65rem 0.85rem;
    border-radius: 1.1rem 1.1rem 1.1rem 0.35rem;
    box-shadow: var(--shadow-xs);
  }

  .messages li.from-user {
    justify-self: end;
    background: rgba(var(--voyage-blue-rgb), 0.9);
    border-radius: 1.1rem 0.35rem 1.1rem 1.1rem;
  }

  .typing {
    display: inline-flex;
    gap: 0.3rem;
    padding: 0.65rem 0.85rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1.1rem;
  }

  .typing span {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.7);
    animation: blink 1.2s ease-in-out infinite;
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
    background: rgba(255, 255, 255, 0.08);
    color: rgba(244, 247, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-lg);
    padding: 0.5rem 0.8rem;
    font-size: 0.82rem;
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }

  .suggestions button:hover,
  .suggestions button:focus-visible {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.16);
  }

  .panel__input {
    display: flex;
    align-items: flex-end;
    gap: 0.65rem;
    padding: 1rem 1.2rem 1.2rem;
    background: rgba(10, 12, 24, 0.92);
  }

  .panel__input textarea {
    flex: 1;
    min-height: 56px;
    max-height: 124px;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(244, 247, 255, 0.94);
    font-family: var(--font-body);
    font-size: 0.95rem;
    padding: 0.65rem 0.8rem;
    resize: vertical;
  }

  .panel__input textarea::placeholder {
    color: rgba(244, 247, 255, 0.55);
  }

  .panel__input textarea:focus-visible {
    outline: 2px solid rgba(var(--aurora-purple-rgb), 0.5);
    outline-offset: 2px;
  }

  .send {
    background: var(--gradient-primary);
    border: none;
    color: var(--pure-white);
    padding: 0.65rem 1.05rem;
    border-radius: var(--radius-lg);
    font-weight: var(--weight-semibold);
    cursor: pointer;
    transition: transform var(--duration-fast) var(--ease-spring), box-shadow var(--duration-fast) var(--ease-out);
  }

  .send:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .send:not(:disabled):hover,
  .send:not(:disabled):focus-visible {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(var(--voyage-blue-rgb), 0.45);
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
