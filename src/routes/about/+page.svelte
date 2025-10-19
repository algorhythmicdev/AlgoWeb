<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string) => translateOrFallback($_, key, fallback);

  const hero = {
    eyebrowKey: 'about.page.hero.eyebrow',
    eyebrowFallback: 'Inside AlgoRhythmics',
    titleKey: 'about.page.hero.title',
    titleFallback: 'Calm AI, crafted in Riga and Rotterdam',
    subtitleKey: 'about.page.hero.subtitle',
    subtitleFallback:
      'We are a Latvian-born studio where algorithms and artistry share the same rhythm. Our work blends signage precision, inclusive design, and playful experimentation.',
    descriptionKey: 'about.page.hero.description',
    descriptionFallback:
      'Founded in 2025 by technologists and educators, AlgoRhythmics believes logic and creativity belong together. From AI platforms to classroom pilots, we choreograph solutions that explain themselves and invite collaboration.',
    primary: {
      href: '/services',
      labelKey: 'about.page.hero.primary_cta',
      labelFallback: 'Explore Our Services'
    },
    secondary: {
      href: '#team',
      labelKey: 'about.page.hero.secondary_cta',
      labelFallback: 'Meet the Team'
    }
  } as const;

  const values = [
    {
      icon: 'education',
      titleKey: 'about.page.values.education_first.title',
      titleFallback: 'Education first',
      copyKey: 'about.page.values.education_first.copy',
      copyFallback:
        'We nurture AI literacy in classrooms and community hubs. Free resources and respectful mentorship keep curiosity alive for every learner.'
    },
    {
      icon: 'target',
      titleKey: 'about.page.values.empowerment.title',
      titleFallback: 'Empowerment through technology',
      copyKey: 'about.page.values.empowerment.copy',
      copyFallback:
        'Whether you are a founder, teacher, or student, our tools are designed to feel welcoming, intuitive, and human-centred.'
    },
    {
      icon: 'idea',
      titleKey: 'about.page.values.integrity.title',
      titleFallback: 'Innovation with integrity',
      copyKey: 'about.page.values.integrity.copy',
      copyFallback:
        'Ethical guardrails, privacy, and transparency guide every release. We document automation decisions in plain language so trust stays intact.'
    },
    {
      icon: 'people',
      titleKey: 'about.page.values.community.title',
      titleFallback: 'Community & collaboration',
      copyKey: 'about.page.values.community.copy',
      copyFallback:
        'Partnerships with parents, cultural institutions, and industry mentors turn AI into a shared dance rather than a solo act.'
    }
  ] as const;

  const story = {
    introKey: 'about.page.story.intro',
    introFallback:
      "What began as a small startup in Riga has grown into a bridge between education, culture, and industry. Early collaborations with Latvia's Investment and Development Agency (LIAA) helped us champion AI education nationwide.",
    milestones: [
      {
        key: 'about.page.story.milestones.0',
        fallback:
          'Launched pilot programmes in local schools where students built projects with our tools and saw their ideas come alive.'
      },
      {
        key: 'about.page.story.milestones.1',
        fallback:
          'Tailored Ideonautix for startups after listening to founders who needed calm, creative productivity support.'
      },
      {
        key: 'about.page.story.milestones.2',
        fallback:
          'Expanded partnerships with museums, libraries, and international conferences—proving that logic and art thrive together.'
      }
    ],
    cultureKey: 'about.page.story.culture',
    cultureFallback:
      'Inside the studio we host Logic/Dance sessions—one day a data science hackathon, the next an improv design workshop. This fusion of play and rigor shapes the experiences we ship.'
  } as const;

  const team = [
    {
      nameKey: 'about.page.team.members.nikita.name',
      nameFallback: 'Nikita Jurtaevs',
      roleKey: 'about.page.team.members.nikita.role',
      roleFallback: 'Co-founder & CEO',
      focusKey: 'about.page.team.members.nikita.focus',
      focusFallback: 'Signage craft, storytelling, and partner delivery',
      bioKey: 'about.page.team.members.nikita.bio',
      bioFallback:
        'Nikita keeps product direction, accessibility, and partnerships aligned. He brings signage-floor realism to every interface and programme.',
      links: [
        { labelKey: 'about.page.team.members.nikita.links.email', labelFallback: 'Email', href: 'mailto:nikita@algorhythmics.ai' },
        {
          labelKey: 'about.page.team.members.nikita.links.linkedin',
          labelFallback: 'LinkedIn',
          href: 'https://www.linkedin.com/in/nikitajurtaevs/'
        }
      ],
      photo: '/images/placeholders/team-nikita.svg'
    },
    {
      nameKey: 'about.page.team.members.slaff.name',
      nameFallback: 'Vjaceslavs "Slaff" Trosins',
      roleKey: 'about.page.team.members.slaff.role',
      roleFallback: 'Co-founder & CTO',
      focusKey: 'about.page.team.members.slaff.focus',
      focusFallback: 'Cloud architecture, explainable AI, and operations',
      bioKey: 'about.page.team.members.slaff.bio',
      bioFallback:
        'Slaff orchestrates engineering, data flows, and AI integrations. He connects hardware-grade discipline with transparent software experiences.',
      links: [
        { labelKey: 'about.page.team.members.slaff.links.email', labelFallback: 'Email', href: 'mailto:slaff@algorhythmics.ai' },
        { labelKey: 'about.page.team.members.slaff.links.linkedin', labelFallback: 'LinkedIn', href: 'https://www.linkedin.com/in/slaff/' }
      ],
      photo: '/images/placeholders/team-slaff.svg'
    }
  ] as const;

  const finale = {
    eyebrowKey: 'about.page.finale.eyebrow',
    eyebrowFallback: 'Join us',
    titleKey: 'about.page.finale.title',
    titleFallback: 'Join the rhythm',
    copyKey: 'about.page.finale.copy',
    copyFallback:
      'We welcome collaborators who care about accessible technology, joyful learning, and responsible automation. Whether you are exploring careers, partnerships, or sponsorships, let’s build together.',
    primary: {
      href: '/contact',
      labelKey: 'about.page.finale.primary_cta',
      labelFallback: 'Connect with AlgoRhythmics'
    },
    secondary: {
      href: '/education-hub#newsletter',
      labelKey: 'about.page.finale.secondary_cta',
      labelFallback: 'Subscribe to Updates'
    }
  } as const;
