<script>
  import { _, json } from 'svelte-i18n';
  import { Icon } from '$lib/components';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import { staggerReveal, reveal, ripple, magnetic } from '$utils/animations';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';

  const fallbackHeroPhrases = Array.isArray(en.nodevoyage?.hero_rotating)
    ? [...en.nodevoyage.hero_rotating]
    : [en.nodevoyage.tagline];

  /**
   * @param {unknown} value
   * @returns {string[]}
   */
  const ensureStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length)
      ? Array.from(value)
      : [...fallbackHeroPhrases];

  const product = productsData.nodevoyage;
  const features = product.features;
  const stepKeys = ['step1', 'step2', 'step3', 'step4'];

  let heroPhrases = [...fallbackHeroPhrases];
  $: heroPhrases = ensureStringArray($json?.('nodevoyage.hero_rotating'));
</script>

<svelte:head>
  <title>{$_('nodevoyage.meta_title')}</title>
  <meta name="description" content={$_('nodevoyage.seo_description')} />
</svelte:head>

<HeroWrapper class="hero hero--product hero--nodevoyage hero--centered" introReveal={{ delay: 60, stagger: 130 }}>
  <svelte:fragment slot="backdrop">
    <div class="product-hero__halo" aria-hidden="true">
      <span class="halo-ring halo-ring--outer"></span>
      <span class="halo-ring halo-ring--inner"></span>
      <span class="halo-orb halo-orb--one"></span>
      <span class="halo-orb halo-orb--two"></span>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="status">
    <span class="hero-badge product-hero__badge">{$_('nodevoyage.status')}</span>
  </svelte:fragment>

  <svelte:fragment slot="title">
    <h1 class="product-hero__title">{$_('nodevoyage.name')}</h1>
  </svelte:fragment>

  <svelte:fragment slot="lead">
    <span class="product-hero__headline">
      <AnimatedHeadline variant="slide" phrases={heroPhrases} holdDuration={2600} />
    </span>
  </svelte:fragment>

  <svelte:fragment slot="description">
    <p class="product-hero__description">{$_('nodevoyage.hero_description')}</p>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="product-hero__actions">
      <button class="btn btn-primary" use:ripple use:magnetic>{$_('nodevoyage.cta_primary')}</button>
      <a href="#features" class="btn btn-secondary">{$_('nodevoyage.cta_secondary')}</a>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="metrics">
    <div class="product-hero__stats" use:staggerReveal={{ stagger: 160 }}>
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
  </svelte:fragment>

  <svelte:fragment slot="aside">
    <div class="product-hero__visual">
      <div class="device-frame">
        <img src="/images/products/nodevoyage-hero.png" alt={$_('nodevoyage.hero_alt')} />
      </div>
    </div>
  </svelte:fragment>
</HeroWrapper>

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
      {#each stepKeys as stepKey, index}
        <article class="step-card">
          <span class="step-index">{String(index + 1).padStart(2, '0')}</span>
          <h3>{$_(`nodevoyage.${stepKey}_title`)}</h3>
          <p>{$_(`nodevoyage.${stepKey}_desc`)}</p>
        </article>
      {/each}
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
  :global(.hero--nodevoyage) {
    --hero-padding-block-start: clamp(5.5rem, 12vw, 8rem);
    --hero-padding-block-end: clamp(4rem, 10vw, 6.5rem);
    --hero-shell-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    --hero-shell-gap: clamp(2.6rem, 5vw, 3.6rem);
    --hero-intro-gap: clamp(1.4rem, 3vw, 2.1rem);
    --hero-aside-gap: clamp(1.8rem, 4vw, 2.6rem);
    --hero-backdrop-inset: clamp(-6rem, -8vw, -3rem) -10% auto;
    --hero-backdrop-height: clamp(18rem, 32vw, 24rem);
    --hero-backdrop-gradient: radial-gradient(circle at 30% 40%, rgba(19, 81, 255, 0.18), transparent 70%);
    --hero-backdrop-opacity: 0.7;
    --hero-backdrop-blur: 120px;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
    overflow: hidden;
  }

  :global(.hero--nodevoyage .hero-wrapper__intro) {
    text-align: center;
    justify-items: center;
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

  .product-hero__badge {
    background: color-mix(in srgb, rgba(255, 255, 255, 0.24) 65%, transparent);
    border-color: rgba(255, 255, 255, 0.45);
  }

  .product-hero__title {
    margin: 0;
    font-size: clamp(2.6rem, 6vw, 4.1rem);
    letter-spacing: -0.035em;
  }

  .product-hero__headline {
    display: inline-flex;
    margin-bottom: clamp(0.6rem, 2vw, 1rem);
    padding: clamp(0.55rem, 1.8vw, 0.9rem) clamp(1.25rem, 3vw, 1.85rem);
    border-radius: clamp(2.2rem, 4.6vw, 3.1rem);
    background: linear-gradient(126deg, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.08));
    border: 1px solid rgba(255, 255, 255, 0.38);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.24);
  }

  .product-hero__headline :global(.animated-headline) {
    width: 100%;
  }

  :global([data-base-theme='dark']) .product-hero__headline {
    background: linear-gradient(126deg, rgba(22, 30, 52, 0.78), rgba(22, 30, 52, 0.54));
    border: 1px solid rgba(120, 146, 220, 0.38);
    box-shadow: inset 0 0 0 1px rgba(120, 146, 220, 0.26);
  }

  :global([data-theme='contrast']) .product-hero__headline {
    background: linear-gradient(126deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.72));
    border: 2px solid rgba(255, 255, 255, 0.85);
  }

  :global([data-base-theme='dark']) .product-hero__badge {
    background: rgba(22, 30, 52, 0.7);
    border-color: rgba(120, 146, 220, 0.4);
    color: rgba(220, 232, 255, 0.88);
  }

  :global([data-theme='contrast']) .product-hero__badge {
    background: rgba(0, 0, 0, 0.92);
    border: 2px solid rgba(255, 255, 255, 0.85);
    color: #fff;
  }

  .product-hero__description {
    color: var(--text-secondary);
    margin: 0;
    max-width: 60ch;
  }

  .product-hero__actions {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    justify-content: center;
  }

  .product-hero__stats {
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

  .product-hero__stats .label {
    color: var(--text-tertiary);
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .product-hero__stats .value {
    font-size: var(--text-title);
    font-weight: var(--weight-semibold);
  }

  .product-hero__visual {
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

  :global([data-base-theme='dark']) .product-hero__halo .halo-ring {
    border-color: rgba(90, 135, 255, 0.32);
  }

  :global([data-base-theme='dark']) .product-hero__halo .halo-orb {
    opacity: 0.48;
  }

  @media (prefers-reduced-motion: reduce) {
    .halo-ring,
    .halo-orb {
      animation: none;
    }
  }

  @media (max-width: 1024px) {
    :global(.hero--nodevoyage) {
      --hero-shell-columns: minmax(0, 1fr);
    }

    :global(.hero--nodevoyage .hero-wrapper__aside) {
      order: -1;
    }

    .product-hero__actions {
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .product-hero__actions { flex-direction: column; }
    .device-frame { padding: 1rem; }
    .device-frame img { width: 100%; }
  }
</style>
