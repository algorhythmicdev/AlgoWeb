<script>
  import { _ } from 'svelte-i18n';
  import { staggerReveal, reveal, ripple, magnetic } from '$utils/animations';
  import productsData from '$data/products.json';

  const product = productsData.nodevoyage;
  const features = product.features;
</script>

<svelte:head>
  <title>{$_('nodevoyage.name')} - AlgoRhythmics</title>
  <meta name="description" content={$_('nodevoyage.seo_description')} />
</svelte:head>

<section class="product-hero section" use:reveal>
  <div class="container hero-grid">
    <div class="hero-copy">
      <span class="eyebrow">{$_('nodevoyage.status')}</span>
      <h1>{$_('nodevoyage.name')}</h1>
      <p class="hero-tagline">{$_('nodevoyage.tagline')}</p>
      <p class="hero-description">{$_('nodevoyage.hero_description')}</p>

      <div class="hero-actions">
        <button class="btn btn-primary" use:ripple use:magnetic>{$_('nodevoyage.cta_primary')}</button>
        <a href="#features" class="btn btn-secondary">{$_('nodevoyage.cta_secondary')}</a>
      </div>

      <div class="hero-stats" use:staggerReveal={{ stagger: 160 }}>
        <div class="stat">
          <span class="label">{$_('nodevoyage.stat1_label')}</span>
          <span class="value">{$_('nodevoyage.stat1_value')}</span>
        </div>
        <div class="stat">
          <span class="label">{$_('nodevoyage.stat2_label')}</span>
          <span class="value">{$_('nodevoyage.stat2_value')}</span>
        </div>
        <div class="stat">
          <span class="label">{$_('nodevoyage.stat3_label')}</span>
          <span class="value">{$_('nodevoyage.stat3_value')}</span>
        </div>
      </div>
    </div>

    <div class="hero-visual">
      <div class="device-frame">
        <img src="/images/products/nodevoyage-hero.webp" alt={$_('nodevoyage.hero_alt')} />
      </div>
    </div>
  </div>
</section>

<section class="features section" id="features" use:reveal>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('nodevoyage.features_title')}</span>
      <h2>{$_('nodevoyage.features_subtitle')}</h2>
    </div>

    <div class="features-grid" use:staggerReveal={{ stagger: 120 }}>
      {#each features as feature}
        <article class="feature-card">
          <span class="feature-icon">{feature.icon}</span>
          <h3>{$_(`nodevoyage.features.${feature.id}.title`)}</h3>
          <p>{$_(`nodevoyage.features.${feature.id}.description`)}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="steps section" use:reveal>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('nodevoyage.how_title')}</span>
    </div>

    <div class="steps-grid" use:staggerReveal={{ stagger: 120 }}>
      <article class="step-card">
        <span class="step-index">01</span>
        <h3>{$_('nodevoyage.step1_title')}</h3>
        <p>{$_('nodevoyage.step1_desc')}</p>
      </article>
      <article class="step-card">
        <span class="step-index">02</span>
        <h3>{$_('nodevoyage.step2_title')}</h3>
        <p>{$_('nodevoyage.step2_desc')}</p>
      </article>
      <article class="step-card">
        <span class="step-index">03</span>
        <h3>{$_('nodevoyage.step3_title')}</h3>
        <p>{$_('nodevoyage.step3_desc')}</p>
      </article>
      <article class="step-card">
        <span class="step-index">04</span>
        <h3>{$_('nodevoyage.step4_title')}</h3>
        <p>{$_('nodevoyage.step4_desc')}</p>
      </article>
    </div>
  </div>
</section>

<section class="tech section-sm" use:reveal>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('nodevoyage.tech_title')}</span>
      <h3>{$_('nodevoyage.tech_subtitle')}</h3>
    </div>

    <div class="tech-grid" use:staggerReveal={{ stagger: 90 }}>
      {#each product.techStack as tech}
        <span class="tech-chip">{tech}</span>
      {/each}
    </div>
  </div>
</section>

<section class="cta section" use:reveal>
  <div class="container cta-card">
    <div class="cta-copy">
      <h2>{$_('nodevoyage.cta_title')}</h2>
      <p>{$_('nodevoyage.cta_description')}</p>
      <p class="note">{$_('nodevoyage.cta_note')}</p>
    </div>
    <button class="btn btn-primary" use:ripple use:magnetic>{$_('nodevoyage.cta_button')}</button>
  </div>
</section>

<style>
  .product-hero {
    background: var(--bg-muted);
  }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: var(--space-6);
    align-items: center;
  }

  .hero-copy { display: grid; gap: var(--space-3); }

  .hero-tagline {
    font-size: var(--text-headline);
    color: var(--text-secondary);
    font-style: italic;
  }

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

  .hero-visual {
    display: flex;
    justify-content: center;
  }

  .device-frame {
    border: 1px solid var(--border-subtle);
    border-radius: 28px;
    overflow: hidden;
    background: var(--bg-surface);
    box-shadow: var(--shadow-md);
    padding: 1.2rem;
  }

  .device-frame img { width: clamp(240px, 60vw, 360px); border-radius: 20px; }

  .section-heading {
    display: grid;
    gap: 0.6rem;
    max-width: 720px;
    margin-bottom: var(--space-8);
  }

  .features {
    background: var(--bg-surface);
  }

  .features-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .feature-card {
    padding: var(--space-4);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    background: var(--bg-muted);
    display: grid;
    gap: var(--space-2);
  }

  .feature-icon { font-size: 2rem; }
  .feature-card p { color: var(--text-secondary); }

  .steps {
    background: var(--bg-surface);
  }

  .steps-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .step-card {
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: grid;
    gap: 0.75rem;
    background: var(--bg-muted);
  }

  .step-index {
    font-size: var(--text-small);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.18em;
  }

  .step-card p { color: var(--text-secondary); }

  .tech {
    background: var(--bg-muted);
  }

  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

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
  .note { font-size: var(--text-small); color: var(--text-tertiary); }

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
