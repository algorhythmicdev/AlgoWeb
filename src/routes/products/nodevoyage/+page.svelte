<script>
  import { _ } from 'svelte-i18n';
  import { Icon } from '$lib/components';
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
  <div class="product-hero__halo" aria-hidden="true">
    <span class="halo-ring halo-ring--outer"></span>
    <span class="halo-ring halo-ring--inner"></span>
    <span class="halo-orb halo-orb--one"></span>
    <span class="halo-orb halo-orb--two"></span>
  </div>
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
          <span class="feature-icon">
            <Icon name={feature.icon} size={32} />
          </span>
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
    position: relative;
    overflow: hidden;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  }

  .product-hero::before {
    content: '';
    position: absolute;
    inset: clamp(-6rem, -8vw, -3rem) -10% auto;
    height: clamp(18rem, 32vw, 24rem);
    background: radial-gradient(circle at 30% 40%, rgba(19, 81, 255, 0.18), transparent 70%);
    filter: blur(120px);
    opacity: 0.7;
    pointer-events: none;
  }

  .product-hero__halo {
    position: absolute;
    inset: -16% -18% auto;
    height: clamp(26rem, 44vw, 32rem);
    pointer-events: none;
  }

  .halo-ring {
    position: absolute;
    inset: 16% 24%;
    border-radius: 50%;
    border: 1.5px solid rgba(19, 81, 255, 0.25);
    mix-blend-mode: screen;
    animation: heroRingOrbit 32s linear infinite;
  }

  .halo-ring::after {
    content: '';
    position: absolute;
    inset: 12% 18%;
    border-radius: 50%;
    border: 1px dashed rgba(106, 56, 255, 0.22);
  }

  .halo-ring--outer {
    animation-duration: 36s;
  }

  .halo-ring--inner {
    inset: 0 28%;
    animation-direction: reverse;
    animation-duration: 24s;
  }

  .halo-orb {
    position: absolute;
    width: clamp(120px, 22vw, 180px);
    height: clamp(120px, 22vw, 180px);
    border-radius: 50%;
    background: var(--gradient-spectrum-1);
    filter: blur(50px);
    opacity: 0.4;
    animation: heroOrbPulse 18s ease-in-out infinite;
  }

  .halo-orb--one {
    top: -20%;
    left: 8%;
  }

  .halo-orb--two {
    right: 10%;
    bottom: -32%;
    background: var(--gradient-spectrum-3);
    animation-delay: -8s;
  }

  @keyframes heroRingOrbit {
    0% {
      transform: rotate(0deg) scale(0.94);
      opacity: 0.55;
    }
    50% {
      transform: rotate(180deg) scale(1.04);
      opacity: 0.8;
    }
    100% {
      transform: rotate(360deg) scale(0.94);
      opacity: 0.55;
    }
  }

  @keyframes heroOrbPulse {
    0%, 100% {
      transform: translate3d(-6%, -4%, 0) scale(0.9);
    }
    50% {
      transform: translate3d(6%, 4%, 0) scale(1.05);
    }
  }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: clamp(2.5rem, 5vw, 4rem);
    align-items: center;
  }

  .hero-copy { display: grid; gap: clamp(1.6rem, 3vw, 2.2rem); }

  .hero-tagline {
    font-size: var(--text-headline);
    color: var(--text-secondary);
    font-style: italic;
  }

  .hero-description { color: var(--text-secondary); }

  .hero-actions { display: flex; gap: var(--space-2); flex-wrap: wrap; }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: clamp(1.2rem, 3vw, 1.8rem);
    margin-top: 1.6rem;
  }

  .stat {
    padding: 1.1rem 1.45rem;
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    background: var(--bg-surface);
    background: var(--surface-glass);
    display: grid;
    gap: 0.45rem;
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(22px);
  }

  .label { color: var(--text-tertiary); font-size: var(--text-small); text-transform: uppercase; letter-spacing: 0.12em; }
  .value { font-size: var(--text-title); font-weight: var(--weight-semibold); }

  .hero-visual {
    display: flex;
    justify-content: center;
  }

  .device-frame {
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: 32px;
    overflow: hidden;
    background: var(--bg-surface);
    background: var(--surface-glass);
    box-shadow: var(--shadow-md);
    padding: 1.4rem;
    backdrop-filter: blur(24px);
  }

  .device-frame img { width: clamp(240px, 60vw, 360px); border-radius: 20px; }

  .section-heading {
    display: grid;
    gap: 0.8rem;
    max-width: 720px;
    margin-bottom: clamp(3rem, 6vw, 4.5rem);
  }

  .features-grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.2rem);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .feature-card {
    padding: clamp(1.8rem, 3vw, 2.2rem);
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    background: var(--bg-surface);
    background: var(--surface-glass);
    display: grid;
    gap: clamp(0.9rem, 2vw, 1.2rem);
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(22px);
  }

  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, var(--voyage-blue) 14%, transparent 86%);
    color: var(--voyage-blue);
  }
  .feature-card p { color: var(--text-secondary); }

  .steps-grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.2rem);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .step-card {
    border: 1px dashed rgba(19, 81, 255, 0.24);
    border-radius: var(--radius-2xl);
    padding: clamp(1.8rem, 3vw, 2.2rem);
    display: grid;
    gap: 0.85rem;
    background: var(--bg-surface);
    background: var(--surface-glass);
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(20px);
  }

  .step-index {
    font-size: var(--text-small);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.18em;
  }

  .step-card p { color: var(--text-secondary); }

  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .tech-chip {
    padding: 0.6rem 1rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(19, 81, 255, 0.18);
    background: rgba(19, 81, 255, 0.08);
    font-size: var(--text-small);
  }

  .cta-card {
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    background: var(--bg-surface);
    background: var(--surface-glass);
    padding: clamp(2.5rem, 5vw, 3.4rem);
    display: flex;
    flex-direction: column;
    gap: clamp(1.6rem, 3vw, 2.2rem);
    align-items: flex-start;
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(24px);
  }

  .cta-copy { display: grid; gap: 0.65rem; max-width: 540px; }
  .cta-copy p { color: var(--text-secondary); }
  .note { font-size: var(--text-small); color: var(--text-tertiary); }

  :global([data-theme='dark']) .product-hero__halo .halo-ring {
    border-color: rgba(90, 135, 255, 0.32);
  }

  :global([data-theme='dark']) .product-hero__halo .halo-orb {
    opacity: 0.48;
  }

  @media (prefers-reduced-motion: reduce) {
    .halo-ring,
    .halo-orb {
      animation: none;
    }
  }

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