</script>

<Hero
  class="hero--products"
  variant="grid"
  title={t(hero.titleKey, hero.titleFallback)}
  subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
>
  <svelte:fragment slot="status">
    <span class="hero-kicker surface-pill" data-tone="accent">{t(hero.eyebrowKey, hero.eyebrowFallback)}</span>
  </svelte:fragment>
  <svelte:fragment slot="description">
    <p class="hero-description">{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button variant="gradient" size="lg" href={hero.primary.href}>{t(hero.primary.labelKey, hero.primary.labelFallback)}</Button>
      <Button variant="secondary" size="lg" href={hero.secondary.href}>{t(hero.secondary.labelKey, hero.secondary.labelFallback)}</Button>
    </div>
  </svelte:fragment>
</Hero>

<section class="section who-we-are" data-surface="glow" use:revealOnScroll>
  <div class="container who-we-are__grid">
    <GlassCard class="about-card" padding="lg">
      <h2>{t('about.page.story.heading')}</h2>
      <p>{t(story.introKey, story.introFallback)}</p>
      <p>
        {t(story.cultureKey, story.cultureFallback)}
      </p>
    </GlassCard>
    <GlassCard class="about-card" padding="lg" halo>
      <h2>{t('about.page.story.milestones_heading')}</h2>
      <ul>
        {#each story.milestones as milestone (milestone.key)}
          <li>{t(milestone.key, milestone.fallback)}</li>
        {/each}
      </ul>
      <div class="card-actions">
        <Button href="/education-hub#case-studies" variant="secondary" size="md">{t('about.page.story.cta')}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="section values" data-surface="glow" aria-labelledby="values-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('about.page.values.eyebrow')}</span>
      <h2 id="values-heading">{t('about.page.values.title')}</h2>
      <p>
        {t('about.page.values.copy')}
      </p>
    </header>

    <div class="values__grid" use:staggerReveal>
      {#each values as value (value.titleKey)}
        <GlassCard class="value-card" padding="lg">
          <div class="value-icon">
            <Icon name={value.icon} size={26} />
          </div>
          <h3>{t(value.titleKey, value.titleFallback)}</h3>
          <p>{t(value.copyKey, value.copyFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="section team" data-surface="glow" id="team" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('about.page.team.eyebrow')}</span>
      <h2>{t('about.page.team.title')}</h2>
      <p>
        {t('about.page.team.copy')}
      </p>
    </header>

    <div class="team__grid" use:staggerReveal>
      {#each team as member (member.nameKey)}
        <GlassCard class="team-card" padding="lg">
          <img
            class="team-photo"
            src={member.photo}
            alt={`${t(member.nameKey, member.nameFallback)} portrait`}
            width="480"
            height="360"
            loading="lazy"
          />
          <h3>{t(member.nameKey, member.nameFallback)}</h3>
          <span class="team-role">{t(member.roleKey, member.roleFallback)}</span>
          <p class="team-focus">
            {t('about.page.team.focus_label').replace('{focus}', t(member.focusKey, member.focusFallback))}
          </p>
          <p>{t(member.bioKey, member.bioFallback)}</p>
          <div class="team-links">
            {#each member.links as link (link.href)}
              <a href={link.href}>{t(link.labelKey, link.labelFallback)}</a>
            {/each}
          </div>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<section class="section finale" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <GlassCard class="finale-card" halo padding="lg">
      <span class="section-eyebrow">{t(finale.eyebrowKey, finale.eyebrowFallback)}</span>
      <h2>{t(finale.titleKey, finale.titleFallback)}</h2>
      <p>{t(finale.copyKey, finale.copyFallback)}</p>
      <div class="card-actions">
        <Button href={finale.primary.href} variant="gradient" size="lg">{t(finale.primary.labelKey, finale.primary.labelFallback)}</Button>
        <Button href={finale.secondary.href} variant="secondary" size="lg">{t(finale.secondary.labelKey, finale.secondary.labelFallback)}</Button>
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
    max-width: 70ch;
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

  .section.who-we-are,
  .section.values,
  .section.team,
  .section.finale {
    isolation: isolate;
  }

  .section.who-we-are {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.16);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  .section.values {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.2);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  .section.team {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.26);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  .section.finale {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.3);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.16);
  }

  .who-we-are__grid,
  .values__grid,
  .team__grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  .team-photo {
    width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--shadow-lg);
  }

  :global(.about-card),
  :global(.value-card),
  :global(.team-card),
  :global(.finale-card) {
    display: grid;
    gap: clamp(1rem, 3vw, 1.6rem);
  }

  :global(.about-card) ul {
    margin: 0;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.45rem;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .section-heading {
    margin-block-end: clamp(2rem, 6vw, 3rem);
  }

  .value-icon {
    width: 3rem;
    height: 3rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 56%, transparent 44%);
    color: var(--voyage-blue);
  }

  .team-role {
    font-size: var(--text-small);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-tertiary);
  }

  .team-focus {
    font-weight: var(--weight-semibold);
    color: var(--text-secondary);
  }

  .team-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
  }

  .team-links a {
    color: var(--voyage-blue);
    font-weight: var(--weight-semibold);
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm, 0.75rem);
    align-items: center;
  }

  @media (min-width: 900px) {
    .who-we-are__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .values__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .team__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .who-we-are,
    .values,
    .team,
    .finale {
      animation: none;
    }
  }
</style>


