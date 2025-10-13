<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import { revealOnScroll } from '$lib/animations';
  import { translateOrFallback } from '$lib/utils';
  import { _ } from 'svelte-i18n';
  import en from '$lib/i18n/en.json';

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  const translate = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

  const heroCopy = (en.resources?.hero ?? {}) as Record<string, any>;
  $: heroTitle = translate('resources.hero.title', ensureString(heroCopy.title, 'Resources for calm AI teams'));
  $: heroSubtitle = translate('resources.hero.subtitle', ensureString(heroCopy.subtitle, 'Case studies, accessibility notes, and tooling guidelines.'));
  $: heroDescription = translate('resources.hero.description', ensureString(heroCopy.description, 'Signals from the AlgoRhythmics studio.'));
  $: heroPrimary = translate('resources.hero.primary', ensureString(heroCopy.primary, 'Browse case studies'));
  $: heroSecondary = translate('resources.hero.secondary', ensureString(heroCopy.secondary, 'Subscribe to updates'));

  const blogList = (en.resources?.blog?.items ?? []) as Array<Record<string, string>>;
  $: blogItems = blogList.slice(0, 3).map((entry, index) => ({
    title: translate(`resources.blog.items.${index}.title`, ensureString(entry.title, 'Article title')),
    summary: translate(`resources.blog.items.${index}.summary`, ensureString(entry.summary, 'Short summary.')),
    href: ensureString(entry.href, '#'),
    date: translate(`resources.blog.items.${index}.date`, ensureString(entry.date, '')),
    category: translate(`resources.blog.items.${index}.category`, ensureString(entry.category, ''))
  }));
  $: blogRead = translate('resources.blog.read', ensureString(en.resources?.blog?.read ?? '', 'Read article'));

  const caseList = (en.resources?.cases?.items ?? []) as Array<Record<string, string>>;
  $: caseItems = caseList.slice(0, 3).map((entry, index) => ({
    title: translate(`resources.cases.items.${index}.title`, ensureString(entry.title, 'Case study')),
    summary: translate(`resources.cases.items.${index}.summary`, ensureString(entry.summary, 'Outcome overview.')),
    href: ensureString(entry.href, '#'),
    stat: translate(`resources.cases.items.${index}.stat`, ensureString(entry.stat, ''))
  }));
  $: caseRead = translate('resources.cases.read', ensureString(en.resources?.cases?.read ?? '', 'Open case study'));

  const newsletterCopy = (en.resources?.newsletter ?? {}) as Record<string, any>;
  $: newsletterTitle = translate('resources.newsletter.title', ensureString(newsletterCopy.title, 'Stay in the calm loop'));
  $: newsletterDescription = translate('resources.newsletter.description', ensureString(newsletterCopy.description, 'Monthly notes covering accessibility upgrades and experiments.'));
  $: newsletterCta = translate('resources.newsletter.cta', ensureString(newsletterCopy.cta, 'Join the list'));
  $: newsletterHref = ensureString(newsletterCopy.href, 'https://algorhythmics.substack.com');
</script>

<Hero variant="aurora" title={heroTitle} subtitle={heroSubtitle}>
  <svelte:fragment slot="description">
    <p class="hero-description">{heroDescription}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button variant="gradient" size="lg" href="#case-studies">{heroPrimary}</Button>
      <Button variant="secondary" size="lg" href={newsletterHref}>{heroSecondary}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="blog" use:revealOnScroll>
  <div class="container blog__grid">
    {#each blogItems as item (item.title)}
      <GlassCard class="blog-card" padding="lg">
        {#if item.category}
          <span class="blog-card__category">{item.category}</span>
        {/if}
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div class="blog-card__meta">
          <span>{item.date}</span>
          <a href={item.href}>{blogRead}</a>
        </div>
      </GlassCard>
    {/each}
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="cases" id="case-studies" use:revealOnScroll>
  <div class="container cases__grid">
    {#each caseItems as item (item.title)}
      <GlassCard class="case-card" padding="lg">
        {#if item.stat}
          <span class="case-card__stat">{item.stat}</span>
        {/if}
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <a class="case-card__link" href={item.href}>{caseRead}</a>
      </GlassCard>
    {/each}
  </div>
</section>

<section class="newsletter" use:revealOnScroll>
  <div class="container">
    <GlassCard class="newsletter__card" particles padding="lg">
      <div>
        <h2>{newsletterTitle}</h2>
        <p>{newsletterDescription}</p>
      </div>
      <div class="newsletter__actions">
        <Button variant="gradient" size="lg" href={newsletterHref}>{newsletterCta}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .hero-description {
    max-width: 60ch;
    margin: 0;
    color: var(--text-secondary);
    font-size: clamp(1.05rem, 2.6vw, 1.3rem);
    line-height: 1.6;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .blog,
  .cases,
  .newsletter {
    padding: clamp(3.5rem, 9vw, 6rem) 0;
  }

  .blog__grid,
  .cases__grid {
    display: grid;
    gap: clamp(1.4rem, 3.5vw, 2.2rem);
  }

  :global(.blog-card),
  :global(.case-card) {
    display: grid;
    gap: 0.75rem;
  }

  .blog-card__category {
    display: inline-flex;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--bg) 90%, rgba(var(--voyage-blue-rgb), 0.2) 10%);
    font-size: var(--text-small);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .blog-card__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .case-card__stat {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .case-card__link {
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }

  :global(.newsletter__card) {
    display: grid;
    gap: 1rem;
    align-items: center;
  }

  .newsletter__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .blog__grid,
    .cases__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    :global(.newsletter__card) {
      grid-template-columns: minmax(0, 1fr) auto;
    }
  }

  @media (min-width: 1024px) {
    .blog__grid,
    .cases__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
