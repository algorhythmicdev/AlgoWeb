<script>
  import { _ } from 'svelte-i18n';
  import foundersData from '$data/founders.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';
</script>

<section class="founders section" id="founders" use:revealOnScroll>
  <div class="container">
    <h2 class="section-title text-center">{$_('founders.title')}</h2>
    <p class="section-subtitle text-center">{$_('founders.subtitle')}</p>

    <!-- Airy two-column layout with emphasis on story over dense blocks -->
    <div class="founders-grid" use:staggerReveal={{ delay: 80, stagger: 140 }}>
      <!-- Slaff Card - Featured on left for balance -->
      <article class="founder-card featured" aria-labelledby="slaff-name">
        <div class="avatar">
          <img src={foundersData.slaff.avatar} alt={foundersData.slaff.name} />
        </div>
        <h3 id="slaff-name">{foundersData.slaff.name}</h3>
        <p class="role">{$_('founders.slaff.role')}</p>
        
        <div class="current-position">
          <h4>{$_('founders.slaff.current_title')}</h4>
          <p class="position-title">{$_('founders.slaff.position')}</p>
        </div>

        <ul class="achievements" aria-label="{$_('founders.slaff.current_title')}">
          <li>{$_('founders.slaff.achievement1')}</li>
          <li>{$_('founders.slaff.achievement2')}</li>
          <li>{$_('founders.slaff.achievement3')}</li>
          <li>{$_('founders.slaff.achievement4')}</li>
        </ul>

        <blockquote class="philosophy">
          <p>{$_('founders.slaff.philosophy')}</p>
        </blockquote>

        <div class="algorhythmics-vision">
          <h4>{$_('founders.slaff.algorhythmics_title')}</h4>
          <p>{$_('founders.slaff.algorhythmics_vision')}</p>
        </div>

        <div class="brand-experience">
          <h4>{$_('founders.slaff.brand_title')}</h4>
          <p class="brand-intro">{$_('founders.slaff.brand_intro')}</p>
          <div class="brand-logos">
            {#each foundersData.slaff.brandExperience.clients as client}
              <div class="brand-logo" title={client.name}>
                <img src={client.logo} alt={client.name} />
              </div>
            {/each}
          </div>
          <p class="brand-context">{$_('founders.slaff.brand_context')}</p>
        </div>
      </article>

      <!-- Nikita Card - Light, simplified and airy -->
      <article class="founder-card" aria-labelledby="nikita-name">
        <div class="avatar">
          <img src={foundersData.nikita.avatar} alt={foundersData.nikita.name} />
        </div>
        <h3 id="nikita-name">{foundersData.nikita.name}</h3>
        <p class="role">{$_('founders.nikita.role')}</p>
        <p class="bio">{$_('founders.nikita.bio')}</p>

        {#if foundersData.nikita.currentPosition}
          <div class="current-position">
            <h4>{$_('founders.nikita.current_title')}</h4>
            <p class="position-title">{foundersData.nikita.currentPosition.title} @ {foundersData.nikita.currentPosition.company}</p>
          </div>
        {/if}

        {#if foundersData.nikita.brandExperience}
          <div class="brand-logos minimal" aria-label="Brand experience">
            {#each foundersData.nikita.brandExperience.clients.slice(0,6) as client}
              <img class="brand-icon" src={client.logo} alt={client.name} />
            {/each}
          </div>
        {/if}

        <ul class="expertise compact" aria-label="Expertise">
          {#each foundersData.nikita.expertise as skill}
            <li>{skill}</li>
          {/each}
        </ul>
      </article>
    </div>
  </div>
</section>

<style>
  .section-title {
    font-size: var(--text-display);
    margin-bottom: var(--space-4);
  }
  
  .section-subtitle {
    font-size: var(--text-title);
    color: var(--text-secondary);
    margin-bottom: var(--space-12);
  }
  
  .founders-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(280px, 1fr));
    gap: var(--space-12);
    align-items: start;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .founder-card {
    padding: var(--space-8);
    background: var(--bg-surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    transition: all var(--duration-normal) var(--ease-out);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .founder-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
  }
  
  .founder-card.featured {
    background: linear-gradient(135deg, rgba(19, 81, 255, 0.03), rgba(106, 56, 255, 0.03));
    border: 2px solid var(--voyage-blue);
  }
  
  .avatar {
    width: 172px;
    height: 172px;
    margin: 0 auto var(--space-4);
    overflow: hidden;
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 46% 54% 44% 56%/42% 60% 40% 58%;
  }
  
  .founder-card h3 {
    font-size: var(--text-headline);
    text-align: center;
    margin-bottom: var(--space-2);
  }
  
  .role {
    text-align: center;
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-4);
  }
  
  .bio {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: var(--space-6);
    line-height: 1.6;
    font-size: var(--text-body);
  }
  
  .expertise {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .expertise li {
    padding: var(--space-2) var(--space-3);
    background: var(--bg-elevated);
    border-radius: var(--radius-md);
    font-size: var(--text-body);
  }
  
  .current-position,
  .brand-experience,
  .international,
  .algorhythmics-vision {
    margin-top: var(--space-6);
  }
  
  .current-position h4,
  .brand-experience h4,
  .international h4,
  .algorhythmics-vision h4 {
    font-size: var(--text-title);
    margin-bottom: var(--space-3);
    color: var(--voyage-blue);
  }
  
  .position-title {
    font-weight: var(--weight-semibold);
    margin-bottom: var(--space-3);
  }
  
  .achievements {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .achievements li::before {
    content: '✓ ';
    color: var(--voyage-blue);
    font-weight: var(--weight-bold);
    margin-right: var(--space-1);
  }
  
  .brand-intro {
    margin-bottom: var(--space-4);
    color: var(--text-secondary);
  }
  
  .brand-logos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--space-3);
    margin: var(--space-4) 0;
  }

  .brand-logos.minimal {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
    opacity: 0.8;
  }

  .brand-icon {
    filter: grayscale(1);
    opacity: 0.65;
  }
  
  .brand-logo {
    padding: var(--space-3);
    background: var(--bg-elevated);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--duration-normal) var(--ease-out);
  }
  
  .brand-logo img {
    max-width: 100%;
    height: auto;
    filter: grayscale(1);
    opacity: 0.6;
    transition: all var(--duration-normal) var(--ease-out);
  }
  
  .brand-logo:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }
  
  .brand-logo:hover img {
    filter: grayscale(0);
    opacity: 1;
  }
  
  .brand-context {
    font-size: var(--text-small);
    color: var(--text-secondary);
    font-style: italic;
  }
  
  .expo-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .expo-item {
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;
    padding: var(--space-3);
    background: var(--bg-elevated);
    border-radius: var(--radius-md);
  }
  
  .flag {
    font-size: var(--text-headline);
  }
  
  .expo-item p {
    font-size: var(--text-small);
    color: var(--text-secondary);
    margin-top: var(--space-1);
  }
  
  .philosophy {
    margin: var(--space-6) 0;
    padding: var(--space-4);
    background: var(--glass-bg);
    border-left: 4px solid var(--voyage-blue);
    border-radius: var(--radius-md);
    font-style: italic;
    color: var(--text-secondary);
  }
  
  @media (max-width: 960px) {
    .founders-grid {
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }
  }

  @media (max-width: 768px) {
    .founder-card {
      padding: var(--space-6);
    }
    .avatar { width: 140px; height: 140px; margin-bottom: var(--space-3); }
    .founder-card h3 { font-size: var(--text-title); }
    .brand-logos { grid-template-columns: repeat(2, 1fr); gap: var(--space-2); }
    .current-position h4,
    .brand-experience h4,
    .international h4,
    .algorhythmics-vision h4 { font-size: var(--text-body); margin-bottom: var(--space-2); }
  }
</style>
