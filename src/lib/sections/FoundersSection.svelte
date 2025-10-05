<script>
  import { _, json } from 'svelte-i18n';
  import foundersData from '$data/founders.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  $: slaffAchievements = (() => {
    const value = $json?.('founders.slaff.achievements');
    return Array.isArray(value) ? value : [];
  })();

  $: nikitaExpertise = (() => {
    const value = $json?.('founders.nikita.expertise');
    return Array.isArray(value) ? value : [];
  })();
</script>

<section class="founders section" id="founders" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('founders.subtitle')}</span>
      <h2>{$_('founders.title')}</h2>
    </div>

    <div class="founders-grid" use:staggerReveal={{ delay: 80, stagger: 160 }}>
      <article class="founder-card focus">
        <header>
          <div class="avatar">
            <img src={foundersData.slaff.avatar} alt={$_('founders.slaff.name')} />
          </div>
          <div class="identity">
            <h3>{$_('founders.slaff.name')}</h3>
            <p class="role">{$_('founders.slaff.role')}</p>
            <span class="badge-pill">{$_('founders.slaff.position')}</span>
          </div>
        </header>

        <div class="bio">
          <p>{$_('founders.slaff.philosophy')}</p>
        </div>

        <div class="achievements">
          {#each slaffAchievements as item}
            <div class="achievement-item">{item}</div>
          {/each}
        </div>

        <div class="vision">
          <span class="kicker">{$_('founders.slaff.algorhythmics_title')}</span>
          <p>{$_('founders.slaff.algorhythmics_vision')}</p>
        </div>

        <div class="brand-experience">
          <span class="kicker">{$_('founders.slaff.brand_title')}</span>
          <p>{$_('founders.slaff.brand_intro')}</p>
          <div class="brand-logos">
            {#each foundersData.slaff.brandExperience.clients as client}
              <div class="brand-logo" title={client.name}>
                <img src={client.logo} alt={client.name} />
              </div>
            {/each}
          </div>
          <p class="brand-note">{$_('founders.slaff.brand_context')}</p>
        </div>
      </article>

      <article class="founder-card">
        <header>
          <div class="avatar">
            <img src={foundersData.nikita.avatar} alt={$_('founders.nikita.name')} />
          </div>
          <div class="identity">
            <h3>{$_('founders.nikita.name')}</h3>
            <p class="role">{$_('founders.nikita.role')}</p>
          </div>
        </header>

        <div class="bio">
          <p>{$_('founders.nikita.bio')}</p>
        </div>

        <div class="current">
          <span class="kicker">{$_('founders.nikita.current_title')}</span>
          <p>{$_('founders.nikita.current_position')}</p>
        </div>

        <div class="expertise">
          {#each nikitaExpertise as skill}
            <span>{skill}</span>
          {/each}
        </div>

        <div class="brand-minimal">
          {#each foundersData.nikita.brandExperience.clients.slice(0, 6) as client}
            <img src={client.logo} alt={client.name} />
          {/each}
        </div>
      </article>
    </div>
  </div>
</section>

<style>
  .section-heading {
    display: grid;
    gap: 0.65rem;
    max-width: 720px;
    margin-bottom: var(--space-10);
  }

  .founders-grid {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  }

  .founder-card {
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    display: grid;
    gap: var(--space-4);
    box-shadow: var(--shadow-xs);
  }

  .founder-card.focus {
    box-shadow: var(--shadow-md);
    background: var(--bg-muted);
  }

  header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .avatar {
    width: 96px;
    height: 96px;
    border-radius: 32% 46% 38% 54% / 46% 42% 58% 54%;
    overflow: hidden;
    border: 1px solid rgba(15, 20, 25, 0.12);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .identity h3 {
    font-size: clamp(1.6rem, 2.8vw, 2.1rem);
  }

  .role {
    color: var(--text-secondary);
    font-weight: var(--weight-medium);
  }

  .bio p { color: var(--text-secondary); line-height: var(--leading-relaxed); }

  .achievements {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .achievement-item {
    padding: 0.6rem 0.9rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-subtle);
    font-size: var(--text-small);
    color: var(--text-secondary);
    background: var(--bg-surface);
  }

  .vision {
    display: grid;
    gap: 0.4rem;
  }

  .vision p { color: var(--text-secondary); }

  .brand-experience {
    display: grid;
    gap: var(--space-2);
  }

  .brand-logos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
    gap: 0.75rem;
  }

  .brand-logo {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--bg-surface);
    padding: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-logo img { max-width: 72px; filter: grayscale(1); opacity: 0.7; }

  .brand-note {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .current {
    display: grid;
    gap: 0.35rem;
  }

  .current p { color: var(--text-secondary); }

  .expertise {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .expertise span {
    padding: 0.45rem 0.8rem;
    border-radius: var(--radius-full);
    background: var(--bg-muted);
    border: 1px solid rgba(15, 20, 25, 0.08);
    font-size: var(--text-small);
  }

  .brand-minimal {
    margin-top: var(--space-2);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
    gap: 0.75rem;
    align-items: center;
  }

  .brand-minimal img { filter: grayscale(1); opacity: 0.65; }

  @media (max-width: 1080px) {
    .founders-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .founder-card { padding: var(--space-3); }
    header { flex-direction: column; align-items: flex-start; }
    .avatar { width: 80px; height: 80px; }
  }
</style>
