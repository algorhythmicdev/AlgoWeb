<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll } from '$lib/animations';
  import { translateOrFallback } from '$lib/utils';
  import { _ } from 'svelte-i18n';
  import en from '$lib/i18n/en.json';

  const ensureString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' && value.trim().length ? value.trim() : fallback;

  const translate = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

  const heroCopy = (en.education?.hero ?? {}) as Record<string, any>;
  $: heroEyebrow = translate('education.hero.eyebrow', ensureString(heroCopy.eyebrow, 'Education partnership'));
  $: heroTitle = translate('education.hero.title', ensureString(heroCopy.title, 'AI literacy programmes that feel calm'));
  $: heroSubtitle = translate('education.hero.subtitle', ensureString(heroCopy.subtitle, 'Curricula co-designed with Latvian partners.'));
  $: heroDescription = translate('education.hero.description', ensureString(heroCopy.description, 'Workshops blend signage clarity, explainable AI demos, and governance checklists.'));
  $: heroPrimary = translate('education.hero.primary', ensureString(heroCopy.primary, 'Plan a pilot'));
  $: heroSecondary = translate('education.hero.secondary', ensureString(heroCopy.secondary, 'Download the syllabus'));

  const valueList = (en.education?.valueProps ?? []) as Array<Record<string, string>>;
  $: valueProps = valueList.slice(0, 3).map((entry, index) => ({
    icon: ensureString(entry.icon, 'idea'),
    title: translate(`education.valueProps.${index}.title`, ensureString(entry.title, 'Focus area')),
    body: translate(`education.valueProps.${index}.body`, ensureString(entry.body, 'Concise description.'))
  }));

  const programmeList = (en.education?.programmes?.items ?? []) as Array<Record<string, string>>;
  $: programmes = programmeList.slice(0, 2).map((entry, index) => ({
    icon: ensureString(entry.icon, 'target'),
    title: translate(`education.programmes.items.${index}.title`, ensureString(entry.title, 'Programme title')),
    body: translate(`education.programmes.items.${index}.body`, ensureString(entry.body, 'Brief explanation.')),
    cta: translate(`education.programmes.items.${index}.cta`, ensureString(entry.cta, 'Learn more')),
    href: ensureString(entry.href, '#')
  }));

  const ctaCopy = (en.education?.cta ?? {}) as Record<string, any>;
  $: ctaEyebrow = translate('education.cta.eyebrow', ensureString(ctaCopy.eyebrow, 'Next steps'));
  $: ctaTitle = translate('education.cta.title', ensureString(ctaCopy.title, 'Bring calm AI to your classroom'));
  $: ctaBody = translate('education.cta.body', ensureString(ctaCopy.body, 'Share your goals and we will tailor the pilot to your needs.'));
  $: ctaPrimary = translate('education.cta.primary', ensureString(ctaCopy.primary, 'Book a discovery call'));
  $: ctaSecondary = translate('education.cta.secondary', ensureString(ctaCopy.secondary, 'Request programme deck'));
</script>

<Hero variant="halo" title={heroTitle} subtitle={heroSubtitle}>
  <svelte:fragment slot="status">
    <span class="hero-kicker surface-pill" data-tone="accent">{heroEyebrow}</span>
  </svelte:fragment>
  <svelte:fragment slot="description">
    <p class="hero-description">{heroDescription}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button variant="gradient" size="lg" href="/contact">{heroPrimary}</Button>
      <Button variant="secondary" size="lg" href="mailto:AlgoRhythmics.dev@gmail.com">{heroSecondary}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="value-props" use:revealOnScroll>
  <div class="container value-props__layout">
    {#each valueProps as prop (prop.title)}
      <GlassCard class="value-card" padding="lg">
        <div class="value-card__icon">
          <Icon name={prop.icon} size={22} />
        </div>
        <h3>{prop.title}</h3>
        <p>{prop.body}</p>
      </GlassCard>
    {/each}
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="programmes" use:revealOnScroll>
  <div class="container programmes__grid">
    {#each programmes as programme (programme.title)}
      <GlassCard class="programme-card" halo padding="lg">
        <div class="programme-card__icon">
          <Icon name={programme.icon} size={22} />
        </div>
        <h3>{programme.title}</h3>
        <p>{programme.body}</p>
        <Button href={programme.href} variant="gradient" size="md">{programme.cta}</Button>
      </GlassCard>
    {/each}
  </div>
</section>

<section class="education-cta" use:revealOnScroll>
  <div class="container">
    <GlassCard class="education-cta__card" halo padding="lg">
      <span class="education-cta__eyebrow">{ctaEyebrow}</span>
      <h2>{ctaTitle}</h2>
      <p>{ctaBody}</p>
      <div class="education-cta__actions">
        <Button variant="gradient" size="lg" href="/contact">{ctaPrimary}</Button>
        <Button variant="secondary" size="lg" href="mailto:AlgoRhythmics.dev@gmail.com">{ctaSecondary}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .hero-kicker {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.8rem;
    font-size: var(--text-small);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

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

  .value-props,
  .programmes,
  .education-cta {
    padding: clamp(3.5rem, 9vw, 6rem) 0;
  }

  .value-props__layout {
    display: grid;
    gap: clamp(1.4rem, 3.5vw, 2.2rem);
  }

  :global(.value-card) {
    display: grid;
    gap: 0.75rem;
  }

  .value-card__icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg-elev-2) 86%, rgba(var(--voyage-blue-rgb), 0.2) 14%);
  }

  .programmes__grid {
    display: grid;
    gap: clamp(1.4rem, 3.5vw, 2.2rem);
  }

  :global(.programme-card) {
    display: grid;
    gap: 0.75rem;
  }

  .programme-card__icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg-elev-2) 86%, rgba(var(--signal-yellow-rgb), 0.22) 14%);
  }

  :global(.education-cta__card) {
    display: grid;
    gap: 1rem;
    text-align: center;
  }

  .education-cta__actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .value-props__layout,
    .programmes__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .value-props__layout {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
