<script>
  import { _ } from 'svelte-i18n';
  import productsData from '$data/products.json';
  import timelineData from '$data/timeline.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  const upcomingMilestone = timelineData.milestones?.[0];
  const milestoneDate = upcomingMilestone
    ? new Date(`${upcomingMilestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : '';
</script>

<section class="hero section-lg">
  <div class="container hero-grid">
    <div class="hero-copy" use:revealOnScroll>
      <span class="eyebrow">{$_('hero.status')}</span>
      <h1 class="gradient-text">AlgoRhythmics</h1>
      <p class="hero-lead">{$_('hero.subtitle')}</p>

      <div class="hero-actions" role="group" aria-label="Primary actions">
        <a href="/products" class="btn btn-gradient">{$_('hero.cta_products')}</a>
        <a href="/consulting" class="btn btn-secondary hover-lift">{$_('hero.cta_consulting')}</a>
      </div>

      <div class="hero-meta" use:staggerReveal={{ stagger: 160 }}>
        <article class="meta-card">
          <header>
            <span class="kicker">{$_('products.nodevoyage.name')}</span>
            <span class="badge-pill">{$_('products.nodevoyage.status')}</span>
          </header>
          <p>{$_('nodevoyage.hero_description')}</p>
          <footer>{$_('products.nodevoyage.mvp')}</footer>
        </article>

        <article class="meta-card">
          <header>
            <span class="kicker">{$_('products.ideonautix.name')}</span>
            <span class="badge-pill">{$_('products.ideonautix.status')}</span>
          </header>
          <p>{$_('ideonautix.hero_description')}</p>
          <footer>{$_('products.ideonautix.mvp')}</footer>
        </article>
      </div>
    </div>

    <div class="hero-showcase" use:staggerReveal={{ delay: 140, stagger: 120 }}>
      <article class="showcase-card focus">
        <span class="kicker">{$_('story.reality_title')}</span>
        <h2>{$_('hero.title')}</h2>
        <p>{$_('story.reality_text')}</p>
      </article>

      <div class="showcase-stack">
        <article class="showcase-card">
          <span class="kicker">{$_('story.mission_title')}</span>
          <p>{$_('story.mission_text')}</p>
        </article>

        {#if upcomingMilestone}
          <article class="showcase-card milestone">
            <span class="kicker">{$_('hero.next_milestone')}</span>
            <h3>{$_(`timeline.milestones.${upcomingMilestone.id}.title`)}</h3>
            <p>{$_(`timeline.milestones.${upcomingMilestone.id}.description`)}</p>
            {#if $_(`timeline.milestones.${upcomingMilestone.id}.note`)}
              <p class="timeline-note">{$_(`timeline.milestones.${upcomingMilestone.id}.note`)}</p>
            {/if}
            <span class="milestone-date">{milestoneDate}</span>
          </article>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding-top: calc(var(--space-24) + 40px);
  }

  .hero-grid {
    display: grid;
    gap: var(--space-12);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .hero-lead {
    font-size: clamp(1.2rem, 2.4vw, 1.6rem);
    color: var(--text-secondary);
    max-width: 34rem;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    margin-top: var(--space-2);
  }

  .hero-meta {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-4);
  }

  .meta-card {
    padding: var(--space-3);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-surface);
    box-shadow: var(--shadow-xs);
    display: grid;
    gap: 0.6rem;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .meta-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  .meta-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .meta-card p {
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .meta-card footer {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .hero-showcase {
    display: grid;
    gap: var(--space-3);
  }

  .showcase-card {
    padding: var(--space-4);
    border-radius: var(--radius-xl);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    box-shadow: var(--shadow-sm);
    display: grid;
    gap: var(--space-2);
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .showcase-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .showcase-card.focus {
    background: var(--bg-muted);
    box-shadow: var(--shadow-md);
  }

  .showcase-card h2 {
    font-size: clamp(2rem, 4vw, 2.8rem);
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  .showcase-card p {
    color: var(--text-secondary);
    font-size: var(--text-body);
  }

  .showcase-stack {
    display: grid;
    gap: var(--space-3);
  }

  .milestone {
    position: relative;
    border-style: dashed;
  }

  .milestone h3 {
    font-size: clamp(1.4rem, 2.6vw, 1.8rem);
  }

  .milestone p {
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .milestone-date {
    font-size: var(--text-small);
    font-weight: var(--weight-medium);
    color: var(--voyage-blue);
  }

  @media (max-width: 1100px) {
    .hero-grid {
      grid-template-columns: 1fr;
    }

    .hero {
      padding-top: calc(var(--space-20) + 56px);
    }

    .hero-showcase { order: -1; }
  }

  @media (max-width: 640px) {
    .hero-actions { flex-direction: column; align-items: stretch; }
    .meta-card { padding: var(--space-2); }
  }
</style>
