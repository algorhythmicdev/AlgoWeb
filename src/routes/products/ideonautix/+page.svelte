<script>
  import { _ } from 'svelte-i18n';
  import { staggerReveal, reveal, ripple, magnetic } from '$utils/animations';
  import productsData from '$data/products.json';

  const product = productsData.ideonautix;
  const microservices = [
    { icon: '🎯', titleKey: 'pitch_title', descKey: 'pitch_desc' },
    { icon: '📊', titleKey: 'revenue_title', descKey: 'revenue_desc' },
    { icon: '👥', titleKey: 'team_title', descKey: 'team_desc' }
  ];
</script>

<svelte:head>
  <title>{$_('ideonautix.name')} - AlgoRhythmics</title>
  <meta name="description" content={$_('ideonautix.seo_description')} />
</svelte:head>

<section class="product-hero section" use:reveal>
  <div class="container hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">{$_('ideonautix.status')}</span>
      <h1>{$_('ideonautix.name')}</h1>
      <p class="hero-tagline">{$_('ideonautix.tagline')}</p>
      <p class="hero-description">{$_('ideonautix.hero_description')}</p>

      <div class="hero-actions">
        <button class="btn btn-primary" use:ripple use:magnetic>{$_('ideonautix.cta_primary')}</button>
        <a href="#services" class="btn btn-secondary">{$_('ideonautix.cta_secondary')}</a>
      </div>

      <div class="hero-stats" use:staggerReveal={{ stagger: 160 }}>
        <div class="stat">
          <span class="label">{$_('ideonautix.stat1_label')}</span>
          <span class="value">{$_('ideonautix.stat1_value')}</span>
        </div>
        <div class="stat">
          <span class="label">{$_('ideonautix.stat2_label')}</span>
          <span class="value">{$_('ideonautix.stat2_value')}</span>
        </div>
        <div class="stat">
          <span class="label">{$_('ideonautix.stat3_label')}</span>
          <span class="value">{$_('ideonautix.stat3_value')}</span>
        </div>
      </div>
    </div>

    <div class="hero-visual">
      <div class="device-frame">
        <img src="/images/products/ideonautix-hero.webp" alt={$_('ideonautix.hero_alt')} />
      </div>
    </div>
  </div>
</section>

<section class="services section" id="services" use:reveal>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('ideonautix.microservices_title')}</span>
      <h2>{$_('ideonautix.microservices_subtitle')}</h2>
    </div>

    <div class="services-grid" use:staggerReveal={{ stagger: 140 }}>
      {#each microservices as service}
        <article class="service-card">
          <span class="service-icon">{service.icon}</span>
          <h3>{$_(`ideonautix.${service.titleKey}`)}</h3>
          <p>{$_(`ideonautix.${service.descKey}`)}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="pillars section" use:reveal>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('ideonautix.how_title')}</span>
    </div>

    <div class="pillars-grid" use:staggerReveal={{ stagger: 120 }}>
      <article class="pillar-card">
        <h3>{$_('ideonautix.pitch_title')}</h3>
        <p>{$_('ideonautix.pitch_desc')}</p>
      </article>
      <article class="pillar-card">
        <h3>{$_('ideonautix.revenue_title')}</h3>
        <p>{$_('ideonautix.revenue_desc')}</p>
      </article>
      <article class="pillar-card">
        <h3>{$_('ideonautix.team_title')}</h3>
        <p>{$_('ideonautix.team_desc')}</p>
      </article>
    </div>
  </div>
</section>

<section class="tech section-sm" use:reveal>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('ideonautix.integrations_title')}</span>
    </div>

    <div class="tech-grid" use:staggerReveal={{ stagger: 80 }}>
      {#each product.techStack as tech}
        <span class="tech-chip">{tech}</span>
      {/each}
    </div>
  </div>
</section>

<section class="cta section" use:reveal>
  <div class="container cta-card">
    <div class="cta-copy">
      <h2>{$_('ideonautix.cta_title')}</h2>
      <p>{$_('ideonautix.cta_description')}</p>
    </div>
    <button class="btn btn-primary" use:ripple use:magnetic>{$_('ideonautix.cta_primary')}</button>
  </div>
</section>

<style>
  .product-hero { background: var(--bg-muted); }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--space-6);
    align-items: center;
  }

  .hero-copy { display: grid; gap: var(--space-3); }
  .hero-tagline { font-size: var(--text-headline); color: var(--text-secondary); font-style: italic; }
  .hero-description { color: var(--text-secondary); }
  .hero-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-3);
    margin-top: var(--space-3);
  }

  .stat {
    padding: 1rem 1.2rem;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-surface);
    display: grid;
    gap: 0.3rem;
  }

  .label { color: var(--text-tertiary); font-size: var(--text-small); text-transform: uppercase; letter-spacing: 0.12em; }
  .value { font-size: var(--text-title); font-weight: var(--weight-semibold); }

  .hero-visual { display: flex; justify-content: center; }

  .device-frame {
    border: 1px solid var(--border-subtle);
    border-radius: 28px;
    overflow: hidden;
    background: var(--bg-surface);
    box-shadow: var(--shadow-md);
    padding: 1.2rem;
  }

  .device-frame img { width: clamp(240px, 60vw, 360px); border-radius: 20px; }

  .section-heading { display: grid; gap: 0.6rem; max-width: 720px; margin-bottom: var(--space-8); }

  .services { background: var(--bg-surface); }

  .services-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .service-card {
    padding: var(--space-4);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-muted);
    display: grid;
    gap: var(--space-2);
  }

  .service-icon { font-size: 2rem; }
  .service-card p { color: var(--text-secondary); }

  .pillars { background: var(--bg-surface); }

  .pillars-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .pillar-card {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    background: var(--bg-muted);
    display: grid;
    gap: 0.75rem;
  }

  .pillar-card p { color: var(--text-secondary); }

  .tech { background: var(--bg-muted); }

  .tech-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }

  .tech-chip {
    padding: 0.5rem 0.9rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-subtle);
    background: var(--bg-surface);
    font-size: var(--text-small);
  }

  .cta-card {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    background: var(--bg-surface);
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
    box-shadow: var(--shadow-sm);
  }

  .cta-copy { display: grid; gap: 0.65rem; max-width: 540px; }
  .cta-copy p { color: var(--text-secondary); }

  @media (max-width: 1024px) {
    .hero-grid { grid-template-columns: 1fr; }
    .hero-visual { order: -1; }
  }

  @media (max-width: 640px) {
    .hero-actions { flex-direction: column; }
    .device-frame { padding: 1rem; }
    .device-frame img { width: 100%; }
  }
</style>
