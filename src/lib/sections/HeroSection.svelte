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
    padding-top: clamp(8rem, 12vw, 10rem);
  }

  .hero::before {
    content: '';
    position: absolute;
    inset: clamp(-4rem, -8vw, -2rem) 0 auto;
    height: clamp(18rem, 35vw, 26rem);
    background: linear-gradient(135deg, rgba(19, 81, 255, 0.18), rgba(106, 56, 255, 0.08));
    filter: blur(120px);
    opacity: 0.7;
    z-index: -1;
  }

  .hero-grid {
    display: grid;
    gap: clamp(3rem, 6vw, 5rem);
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: center;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3vw, 2rem);
    max-width: 38rem;
  }

  .hero-lead {
    font-size: clamp(1.2rem, 2.4vw, 1.7rem);
    color: var(--text-secondary);
    max-width: 34rem;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .hero-meta {
    display: grid;
    gap: 1.2rem;
    margin-top: 1.4rem;
  }

  .meta-card {
    padding: clamp(1.4rem, 2.4vw, 1.8rem);
    border: 1px solid rgba(255, 255, 255, 0.58);
    border-radius: var(--radius-2xl);
    background: var(--surface-glass);
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(24px);
    display: grid;
    gap: 0.65rem;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .meta-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .meta-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
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
    gap: clamp(1.6rem, 4vw, 2.2rem);
  }

  .showcase-card {
    padding: clamp(1.8rem, 3vw, 2.4rem);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: var(--surface-glass);
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
    display: grid;
    gap: clamp(0.9rem, 2vw, 1.2rem);
    position: relative;
    overflow: hidden;
    transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }

  .showcase-card::after {
    content: '';
    position: absolute;
    inset: -40% 30% auto -30%;
    height: 140%;
    background: radial-gradient(ellipse at center, rgba(19, 81, 255, 0.2), transparent 65%);
    opacity: 0;
    transition: opacity var(--duration-normal) var(--ease-out);
  }

  .showcase-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-md);
  }

  .showcase-card:hover::after {
    opacity: 0.6;
  }

  .showcase-card.focus {
    border: 1px solid rgba(19, 81, 255, 0.24);
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
    gap: clamp(1.4rem, 3vw, 1.8rem);
  }

  .milestone {
    position: relative;
    border-style: dashed;
  }

  .milestone h3 {
    font-size: clamp(1.4rem, 2.6vw, 1.9rem);
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
      align-items: stretch;
    }

    .hero {
      padding-top: clamp(6rem, 18vw, 8rem);
    }

    .hero-showcase { order: -1; }
  }

  @media (max-width: 640px) {
    .hero-actions { flex-direction: column; align-items: stretch; }
    .meta-card { padding: 1.2rem; }
    .showcase-card { padding: 1.6rem; }
  }
</style>
