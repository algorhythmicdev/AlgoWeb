<script>
  import { onDestroy, onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { _, json } from 'svelte-i18n';
  import timelineData from '$data/timeline.json';
  import { revealOnScroll, staggerReveal } from '$utils/animations';

  const upcomingMilestone = timelineData.milestones?.[0];
  const milestoneDate = upcomingMilestone
    ? new Date(`${upcomingMilestone.date}-01`).toLocaleString(undefined, { month: 'short', year: 'numeric' })
    : '';

  const heroProducts = [
    { id: 'nodevoyage', href: '/products/nodevoyage' },
    { id: 'ideonautix', href: '/products/ideonautix' }
  ];

  $: heroPillars = (() => {
    const value = $json?.('hero.pillars');
    return Array.isArray(value) ? value : [];
  })();

  const defaultPointer = { x: 0.56, y: 0.42 };
  const pointerSpring = spring(defaultPointer, {
    stiffness: 0.18,
    damping: 0.42,
    precision: 0.0005
  });

  /** @type {{ x: number; y: number }} */
  let pointerCoords = defaultPointer;
  let heroSection;
  let motionEnabled = false;

  const unsubscribePointer = pointerSpring.subscribe((value) => {
    pointerCoords = value;
  });

  $: heroVars = `--hero-pointer-x:${pointerCoords.x}; --hero-pointer-y:${pointerCoords.y};`;

  function normalize(value) {
    return Math.max(0, Math.min(1, value));
  }

  function handlePointer(event) {
    if (!motionEnabled || !heroSection || event.pointerType === 'touch') return;
    const rect = heroSection.getBoundingClientRect();
    const x = normalize((event.clientX - rect.left) / rect.width);
    const y = normalize((event.clientY - rect.top) / rect.height);
    pointerSpring.set({ x, y });
  }

  function relaxPointer() {
    pointerSpring.set(defaultPointer);
  }

  onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event) => {
      motionEnabled = !event.matches;
      if (!motionEnabled) {
        relaxPointer();
      }
    };

    motionEnabled = !mediaQuery.matches;
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updatePreference);
    } else {
      mediaQuery.addListener(updatePreference);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updatePreference);
      } else {
        mediaQuery.removeListener(updatePreference);
      }
    };
  });

  onDestroy(() => {
    unsubscribePointer();
  });
</script>

<section
  class="hero section"
  id="hero"
  use:revealOnScroll
  bind:this={heroSection}
  style={heroVars}
  on:pointermove={handlePointer}
  on:pointerleave={relaxPointer}
  on:pointercancel={relaxPointer}
  on:touchend={relaxPointer}
