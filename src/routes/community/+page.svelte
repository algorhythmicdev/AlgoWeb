<script>
  // @ts-nocheck
  import { _, json } from 'svelte-i18n';
  import { Icon } from '$lib/components';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import { voting } from '$stores/voting';
  import { staggerReveal, tilt, particleExplode, sparkleTrail, ripple, magnetic } from '$utils/animations';
  import Toast from '$components/toast.svelte';
  import en from '$lib/i18n/en.json';

  const fallbackHeroPhrases = Array.isArray(en.community?.hero_rotating)
    ? en.community.hero_rotating
    : [en.community.hero_subtitle];

  /**
   * @param {unknown} value
   * @returns {ReadonlyArray<string>}
   */
  const ensureStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length)
      ? /** @type {string[]} */ (value)
      : fallbackHeroPhrases;

  let heroPhrases = fallbackHeroPhrases;
  $: heroPhrases = ensureStringArray($json?.('community.hero_rotating'));
  $: heroHeadlinePhrases = [$_('community.hero_title'), ...heroPhrases]
    .filter((value, index, array) => typeof value === 'string' && value.trim().length && array.indexOf(value) === index);

  
  let features = [
    { id: 'ai-trip-optimizer', votes: 127, product: 'nodevoyage' },
    { id: 'team-collaboration-board', votes: 98, product: 'nodevoyage' },
    { id: 'revenue-forecasting-ai', votes: 156, product: 'ideonautix' },
    { id: 'ar-navigation-mode', votes: 203, product: 'nodevoyage' },
    { id: 'pitch-deck-analyzer', votes: 89, product: 'ideonautix' },
    { id: 'offline-maps-pro', votes: 167, product: 'nodevoyage' },
    { id: 'social-travel-feed', votes: 142, product: 'nodevoyage' },
    { id: 'budget-tracker', votes: 178, product: 'nodevoyage' }
  ];
  
  let newIdeaText = '';
  let showToast = false;
  let toastMessage = '';
  let toastType = 'success';
  
  $: sortedFeatures = [...features].sort((a, b) => b.votes - a.votes);
  
  function handleVote(featureId) {
    voting.vote(featureId);
    
    const feature = features.find(f => f.id === featureId);
    const featureName = $_(`community.features.${feature.id}.name`);
    if ($voting[featureId]) {
      feature.votes++;
      toastMessage = $_('community.toast_voted', { values: { feature: featureName } });
    } else {
      feature.votes--;
      toastMessage = $_('community.toast_removed', { values: { feature: featureName } });
    }
    toastType = 'success';
    showToast = true;
    
    features = features; // Trigger reactivity
  }
  
  function submitIdea() {
    if (!newIdeaText.trim()) {
      toastMessage = $_('community.ideas_error_empty');
      toastType = 'error';
      showToast = true;
      return;
    }

    // In production, this would send to backend
    toastMessage = $_('community.ideas_success');
    toastType = 'success';
    showToast = true;
    newIdeaText = '';
  }
</script>

<svelte:head>
  <title>{$_('community.meta_title')}</title>
</svelte:head>

