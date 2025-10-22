<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Section from '$lib/components/Section.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { _ } from '$lib/i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  type TranslationParams = Record<string, unknown>;

  const t = (
    key: string,
    fallbackOrParams?: string | TranslationParams,
    params?: TranslationParams
  ) => {
    const fallback = typeof fallbackOrParams === 'string' ? fallbackOrParams : '';
    const finalParams =
      typeof fallbackOrParams === 'string' || fallbackOrParams === undefined
        ? params
        : fallbackOrParams;
    return translateOrFallback($_, key, fallback, finalParams);
  };

  const hero = {
    titleKey: 'nodevoyage.hero.title',
    titleFallback: 'NodeVoyage',
    subtitleKey: 'nodevoyage.hero.subtitle',
    subtitleFallback:
      'Fun. Travel. Memories. Community. Your AI travel companion that keeps every explorer in the loop.',
    descriptionKey: 'nodevoyage.hero.description',
    descriptionFallback:
      'Describe your dream journey and Nodi orchestrates an itinerary with accessibility, sustainability, and surprise in mind. Plan with friends in real time, translate signs on the go, and capture stories that outlast the flight home.',
    primaryCta: {
      href: '#explorers-club',
      labelKey: 'nodevoyage.hero.primary_cta',
      labelFallback: 'Join the Explorers Club'
    },
    secondaryCta: {
      href: '/consulting',
      labelKey: 'nodevoyage.hero.secondary_cta',
      labelFallback: 'Back to solutions overview'
    },
    demoCta: {
      href: null,
      labelKey: 'nodevoyage.hero.demo_cta',
      labelFallback: 'Live demo (coming soon)',
      statusKey: 'nodevoyage.hero.demo_status',
      statusFallback: 'Coming soon',
      isAvailable: false
    },
    highlights: [
      {
        labelKey: 'nodevoyage.hero.highlights.status_label',
        labelFallback: 'Status',
        valueKey: 'nodevoyage.hero.highlights.status_value',
        valueFallback: 'Alpha in progress'
      },
      {
        labelKey: 'nodevoyage.hero.highlights.focus_label',
        labelFallback: 'Focus',
        valueKey: 'nodevoyage.hero.highlights.focus_value',
        valueFallback: 'Collaborative, sustainable travel'
      },
      {
        labelKey: 'nodevoyage.hero.highlights.milestone_label',
        labelFallback: 'Next milestone',
        valueKey: 'nodevoyage.hero.highlights.milestone_value',
        valueFallback: 'Public beta · June 2026'
      }
    ]
  } as const;

  const snapshot = {
    image: '/images/products/nodevoyage-icon.png',
    altKey: 'nodevoyage.snapshot.alt',
    altFallback: 'Preview of the NodeVoyage travel timeline layout',
    captionKey: 'nodevoyage.snapshot.caption',
    captionFallback:
      'Planning missions, accessibility notes, and collaborative editing are all woven into the upcoming public beta experience.'
  } as const;

  const features = {
    titleKey: 'nodevoyage.features.title',
    titleFallback: 'What makes NodeVoyage different?',
    leadKey: 'nodevoyage.features.lead',
    leadFallback:
      'NodeVoyage feels like a playful travel OS: windowed layouts, frosted panels, and an AI buddy who keeps plans tidy while celebrating spontaneity.',
    cards: [
      {
        icon: 'map',
        titleKey: 'nodevoyage.features.cards.0.title',
        titleFallback: 'Smart Trip Planner',
        copyKey: 'nodevoyage.features.cards.0.copy',
        copyFallback:
          'Tell Nodi how you want to feel on your next adventure. NodeVoyage balances hidden gems with essentials, optimises routes, and adjusts for mobility or sensory needs automatically.'
      },
      {
        icon: 'people',
        titleKey: 'nodevoyage.features.cards.1.title',
        titleFallback: 'Collaborative Crews',
        copyKey: 'nodevoyage.features.cards.1.copy',
        copyFallback:
          'Invite family, friends, or classmates into a shared travel canvas. Vote on ideas, track who is editing, and keep everyone aligned with calm notifications.'
      },
      {
        icon: 'device',
        titleKey: 'nodevoyage.features.cards.2.title',
        titleFallback: 'AR Translation & Capture',
        copyKey: 'nodevoyage.features.cards.2.copy',
        copyFallback:
          'Use the mobile app to translate menus, capture audio notes, or pin AR “memory anchors” to revisit favourite spots later.'
      },
      {
        icon: 'target',
        titleKey: 'nodevoyage.features.cards.3.title',
        titleFallback: 'Eco & Community Missions',
        copyKey: 'nodevoyage.features.cards.3.copy',
        copyFallback:
          'Earn badges for low-impact choices, community storytelling, and cultural challenges curated with local partners.'
      },
      {
        icon: 'idea',
        titleKey: 'nodevoyage.features.cards.4.title',
        titleFallback: 'Travel Journal & Reel',
        copyKey: 'nodevoyage.features.cards.4.copy',
        copyFallback:
          'After the trip, NodeVoyage weaves your photos, notes, and check-ins into a shareable story or highlight reel—always with edit controls and privacy toggles.'
      }
    ]
  } as const;

  const roadmap = {
    eyebrowKey: 'nodevoyage.roadmap.eyebrow',
    eyebrowFallback: 'Roadmap',
    titleKey: 'nodevoyage.roadmap.title',
    titleFallback: '2026 journey',
    leadKey: 'nodevoyage.roadmap.lead',
    leadFallback:
      'We are building NodeVoyage out in the open. Each phase brings more collaborative magic while reinforcing accessibility, localisation, and transparent AI coaching.',
    items: [
      {
        phaseKey: 'nodevoyage.roadmap.items.0.phase',
        phaseFallback: 'Alpha launch',
        timingKey: 'nodevoyage.roadmap.items.0.timing',
        timingFallback: 'April 2026',
        detailsKey: 'nodevoyage.roadmap.items.0.details',
        detailsFallback:
          'First wave of explorers test collaborative itineraries, AR translation, and sustainability missions alongside our team.'
      },
      {
        phaseKey: 'nodevoyage.roadmap.items.1.phase',
        phaseFallback: 'Public beta',
        timingKey: 'nodevoyage.roadmap.items.1.timing',
        timingFallback: 'June 2026',
        detailsKey: 'nodevoyage.roadmap.items.1.details',
        detailsFallback:
          'Expanded language support, travel journal exports, and integrations with accessibility partners land for summer adventures.'
      },
      {
        phaseKey: 'nodevoyage.roadmap.items.2.phase',
        phaseFallback: 'Community rollout',
        timingKey: 'nodevoyage.roadmap.items.2.timing',
        timingFallback: 'Late 2026',
        detailsKey: 'nodevoyage.roadmap.items.2.details',
        detailsFallback:
          'Goal of 10,000 travellers across Latvia and neighbouring regions, with classroom pilots and tourism collaborations.'
      }
    ]
  } as const;

  const differentiators = {
    eyebrowKey: 'nodevoyage.differentiators.eyebrow',
    eyebrowFallback: 'Why explorers stay',
    titleKey: 'nodevoyage.differentiators.title',
    titleFallback: 'Calm, trustworthy travel intelligence',
    leadKey: 'nodevoyage.differentiators.lead',
    leadFallback:
      'NodeVoyage blends signage-inspired clarity with travel storytelling. It is approachable for first-time travellers and powerful for adventure planners who want deeper context.',
    ctaKey: 'nodevoyage.differentiators.cta',
    ctaFallback: 'Partner with us',
    cards: [
      {
        icon: 'bolt',
        titleKey: 'nodevoyage.differentiators.cards.0.title',
        titleFallback: 'AI that explains itself',
        copyKey: 'nodevoyage.differentiators.cards.0.copy',
        copyFallback: 'Every itinerary comes with plain-language reasoning, accessible alternatives, and opt-out controls.'
      },
      {
        icon: 'chart',
        titleKey: 'nodevoyage.differentiators.cards.1.title',
        titleFallback: 'Inclusive by default',
        copyKey: 'nodevoyage.differentiators.cards.1.copy',
        copyFallback: 'AAA contrast themes, reduced-motion support, and multi-language content are core—not add-ons.'
      },
      {
        icon: 'package',
        titleKey: 'nodevoyage.differentiators.cards.2.title',
        titleFallback: 'Built with partners',
        copyKey: 'nodevoyage.differentiators.cards.2.copy',
        copyFallback:
          'Co-designed with travel educators, accessibility advocates, and signage specialists from Ideju Kauss programmes.'
      }
    ]
  } as const;

  const explorers = {
    eyebrowKey: 'nodevoyage.explorers.eyebrow',
    eyebrowFallback: 'NodeVoyage Explorers Club',
    titleKey: 'nodevoyage.explorers.title',
    titleFallback: 'Be first aboard the beta',
    copyKey: 'nodevoyage.explorers.copy',
    copyFallback:
      'Leave your details to receive early access invites, mission briefs, and behind-the-scenes updates as we prepare the public beta. We keep emails minimal and never share your contact.',
    form: {
      nameLabelKey: 'nodevoyage.explorers.form.name_label',
      nameLabelFallback: 'Name (optional)',
      emailLabelKey: 'nodevoyage.explorers.form.email_label',
      emailLabelFallback: 'Email',
      submitKey: 'nodevoyage.explorers.form.submit',
      submitFallback: 'Request invite',
      successKey: 'nodevoyage.explorers.form.success',
      successFallback: 'Thanks! We just opened your email client so you can confirm the request.',
      privacyKey: 'nodevoyage.explorers.form.privacy',
      privacyFallback:
        'By joining, you agree to receive NodeVoyage development updates. You can unsubscribe anytime and we will only use your email for these messages.',
      errorKey: 'nodevoyage.explorers.form.error',
      errorFallback: 'Add a valid email so we can send your invite.',
      subjectKey: 'nodevoyage.explorers.form.subject',
      subjectFallback: 'NodeVoyage Explorers Club signup'
    }
  } as const;

  const related = {
    titleKey: 'nodevoyage.cta.title',
    titleFallback: 'Curious about Ideonautix too?',
    copyKey: 'nodevoyage.cta.copy',
    copyFallback:
      'If you are exploring NodeVoyage for team retreats or student programmes, take a look at Ideonautix—our startup OS that keeps creative projects on track. Both platforms share the same inclusive design system.',
    primaryCtaKey: 'nodevoyage.cta.primary',
    primaryCtaFallback: 'Explore Ideonautix',
    secondaryCtaKey: 'nodevoyage.cta.secondary',
    secondaryCtaFallback: 'Talk to our team'
  } as const;

  let explorerEmail = '';
  let explorerName = '';
  let explorerStatus: 'idle' | 'error' | 'success' = 'idle';
  let explorerError = '';

  const resetExplorerStatus = () => {
    if (explorerStatus !== 'idle') explorerStatus = 'idle';
    explorerError = '';
  };

  const handleExplorerSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const trimmedEmail = explorerEmail.trim();
    if (!trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      explorerStatus = 'error';
      explorerError = t(explorers.form.errorKey, explorers.form.errorFallback);
      return;
    }

    const namePart = explorerName.trim() ? `Name: ${explorerName.trim()}%0A` : '';
    const subject = encodeURIComponent(t(explorers.form.subjectKey, explorers.form.subjectFallback));
    const body = encodeURIComponent(`${namePart}Email: ${trimmedEmail}`);
    window.location.href = `mailto:help@algorhythmics.dev?subject=${subject}&body=${body}`;
    explorerStatus = 'success';
    explorerName = '';
    explorerEmail = '';
  };
