<script>
  import { _ } from 'svelte-i18n';
  import { onMount } from 'svelte';
  import { voting } from '$stores/voting';
  import { staggerReveal, tilt, particleExplode } from '$utils/animations';
  import Toast from '$components/Toast.svelte';
  
  let features = [
    { id: 'f1', name: 'AI Trip Optimizer', description: 'Automatically optimize routes based on time, budget, and preferences', votes: 127, category: 'NodeVoyage' },
    { id: 'f2', name: 'Team Collaboration Board', description: 'Real-time collaborative planning for group trips', votes: 98, category: 'NodeVoyage' },
    { id: 'f3', name: 'Revenue Forecasting AI', description: 'Predictive analytics for startup revenue projections', votes: 156, category: 'Ideonautix' },
    { id: 'f4', name: 'AR Navigation Mode', description: 'Augmented reality navigation for city exploration', votes: 203, category: 'NodeVoyage' },
    { id: 'f5', name: 'Pitch Deck Analyzer', description: 'AI-powered feedback on pitch presentations', votes: 89, category: 'Ideonautix' },
    { id: 'f6', name: 'Offline Maps Pro', description: 'Enhanced offline capabilities with 3D maps', votes: 167, category: 'NodeVoyage' },
    { id: 'f7', name: 'Social Travel Feed', description: 'Instagram-style feed for sharing travel moments', votes: 142, category: 'NodeVoyage' },
    { id: 'f8', name: 'Budget Tracker', description: 'Real-time expense tracking during trips', votes: 178, category: 'NodeVoyage' }
  ];
  
  let newIdeaText = '';
  let showToast = false;
  let toastMessage = '';
  let toastType = 'success';
  
  $: sortedFeatures = [...features].sort((a, b) => b.votes - a.votes);
  
  function handleVote(featureId) {
    voting.vote(featureId);
    
    const feature = features.find(f => f.id === featureId);
    if ($voting[featureId]) {
      feature.votes++;
      toastMessage = `Voted for "${feature.name}"!`;
    } else {
      feature.votes--;
      toastMessage = `Vote removed from "${feature.name}"`;
    }
    toastType = 'success';
    showToast = true;
    
    features = features; // Trigger reactivity
  }
  
  function submitIdea() {
    if (!newIdeaText.trim()) {
      toastMessage = 'Please enter your idea';
      toastType = 'error';
      showToast = true;
      return;
    }
    
    // In production, this would send to backend
    toastMessage = 'Thank you! Your idea has been submitted.';
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
    <h1 class="hero-title">{$_('community.hero_title')}</h1>
    <p class="hero-subtitle">{$_('community.hero_subtitle')}</p>
  </div>
</section>

<!-- Voting Section -->
<section class="voting-section">
  <div class="container">
    <h2 class="section-title">{$_('community.voting_title')}</h2>
    <p class="section-subtitle">{$_('community.voting_subtitle')}</p>
    
    <div class="features-grid" use:staggerReveal={{ delay: 100 }}>
      {#each sortedFeatures as feature (feature.id)}
        <div class="feature-card glass-card" use:tilt={{ max: 3 }}>
          <div class="feature-header">
            <span class="category-badge">{feature.category}</span>
            <div class="vote-count">{feature.votes}</div>
          </div>
          
          <h3 class="feature-name">{feature.name}</h3>
          <p class="feature-description">{feature.description}</p>
          
          <button 
            class="vote-button"
            class:voted={$voting[feature.id]}
            on:click={() => handleVote(feature.id)}
            use:particleExplode
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
    <div class="idea-card glass-card">
      <h2>{$_('community.ideas_title')}</h2>
      <div class="idea-form">
        <textarea 
          bind:value={newIdeaText}
          placeholder={$_('community.ideas_placeholder')}
          rows="4"
        ></textarea>
        <button 
          class="btn btn-primary btn-lg"
          on:click={submitIdea}
          use:particleExplode
        >
          {$_('community.ideas_submit')}
        </button>
      </div>
    </div>
  </div>
</section>

<style>
  .community-hero {
    padding: var(--space-20) 0 var(--space-8);
    text-align: center;
  }
  
  .hero-title {
    font-size: var(--text-mega);
    background: linear-gradient(135deg, var(--voyage-blue), var(--signal-yellow));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .voting-section {
    padding: var(--space-16) 0;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-8);
  }
  
  .feature-card {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
  }
  
  .feature-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }
  
  .category-badge {
    padding: var(--space-1) var(--space-3);
    background: rgba(19, 81, 255, 0.1);
    color: var(--voyage-blue);
    border-radius: var(--radius-full);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
  }
  
  .vote-count {
    font-size: var(--text-headline);
    font-weight: var(--weight-black);
    color: var(--signal-yellow);
  }
  
  .feature-name {
    font-size: var(--text-title);
    margin-bottom: var(--space-2);
  }
  
  .feature-description {
    color: var(--text-secondary);
    margin-bottom: var(--space-4);
    line-height: var(--leading-relaxed);
  }
  
  .vote-button {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    background: var(--voyage-blue);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-weight: var(--weight-semibold);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-out);
  }
  
  .vote-button:hover {
    background: var(--aurora-purple);
    transform: translateY(-2px);
  }
  
  .vote-button.voted {
    background: var(--signal-yellow);
    color: var(--ink);
  }
  
  .idea-section {
    padding: var(--space-16) 0;
  }
  
  .idea-card {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-8);
    border-radius: var(--radius-2xl);
    text-align: center;
  }
  
  .idea-form {
    margin-top: var(--space-6);
  }
  
  .idea-form textarea {
    width: 100%;
    padding: var(--space-4);
    background: var(--bg-elevated);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    font-size: var(--text-body);
    font-family: inherit;
    margin-bottom: var(--space-4);
    transition: all var(--duration-fast) var(--ease-out);
  }
  
  .idea-form textarea:focus {
    outline: none;
    border-color: var(--voyage-blue);
    box-shadow: 0 0 0 4px rgba(19, 81, 255, 0.1);
  }
</style>
