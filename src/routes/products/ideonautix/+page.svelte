<script>
  import { _, json } from 'svelte-i18n';
  import { Icon } from '$lib/components';
  import HeroWrapper from '$lib/components/hero/HeroWrapper.svelte';
  import AnimatedHeadline from '$lib/components/hero/AnimatedHeadline.svelte';
  import { staggerReveal, revealOnScroll, ripple, magnetic } from '$utils/animations';
  import productsData from '$data/products.json';
  import en from '$lib/i18n/en.json';

  const fallbackHeroPhrases = Array.isArray(en.ideonautix?.hero_rotating)
    ? [...en.ideonautix.hero_rotating]
    : [en.ideonautix.tagline];

  /**
   * @param {unknown} value
   * @returns {string[]}
   */
  const ensureStringArray = (value) =>
    Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length)
      ? Array.from(value)
      : [...fallbackHeroPhrases];

  const product = productsData.ideonautix;
  const microservices = [
    { icon: 'target', titleKey: 'pitch_title', descKey: 'pitch_desc' },
    { icon: 'chart', titleKey: 'revenue_title', descKey: 'revenue_desc' },
    { icon: 'people', titleKey: 'team_title', descKey: 'team_desc' }
  ];

  let heroPhrases = [...fallbackHeroPhrases];
  $: heroPhrases = ensureStringArray($json?.('ideonautix.hero_rotating'));
</script>

<svelte:head>
  <title>{$_('ideonautix.meta_title')}</title>
  <meta name="description" content={$_('ideonautix.seo_description')} />
</svelte:head>

<HeroWrapper class="hero hero--product hero--ideonautix hero--centered" introReveal={{ delay: 60, stagger: 130 }}>
  <svelte:fragment slot="backdrop">
    <div class="product-hero__halo" aria-hidden="true">
      <span class="ribbon ribbon--one"></span>
      <span class="ribbon ribbon--two"></span>
      <span class="spark spark--one"></span>
      <span class="spark spark--two"></span>
    </div>
  </svelte:fragment>
<svelte:fragment slot="title">
    <h1 class="product-hero__title">{$_('ideonautix.name')}</h1>
  </svelte:fragment>

  <svelte:fragment slot="lead">
    <span class="product-hero__headline product-hero__headline--glow">
      <AnimatedHeadline variant="glow" phrases={heroPhrases} holdDuration={2600} />
    </span>
  </svelte:fragment>

  <svelte:fragment slot="description">
    <p class="product-hero__description">{$_('ideonautix.hero_description')}</p>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="product-hero__actions">
      <button class="btn btn-primary" use:ripple use:magnetic>{$_('ideonautix.cta_primary')}</button>
      <a href="#services" class="btn btn-secondary">{$_('ideonautix.cta_secondary')}</a>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="metrics">
    <div class="product-hero__stats" use:staggerReveal={{ stagger: 160 }}>
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
  </svelte:fragment>

  <svelte:fragment slot="aside">
    <div class="product-hero__visual">
      <div class="device-frame">
        <img src="/images/products/ideonautix-hero.png" alt={$_('ideonautix.hero_alt')} />
      </div>
    </div>
  </svelte:fragment>
</HeroWrapper>

