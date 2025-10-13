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

  const heroCopy = (en.about?.hero ?? {}) as Record<string, any>;
  $: heroEyebrow = translate('about.hero.eyebrow', ensureString(heroCopy.eyebrow, 'Inside AlgoRhythmics'));
  $: heroTitle = translate('about.hero.title', ensureString(heroCopy.title, 'Calm AI, crafted in Riga and Rotterdam'));
  $: heroSubtitle = translate('about.hero.subtitle', ensureString(heroCopy.subtitle, 'One operating rhythm across products, consulting, and education.'));
  $: heroDescription = translate('about.hero.description', ensureString(heroCopy.description, 'Signage craft, accessible design, and transparent automation.'));
  $: heroPrimary = translate('about.hero.primary', ensureString(heroCopy.primary, 'Explore products'));
  $: heroSecondary = translate('about.hero.secondary', ensureString(heroCopy.secondary, 'Talk with the founders'));

  const valueList = (en.about?.values ?? []) as Array<Record<string, string>>;
  $: values = valueList.slice(0, 3).map((entry, index) => ({
    icon: ensureString(entry.icon, 'idea'),
    title: translate(`about.values.${index}.title`, ensureString(entry.title, 'Value title')),
    body: translate(`about.values.${index}.body`, ensureString(entry.body, 'Value description.'))
  }));

  const timelineList = (en.about?.timeline?.items ?? []) as Array<Record<string, string>>;
  $: timeline = timelineList.slice(0, 3).map((entry, index) => ({
    year: translate(`about.timeline.items.${index}.year`, ensureString(entry.year, '2023')),
    title: translate(`about.timeline.items.${index}.title`, ensureString(entry.title, 'Milestone')),
    description: translate(`about.timeline.items.${index}.description`, ensureString(entry.description, 'Brief note.'))
  }));

  const teamList = (en.about?.team?.members ?? []) as Array<Record<string, string>>;
  $: team = teamList.slice(0, 2).map((entry, index) => ({
    name: translate(`about.team.members.${index}.name`, ensureString(entry.name, 'Founder')),
    role: translate(`about.team.members.${index}.role`, ensureString(entry.role, 'Role')),
    bio: translate(`about.team.members.${index}.bio`, ensureString(entry.bio, 'Short bio.'))
  }));

  const ctaCopy = (en.about?.cta ?? {}) as Record<string, any>;
  $: ctaEyebrow = translate('about.cta.eyebrow', ensureString(ctaCopy.eyebrow, 'Collaborate with us'));
  $: ctaTitle = translate('about.cta.title', ensureString(ctaCopy.title, 'Let’s build calm AI together'));
  $: ctaBody = translate('about.cta.body', ensureString(ctaCopy.body, 'Bring your roadmap and we will help choreograph accessible rituals.'));
  $: ctaPrimary = translate('about.cta.primary', ensureString(ctaCopy.primary, 'Schedule a strategy session'));
  $: ctaSecondary = translate('about.cta.secondary', ensureString(ctaCopy.secondary, 'Explore our products'));
</script>

<Hero variant="grid" title={heroTitle} subtitle={heroSubtitle}>
  <svelte:fragment slot="status">
    <span class="hero-kicker surface-pill" data-tone="accent">{heroEyebrow}</span>
  </svelte:fragment>
  <svelte:fragment slot="description">
    <p class="hero-description">{heroDescription}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button variant="gradient" size="lg" href="/products">{heroPrimary}</Button>
      <Button variant="secondary" size="lg" href="/contact">{heroSecondary}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="values" use:revealOnScroll>
  <div class="container values__grid">
    {#each values as value (value.title)}
      <GlassCard class="values__card" padding="lg">
        <div class="values__icon">
          <Icon name={value.icon} size={22} />
        </div>
        <h3>{value.title}</h3>
        <p>{value.body}</p>
      </GlassCard>
    {/each}
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="timeline" use:revealOnScroll>
  <div class="container timeline__grid">
    {#each timeline as item (item.title)}
      <GlassCard class="timeline__card" padding="lg">
        <span class="timeline__year">{item.year}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </GlassCard>
    {/each}
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="team" use:revealOnScroll>
  <div class="container team__grid">
    {#each team as member (member.name)}
      <GlassCard class="team-card" padding="lg">
        <h3>{member.name}</h3>
        <span class="team-card__role">{member.role}</span>
        <p>{member.bio}</p>
      </GlassCard>
    {/each}
  </div>
</section>

<section class="about-cta" use:revealOnScroll>
  <div class="container">
    <GlassCard class="about-cta__card" halo padding="lg">
      <span class="about-cta__eyebrow">{ctaEyebrow}</span>
      <h2>{ctaTitle}</h2>
      <p>{ctaBody}</p>
      <div class="about-cta__actions">
        <Button variant="gradient" size="lg" href="/contact">{ctaPrimary}</Button>
        <Button variant="secondary" size="lg" href="/products">{ctaSecondary}</Button>
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

  .values,
  .timeline,
  .team,
  .about-cta {
    padding: clamp(3.5rem, 9vw, 6rem) 0;
  }

  .values__grid,
  .timeline__grid,
  .team__grid {
    display: grid;
    gap: clamp(1.4rem, 3.5vw, 2.2rem);
  }

  :global(.values__card),
  :global(.timeline__card),
  :global(.team-card) {
    display: grid;
    gap: 0.75rem;
  }

  .values__icon {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--bg-elev-2) 86%, rgba(var(--voyage-blue-rgb), 0.2) 14%);
  }

  .timeline__year {
    font-size: var(--text-small);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .team-card__role {
    font-size: var(--text-small);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  :global(.about-cta__card) {
    display: grid;
    gap: 1rem;
    text-align: center;
  }

  .about-cta__eyebrow {
    font-size: var(--text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .about-cta__actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .values__grid,
    .timeline__grid,
    .team__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .values__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
