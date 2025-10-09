<script>
  // @ts-nocheck
  import { _, json } from 'svelte-i18n';
  import { Icon } from '$lib/components';
  import Hero from '$lib/components/Hero.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import MagneticTiltCard from '$lib/components/MagneticTiltCard.svelte';
  import { voting } from '$stores/voting';
  import Toast from '$components/toast.svelte';
  import en from '$lib/i18n/en.json';

  const fallbackHeroPhrases = Array.isArray(en.community?.hero_rotating)
    ? en.community.hero_rotating
    : [en.community.hero_subtitle];
  const fallbackHeroManifest = typeof en.community?.hero_manifest === 'string' ? en.community.hero_manifest : '';
  const fallbackHeroMetrics = Array.isArray(en.community?.metrics)
    ? en.community.metrics.filter(
        (entry) =>
          entry &&
          typeof entry === 'object' &&
          typeof entry.label === 'string' &&
          entry.label &&
          typeof entry.value === 'string' &&
          entry.value
      )
    : [
        { label: 'Contributors', value: '2.4k' },
        { label: 'Feature votes', value: '58k' },
        { label: 'Locales', value: '6 languages' }
      ];

  /**
   * @param {unknown} value
   * @returns {ReadonlyArray<string>}
   */
  const ensureStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length)
      ? /** @type {string[]} */ (value)
      : fallbackHeroPhrases;

  const ensureString = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback);

  /**
   * @param {unknown} value
   * @param {Array<{ label: string; value: string }>} fallback
   */
  const ensureMetrics = (value, fallback) => {
    if (!Array.isArray(value)) return fallback;
    const entries = value
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const label = ensureString(item.label);
        const metricValue = ensureString(item.value);
        if (!label || !metricValue) return null;
        return { label, value: metricValue };
      })
      .filter(Boolean);
    return entries.length ? /** @type {Array<{ label: string; value: string }>} */ (entries) : fallback;
  };

  let heroPhrases = fallbackHeroPhrases;
  $: heroPhrases = ensureStringArray($json?.('community.hero_rotating'));
  $: heroHeadlinePhrases = [$_('community.hero_title'), ...heroPhrases]
    .filter((value, index, array) => typeof value === 'string' && value.trim().length && array.indexOf(value) === index);

  let heroManifest = fallbackHeroManifest;
  $: heroManifest = ensureString($json?.('community.hero_manifest'), fallbackHeroManifest);

  let heroMetrics = fallbackHeroMetrics;
  $: heroMetrics = ensureMetrics($json?.('community.metrics'), fallbackHeroMetrics);

  const featureVariants = {
    nodevoyage: 'halo',
    ideonautix: 'grid'
  };

  
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
<Hero variant="particles" title={$_('community.hero_title')} subtitle={$_('community.hero_subtitle')}>
  <div class="community-hero">
    <div class="community-hero__headline">
      <AnimatedHeadline variant="slide" phrases={heroHeadlinePhrases} holdDuration={2600} />
    </div>

    {#if heroManifest}
      <div class="hero-highlights">
        <p class="community-hero__manifest" aria-live="polite">{heroManifest}</p>
      </div>
    {/if}

    {#if heroMetrics.length}
      <ul class="hero-metrics community-hero__metrics">
        {#each heroMetrics as metric (metric.label)}
          <li class="community-hero__metric glass-card">
            <span class="community-hero__metric-value">{metric.value}</span>
            <span class="community-hero__metric-label">{metric.label}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</Hero>

<!-- Voting Section -->
<section class="voting-section">
  <div class="container">
    <h2 class="section-title">{$_('community.voting_title')}</h2>
    <p class="section-subtitle">{$_('community.voting_subtitle')}</p>
    
    <div
      class="features-grid"
      role="list"
      aria-label={$_('community.voting_list_aria')}
    >
      {#each sortedFeatures as feature, index (feature.id)}
        <MagneticTiltCard
          class="feature-card"
          data-variant={featureVariants[feature.product]}
          role="listitem"
          staggerOptions={{ delay: 120 + index * 60 }}
        >
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
        </MagneticTiltCard>
      {/each}
    </div>
  </div>
</section>

<!-- Submit Idea -->
<section class="idea-section">
  <div class="container">
    <MagneticTiltCard class="idea-card" interactive={false}>
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
        >
          {$_('community.ideas_submit')}
        </button>
      </div>
    </MagneticTiltCard>
  </div>
</section>

<style>
  :global(.community-hero)::before {
    content: '';
    position: absolute;
    inset: -40% -15% auto;
    height: clamp(18rem, 32vw, 24rem);
    background: radial-gradient(circle at center, var(--hero-glow-primary), transparent 70%);
    filter: blur(140px);
    opacity: 0.68;
    pointer-events: none;
  }

  .community-hero {
    display: grid;
    justify-items: center;
    gap: clamp(1.4rem, 4vw, 2.2rem);
    text-align: center;
  }

  .community-hero :global(h1) {
    margin: 0;
    font-size: clamp(2.8rem, 6.5vw, 4rem);
    letter-spacing: -0.02em;
  }

  .community-hero__headline {
    position: relative;
    display: inline-flex;
    justify-content: center;
    margin-top: clamp(1.1rem, 3vw, 1.8rem);
    padding: clamp(0.65rem, 2vw, 0.95rem) clamp(1.2rem, 3vw, 1.85rem);
    border-radius: clamp(2.4rem, 5vw, 3.6rem);
    max-width: min(100%, 60ch);
    background: linear-gradient(128deg,
        color-mix(in srgb, var(--bg-elev-1) 82%, rgba(var(--voyage-blue-rgb), 0.28) 18%),
        color-mix(in srgb, var(--bg-elev-1) 78%, rgba(var(--aurora-purple-rgb), 0.22) 22%));
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.42) 60%, rgba(255, 255, 255, 0.4) 40%);
    box-shadow: 0 24px 55px rgba(10, 22, 44, 0.22);
    backdrop-filter: blur(18px);
  }

  .community-hero__headline :global(.animated-headline) {
    width: 100%;
  }

  .community-hero :global(p) {
    margin: 0;
    max-width: min(100%, 68ch);
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.35rem);
  }

  .community-hero__manifest {
    margin: 0;
    max-width: min(100%, 72ch);
    font-size: clamp(1rem, 2.2vw, 1.35rem);
    color: var(--text-secondary);
  }

  .community-hero__metrics {
    display: grid;
    width: 100%;
    gap: clamp(1rem, 2.4vw, 1.6rem);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    margin-top: clamp(2rem, 5vw, 3rem);
  }

  .community-hero__metric {
    display: grid;
    gap: 0.55rem;
    padding: clamp(1.1rem, 2.4vw, 1.7rem);
    text-align: left;
    border: 1px solid color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.34) 55%, rgba(255, 255, 255, 0.4) 45%);
    background: color-mix(in srgb, var(--bg-surface) 82%, rgba(var(--voyage-blue-rgb), 0.16) 18%);
    box-shadow: 0 18px 42px rgba(10, 22, 44, 0.12);
  }

  .community-hero__metric-value {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, var(--grad-a) 55%, var(--text) 45%);
  }

  .community-hero__metric-label {
    font-size: var(--text-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  .voting-section {
    padding: clamp(6rem, 14vw, 8rem) 0;
    position: relative;
  }

  .voting-section::before {
    content: '';
    position: absolute;
    inset: -35% -25% auto;
    height: clamp(18rem, 32vw, 26rem);
    background: radial-gradient(circle at 70% 40%, var(--hero-glow-primary), transparent 70%);
    filter: blur(140px);
    opacity: 0.55;
    pointer-events: none;
  }

  .section-title {
    margin: 0;
    text-align: center;
    font-size: clamp(2rem, 4vw, 2.8rem);
  }

  .section-subtitle {
    text-align: center;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.4vw, 1.35rem);
    line-height: var(--leading-relaxed);
    margin: 0.75rem auto 0;
    max-width: min(100%, 60ch);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(1.8rem, 4vw, 2.8rem);
    margin-top: clamp(2.8rem, 6vw, 4.5rem);
  }

  .features-grid :global(.feature-card) {
    display: grid;
    gap: clamp(1rem, 2.6vw, 1.6rem);
    padding: clamp(1.8rem, 4vw, 2.6rem);
    border-radius: var(--radius-2xl);
    position: relative;
    overflow: hidden;
  }

  .features-grid :global(.feature-card)::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg,
        color-mix(in srgb, var(--grad-a) 22%, transparent),
        color-mix(in srgb, var(--grad-b) 18%, transparent));
    opacity: 0;
    transition: opacity 220ms var(--ease-out-soft, cubic-bezier(0.25, 0.46, 0.45, 0.94));
    pointer-events: none;
  }

  .features-grid :global(.feature-card:hover)::before,
  .features-grid :global(.feature-card:focus-within)::before {
    opacity: 0.5;
  }

  .feature-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .category-badge {
    padding: 0.45rem 1rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--voyage) 18%, transparent);
    border: 1px solid color-mix(in srgb, var(--voyage) 32%, transparent);
    color: var(--voyage);
    font-size: var(--text-small);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .vote-count {
    font-size: clamp(1.45rem, 3vw, 1.9rem);
    font-weight: var(--weight-semibold);
    color: color-mix(in srgb, var(--grad-b) 52%, var(--text) 48%);
  }

  .feature-name {
    font-size: clamp(1.4rem, 3vw, 1.85rem);
  }

  .feature-description {
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  .vote-button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.85rem 1.35rem;
    border-radius: var(--radius-full);
    border: 1px solid color-mix(in srgb, var(--voyage) 32%, transparent);
    background: color-mix(in srgb, var(--bg-surface) 88%, rgba(var(--voyage-blue-rgb), 0.12) 12%);
    color: var(--text);
    font-weight: var(--weight-semibold);
    transition: transform 180ms var(--ease-out-soft, cubic-bezier(0.25, 0.46, 0.45, 0.94)),
      box-shadow 180ms var(--ease-out-soft, cubic-bezier(0.25, 0.46, 0.45, 0.94)),
      background-color 180ms var(--ease-out-soft, cubic-bezier(0.25, 0.46, 0.45, 0.94));
  }

  .vote-button:hover,
  .vote-button:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(19, 81, 255, 0.25);
    background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
    color: #fff;
  }

  .vote-button.voted {
    background: linear-gradient(135deg, var(--grad-a), var(--grad-b));
    color: #fff;
    box-shadow: 0 18px 36px rgba(19, 81, 255, 0.3);
  }

  .vote-icon {
    display: inline-flex;
  }

  .idea-section {
    padding: clamp(5rem, 12vw, 7rem) 0 clamp(6rem, 14vw, 8rem);
  }

  :global(.idea-card) {
    width: min(100%, 560px);
    margin: 0 auto;
    padding: clamp(2.2rem, 5vw, 3rem);
  }

  .idea-form {
    margin-top: clamp(1.4rem, 3vw, 2rem);
    display: grid;
    gap: clamp(1.1rem, 3vw, 1.6rem);
  }

  .idea-form textarea {
    width: 100%;
    padding: clamp(1.1rem, 3vw, 1.5rem);
    border-radius: var(--radius-xl);
    border: 1px solid color-mix(in srgb, var(--voyage) 22%, transparent);
    background: color-mix(in srgb, var(--bg-surface) 92%, rgba(var(--aurora-purple-rgb), 0.08) 8%);
    font-family: inherit;
    font-size: var(--text-body);
    color: var(--text);
    transition: border-color 160ms var(--ease-out-soft, cubic-bezier(0.25, 0.46, 0.45, 0.94));
  }

  .idea-form textarea:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--grad-a) 60%, var(--grad-b) 40%);
    outline-offset: 2px;
    border-color: transparent;
  }

  @media (max-width: 720px) {
    .community-hero__metrics {
      grid-template-columns: minmax(0, 1fr);
    }

    .features-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .community-hero__headline,
    .community-hero__metrics,
    .features-grid,
    :global(.idea-card) {
      transition: none;
    }

    .features-grid :global(.feature-card)::before,
    .vote-button,
    .idea-form textarea {
      transition: none;
    }
  }
</style>



















