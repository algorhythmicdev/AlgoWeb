<script>
  import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
  import { locale } from 'svelte-i18n';
  import {
    DEFAULT_LOCALE,
    getProfile,
    isSupportedLocale,
    matchKnowledgeBase
  } from '$lib/memory/companionProfiles';

  /** @typedef {import('$lib/memory/companionProfiles').CompanionProfile} CompanionProfile */
  /** @typedef {import('$lib/memory/companionProfiles').CompanionMessage} Message */
  /** @typedef {import('$lib/memory/companionProfiles').SupportedLocale} SupportedLocale */

  const STORAGE_KEY = 'algoweb:lumen:memory';
  const FOCUSABLE_SELECTOR =
    'button, [href], textarea, input, select, [tabindex]:not([tabindex="-1"])';

  let isOpen = false;
  let input = '';
  let loading = false;
  let hasUserInteracted = false;
  /** @type {SupportedLocale} */
  let currentLocale = DEFAULT_LOCALE;
  /** @type {CompanionProfile} */
  let profile = getProfile(DEFAULT_LOCALE);
  let suggestions = profile.suggestions;
  /** @type {Message[]} */
  let messages = [
    {
      sender: 'companion',
      text: profile.greeting
    }
  ];

  /** @type {HTMLTextAreaElement | null} */
  let inputEl = null;
  /** @type {HTMLUListElement | null} */
  let messagesEl = null;
  /** @type {HTMLButtonElement | null} */
  let launcherEl = null;
  /** @type {HTMLElement | null} */
  let panelEl = null;
  /** @type {HTMLElement[]} */
  let focusableEls = [];
  /** @type {Element | null} */
  let previouslyFocused = null;

  let canPersist = false;
  let skipLocaleGreeting = false;
  let isHoveringOrb = false;
  let orbShiftX = 0;
  let orbShiftY = 0;
  let scrollDrift = 0;
  let requestToken = 0;

  const unsubscribe = locale.subscribe((value) => {
    const nextLocale = /** @type {SupportedLocale} */ (
      isSupportedLocale(value) ? value : DEFAULT_LOCALE
    );
    const localeChanged = nextLocale !== currentLocale;

    currentLocale = nextLocale;
    profile = getProfile(nextLocale);
    suggestions = profile.suggestions;

    if (localeChanged) {
      if (skipLocaleGreeting) {
        skipLocaleGreeting = false;
      } else if (!hasUserInteracted) {
        messages = [
          {
            sender: 'companion',
            text: profile.greeting
          }
        ];
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

  const restoreFromStorage = () => {
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const persisted = JSON.parse(raw);
      const storedLocale = persisted?.locale;
      const rawMessages = Array.isArray(persisted?.messages) ? persisted.messages : [];

      /** @type {Message[]} */
      const cleanedMessages = [];
      for (const entry of rawMessages) {
        if (
          entry &&
          typeof entry === 'object' &&
          (entry.sender === 'user' || entry.sender === 'companion') &&
          typeof entry.text === 'string'
        ) {
          cleanedMessages.push({
            sender: entry.sender === 'user' ? 'user' : 'companion',
            text: entry.text
          });
        }
      }

      if (isSupportedLocale(storedLocale)) {
        skipLocaleGreeting = storedLocale !== currentLocale;
        currentLocale = storedLocale;
        profile = getProfile(storedLocale);
        suggestions = profile.suggestions;

        if (skipLocaleGreeting) {
          locale.set(storedLocale);
        }
      }

      if (cleanedMessages.length) {
        messages = cleanedMessages;
        hasUserInteracted =
          typeof persisted?.hasUserInteracted === 'boolean'
            ? persisted.hasUserInteracted
            : cleanedMessages.some((message) => message.sender === 'user');
      }
    } catch (error) {
      // ignore persistence errors
    }

    if (!messages.length) {
      messages = [
        {
          sender: 'companion',
          text: profile.greeting
        }
      ];
    }
  };

  onMount(() => {
    restoreFromStorage();

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleGlobalKeydown);
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    canPersist = true;

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', handleGlobalKeydown);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  });

  const updateFocusableElements = () => {
    if (!panelEl) {
      focusableEls = [];
      return;
    }

    focusableEls = /** @type {HTMLElement[]} */ (
      Array.from(panelEl.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) =>
        element instanceof HTMLElement &&
        !element.hasAttribute('disabled') &&
        element.getAttribute('aria-hidden') !== 'true'
      )
    );
  };

  const focusFirstElement = async () => {
    await tick();
    updateFocusableElements();
    const first = focusableEls[0] ?? panelEl;
    if (first instanceof HTMLElement) {
      first.focus();
    }
  };

  const focusInput = async () => {
    await tick();
    if (inputEl) {
      inputEl.focus();
    }
  };

  afterUpdate(() => {
    if (!isOpen) return;

    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    updateFocusableElements();
  });

  $: if (canPersist && typeof window !== 'undefined') {
    try {
      const snapshot = {
        locale: currentLocale,
        messages: messages.slice(-24).map((message) => ({
          sender: message.sender,
          text: message.text
        })),
        hasUserInteracted
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      // ignore persistence errors
    }
  }

  const openPanel = () => {
    if (isOpen) return;

    previouslyFocused = document.activeElement;
    isOpen = true;
    orbShiftX = 0;
    orbShiftY = 0;
    scrollDrift = 0;
    focusFirstElement();
  };

  const closePanel = (focusLauncher = false) => {
    if (!isOpen) return;

    isOpen = false;

    const target =
      focusLauncher && launcherEl
        ? launcherEl
        : previouslyFocused instanceof HTMLElement
        ? previouslyFocused
        : null;

    if (target) {
      target.focus();
    }

    previouslyFocused = null;
  };

  const toggle = () => {
    if (isOpen) {
      closePanel(true);
    } else {
      openPanel();
    }
  };

  /**
   * @param {KeyboardEvent} event
   */
  const handlePanelKeydown = (event) => {
    if (event.key !== 'Tab') return;

    updateFocusableElements();
    if (!focusableEls.length) return;

    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
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

  const resetConversation = () => {
    requestToken += 1;
    loading = false;
    messages = [
      {
        sender: 'companion',
        text: profile.greeting
      }
    ];
    hasUserInteracted = false;
    focusInput();
  };

  /**
   * @param {PointerEvent} event
   */
  const handlePointerMove = (event) => {
    if (isOpen || isHoveringOrb || typeof window === 'undefined') return;

    const { innerWidth, innerHeight } = window;
    if (!innerWidth || !innerHeight) return;

    const normalizedX = event.clientX / innerWidth - 0.5;
    const normalizedY = event.clientY / innerHeight - 0.5;

    orbShiftX = normalizedX * 18;
    orbShiftY = normalizedY * 14;
  };

  const handleScroll = () => {
    if (isOpen || typeof window === 'undefined') return;

    const { innerHeight, scrollY } = window;
    if (!innerHeight) return;

    const ratio = Math.max(-1, Math.min(1, scrollY / innerHeight));
    scrollDrift = ratio * 12;
  };

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || loading) return;

    addMessage('user', trimmed);
    input = '';
    loading = true;
    hasUserInteracted = true;

    const conversation = messages.slice(-10).map((message) => ({
      sender: message.sender,
      text: message.text
    }));
    const token = ++requestToken;
    let reply = matchKnowledgeBase(currentLocale, trimmed);
    const startedAt = Date.now();

    try {
      const response = await fetch('/api/companion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locale: currentLocale,
          messages: conversation
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof data.reply === 'string' && data.reply.trim()) {
          reply = data.reply.trim();
        }
      }
    } catch (error) {
      // use knowledge base fallback
    }

    const elapsed = Date.now() - startedAt;
    if (profile.latency > elapsed) {
      await new Promise((resolve) => setTimeout(resolve, profile.latency - elapsed));
    }

    if (token !== requestToken) {
      loading = false;
      return;
    }

    addMessage('companion', reply);
    loading = false;
    focusInput();
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
    focusInput();
  };

  const handleOrbEnter = () => {
    isHoveringOrb = true;
  };

  const handleOrbLeave = () => {
    isHoveringOrb = false;
  };

  $: orbStyle = `--orb-shift-x: ${orbShiftX.toFixed(2)}px; --orb-shift-y: ${orbShiftY.toFixed(
    2
  )}px; --orb-scroll: ${scrollDrift.toFixed(2)}px;`;
</script>


<div
  class="companion"
  aria-live="polite"
  class:companion--floating={!isOpen && !isHoveringOrb}
  class:companion--engaged={hasUserInteracted}
>
  <button
    class="orb"
    style={orbStyle}
    bind:this={launcherEl}
    on:click={toggle}
    on:mouseenter={handleOrbEnter}
    on:mouseleave={handleOrbLeave}
    aria-haspopup="dialog"
    aria-label={isOpen ? profile.actions.hide : profile.actions.open}
    aria-expanded={isOpen}
  >
    <span class="orb__halo"></span>
    <span class="orb__glow"></span>
    <span class="orb__core"></span>
  </button>

  {#if isOpen}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <section
      class="panel"
      role="dialog"
      aria-modal="true"
      aria-label={profile.dialogLabel}
      bind:this={panelEl}
      tabindex="-1"
      on:keydown={handlePanelKeydown}
    >
      <header class="panel__header">
        <div class="panel__identity">
          <div class="panel__avatar"></div>
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.role}</p>
          </div>
        </div>
        <button class="close" on:click={() => closePanel(true)} aria-label={profile.actions.closePanel}>
          ✕
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

        <div class="panel__body-actions">
          <div class="suggestions" aria-label={profile.actions.suggestionLabel}>
            {#each suggestions as suggestion}
              <button type="button" on:click={() => chooseSuggestion(suggestion.prompt)}>
                <span>{suggestion.title}</span>
              </button>
            {/each}
          </div>
          <button type="button" class="reset" on:click={resetConversation}>
            {profile.actions.reset}
          </button>
        </div>
      </div>

      <form class="panel__input" on:submit|preventDefault={sendMessage} aria-label={profile.actions.formLabel}>
        <textarea
          bind:this={inputEl}
          bind:value={input}
          placeholder={profile.placeholder}
          rows="2"
          on:keydown={handleKeydown}
        />
        <button type="submit" class="send" disabled={loading || !input.trim()}>
          {profile.actions.send}
        </button>
      </form>
    </section>
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
    transform: translate3d(0, 0, 0);
    will-change: transform;
  }

  .companion--floating {
    animation: float 26s var(--ease-in-out) infinite alternate;
  }

  .companion--engaged {
    gap: 1.25rem;
  }

  .orb {
    position: relative;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
    padding: 0;
    transform: translate3d(
      calc(var(--orb-shift-x, 0px)),
      calc(var(--orb-shift-y, 0px) + var(--orb-scroll, 0px)),
      0
    );
    transition: transform var(--duration-slow) var(--ease-out);
  }

  .companion--floating .orb {
    transition-duration: var(--duration-slower);
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
    opacity: 0.7;
  }

  .orb__glow {
    position: absolute;
    inset: -18%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(var(--voyage-blue-rgb), 0.32), rgba(19, 81, 255, 0));
    filter: blur(18px);
    opacity: 0.82;
    animation: pulse 4.5s var(--ease-in-out) infinite;
  }

  .orb__core {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(var(--signal-yellow-rgb), 0.24), rgba(var(--aurora-purple-rgb), 0.68));
    box-shadow: 0 0 24px rgba(var(--voyage-blue-rgb), 0.45), 0 0 64px rgba(106, 56, 255, 0.32);
    transition: transform var(--duration-normal) var(--ease-spring), box-shadow var(--duration-normal) var(--ease-out),
      opacity var(--duration-normal) var(--ease-out);
    opacity: 0.86;
  }

  .orb:hover .orb__core,
  .orb:focus-visible .orb__core {
    transform: scale(1.06);
    box-shadow: 0 0 32px rgba(var(--voyage-blue-rgb), 0.58), 0 0 72px rgba(106, 56, 255, 0.42);
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

  .panel__body-actions {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    align-items: flex-start;
  }

  .panel__body-actions .suggestions {
    width: 100%;
  }

  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .reset {
    align-self: flex-end;
    background: transparent;
    border: none;
    color: rgba(244, 247, 255, 0.7);
    font-size: 0.78rem;
    padding: 0;
    cursor: pointer;
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
  }

  .reset:hover,
  .reset:focus-visible {
    color: rgba(244, 247, 255, 0.95);
    text-decoration: underline;
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

  @keyframes float {
    0% {
      transform: translate3d(0, 0, 0);
    }

    25% {
      transform: translate3d(-10px, -8px, 0);
    }

    50% {
      transform: translate3d(6px, -14px, 0);
    }

    75% {
      transform: translate3d(-6px, -4px, 0);
    }

    100% {
      transform: translate3d(4px, 8px, 0);
    }
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
    .companion--floating {
      animation: none;
    }

    .orb {
      transform: translate3d(0, 0, 0);
      transition-duration: var(--duration-fast);
    }

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
