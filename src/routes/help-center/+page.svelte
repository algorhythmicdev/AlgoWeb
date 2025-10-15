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
    eyebrowKey: 'help.page.hero.eyebrow',
    eyebrowFallback: 'Support & knowledge base',
    titleKey: 'help.page.hero.title',
    titleFallback: 'Welcome to the AlgoRhythmics Help Center',
    subtitleKey: 'help.page.hero.subtitle',
    subtitleFallback:
      'Guides, calm AI rituals, and live status updates to help your team feel confident with our products and programmes.',
    descriptionKey: 'help.page.hero.description',
    descriptionFallback:
      'Explore walkthroughs for NodeVoyage and Ideonautix, download onboarding packs, or connect with a human in just a few clicks. We keep every article AAA accessible and localised for our core languages.',
    primary: {
      href: '/contact#form',
      labelKey: 'help.page.hero.primary',
      labelFallback: 'Message support'
    },
    secondary: {
      href: '#faq',
      labelKey: 'help.page.hero.secondary',
      labelFallback: 'Jump to quick answers'
    }
  } as const;

  const heroMedia = {
    image: '/images/placeholders/help-center-desk.svg',
    altKey: 'help.page.hero.media.alt',
    altFallback: 'Support desk with glowing nodes connected across calm displays',
    captionKey: 'help.page.hero.media.caption',
    captionFallback:
      'Every channel feeds into the same calm command centre—transcripts, status notes, and playbooks stay transparent for your crew.'
  } as const;

  const knowledgeBase = [
    {
      icon: 'idea',
      eyebrowKey: 'help.page.knowledge.items.onboarding.eyebrow',
      eyebrowFallback: 'Start here',
      titleKey: 'help.page.knowledge.items.onboarding.title',
      titleFallback: 'Onboarding rituals & rollout plans',
      copyKey: 'help.page.knowledge.items.onboarding.copy',
      copyFallback:
        'Step-by-step launch plans for NodeVoyage journeys, Ideonautix pilots, and consulting engagements—complete with printable pacing cards.',
      bullets: [
        {
          key: 'help.page.knowledge.items.onboarding.bullets.0',
          fallback: 'Facilitator checklists for travel crews and startup pods'
        },
        {
          key: 'help.page.knowledge.items.onboarding.bullets.1',
          fallback: 'Orientation slides and talking points in EN · LV · RU'
        },
        {
          key: 'help.page.knowledge.items.onboarding.bullets.2',
          fallback: 'Opt-in email templates and privacy notices ready to send'
        }
      ],
      accent: 'aurora',
      cta: {
        href: '#resources',
        labelKey: 'help.page.knowledge.items.onboarding.cta',
        labelFallback: 'Download starter packs'
      }
    },
    {
      icon: 'map',
      eyebrowKey: 'help.page.knowledge.items.nodevoyage.eyebrow',
      eyebrowFallback: 'NodeVoyage',
      titleKey: 'help.page.knowledge.items.nodevoyage.title',
      titleFallback: 'Trips, missions, and travel journaling',
      copyKey: 'help.page.knowledge.items.nodevoyage.copy',
      copyFallback:
        'Understand itinerary co-creation, mission scoring, and accessibility controls for the travel OS.',
      bullets: [
        {
          key: 'help.page.knowledge.items.nodevoyage.bullets.0',
          fallback: 'Configure shared boards for family and classroom trips'
        },
        {
          key: 'help.page.knowledge.items.nodevoyage.bullets.1',
          fallback: 'How memory anchors, AR translation, and offline mode work'
        },
        {
          key: 'help.page.knowledge.items.nodevoyage.bullets.2',
          fallback: 'Service levels & response windows for premium pilots'
        }
      ],
      accent: 'voyage',
      cta: {
        href: '/nodevoyage',
        labelKey: 'help.page.knowledge.items.nodevoyage.cta',
        labelFallback: 'Visit NodeVoyage overview'
      }
    },
    {
      icon: 'ai',
      eyebrowKey: 'help.page.knowledge.items.ideonautix.eyebrow',
      eyebrowFallback: 'Ideonautix',
      titleKey: 'help.page.knowledge.items.ideonautix.title',
      titleFallback: 'Modular copilots & calm productivity',
      copyKey: 'help.page.knowledge.items.ideonautix.copy',
      copyFallback:
        'Explore module-by-module tutorials, workspace governance tips, and explainable AI prompts to share with your team.',
      bullets: [
        {
          key: 'help.page.knowledge.items.ideonautix.bullets.0',
          fallback: 'Pitch Assistant script library with rehearsal notes'
        },
        {
          key: 'help.page.knowledge.items.ideonautix.bullets.1',
          fallback: 'Pomodoro Coach and focus rituals for hybrid teams'
        },
        {
          key: 'help.page.knowledge.items.ideonautix.bullets.2',
          fallback: 'Security briefings and API scopes for technical leads'
        }
      ],
      accent: 'ideonautix',
      cta: {
        href: '/ideonautix',
        labelKey: 'help.page.knowledge.items.ideonautix.cta',
        labelFallback: 'Review Ideonautix modules'
      }
    },
    {
      icon: 'info',
      eyebrowKey: 'help.page.knowledge.items.policies.eyebrow',
      eyebrowFallback: 'Policies',
      titleKey: 'help.page.knowledge.items.policies.title',
      titleFallback: 'Trust, accessibility, and compliance',
      copyKey: 'help.page.knowledge.items.policies.copy',
      copyFallback:
        'Plain-language policies for privacy, data retention, high-contrast design, and emergency support escalation.',
      bullets: [
        {
          key: 'help.page.knowledge.items.policies.bullets.0',
          fallback: 'GDPR-ready privacy templates and data processing notes'
        },
        {
          key: 'help.page.knowledge.items.policies.bullets.1',
          fallback: 'AAA accessibility commitments and reporting loop'
        },
        {
          key: 'help.page.knowledge.items.policies.bullets.2',
          fallback: 'Status communication workflow for outages and incidents'
        }
      ],
      accent: 'neutral',
      cta: {
        href: '#status',
        labelKey: 'help.page.knowledge.items.policies.cta',
        labelFallback: 'Read status playbook'
      }
    }
  ] as const;

  const knowledgeMedia = {
    image: '/images/placeholders/education-lab.svg',
    altKey: 'help.page.knowledge.media.alt',
    altFallback: 'Calm AI lab with touchscreen displays and inclusive learning stations',
    captionKey: 'help.page.knowledge.media.caption',
    captionFallback:
      'Walk through guided paths for teachers, founders, and families—each toolkit blends signage clarity with multilingual support.'
  } as const;

  const faqs = [
    {
      questionKey: 'help.page.faq.items.0.question',
      questionFallback: 'How fast will support reply to my ticket?',
      answerKey: 'help.page.faq.items.0.answer',
      answerFallback:
        'We respond to most enquiries within one business day. Pilot partners and consulting teams have a dedicated escalation inbox with a four-hour response window during business hours.'
    },
    {
      questionKey: 'help.page.faq.items.1.question',
      questionFallback: 'Where can I find training for my classroom or team?',
      answerKey: 'help.page.faq.items.1.answer',
      answerFallback:
        'Download facilitator packs in the resources section below or join our monthly live onboarding circles. Each session includes recordings, transcripts, and bilingual worksheets.'
    },
    {
      questionKey: 'help.page.faq.items.2.question',
      questionFallback: 'Do you offer SLA-backed support for enterprises?',
      answerKey: 'help.page.faq.items.2.answer',
      answerFallback:
        'Yes. Consulting retainers include a calm AI operations handbook, quarterly architecture reviews, and priority response for critical issues. Contact us to tailor the SLA to your team size and region.'
    },
    {
      questionKey: 'help.page.faq.items.3.question',
      questionFallback: 'Is content available in multiple languages?',
      answerKey: 'help.page.faq.items.3.answer',
      answerFallback:
        'Core help articles ship in English, Latvian, and Russian today, with French, Spanish, and Ukrainian arriving through 2026. Articles note their translation status and provide request links for additional languages.'
    }
  ] as const;

  const statusUpdates = [
    {
      statusKey: 'help.page.status.items.0.status',
      statusFallback: 'All systems operational',
      metaKey: 'help.page.status.items.0.meta',
      metaFallback: 'Last updated 12 April 2026 · 09:00 EEST',
      descriptionKey: 'help.page.status.items.0.description',
      descriptionFallback:
        'NodeVoyage APIs, Ideonautix modules, and contact channels are running smoothly. Next maintenance window: 20 April 2026 (rolling restart, < 10 minutes).'
    },
    {
      statusKey: 'help.page.status.items.1.status',
      statusFallback: 'Knowledge base refresh in progress',
      metaKey: 'help.page.status.items.1.meta',
      metaFallback: 'Editing window: 8–15 April 2026',
      descriptionKey: 'help.page.status.items.1.description',
      descriptionFallback:
        'We are translating the consulting playbook and Ideonautix Pomodoro Coach docs into French and Spanish. Articles remain available; expect incremental updates daily.'
    },
    {
      statusKey: 'help.page.status.items.2.status',
      statusFallback: 'Previous incident: Ideonautix sync delay',
      metaKey: 'help.page.status.items.2.meta',
      metaFallback: 'Resolved 2 April 2026',
      descriptionKey: 'help.page.status.items.2.description',
      descriptionFallback:
        'An infrastructure upgrade briefly delayed cross-device sync for Ideonautix workspaces. We added automated integrity checks and published the root-cause report in the resources archive.'
    }
  ] as const;

  const escalation = {
    eyebrowKey: 'help.page.escalation.eyebrow',
    eyebrowFallback: 'Need a hand?',
    titleKey: 'help.page.escalation.title',
    titleFallback: 'Reach our calm support crew',
    copyKey: 'help.page.escalation.copy',
    copyFallback:
      'If you cannot find what you need, our humans are ready. Choose a channel that matches your urgency and we will guide you every step.',
    channels: [
      {
        icon: 'mail',
        titleKey: 'help.page.escalation.channels.0.title',
        titleFallback: 'Email support',
        copyKey: 'help.page.escalation.channels.0.copy',
        copyFallback: 'help@algorhythmics.com replies within one business day with transparent next steps.',
        href: 'mailto:help@algorhythmics.com'
      },
      {
        icon: 'target',
        titleKey: 'help.page.escalation.channels.1.title',
        titleFallback: 'Priority pilot hotline',
        copyKey: 'help.page.escalation.channels.1.copy',
        copyFallback: 'Pilot and consulting partners get a dedicated Signal channel with 24-hour coverage.',
        href: '/contact#support'
      },
      {
        icon: 'people',
        titleKey: 'help.page.escalation.channels.2.title',
        titleFallback: 'Monthly office hours',
        copyKey: 'help.page.escalation.channels.2.copy',
        copyFallback: 'Join our calm AI clinics for live demos, Q&A, and peer learning stories.',
        href: '/education-hub#events'
      }
    ] as const
  } as const;

  const resourceArchive = {
    eyebrowKey: 'help.page.resources.eyebrow',
    eyebrowFallback: 'Resource archive',
    titleKey: 'help.page.resources.title',
    titleFallback: 'Latest help center releases',
    copyKey: 'help.page.resources.copy',
    copyFallback:
      'Browse freshly published articles, recordings, and templates. Each entry lists translation availability so your teams know what to expect.',
    items: [
      {
        titleKey: 'help.page.resources.items.0.title',
        titleFallback: 'Calm AI onboarding playbook — April 2026 update',
        metaKey: 'help.page.resources.items.0.meta',
        metaFallback: 'EN · LV · RU • PDF & slides',
        href: '#',
        descriptionKey: 'help.page.resources.items.0.description',
        descriptionFallback:
          'Updated facilitator prompts, signage-inspired icebreakers, and data transparency briefing for new cohorts.'
      },
      {
        titleKey: 'help.page.resources.items.1.title',
        titleFallback: 'Ideonautix Pomodoro Coach — troubleshooting checklist',
        metaKey: 'help.page.resources.items.1.meta',
        metaFallback: 'EN • Interactive guide',
        href: '#',
        descriptionKey: 'help.page.resources.items.1.description',
        descriptionFallback:
          'Diagnose sync issues, calibrate focus modes, and share best practices for neurodiverse teams.'
      },
      {
        titleKey: 'help.page.resources.items.2.title',
        titleFallback: 'NodeVoyage Mission Studio — educator tips',
        metaKey: 'help.page.resources.items.2.meta',
        metaFallback: 'EN · LV • Worksheet bundle',
        href: '#',
        descriptionKey: 'help.page.resources.items.2.description',
        descriptionFallback:
          'Co-create travel challenges with students, embed sustainability goals, and collect reflection stories responsibly.'
      }
    ] as const
  } as const;