<section class="services section" id="services" use:revealOnScroll>
  <div class="container">
    <div class="section-heading">
      <span class="eyebrow">{$_('ideonautix.microservices_title')}</span>
      <h2>{$_('ideonautix.microservices_subtitle')}</h2>
    </div>

    <div class="services-grid" use:staggerReveal={{ stagger: 140 }}>
      {#each microservices as service}
        <article class="service-card">
          <span class="service-icon">
            <Icon name={service.icon} size={32} />
          </span>
          <h3>{$_(`ideonautix.${service.titleKey}`)}</h3>
          <p>{$_(`ideonautix.${service.descKey}`)}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="pillars section" use:revealOnScroll>
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

<section class="tech section-sm" use:revealOnScroll>
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

<section class="cta section" use:revealOnScroll>
  <div class="container cta-card">
    <div class="cta-copy">
      <h2>{$_('ideonautix.cta_title')}</h2>
      <p>{$_('ideonautix.cta_description')}</p>
    </div>
    <button class="btn btn-primary" use:ripple use:magnetic>{$_('ideonautix.cta_primary')}</button>
  </div>
</section>

<style>
  :global(.hero--ideonautix) {
    --hero-padding-block-start: clamp(5.5rem, 12vw, 8rem);
    --hero-padding-block-end: clamp(4rem, 10vw, 6.5rem);
    --hero-shell-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    --hero-shell-gap: clamp(2.6rem, 5vw, 3.6rem);
    --hero-intro-gap: clamp(1.4rem, 3vw, 2.1rem);
    --hero-aside-gap: clamp(1.8rem, 4vw, 2.6rem);
    --hero-backdrop-inset: clamp(-6rem, -8vw, -3rem) -12% auto;
    --hero-backdrop-height: clamp(18rem, 32vw, 24rem);
    --hero-backdrop-gradient: radial-gradient(circle at 70% 30%, rgba(106, 56, 255, 0.2), transparent 70%);
    --hero-backdrop-opacity: 0.75;
    --hero-backdrop-blur: 120px;
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
    overflow: hidden;
  }

  :global(.hero--ideonautix .hero-wrapper__intro) {
    text-align: center;
    justify-items: center;
  }

  .product-hero__halo {
    position: absolute;
    inset: -14% -16% auto;
    height: clamp(28rem, 44vw, 34rem);
    pointer-events: none;
    overflow: hidden;
  }

  .ribbon {
    position: absolute;
    inset: 0;
    width: 160%;
    height: clamp(200px, 32vw, 260px);
    background: linear-gradient(120deg, rgba(106, 56, 255, 0.18), rgba(19, 81, 255, 0.08));
    filter: blur(70px);
    transform: rotate(18deg);
    transform-origin: center;
    animation: ideonautixRibbon 24s ease-in-out infinite;
  }

  .ribbon--one {
    top: -16%;
    left: -30%;
  }

  .ribbon--two {
    bottom: -22%;
    right: -26%;
    transform: rotate(-16deg);
    background: linear-gradient(120deg, rgba(255, 211, 57, 0.16), rgba(224, 50, 44, 0.12));
    animation-delay: -10s;
  }

  .spark {
    position: absolute;
    width: clamp(90px, 18vw, 140px);
    height: clamp(90px, 18vw, 140px);
    border-radius: 40% 60% 50% 50%;
    background: var(--gradient-spectrum-2);
    filter: blur(40px);
    opacity: 0.42;
    animation: ideonautixSpark 18s ease-in-out infinite;
  }

  .spark--one {
    top: -14%;
    right: 12%;
  }

  .spark--two {
    bottom: -28%;
    left: 18%;
    background: var(--gradient-spectrum-5);
    animation-delay: -6s;
  }

  @keyframes ideonautixRibbon {
    0% {
      transform: translate3d(-6%, -2%, 0) rotate(18deg) scale(0.92);
      opacity: 0.48;
    }
    50% {
      transform: translate3d(6%, 4%, 0) rotate(22deg) scale(1.04);
      opacity: 0.7;
    }
    100% {
      transform: translate3d(-6%, -2%, 0) rotate(18deg) scale(0.92);
      opacity: 0.48;
    }
  }

  @keyframes ideonautixSpark {
    0%, 100% {
      transform: translate3d(-6%, 4%, 0) scale(0.88) rotate(-6deg);
    }
    50% {
      transform: translate3d(6%, -4%, 0) scale(1.05) rotate(6deg);
    }
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

  .product-hero__headline--glow :global(.animated-headline__glow::after) {
    opacity: 0.46;
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

  .device-frame img {
    width: clamp(240px, 60vw, 360px);
    border-radius: 20px;
  }

  .section-heading {
    --section-heading-gap: clamp(1.5rem, 3vw, 2.25rem);
    --section-heading-max-width: min(100%, var(--measure-lg));
    --section-heading-margin: clamp(3rem, 6vw, 4.5rem);
    --section-heading-copy-width: var(--measure-md);
  }

  .services-grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.2rem);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .service-card {
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

  .service-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--aurora-purple) 16%, transparent 84%);
    color: var(--aurora-purple);
  }
  .service-card p { color: var(--text-secondary); }

  .pillars-grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.2rem);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .pillar-card {
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: var(--radius-2xl);
    padding: clamp(1.8rem, 3vw, 2.2rem);
    background: var(--bg-surface);
    background: var(--surface-glass);
    display: grid;
    gap: 0.85rem;
    box-shadow: var(--shadow-xs);
    backdrop-filter: blur(22px);
  }

  .pillar-card p { color: var(--text-secondary); }

  .tech-grid { display: flex; flex-wrap: wrap; gap: 0.8rem; }

  .tech-chip {
    padding: 0.6rem 1rem;
    border-radius: var(--radius-full);
    border: 1px solid rgba(106, 56, 255, 0.22);
    background: rgba(106, 56, 255, 0.1);
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

  :global([data-base-theme='dark']) .product-hero__halo .ribbon {
    background: linear-gradient(120deg, rgba(106, 56, 255, 0.22), rgba(47, 92, 220, 0.14));
  }

  :global([data-base-theme='dark']) .product-hero__halo .spark {
    opacity: 0.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .ribbon,
    .spark {
      animation: none;
    }
  }

  @media (max-width: 1024px) {
    :global(.hero--ideonautix) {
      --hero-shell-columns: minmax(0, 1fr);
    }

    :global(.hero--ideonautix .hero-wrapper__aside) {
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

