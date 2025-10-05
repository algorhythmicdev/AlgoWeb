<script>
  // @ts-nocheck
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { voting } from '$stores/voting';
  import { staggerReveal, tilt, particleExplode, sparkleTrail, ripple, magnetic } from '$utils/animations';
  import Toast from '$components/toast.svelte';
  
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
  <title>{$_('community.hero_title')} - AlgoRhythmics</title>
</svelte:head>

{#if showToast}
  <Toast message={toastMessage} type={toastType} onClose={() => showToast = false} />
{/if}

<!-- Hero -->
<section class="community-hero">
  <div class="container">
    <span class="eyebrow">{$_('community.hero_title')}</span>
    <h1>{$_('community.hero_subtitle')}</h1>
  </div>
</section>

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
        <div class="feature-card" use:tilt={{ max: 3, scale: 1.01 }} role="listitem">
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
            {$voting[feature.id] ? '✓ ' + $_('community.voted_button') : $_('community.vote_button')}
          </button>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Submit Idea -->
<section class="idea-section">
  <div class="container">
    <div class="idea-card">
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
  .community-hero {
    padding: clamp(6rem, 14vw, 8rem) 0 clamp(3.5rem, 8vw, 5rem);
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .community-hero::before {
    content: '';
    position: absolute;
    inset: -40% -15% auto;
    height: clamp(18rem, 32vw, 24rem);
    background: radial-gradient(circle at center, rgba(19, 81, 255, 0.22), transparent 70%);
    filter: blur(140px);
    opacity: 0.7;
    pointer-events: none;
  }

  .community-hero h1 {
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
    background: radial-gradient(circle at 70% 40%, rgba(106, 56, 255, 0.18), transparent 70%);
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
    padding: clamp(2.2rem, 4vw, 2.8rem);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.55);
    background: var(--bg-surface);
    background: var(--surface-glass);
    display: grid;
    gap: clamp(1.2rem, 3vw, 1.6rem);
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(19, 81, 255, 0.1), transparent);
    transition: left 0.6s ease;
  }

  .feature-card:hover::before {
    left: 100%;
  }

  .feature-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }

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
    .community-hero { padding: var(--space-12) 0 var(--space-6); }
    .features-grid { grid-template-columns: 1fr; }
  }
</style>