</script>

<Hero
  class="hero--nodevoyage"
  variant="aurora"
  align="center"
  title={t(hero.titleKey, hero.titleFallback)}
  subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
>
  <svelte:fragment slot="description">
    <p>{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <Button href={hero.primaryCta.href} variant="gradient" size="lg">
      {t(hero.primaryCta.labelKey, hero.primaryCta.labelFallback)}
    </Button>
    <Button href={hero.secondaryCta.href} variant="subtle" size="lg">
      {t(hero.secondaryCta.labelKey, hero.secondaryCta.labelFallback)}
    </Button>
    {#if hero.demoCta.isAvailable && hero.demoCta.href}
      <Button href={hero.demoCta.href} variant="secondary" size="lg" target="_blank" rel="noreferrer">
        {t(hero.demoCta.labelKey, hero.demoCta.labelFallback)}
      </Button>
    {:else}
      <div class="cta-disabled-wrapper">
        <Button
          variant="secondary"
          size="lg"
          aria-disabled="true"
          class="cta-disabled"
        >
          {t(hero.demoCta.labelKey, hero.demoCta.labelFallback)}
        </Button>
        <span class="cta-note">{t(hero.demoCta.statusKey, hero.demoCta.statusFallback)}</span>
      </div>
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="highlights">
    <div class="hero-highlights">
      {#each hero.highlights as highlight (highlight.labelKey)}
        <div>
          <span class="hero-eyebrow">{t(highlight.labelKey, highlight.labelFallback)}</span>
          <strong>{t(highlight.valueKey, highlight.valueFallback)}</strong>
        </div>
      {/each}
    </div>
  </svelte:fragment>
</Hero>

<Section class="section--snapshot" data-surface="glow">
  <div class="snapshot" use:revealOnScroll>
    <GlassCard class="snapshot-card" padding="lg" halo>
      <img
        src={snapshot.image}
        alt={t(snapshot.altKey, snapshot.altFallback)}
        width="960"
        height="600"
        loading="lazy"
      />
      <div class="snapshot-card__body">
        <h2>{t('nodevoyage.snapshot.title')}</h2>
        <p>{t(snapshot.captionKey, snapshot.captionFallback)}</p>
        {#if hero.demoCta.isAvailable && hero.demoCta.href}
          <Button href={hero.demoCta.href} variant="secondary" target="_blank" rel="noreferrer">
            {t(hero.demoCta.labelKey, hero.demoCta.labelFallback)}
          </Button>
        {:else}
          <div class="cta-disabled-wrapper">
            <Button
              variant="secondary"
              aria-disabled="true"
              class="cta-disabled"
            >
              {t(hero.demoCta.labelKey, hero.demoCta.labelFallback)}
            </Button>
            <span class="cta-note">{t(hero.demoCta.statusKey, hero.demoCta.statusFallback)}</span>
          </div>
        {/if}
      </div>
    </GlassCard>
  </div>
</Section>

<Section class="section--features" data-surface="glow">
  <div class="features__content" use:revealOnScroll>
    <h2 class="section-title">{t(features.titleKey, features.titleFallback)}</h2>
    <p class="section-lead">{t(features.leadKey, features.leadFallback)}</p>

    <div class="feature-grid" use:staggerReveal>
      {#each features.cards as card (card.titleKey)}
        <GlassCard class="feature-card" halo padding="lg" interactive>
        <div class="feature-icon" aria-hidden="true">
          <Icon name={card.icon} size="var(--icon-glyph-lg)" />
        </div>
        <h3>{t(card.titleKey, card.titleFallback)}</h3>
        <p>{t(card.copyKey, card.copyFallback)}</p>
      </GlassCard>
    {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section class="section--roadmap" data-surface="glow">
  <div class="roadmap" use:revealOnScroll>
    <div>
      <span class="section-eyebrow">{t(roadmap.eyebrowKey, roadmap.eyebrowFallback)}</span>
      <h2>{t(roadmap.titleKey, roadmap.titleFallback)}</h2>
      <p>{t(roadmap.leadKey, roadmap.leadFallback)}</p>
    </div>
    <ol class="roadmap-list">
      {#each roadmap.items as item (item.phaseKey)}
        <li class="roadmap-item">
          <GlassCard padding="md">
            <span class="roadmap-phase">{t(item.phaseKey, item.phaseFallback)}</span>
            <span class="roadmap-timing">{t(item.timingKey, item.timingFallback)}</span>
            <p>{t(item.detailsKey, item.detailsFallback)}</p>
          </GlassCard>
        </li>
      {/each}
    </ol>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="section--differentiators" data-surface="glow">
  <div class="differentiators" use:revealOnScroll>
    <div class="differentiators-copy">
      <span class="section-eyebrow">{t(differentiators.eyebrowKey, differentiators.eyebrowFallback)}</span>
      <h2>{t(differentiators.titleKey, differentiators.titleFallback)}</h2>
      <p>{t(differentiators.leadKey, differentiators.leadFallback)}</p>
      <Button href="/contact" variant="gradient">
        {t(differentiators.ctaKey, differentiators.ctaFallback)}
      </Button>
    </div>
    <div class="differentiators-grid auto-grid" use:staggerReveal>
      {#each differentiators.cards as item (item.titleKey)}
        <GlassCard padding="md" class="differentiator-card" halo>
          <div class="feature-icon" aria-hidden="true">
            <Icon name={item.icon} size="var(--icon-glyph-md)" />
          </div>
          <h3>{t(item.titleKey, item.titleFallback)}</h3>
          <p>{t(item.copyKey, item.copyFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="voyage" />

<Section id="explorers-club" class="explorers section--explorers" data-surface="glow">
  <div class="explorers-section" use:revealOnScroll>
    <GlassCard class="explorers-card" padding="lg" particles>
      <span class="section-eyebrow">{t(explorers.eyebrowKey, explorers.eyebrowFallback)}</span>
      <h2>{t(explorers.titleKey, explorers.titleFallback)}</h2>
      <p>{t(explorers.copyKey, explorers.copyFallback)}</p>

      <form class="explorers-form form" on:submit={handleExplorerSubmit}>
        <div class="form-field">
          <label for="explorer-name">{t(explorers.form.nameLabelKey, explorers.form.nameLabelFallback)}</label>
          <input
            id="explorer-name"
            name="name"
            type="text"
            bind:value={explorerName}
            on:input={resetExplorerStatus}
          />
        </div>

        <div class="form-field">
          <label for="explorer-email">{t(explorers.form.emailLabelKey, explorers.form.emailLabelFallback)}</label>
          <input
            id="explorer-email"
            name="email"
            type="email"
            bind:value={explorerEmail}
            required
            aria-invalid={explorerStatus === 'error' ? 'true' : 'false'}
            on:input={resetExplorerStatus}
          />
          {#if explorerStatus === 'error' && explorerError}
            <span class="field-error">{explorerError}</span>
          {/if}
        </div>

        <Button type="submit" variant="gradient" size="lg">
          {t(explorers.form.submitKey, explorers.form.submitFallback)}
        </Button>

        {#if explorerStatus === 'success'}
          <p class="form-status form-status--success">{t(explorers.form.successKey, explorers.form.successFallback)}</p>
        {/if}
      </form>

      <p class="privacy-note">{t(explorers.form.privacyKey, explorers.form.privacyFallback)}</p>
    </GlassCard>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="cta section--cta" data-surface="glow">
  <div class="cta-container" use:revealOnScroll>
  <GlassCard class="cta-card" padding="lg" halo>
    <h2>{t(related.titleKey, related.titleFallback)}</h2>
    <p>{t(related.copyKey, related.copyFallback)}</p>
    <div class="cta-actions">
      <Button href="/ideonautix" variant="secondary">
        {t(related.primaryCtaKey, related.primaryCtaFallback)}
      </Button>
      <Button href="/contact" variant="gradient">
        {t(related.secondaryCtaKey, related.secondaryCtaFallback)}
      </Button>
    </div>
  </GlassCard>
  </div>
</Section>

<style>
  :global(.section) {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    --section-padding: clamp(var(--section-padding-tablet), 8vw, var(--section-padding-desktop));
  }

  :global(.section.section--snapshot) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.section--features) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.24);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  :global(.section.section--roadmap) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.26);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  :global(.section.section--differentiators) {
    --section-glow-primary: rgba(var(--signal-yellow-rgb), 0.2);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    --section-glow-accent: rgba(var(--aurora-purple-rgb), 0.14);
  }

  :global(.section.section--explorers) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.24);
    --section-glow-secondary: rgba(var(--signal-yellow-rgb), 0.16);
    --section-glow-accent: rgba(var(--aurora-purple-rgb), 0.18);
  }

  :global(.section.section--cta) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.3);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.24);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.18);
  }

  .snapshot {
    display: grid;
  }

  :global(.snapshot-card) {
    display: grid;
    gap: calc(var(--grid-gap-lg) + var(--space-xs));
  }

  :global(.snapshot-card img) {
    width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    border: var(--border-width-hairline) solid var(--glass-border);
    box-shadow: var(--shadow-xl);
  }

  :global(.snapshot-card__body) {
    display: grid;
    gap: var(--cluster-gap-md);
  }

  .section-title {
    font-family: var(--font-heading);
    font-size: var(--text-headline);
    margin-bottom: var(--space-lg);
  }

  .section-lead {
    max-width: var(--measure-md);
    margin-bottom: var(--space-3xl);
    color: var(--text-secondary);
    font-size: var(--text-lead);
    line-height: var(--leading-relaxed);
  }

  .hero-highlights {
    display: grid;
    gap: var(--grid-gap-md);
    grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
    text-align: left;
    font-size: var(--text-small);
    line-height: var(--leading-normal);
  }

  .hero-eyebrow {
    display: block;
    text-transform: uppercase;
    letter-spacing: var(--tracking-meta);
    font-size: var(--text-eyebrow);
    color: var(--text-tertiary);
    margin-bottom: var(--space-2xs);
  }

  .features__content {
    display: grid;
    gap: var(--space-2xl);
  }

  .feature-grid {
    display: grid;
    gap: var(--grid-gap-xl);
    grid-template-columns: repeat(auto-fit, minmax(var(--card-min-width), 1fr));
  }

  :global(.feature-card) {
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 68%, transparent 32%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 28%, transparent 72%);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 66%, var(--aurora-purple) 34%);
  }

  :global(.feature-card) h3 {
    font-size: var(--text-card-title);
    line-height: var(--leading-snug);
    margin-bottom: var(--space-md);
  }

  :global(.feature-card) p {
    color: var(--text-secondary);
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
  }

  .feature-icon {
    inline-size: var(--size-icon-md);
    block-size: var(--size-icon-md);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.12) 60%, transparent 40%);
    display: grid;
    place-items: center;
    margin-bottom: var(--space-lg);
    color: var(--nodevoyage-highlight);
  }

  .feature-icon :global(svg) {
    color: inherit;
  }

  .roadmap {
    display: grid;
    gap: var(--grid-gap-xl);
    align-items: start;
  }

  .roadmap-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--grid-gap-md);
  }

  .roadmap-item::marker {
    content: '';
  }

  .roadmap-phase {
    font-weight: 600;
    font-size: var(--text-body);
  }

  .roadmap-timing {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: var(--text-meta);
    color: var(--text-tertiary);
    margin-bottom: var(--space-sm);
  }

  .differentiators {
    display: grid;
    gap: var(--grid-gap-xl);
    align-items: start;
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, calc(var(--card-max-width) + var(--space-lg))), 1fr)
    );
  }

  .differentiators-copy {
    display: grid;
    gap: var(--space-lg);
  }

  .differentiators-grid {
    --auto-grid-gap: var(--grid-gap-lg);
    --auto-grid-min: min(100%, var(--card-min-width));
    --auto-grid-max: min(100%, var(--card-max-width));
  }

  :global(.differentiator-card) {
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 66%, transparent 34%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 26%, transparent 74%);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 60%, var(--signal-yellow) 40%);
  }

  :global(.differentiator-card) h3 {
    margin-bottom: var(--space-sm);
  }

  :global(.explorers-card) {
    display: grid;
    gap: var(--cluster-gap-lg);
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 68%, transparent 32%);
    --surface-glass-border: color-mix(in srgb, var(--voyage-blue) 30%, transparent 70%);
    --surface-glass-shadow: var(--shadow-xl);
    --focus-ring-color: color-mix(in srgb, var(--signal-yellow) 56%, var(--voyage-blue) 44%);
  }

  .explorers-section {
    display: grid;
    justify-items: center;
  }

  .explorers-form {
    --form-gap: var(--grid-gap-md);
    --form-field-radius: var(--radius-md);
    --form-field-padding-y: var(--space-md);
    --form-field-padding-x: var(--space-lg);
    --form-max-width: min(100%, var(--card-max-width-wide));
    --form-field-min-width: min(100%, calc(var(--card-min-width) + var(--space-sm)));
    --form-field-max-width: min(100%, var(--card-max-width-wide));
    --form-label-color: color-mix(in srgb, var(--text) 88%, transparent 12%);
    --form-field-bg: color-mix(in srgb, var(--glass-bg-lightest) 68%, transparent 32%);
    --form-field-border: color-mix(in srgb, var(--surface-field-border) 85%, transparent 15%);
    --form-field-border-focus: color-mix(
      in srgb,
      var(--nodevoyage-highlight) 52%,
      rgba(var(--voyage-blue-rgb), 0.42) 48%
    );
    --form-focus-ring-color: color-mix(
      in srgb,
      var(--nodevoyage-highlight) 60%,
      var(--voyage-blue) 40%
    );
    --form-field-shadow: var(--shadow-lg);
    --form-error-color: color-mix(in srgb, var(--cherry-pop) 82%, var(--text) 18%);
    --form-status-success-bg: color-mix(in srgb, var(--glass-bg-lightest) 62%, transparent 38%);
    --form-status-success-color: color-mix(
      in srgb,
      var(--nodevoyage-highlight) 64%,
      var(--text) 36%
    );
  }

  .form-field label {
    font-weight: 600;
  }

  .explorers-form .form-status {
    max-width: var(--measure-sm);
  }

  .privacy-note {
    font-size: var(--text-meta);
    color: var(--text-tertiary);
  }

  :global(.cta-card) {
    display: grid;
    gap: calc(var(--space-lg) + var(--space-xs));
    text-align: center;
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 68%, transparent 32%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 28%, transparent 72%);
    --focus-ring-color: color-mix(in srgb, var(--voyage-blue) 64%, var(--aurora-purple) 36%);
  }

  .cta-container {
    display: grid;
    justify-items: center;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    justify-content: center;
  }

  .cta-disabled-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }

  .cta-note {
    font-size: var(--text-meta);
    color: color-mix(in oklab, var(--text) 70%, transparent 30%);
  }

  :global(.cta-disabled) {
    cursor: not-allowed;
  }


  @media (min-width: 960px) {
    .roadmap {
      grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.feature-card),
    :global(.differentiator-card),
    :global(.explorers-card),
    :global(.cta-card) {
      transition: none;
    }
  }
</style>