{#if showToast}
  <Toast message={toastMessage} type={toastType} onClose={() => showToast = false} />
{/if}

<!-- Hero -->
<HeroWrapper
  class="hero hero--community hero--centered community-hero"
  showAside={false}
  introReveal={{ delay: 60, stagger: 120 }}
>
  <svelte:fragment slot="backdrop">
    <div class="community-hero__mesh" aria-hidden="true">
      <span class="mesh-ring mesh-ring--one"></span>
      <span class="mesh-ring mesh-ring--two"></span>
      <span class="mesh-orb mesh-orb--one"></span>
      <span class="mesh-orb mesh-orb--two"></span>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="title">
    <h1 class="community-hero__title">{$_('community.hero_title')}</h1>
  </svelte:fragment>

  <svelte:fragment slot="lead">
    <div class="community-hero__headline">
      <AnimatedHeadline variant="slide" phrases={heroHeadlinePhrases} holdDuration={2600} />
    </div>
  </svelte:fragment>

  <svelte:fragment slot="description">
    <p class="community-hero__description">{$_('community.hero_subtitle')}</p>
  </svelte:fragment>
</HeroWrapper>

<!-- Voting Section -->
<section class="voting-section">
  <div class="container">
    <h2 class="section-title">{$_('community.voting_title')}</h2>
    <p class="section-subtitle">{$_('community.voting_subtitle')}</p>
    
    <div
      class="features-grid"
      use:staggerReveal={{ delay: 100 }}
      role="list"
      aria-label={$_('community.voting_list_aria')}
    >
      {#each sortedFeatures as feature (feature.id)}
        <div class="feature-card os-window" use:tilt={{ max: 3, scale: 1.01 }} role="listitem">
          <div class="feature-header">
            <span
              class="category-badge"
              aria-label={$_('community.category_aria', {
                values: {
                  category: $_(`community.categories.${feature.product}`)
                }
              })}
            >
              {$_(`community.categories.${feature.product}`)}
            </span>
            <span
              class="vote-count"
              aria-label={$_('community.vote_count', { values: { count: feature.votes } })}
            >
              {feature.votes}
            </span>
          </div>

          <h3 class="feature-name">{$_(`community.features.${feature.id}.name`)}</h3>
          <p class="feature-description">{$_(`community.features.${feature.id}.description`)}</p>

          <button
            class="vote-button"
            class:voted={$voting[feature.id]}
            on:click={() => handleVote(feature.id)}
            use:particleExplode
            use:ripple
            use:magnetic
            aria-pressed={$voting[feature.id]}
            aria-label={$_('community.vote_for', { values: { feature: $_(`community.features.${feature.id}.name`) } })}
          >
            {#if $voting[feature.id]}
              <span class="vote-icon" aria-hidden="true">
                <Icon name="check" size={16} />
              </span>
              <span>{$_('community.voted_button')}</span>
            {:else}
              <span>{$_('community.vote_button')}</span>
            {/if}
          </button>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Submit Idea -->
<section class="idea-section">
  <div class="container">
    <div class="idea-card os-window">
      <h2>{$_('community.ideas_title')}</h2>
      <div class="idea-form">
        <textarea 
          bind:value={newIdeaText}
          placeholder={$_('community.ideas_placeholder')}
          rows="4"
          aria-label={$_('community.ideas_aria_label')}
          aria-describedby="idea-help"
        ></textarea>
        <div id="idea-help" class="sr-only">{$_('community.ideas_helper')}</div>
        <button
          class="btn btn-primary btn-lg"
          on:click={submitIdea}
          use:particleExplode
          use:ripple
          use:magnetic
          use:sparkleTrail
        >
          {$_('community.ideas_submit')}
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  :global(.hero--community) {
    --hero-padding-block-start: clamp(6rem, 14vw, 8rem);
    --hero-padding-block-end: clamp(3.5rem, 10vw, 5.2rem);
    --hero-shell-columns: minmax(0, 1fr);
    --hero-shell-gap: clamp(2rem, 4vw, 2.6rem);
    --hero-intro-gap: clamp(1.2rem, 3vw, 1.8rem);
    --hero-backdrop-inset: -40% -15% auto;
    --hero-backdrop-height: clamp(18rem, 32vw, 24rem);
    --hero-backdrop-gradient: radial-gradient(circle at center, rgba(19, 81, 255, 0.22), transparent 70%);
    --hero-backdrop-opacity: 0.35;
    --hero-backdrop-opacity-light: 0.42;
    --hero-backdrop-opacity-dark: 0.28;
    overflow: hidden;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }

  :global(.community-hero)::before {
    content: '';
    position: absolute;
    inset: -40% -15% auto;
    height: clamp(18rem, 32vw, 24rem);
    background: radial-gradient(circle at center, var(--hero-glow-primary), transparent 70%);
    filter: blur(140px);
    opacity: 0.7;
    pointer-events: none;
  }

  .community-hero__title {
    margin: 0;
    text-align: center;
    font-size: clamp(2.4rem, 6vw, 3.4rem);
    letter-spacing: -0.02em;
    color: var(--heading-color);
  }

  .community-hero__headline {
    position: relative;
    display: inline-flex;
    justify-content: center;
    margin: clamp(1.2rem, 2.8vw, 1.8rem) auto 0;
    padding: clamp(0.6rem, 2vw, 0.95rem) clamp(1.25rem, 3vw, 1.85rem);
    border-radius: clamp(2.4rem, 5vw, 3.6rem);
    max-width: min(100%, 52ch);
    text-align: center;
    background: linear-gradient(126deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.45);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32), 0 24px 55px rgba(10, 22, 44, 0.22);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .community-hero__headline :global(.animated-headline) {
    width: 100%;
  }

  .community-hero__description {
    margin: 0;
    max-width: 56ch;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.35rem);
    text-align: center;
  }

  :global([data-base-theme='dark']) .community-hero__headline {
    background: linear-gradient(126deg, rgba(24, 32, 56, 0.82), rgba(24, 32, 56, 0.56));
    box-shadow: inset 0 0 0 1px rgba(120, 146, 220, 0.38), 0 24px 55px rgba(4, 12, 26, 0.42);
  }

  :global([data-theme='contrast']) .community-hero__headline {
    background: linear-gradient(126deg, rgba(0, 0, 0, 0.92), rgba(0, 0, 0, 0.72));
    box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.85);
  }

  .community-hero__mesh {
    position: absolute;
    inset: -10% -20% auto;
    height: clamp(22rem, 36vw, 28rem);
    pointer-events: none;
    overflow: hidden;
    z-index: -1;
  }

  .mesh-ring {
    position: absolute;
    inset: 10% 20%;
    border-radius: 50%;
    border: 1.5px solid var(--hero-ring-border);
    filter: blur(0.4px);
    animation: meshOrbit 28s linear infinite;
  }

  .mesh-ring::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 1px dashed var(--hero-ring-dash);
    mix-blend-mode: var(--hero-overlay-blend);
  }

  .mesh-ring--one {
    animation-duration: 32s;
    animation-direction: alternate;
  }

  .mesh-ring--two {
    inset: 0 12%;
    animation-duration: 26s;
    animation-direction: alternate-reverse;
  }

  .mesh-orb {
    position: absolute;
    width: clamp(160px, 26vw, 220px);
    height: clamp(160px, 26vw, 220px);
    border-radius: 50%;
    background: var(--gradient-spectrum-2);
    filter: blur(60px);
    opacity: var(--hero-orb-opacity);
    animation: meshPulse 20s ease-in-out infinite;
  }

  .mesh-orb--one {
    top: -30%;
    left: 12%;
  }

  .mesh-orb--two {
    bottom: -38%;
    right: 18%;
    background: var(--gradient-spectrum-3);
    animation-delay: -8s;
  }

  @keyframes meshOrbit {
    0% {
      transform: rotate(0deg) scale(0.96);
      opacity: 0.5;
    }
    50% {
      transform: rotate(180deg) scale(1.02);
      opacity: 0.75;
    }
    100% {
      transform: rotate(360deg) scale(0.96);
      opacity: 0.5;
    }
  }

  @keyframes meshPulse {
    0%, 100% {
      transform: translate3d(-6%, -4%, 0) scale(0.9);
    }
    50% {
      transform: translate3d(4%, 6%, 0) scale(1.05);
    }
  }

  :global(.hero--community h1) {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-top: 0.75rem;
  }

  .voting-section {
    padding: clamp(6rem, 14vw, 8rem) 0;
    position: relative;
    overflow: hidden;
  }

  .voting-section::before {
    content: '';
    position: absolute;
    inset: -35% -25% auto;
    height: clamp(18rem, 32vw, 26rem);
    background: radial-gradient(circle at 70% 40%, var(--hero-glow-secondary), transparent 70%);
    filter: blur(140px);
    opacity: 0.6;
    pointer-events: none;
  }

  .section-title { text-align: center; }
  .section-subtitle { text-align: center; color: var(--text-secondary); margin-top: 0.5rem; }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: clamp(2rem, 5vw, 3.2rem);
    margin-top: clamp(3rem, 6vw, 4.5rem);
  }

  .feature-card {
    display: grid;
    gap: clamp(1rem, 2.6vw, 1.6rem);
    padding: clamp(2rem, 4vw, 2.8rem);
    position: relative;
    border-radius: var(--radius-2xl);
    transition: transform var(--duration-normal) var(--ease-out), box-shadow var(--duration-normal) var(--ease-out);
  }

  .feature-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.12), rgba(var(--accent-secondary-rgb), 0.1));
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
    pointer-events: none;
  }

  .feature-card:hover::before {
    opacity: 1;
  }

  .feature-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }

  .feature-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .category-badge {
    padding: 0.4rem 0.9rem;
    border-radius: var(--radius-full);
    background: rgba(19, 81, 255, 0.08);
    border: 1px solid rgba(19, 81, 255, 0.18);
    color: var(--voyage-blue);
    font-size: var(--text-small);
  }

  .vote-count {
    font-size: var(--text-title);
    font-weight: var(--weight-semibold);
    color: var(--voyage-blue);
  }

  .feature-name { font-size: var(--text-headline); }
  .feature-description { color: var(--text-secondary); line-height: var(--leading-relaxed); }

  .vote-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    justify-self: flex-start;
    padding: 0.9rem 1.4rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(19, 81, 255, 0.22);
    background: var(--bg-surface);
    background: color-mix(in srgb, var(--voyage-blue) 6%, transparent);
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
    transition: all var(--duration-fast) var(--ease-out);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(18px);
  }

  .vote-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: var(--gradient-primary);
    transition: left 0.3s ease;
    z-index: -1;
  }

  .vote-button:hover::before {
    left: 0;
  }

  .vote-button:hover {
    border-color: transparent;
    color: var(--pure-white);
    transform: scale(1.05);
  }

  .vote-button.voted {
    background: var(--gradient-primary);
    border-color: transparent;
    color: var(--pure-white);
  }

  .vote-icon {
    display: inline-flex;
  }

  .idea-section { padding: clamp(5rem, 12vw, 7rem) 0 clamp(6rem, 14vw, 8rem); }

  .idea-card {
    max-width: 640px;
    margin: 0 auto;
    padding: clamp(2.4rem, 5vw, 3.2rem);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.55);
    background: var(--bg-surface);
    background: var(--surface-glass);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
  }

  .idea-form {
    margin-top: var(--space-4);
    display: grid;
    gap: clamp(1.2rem, 3vw, 1.8rem);
  }

  .idea-form textarea {
    width: 100%;
    padding: clamp(1.2rem, 3vw, 1.6rem);
    border-radius: var(--radius-xl);
    border: 1px solid rgba(19, 81, 255, 0.16);
    background: var(--bg-surface);
    font-family: inherit;
    font-size: var(--text-body);
    transition: border-color var(--duration-fast) var(--ease-out);
  }

  .idea-form textarea:focus {
    outline: none;
    border-color: var(--voyage-blue);
  }

  @media (max-width: 768px) {
    :global(.hero--community) {
      --hero-padding-block-start: var(--space-12);
      --hero-padding-block-end: var(--space-6);
    }
    .features-grid { grid-template-columns: 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .mesh-ring,
    .mesh-orb {
      animation: none;
    }
  }
</style>



