</script>

<Hero
  class="hero--products"
  variant="halo"
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
  <svelte:fragment slot="aside">
    <GlassCard class="hero-media help-hero-media" padding="lg" particles>
      <figure class="media-card">
        <img
          class="media-card__image"
          src={heroMedia.image}
          alt={t(heroMedia.altKey, heroMedia.altFallback)}
          loading="lazy"
          width="640"
          height="400"
        />
        <figcaption class="media-card__caption">{t(heroMedia.captionKey, heroMedia.captionFallback)}</figcaption>
      </figure>
    </GlassCard>
  </svelte:fragment>
</Hero>

<section class="section knowledge" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('help.page.knowledge.eyebrow', 'Browse by focus')}</span>
      <h2>{t('help.page.knowledge.title', 'Curated paths for every collaborator')}</h2>
      <p>{t('help.page.knowledge.copy', 'Pick the guide that matches your role to see recommended rituals, checklists, and downloads.')}</p>
    </header>
    <div class="knowledge-grid" use:staggerReveal>
      <GlassCard class="knowledge-card knowledge-card--media" padding="lg" particles>
        <figure class="media-card">
          <img
            class="media-card__image"
            src={knowledgeMedia.image}
            alt={t(knowledgeMedia.altKey, knowledgeMedia.altFallback)}
            loading="lazy"
            width="640"
            height="400"
          />
          <figcaption class="media-card__caption">{t(knowledgeMedia.captionKey, knowledgeMedia.captionFallback)}</figcaption>
        </figure>
      </GlassCard>

      {#each knowledgeBase as category (category.titleKey)}
        <GlassCard class="knowledge-card" padding="lg" halo interactive data-tone={category.accent}>
          <div class="card-eyebrow">
            <Icon name={category.icon} size={26} />
            <span>{t(category.eyebrowKey, category.eyebrowFallback)}</span>
          </div>
          <h3>{t(category.titleKey, category.titleFallback)}</h3>
          <p>{t(category.copyKey, category.copyFallback)}</p>
          <ul>
            {#each category.bullets as bullet (bullet.key)}
              <li>{t(bullet.key, bullet.fallback)}</li>
            {/each}
          </ul>
          <Button href={category.cta.href} variant="secondary" size="md">{t(category.cta.labelKey, category.cta.labelFallback)}</Button>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section id="faq" class="section faq" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('help.page.faq.eyebrow', 'Quick answers')}</span>
      <h2>{t('help.page.faq.title', 'Frequently asked questions')}</h2>
      <p>{t('help.page.faq.copy', 'Short reads that cover the topics we hear about most from teams and families alike.')}</p>
    </header>
    <div class="faq-grid" use:staggerReveal>
      {#each faqs as item (item.questionKey)}
        <GlassCard class="faq-card" padding="md" interactive>
          <details>
            <summary>{t(item.questionKey, item.questionFallback)}</summary>
            <p>{t(item.answerKey, item.answerFallback)}</p>
          </details>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="citrus" />

<section id="status" class="section status" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <header class="section-heading" data-align="center">
      <span class="section-eyebrow">{t('help.page.status.eyebrow', 'Live status & history')}</span>
      <h2>{t('help.page.status.title', 'Transparent updates for every product')}</h2>
      <p>{t('help.page.status.copy', 'Follow current uptime, upcoming maintenance, and resolved incidents. Each update links to its full report when available.')}</p>
    </header>
    <div class="status-grid" use:staggerReveal>
      {#each statusUpdates as update (update.statusKey)}
        <GlassCard class="status-card" padding="lg" interactive data-tone="status">
          <div class="status-pill">{t(update.statusKey, update.statusFallback)}</div>
          <p class="status-meta">{t(update.metaKey, update.metaFallback)}</p>
          <p>{t(update.descriptionKey, update.descriptionFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="section escalation" data-surface="glow" use:revealOnScroll>
  <div class="container">
    <div class="escalation-grid" use:staggerReveal>
      <GlassCard class="escalation-card" padding="lg" halo interactive data-tone="escalation">
        <span class="section-eyebrow">{t(escalation.eyebrowKey, escalation.eyebrowFallback)}</span>
        <h2>{t(escalation.titleKey, escalation.titleFallback)}</h2>
        <p>{t(escalation.copyKey, escalation.copyFallback)}</p>
        <div class="channel-list">
          {#each escalation.channels as channel (channel.titleKey)}
            <div class="channel">
              <div class="channel-icon">
                <Icon name={channel.icon} size={24} />
              </div>
              <div class="channel-copy">
                <h3>{t(channel.titleKey, channel.titleFallback)}</h3>
                <p>{t(channel.copyKey, channel.copyFallback)}</p>
                <Button href={channel.href} variant="subtle">{t('help.page.escalation.cta', 'Open channel')}</Button>
              </div>
            </div>
          {/each}
        </div>
      </GlassCard>

      <GlassCard class="resources-card" padding="lg" id="resources" interactive data-tone="resources">
        <span class="section-eyebrow">{t(resourceArchive.eyebrowKey, resourceArchive.eyebrowFallback)}</span>
        <h2>{t(resourceArchive.titleKey, resourceArchive.titleFallback)}</h2>
        <p>{t(resourceArchive.copyKey, resourceArchive.copyFallback)}</p>
        <ul class="resource-list">
          {#each resourceArchive.items as resource (resource.titleKey)}
            <li>
              <div class="resource-meta">
                <span class="resource-title">{t(resource.titleKey, resource.titleFallback)}</span>
                <span class="resource-tag">{t(resource.metaKey, resource.metaFallback)}</span>
              </div>
              <p>{t(resource.descriptionKey, resource.descriptionFallback)}</p>
              <Button href={resource.href} variant="secondary">{t('help.page.resources.cta', 'Open resource')}</Button>
            </li>
          {/each}
        </ul>
        <div class="resources-footer">
          <Button href="/education-hub#insights" variant="subtle">{t('help.page.resources.secondary', 'View all insights')}</Button>
        </div>
      </GlassCard>
    </div>
  </div>
</section>

<style>
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-md, 1rem);
    align-items: center;
  }

  .hero-description {
    max-width: 60ch;
    margin-inline: auto;
  }

  .section.knowledge,
  .section.faq,
  .section.status,
  .section.escalation {
    isolation: isolate;
  }

  .section.knowledge {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.24);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  .section.faq {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  .section.status {
    --section-glow-primary: rgba(var(--signal-yellow-rgb), 0.18);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.16);
    --section-glow-accent: rgba(var(--voyage-blue-rgb), 0.12);
  }

  .section.escalation {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.28);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.16);
  }

  .section-heading {
    margin-block-end: clamp(2rem, 5vw, 3rem);
  }

  .knowledge-grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  :global(.knowledge-card) {
    display: grid;
    gap: clamp(1rem, 2.4vw, 1.6rem);
    align-content: start;
    height: 100%;
    transition: box-shadow var(--duration-fast, 240ms) ease;
  }

  :global(.knowledge-card--media) {
    align-content: stretch;
  }

  :global(.help-hero-media) {
    margin-top: clamp(1rem, 3vw, 1.6rem);
  }

  :global(.knowledge-card[data-tone='aurora']) {
    --glass-card-surface: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--aurora-purple-rgb), 0.12) 8%);
    --glass-card-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.42) 50%, transparent 50%);
    --glass-card-spot-a: rgba(var(--aurora-purple-rgb), 0.28);
    --glass-card-spot-b: rgba(var(--voyage-blue-rgb), 0.2);
    --glass-card-veil: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.24) 38%, transparent 62%);
    --glass-card-halo: rgba(var(--aurora-purple-rgb), 0.3);
  }

  :global(.knowledge-card[data-tone='voyage']) {
    --glass-card-surface: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--voyage-blue-rgb), 0.12) 10%);
    --glass-card-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.38) 52%, transparent 48%);
    --glass-card-spot-a: rgba(var(--voyage-blue-rgb), 0.3);
    --glass-card-spot-b: rgba(var(--aurora-purple-rgb), 0.18);
    --glass-card-veil: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.24) 40%, transparent 60%);
    --glass-card-halo: rgba(var(--voyage-blue-rgb), 0.26);
  }

  :global(.knowledge-card[data-tone='ideonautix']) {
    --glass-card-surface: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--slate-base-rgb), 0.2) 12%);
    --glass-card-border: color-mix(in srgb, rgba(var(--slate-base-rgb), 0.45) 52%, transparent 48%);
    --glass-card-spot-a: rgba(var(--slate-base-rgb), 0.28);
    --glass-card-spot-b: rgba(var(--aurora-purple-rgb), 0.18);
    --glass-card-veil: color-mix(in srgb, rgba(var(--slate-base-rgb), 0.28) 40%, transparent 60%);
    --glass-card-halo: rgba(var(--slate-base-rgb), 0.26);
  }

  :global(.knowledge-card[data-tone='neutral']) {
    --glass-card-surface: color-mix(in srgb, var(--bg-elev-1) 94%, rgba(var(--ink-rgb), 0.08) 6%);
    --glass-card-border: color-mix(in srgb, rgba(var(--ink-rgb), 0.18) 56%, transparent 44%);
    --glass-card-spot-a: rgba(var(--ink-rgb), 0.16);
    --glass-card-spot-b: rgba(var(--voyage-blue-rgb), 0.12);
    --glass-card-veil: color-mix(in srgb, rgba(var(--ink-rgb), 0.14) 42%, transparent 58%);
    --glass-card-halo: rgba(var(--ink-rgb), 0.2);
    --glass-card-veil-opacity: 0.5;
  }

  :global(.knowledge-card) ul {
    margin: 0;
    padding: 0 0 0 1.1rem;
    display: grid;
    gap: 0.5rem;
    list-style: disc;
    color: var(--text-secondary);
    font-size: var(--text-small);
  }

  .card-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-size: var(--text-small);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--text-tertiary);
  }

  .faq-grid {
    display: grid;
    gap: clamp(1rem, 2.4vw, 1.6rem);
  }

  :global(.faq-card) {
    padding: clamp(1.2rem, 2.4vw, 1.6rem);
    --glass-card-surface: color-mix(in srgb, var(--bg-elev-1) 92%, rgba(var(--voyage-blue-rgb), 0.08) 8%);
    --glass-card-border: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.32) 50%, transparent 50%);
    --glass-card-spot-a: rgba(var(--voyage-blue-rgb), 0.22);
    --glass-card-spot-b: rgba(var(--aurora-purple-rgb), 0.14);
    --glass-card-halo: rgba(var(--voyage-blue-rgb), 0.24);
  }

  details {
    display: grid;
    gap: 0.75rem;
    transition: color var(--duration-ui, 240ms) ease;
  }

  summary {
    font-weight: var(--weight-semibold);
    cursor: pointer;
    position: relative;
    padding-right: 1.5rem;
    list-style: none;
  }

  summary::marker {
    display: none;
  }

  summary::after {
    content: '';
    position: absolute;
    inset-inline-end: 0;
    top: 0.4rem;
    width: 0.75rem;
    height: 0.75rem;
    border: 2px solid currentColor;
    border-left: 0;
    border-top: 0;
    transform: rotate(45deg);
    transition: transform var(--duration-ui, 240ms) ease;
  }

  details[open] summary::after {
    transform: translateY(0.2rem) rotate(225deg);
  }

  summary:focus-visible {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 4px;
  }

  details:focus-within summary {
    color: color-mix(in srgb, var(--text) 90%, var(--voyage-blue) 10%);
  }

  details p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .status-grid {
    display: grid;
    gap: clamp(1.2rem, 2.8vw, 2rem);
  }

  :global(.status-card) {
    display: grid;
    gap: clamp(0.8rem, 2vw, 1.2rem);
    --glass-card-surface: color-mix(in srgb, var(--glass-bg-lightest) 66%, transparent 34%);
    --glass-card-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.26) 48%, transparent 52%);
    --glass-card-spot-a: rgba(var(--aurora-purple-rgb), 0.28);
    --glass-card-spot-b: rgba(var(--voyage-blue-rgb), 0.2);
    --glass-card-halo: rgba(var(--aurora-purple-rgb), 0.26);
    --glass-card-halo-opacity: 0.3;
  }

  :global(.status-card[data-tone='status']) .status-pill {
    background: color-mix(in srgb, var(--glass-bg-lightest) 58%, transparent 42%);
    color: color-mix(in srgb, var(--aurora-purple) 78%, rgba(var(--ink-rgb), 0.2) 22%);
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.75rem;
    border-radius: var(--radius-pill, 999px);
    background: color-mix(in srgb, var(--glass-bg-lightest) 56%, transparent 44%);
    color: var(--aurora-purple);
    font-size: var(--text-small);
    font-weight: var(--weight-semibold);
  }

  .status-meta {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .escalation-grid {
    display: grid;
    gap: clamp(1.6rem, 3vw, 2.4rem);
  }

  :global(.escalation-card),
  :global(.resources-card) {
    display: grid;
    gap: clamp(1rem, 2.6vw, 1.6rem);
  }

  :global(.escalation-card[data-tone='escalation']) {
    --glass-card-surface: color-mix(in srgb, var(--glass-bg-lightest) 66%, transparent 34%);
    --glass-card-border: color-mix(in srgb, rgba(var(--signal-yellow-rgb), 0.22) 52%, transparent 48%);
    --glass-card-spot-a: rgba(var(--signal-yellow-rgb), 0.26);
    --glass-card-spot-b: rgba(var(--aurora-purple-rgb), 0.16);
    --glass-card-halo: rgba(var(--signal-yellow-rgb), 0.28);
  }

  :global(.resources-card[data-tone='resources']) {
    --glass-card-surface: color-mix(in srgb, var(--glass-bg-lightest) 66%, transparent 34%);
    --glass-card-border: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.2) 54%, transparent 46%);
    --glass-card-spot-a: rgba(var(--aurora-purple-rgb), 0.26);
    --glass-card-spot-b: rgba(var(--voyage-blue-rgb), 0.18);
    --glass-card-veil: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.24) 36%, transparent 64%);
    --glass-card-halo: rgba(var(--aurora-purple-rgb), 0.26);
  }

  .channel-list {
    display: grid;
    gap: clamp(1rem, 2.4vw, 1.5rem);
  }

  .channel {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: auto 1fr;
    align-items: start;
  }

  .channel-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--radius-full);
    display: inline-grid;
    place-items: center;
    background: color-mix(in srgb, var(--glass-bg-lightest) 58%, transparent 42%);
    color: var(--signal-yellow);
  }

  .channel-copy h3 {
    margin: 0;
    font-size: clamp(1.05rem, 2vw, 1.25rem);
  }

  .channel-copy p {
    margin: 0 0 0.5rem;
    color: var(--text-secondary);
  }

  .resource-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: clamp(1rem, 2.4vw, 1.6rem);
  }

  .resource-meta {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .resource-title {
    font-weight: var(--weight-semibold);
  }

  .resource-tag {
    font-size: var(--text-small);
    color: var(--text-tertiary);
  }

  .resources-footer {
    display: flex;
    justify-content: center;
  }

  @media (min-width: 880px) {
    .knowledge-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .faq-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .status-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .escalation-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: stretch;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .knowledge::before,
    .faq::before,
    .status::before,
    .escalation::before {
      animation: none;
      opacity: 0.8;
    }

    summary::after {
      transition: none;
    }
  }
</style>
