<script lang="ts">
  import { browser } from '$app/environment';
  import { afterUpdate, onDestroy, onMount, tick } from 'svelte';
  import { locale } from 'svelte-i18n';
  import {
    DEFAULT_LOCALE,
    getProfile,
    isSupportedLocale,
    matchKnowledgeBase,
    type CompanionMessage,
    type CompanionProfile,
    type SupportedLocale
  } from '$lib/memory/companionProfiles';

  const STORAGE_KEY = 'algoweb:lumen:memory';
  const FOCUSABLE_SELECTOR =
    'button, [href], textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const MAX_PERSISTED_MESSAGES = 24;
  const MAX_CONTEXT_MESSAGES = 10;

  let isOpen = false;
  let input = '';
  let loading = false;
  let hasUserInteracted = false;
  let currentLocale: SupportedLocale = DEFAULT_LOCALE;
  let profile: CompanionProfile = getProfile(DEFAULT_LOCALE);
  let suggestions = profile.suggestions;
  let messages: CompanionMessage[] = [{ sender: 'companion', text: profile.greeting }];

  let inputEl: HTMLTextAreaElement | null = null;
  let messagesEl: HTMLUListElement | null = null;
  let launcherEl: HTMLButtonElement | null = null;
  let panelEl: HTMLElement | null = null;
  let focusableEls: HTMLElement[] = [];
  let previouslyFocused: Element | null = null;

  let skipLocaleGreeting = false;
  let canPersist = false;
  let isHoveringOrb = false;
  let orbShiftX = 0;
  let orbShiftY = 0;
  let scrollDrift = 0;
  let requestToken = 0;

  let reduceMotion = false;
  let motionQuery: MediaQueryList | null = null;

  const detachFns: Array<() => void> = [];

  const unsubscribeLocale = locale.subscribe((value) => {
    const nextLocale = isSupportedLocale(value) ? value : DEFAULT_LOCALE;
    const changed = nextLocale !== currentLocale;

    currentLocale = nextLocale;
    profile = getProfile(nextLocale);
    suggestions = profile.suggestions;

    if (!changed) return;

    if (!hasUserInteracted && !skipLocaleGreeting) {
      messages = [{ sender: 'companion', text: profile.greeting }];
      return;
    }

    skipLocaleGreeting = false;
    messages = [
      ...messages,
      { sender: 'companion', text: profile.languageSwitch }
    ];
  });

  const stopMotionListener = () => {
    if (!motionQuery) return;
    motionQuery.removeEventListener('change', handleMotionPreference);
    motionQuery = null;
  };

  const handleMotionPreference = (event: MediaQueryList | MediaQueryListEvent) => {
    reduceMotion = event.matches;
  };

  const restoreFromStorage = () => {
    if (!browser) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const persisted = JSON.parse(raw);
      const storedLocale = persisted?.locale;
      const rawMessages = Array.isArray(persisted?.messages) ? persisted.messages : [];

      const cleaned: CompanionMessage[] = [];
      for (const entry of rawMessages) {
        if (
          entry &&
          typeof entry === 'object' &&
          (entry.sender === 'user' || entry.sender === 'companion') &&
          typeof entry.text === 'string'
        ) {
          cleaned.push({ sender: entry.sender, text: entry.text });
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

      if (cleaned.length) {
        messages = cleaned;
        hasUserInteracted =
          typeof persisted?.hasUserInteracted === 'boolean'
            ? persisted.hasUserInteracted
            : cleaned.some((entry) => entry.sender === 'user');
      }
    } catch (error) {
      // ignore
    }

    if (!messages.length) {
      messages = [{ sender: 'companion', text: profile.greeting }];
    }
  };

  const persist = () => {
    if (!canPersist || !browser) return;

    try {
      const snapshot = {
        locale: currentLocale,
        hasUserInteracted,
        messages: messages.slice(-MAX_PERSISTED_MESSAGES)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      // ignore
    }
  };

  const focusFirstElement = async () => {
    await tick();
    if (!panelEl) return;

    updateFocusableElements();
    const target = focusableEls[0] ?? panelEl;
    target?.focus();
  };

  const focusInput = async () => {
    await tick();
    inputEl?.focus();
  };

  const updateFocusableElements = () => {
    if (!panelEl) {
      focusableEls = [];
      return;
    }

    focusableEls = Array.from(
      panelEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((element) => !element.hasAttribute('disabled'));
  };

  const handlePanelKeydown = (event: KeyboardEvent) => {
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

  const trapFocusAction = (node: HTMLElement) => {
    const listener = (event: KeyboardEvent) => handlePanelKeydown(event);
    node.addEventListener('keydown', listener);

    return {
      destroy() {
        node.removeEventListener('keydown', listener);
      }
    };
  };

  const handleGlobalKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closePanel(true);
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (isOpen || isHoveringOrb || !browser || reduceMotion) return;

    const { innerWidth, innerHeight } = window;
    if (!innerWidth || !innerHeight) return;

    const normalizedX = event.clientX / innerWidth - 0.5;
    const normalizedY = event.clientY / innerHeight - 0.5;

    orbShiftX = normalizedX * 18;
    orbShiftY = normalizedY * 14;
  };

  const handleScroll = () => {
    if (isOpen || !browser || reduceMotion) return;

    const { innerHeight, scrollY } = window;
    if (!innerHeight) return;

    const ratio = Math.max(-1, Math.min(1, scrollY / innerHeight));
    scrollDrift = ratio * 12;
  };

  const addMessage = (sender: CompanionMessage['sender'], text: string) => {
    messages = [...messages, { sender, text }];
  };

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

    target?.focus();
    previouslyFocused = null;
  };

  const toggle = () => {
    if (isOpen) {
      closePanel(true);
    } else {
      openPanel();
    }
  };

  const resetConversation = () => {
    requestToken += 1;
    loading = false;
    messages = [{ sender: 'companion', text: profile.greeting }];
    hasUserInteracted = false;
    focusInput();
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    addMessage('user', trimmed);
    input = '';
    loading = true;
    hasUserInteracted = true;

    const conversation = messages.slice(-MAX_CONTEXT_MESSAGES).map((entry) => ({
      sender: entry.sender,
      text: entry.text
    }));
    const token = ++requestToken;

    let reply = matchKnowledgeBase(currentLocale, trimmed);
    const startedAt = Date.now();

    try {
      const response = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      // fall back to knowledge base
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

  const handleInputKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const chooseSuggestion = (prompt: string) => {
    input = prompt;
    focusInput();
  };

  const handleOrbEnter = () => {
    isHoveringOrb = true;
  };

  const handleOrbLeave = () => {
    isHoveringOrb = false;
  };

  onMount(() => {
    restoreFromStorage();

    if (browser) {
      window.addEventListener('keydown', handleGlobalKeydown);
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      detachFns.push(() => window.removeEventListener('keydown', handleGlobalKeydown));
      detachFns.push(() => window.removeEventListener('pointermove', handlePointerMove));
      detachFns.push(() => window.removeEventListener('scroll', handleScroll));

      motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      reduceMotion = motionQuery.matches;
      motionQuery.addEventListener('change', handleMotionPreference);
    }

    canPersist = true;

    return () => {
      detachFns.splice(0).forEach((cleanup) => cleanup());
      stopMotionListener();
    };
  });

  onDestroy(() => {
    unsubscribeLocale();
    detachFns.splice(0).forEach((cleanup) => cleanup());
    stopMotionListener();
  });

  afterUpdate(() => {
    if (!isOpen) return;

    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    updateFocusableElements();
  });

  $: persist();
  $: orbStyle = `--orb-shift-x: ${orbShiftX.toFixed(2)}px; --orb-shift-y: ${orbShiftY.toFixed(
    2
  )}px; --orb-scroll: ${scrollDrift.toFixed(2)}px;`;
</script>

<div
  class="companion"
  aria-live="polite"
  class:companion--floating={!isOpen && !isHoveringOrb && !reduceMotion}
  class:companion--engaged={hasUserInteracted}
  style={orbStyle}
>
  <button
    bind:this={launcherEl}
    class="orb"
    type="button"
    aria-pressed={isOpen}
    on:click={toggle}
    on:mouseenter={handleOrbEnter}
    on:mouseleave={handleOrbLeave}
    aria-label={isOpen ? profile.actions.hide : profile.actions.open}
  >
    <span class="orb__halo" aria-hidden="true"></span>
    <span class="orb__glow" aria-hidden="true"></span>
    <span class="orb__core" aria-hidden="true"></span>
  </button>

  {#if isOpen}
    <section
      bind:this={panelEl}
      class="panel"
      role="dialog"
      aria-modal="true"
      aria-label={profile.dialogLabel}
      tabindex="-1"
      use:trapFocusAction
    >
      <header class="panel__header">
        <div class="panel__identity">
          <div class="panel__avatar" aria-hidden="true">
            <span class="panel__avatar-glow"></span>
          </div>
          <div>
            <p class="panel__name">{profile.name}</p>
            <p class="panel__role">{profile.role}</p>
          </div>
        </div>
        <div class="panel__actions">
          <button type="button" class="panel__reset" on:click={resetConversation}>
            {profile.actions.reset}
          </button>
          <button type="button" class="panel__close" on:click={() => closePanel(true)}>
            <span aria-hidden="true">×</span>
            <span class="sr-only">{profile.actions.closePanel}</span>
          </button>
        </div>
      </header>

      <div class="panel__body">
        <h2 class="sr-only">{profile.actions.formLabel}</h2>
        <ul class="messages" bind:this={messagesEl}>
          {#each messages as message, index (index)}
            <li class={`message message--${message.sender}`}>
              <p>{message.text}</p>
            </li>
          {/each}
          {#if loading}
            <li class="message message--companion">
              <span class="typing" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
              <span class="sr-only">{profile.name} is responding…</span>
            </li>
          {/if}
        </ul>

        {#if suggestions.length}
          <div class="suggestions" aria-label={profile.actions.suggestionLabel}>
            {#each suggestions as suggestion (suggestion.prompt)}
              <button
                type="button"
                class="suggestion"
                on:click={() => chooseSuggestion(suggestion.prompt)}
              >
                <span class="suggestion__title">{suggestion.title}</span>
                <span class="suggestion__prompt">{suggestion.prompt}</span>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <form class="panel__form" on:submit|preventDefault={sendMessage}>
        <label class="sr-only" for="companion-input">{profile.actions.formLabel}</label>
        <textarea
          id="companion-input"
          bind:this={inputEl}
          bind:value={input}
          placeholder={profile.placeholder}
          rows="2"
          on:keydown={handleInputKeydown}
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
    transition: transform var(--duration-normal) var(--ease-spring),
      box-shadow var(--duration-normal) var(--ease-out),
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
    gap: 0.85rem;
  }

  .panel__avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    position: relative;
    background: radial-gradient(circle at 30% 30%, rgba(var(--signal-yellow-rgb), 0.4), rgba(var(--voyage-blue-rgb), 0.75));
    box-shadow: 0 0 14px rgba(var(--pure-white-rgb), 0.3);
    overflow: hidden;
  }

  .panel__avatar-glow {
    position: absolute;
    inset: -20%;
    background: radial-gradient(circle, rgba(var(--aurora-purple-rgb), 0.5), transparent 70%);
    opacity: 0.7;
  }

  .panel__name {
    font: var(--font-body-bold);
    margin: 0;
  }

  .panel__role {
    font: var(--font-small);
    margin: 0;
    opacity: 0.72;
  }

  .panel__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .panel__reset {
    color: var(--pure-white);
    background: transparent;
    border: none;
    font: var(--font-small);
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: rgba(255, 255, 255, 0.4);
    text-underline-offset: 0.25em;
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  .panel__reset:hover,
  .panel__reset:focus-visible {
    opacity: 0.8;
  }

  .panel__close {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.35);
    background: rgba(0, 0, 0, 0.2);
    color: var(--pure-white);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out);
  }

  .panel__close:hover,
  .panel__close:focus-visible {
    background: rgba(0, 0, 0, 0.35);
  }

  .panel__body {
    display: grid;
    grid-template-rows: 1fr auto;
    padding: 0 1.2rem 1.2rem;
    gap: 1rem;
  }

  .messages {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    max-height: min(320px, 45vh);
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .message {
    display: inline-flex;
    border-radius: var(--radius-lg);
    padding: 0.75rem 0.9rem;
    max-width: 100%;
    line-height: 1.4;
    background: rgba(255, 255, 255, 0.08);
    color: var(--pure-white);
  }

  .message--user {
    margin-left: auto;
    background: rgba(var(--voyage-blue-rgb), 0.38);
  }

  .typing {
    display: inline-flex;
    gap: 0.35rem;
  }

  .typing span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.65);
    animation: blink 1.2s infinite ease-in-out;
  }

  .typing span:nth-child(2) {
    animation-delay: 0.15s;
  }

  .typing span:nth-child(3) {
    animation-delay: 0.3s;
  }

  .suggestions {
    display: grid;
    gap: 0.6rem;
  }

  .suggestion {
    width: 100%;
    text-align: left;
    padding: 0.65rem 0.75rem;
    border-radius: var(--radius-md);
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    display: grid;
    gap: 0.3rem;
    transition: transform var(--duration-fast) var(--ease-out),
      border-color var(--duration-fast) var(--ease-out);
  }

  .suggestion:hover,
  .suggestion:focus-visible {
    transform: translateY(-1px);
    border-color: rgba(var(--voyage-blue-rgb), 0.45);
  }

  .suggestion__title {
    font: var(--font-body-bold);
    margin: 0;
  }

  .suggestion__prompt {
    font: var(--font-small);
    margin: 0;
    opacity: 0.76;
  }

  .panel__form {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    padding: 1rem 1.2rem 1.2rem;
    background: rgba(0, 0, 0, 0.25);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  textarea {
    resize: none;
    border-radius: var(--radius-lg);
    padding: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(0, 0, 0, 0.25);
    color: var(--pure-white);
    font: var(--font-body);
    min-height: 68px;
  }

  textarea::placeholder {
    color: rgba(255, 255, 255, 0.58);
  }

  textarea:focus-visible {
    outline: 2px solid rgba(var(--voyage-blue-rgb), 0.55);
    outline-offset: 2px;
  }

  .send {
    align-self: end;
    padding: 0.65rem 1.1rem;
    border-radius: var(--radius-lg);
    border: none;
    background: linear-gradient(135deg, rgba(var(--voyage-blue-rgb), 0.85), rgba(var(--aurora-purple-rgb), 0.85));
    color: var(--pure-white);
    font: var(--font-body-bold);
    cursor: pointer;
    transition: transform var(--duration-fast) var(--ease-out),
      opacity var(--duration-fast) var(--ease-out);
  }

  .send:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .send:not(:disabled):hover,
  .send:not(:disabled):focus-visible {
    transform: translateY(-1px);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  @keyframes float {
    0% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(-3px, -6px, 0);
    }
    100% {
      transform: translate3d(5px, 4px, 0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(0.96);
      opacity: 0.75;
    }
    50% {
      transform: scale(1.04);
      opacity: 1;
    }
  }

  @keyframes blink {
    0%,
    80%,
    100% {
      transform: translateY(0);
      opacity: 0.6;
    }
    40% {
      transform: translateY(-3px);
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    .panel {
      width: min(340px, calc(100vw - 1.5rem));
    }

    .panel__actions {
      gap: 0.5rem;
    }

    .panel__reset {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .companion {
      animation: none !important;
    }

    .orb,
    .send,
    .suggestion {
      transition: none !important;
    }

    .orb__glow,
    .typing span {
      animation: none !important;
    }
  }
</style>