>
  <div class="container hero-layout">
    <div class="hero-content" use:staggerReveal={{ stagger: 120 }}>
      <span class="status-chip">{$_('hero.status')}</span>
      <h1>{$_('hero.title')}</h1>
      <p class="hero-tagline">{$_('hero.tagline')}</p>
      <p class="hero-lead">{$_('hero.subtitle')}</p>
      {#if $_('hero.description')}
        <p class="hero-description">{$_('hero.description')}</p>
      {/if}

      <div class="hero-actions" role="group" aria-label="Primary actions">
        <a href="/products" class="btn btn-gradient">{$_('hero.cta_products')}</a>
        <a href="/consulting" class="btn btn-secondary">{$_('hero.cta_consulting')}</a>
      </div>

      {#if heroPillars.length}
        <div class="hero-pillars" use:staggerReveal={{ stagger: 90 }}>
          <span class="pillars-title">{$_('hero.pillars_title')}</span>
          <ul>
            {#each heroPillars as pillar}
              <li>{pillar}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    <div class="hero-meta" use:staggerReveal={{ delay: 160, stagger: 140 }}>
      <div class="hero-products">
        {#each heroProducts as product}
          <article class="product-card">
            <header>
              <span class="kicker">{$_(`products.${product.id}.name`)}</span>
              <span class="status">{$_(`products.${product.id}.status`)}</span>
            </header>
            <h3>{$_(`products.${product.id}.tagline`)}</h3>
            <p>{$_(`products.${product.id}.description`)}</p>
            <footer>
              <span class="meta">{$_(`products.${product.id}.mvp`)}</span>
              <a class="inline-link" href={product.href}>{$_(`products.${product.id}.cta`)}</a>
            </footer>
          </article>
        {/each}
      </div>

      {#if upcomingMilestone}
        <aside class="milestone-card">
          <span class="milestone-label">{$_('hero.next_milestone')}</span>
          <time datetime={upcomingMilestone.date}>{milestoneDate}</time>
          <h4>{$_(`timeline.milestones.${upcomingMilestone.id}.title`)}</h4>
          <p>{$_(`timeline.milestones.${upcomingMilestone.id}.description`)}</p>
          {#if $_(`timeline.milestones.${upcomingMilestone.id}.note`)}
            <p class="note">{$_(`timeline.milestones.${upcomingMilestone.id}.note`)}</p>
          {/if}
          <a class="inline-link" href="#timeline">{$_('hero.milestone_cta')}</a>
        </aside>
      {/if}
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding-top: clamp(6rem, 12vw, 9rem);
    background:
      radial-gradient(
        120% 140% at calc(var(--hero-pointer-x, 0.56) * 100%) calc(var(--hero-pointer-y, 0.42) * 100%),
        rgba(19, 81, 255, 0.16) 0%,
        transparent 65%
      ),
      radial-gradient(
        150% 150% at calc((1 - var(--hero-pointer-x, 0.56)) * 100%)
          calc((0.85 + (1 - var(--hero-pointer-y, 0.42)) * 0.15) * 100%),
        rgba(106, 56, 255, 0.12) 0%,
        transparent 70%
      );
    transition: background-position 220ms var(--ease-out), background-size 220ms var(--ease-out);
  }

  .hero-layout {
    display: grid;
    gap: clamp(2.5rem, 6vw, 4.5rem);
    align-items: start;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .hero-content {
    display: grid;
    gap: var(--space-lg);
    max-width: 52ch;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.85rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--voyage-blue) 12%, rgba(255, 255, 255, 0.7) 88%);
    color: rgba(26, 33, 55, 0.78);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .hero-tagline {
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .hero-lead {
    font-size: var(--text-subtitle);
    color: var(--text-primary);
  }

  .hero-description {
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md);
  }

  .hero-actions .btn {
    min-width: clamp(10rem, 24vw, 12rem);
    text-align: center;
  }

  .hero-pillars {
    padding: var(--card-padding-lg);
    border-radius: var(--radius-xl);
    border: 1px solid rgba(19, 81, 255, 0.18);
    background: rgba(255, 255, 255, 0.82);
    box-shadow: var(--shadow-xs);
    display: grid;
    gap: var(--space-md);
  }

  .hero-pillars ul {
    display: grid;
    gap: var(--space-sm);
    padding: 0;
    list-style: none;
  }

  .hero-pillars li {
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .hero-pillars li::before {
    content: '•';
    color: var(--voyage-blue);
    font-weight: var(--weight-bold);
  }

  .pillars-title {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(26, 33, 55, 0.65);
  }

  .hero-meta {
    display: grid;
    gap: clamp(2rem, 5vw, 3rem);
  }

  .hero-products {
    display: grid;
    gap: var(--space-lg);
  }

  .product-card {
    padding: var(--card-padding-xl);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-sm);
    display: grid;
    gap: var(--space-md);
  }

  .product-card header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .product-card .kicker {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(26, 33, 55, 0.7);
  }

  .product-card .status {
    font-size: var(--text-small);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    background: color-mix(in srgb, rgba(19, 81, 255, 0.12) 55%, rgba(255, 255, 255, 0.9) 45%);
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }

  .product-card h3 {
    margin: 0;
    color: var(--text-primary);
    -webkit-text-fill-color: initial;
    background: none;
    filter: none;
    font-size: clamp(1.35rem, 2.6vw, 1.85rem);
    letter-spacing: -0.01em;
  }

  .product-card p {
    margin: 0;
    color: var(--text-secondary);
  }

  .product-card footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .product-card .meta {
    font-size: var(--text-small);
    color: rgba(26, 33, 55, 0.6);
  }

  .milestone-card {
    padding: var(--card-padding-lg);
    border-radius: var(--radius-2xl);
    border: 1px solid rgba(106, 56, 255, 0.18);
    background: rgba(255, 255, 255, 0.86);
    box-shadow: var(--shadow-xs);
    display: grid;
    gap: var(--space-sm);
  }

  .milestone-label {
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
    color: rgba(106, 56, 255, 0.85);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .milestone-card time {
    font-size: var(--text-title);
    font-weight: var(--weight-semibold);
    color: var(--aurora-purple);
  }

  .milestone-card h4 {
    margin: 0;
    font-size: clamp(1.25rem, 2.4vw, 1.7rem);
    color: var(--text-primary);
    -webkit-text-fill-color: initial;
    background: none;
    filter: none;
  }

  .milestone-card p {
    margin: 0;
    color: var(--text-secondary);
  }

  .milestone-card .note {
    font-size: var(--text-small);
    color: rgba(26, 33, 55, 0.6);
  }

  .inline-link {
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .inline-link::after {
    content: '→';
    transition: transform var(--duration-fast) var(--ease-out);
  }

  .inline-link:hover::after {
    transform: translateX(4px);
  }

  @media (max-width: 960px) {
    .hero-layout {
      grid-template-columns: 1fr;
    }

    .hero-content {
      max-width: 100%;
    }
  }

  @media (max-width: 640px) {
    .product-card,
    .milestone-card {
      padding: var(--card-padding-md);
    }

    .hero-actions .btn {
      width: 100%;
    }
  }
</style>
