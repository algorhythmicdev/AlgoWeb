<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Section from '$lib/components/Section.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { base } from '$app/paths';
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
    titleKey: 'ideonautix.hero.title',
    titleFallback: 'Ideonautix',
    subtitleKey: 'ideonautix.hero.subtitle',
    subtitleFallback: 'Explore. Invent. Launch. Your modular AI workspace for founders, students, and creative teams.',
    descriptionKey: 'ideonautix.hero.description',
    descriptionFallback:
      'Ideonautix keeps momentum steady with copilots for pitching, research, and focus. Build presentations, run experiments, and manage rituals with explainable AI nudges that honour your process.',
    primaryCta: {
      href: '#pilot-request',
      labelKey: 'ideonautix.hero.primary_cta',
      labelFallback: 'Request pilot access'
    },
    secondaryCta: {
      href: '/consulting',
      labelKey: 'ideonautix.hero.secondary_cta',
      labelFallback: 'Back to solutions overview'
    },
    demoCta: {
      href: null,
      labelKey: 'ideonautix.hero.demo_cta',
      labelFallback: 'Live demo (coming soon)',
      statusKey: 'ideonautix.hero.demo_status',
      statusFallback: 'Coming soon',
      isAvailable: false
    },
    highlights: [
      {
        labelKey: 'ideonautix.hero.highlights.status_label',
        labelFallback: 'Status',
        valueKey: 'ideonautix.hero.highlights.status_value',
        valueFallback: 'Pilot onboarding · Q1 2026'
      },
      {
        labelKey: 'ideonautix.hero.highlights.modules_label',
        labelFallback: 'Modules',
        valueKey: 'ideonautix.hero.highlights.modules_value',
        valueFallback: 'Pitch · Intelligence · Focus · Library'
      },
      {
        labelKey: 'ideonautix.hero.highlights.promise_label',
        labelFallback: 'Promise',
        valueKey: 'ideonautix.hero.highlights.promise_value',
        valueFallback: 'Explainable AI for builders'
      }
    ]
  } as const;

  const snapshot = {
    image: `${base}/images/products/ideonautix-icon.png`,
    altKey: 'ideonautix.snapshot.alt',
    altFallback: 'Preview of the Ideonautix creative cockpit layout',
    captionKey: 'ideonautix.snapshot.caption',
    captionFallback:
      'A modular writing desk with explainable AI suggestions, creative rituals, and multilingual notes ready for your next pitch.'
  } as const;

  const modules = {
    titleKey: 'ideonautix.modules.title',
    titleFallback: 'Tools that keep ideas moving',
    leadKey: 'ideonautix.modules.lead',
    leadFallback:
      'Ideonautix pairs playful visuals with serious operations. Every module lives inside a windowed workspace so you can drag, resize, and focus without losing the bigger picture.',
    cards: [
      {
        icon: 'idea',
        titleKey: 'ideonautix.modules.cards.0.title',
        titleFallback: 'Pitch Deck Assistant',
        copyKey: 'ideonautix.modules.cards.0.copy',
        copyFallback:
          'Answer a short creative brief and Ideonautix drafts slides, speaker notes, and evidence to fit your audience—with transparent citations and edit history.'
      },
      {
        icon: 'chart',
        titleKey: 'ideonautix.modules.cards.1.title',
        titleFallback: 'Competitive Dashboard',
        copyKey: 'ideonautix.modules.cards.1.copy',
        copyFallback:
          'Track market shifts, competitor releases, and trend digests curated for your vertical. Summaries stay human-readable and exportable.'
      },
      {
        icon: 'bolt',
        titleKey: 'ideonautix.modules.cards.2.title',
        titleFallback: 'Pomodoro Coach',
        copyKey: 'ideonautix.modules.cards.2.copy',
        copyFallback:
          'Keep your rhythm with adaptive focus sessions, break prompts, and gentle accountability nudges based on your schedule.'
      },
      {
        icon: 'package',
        titleKey: 'ideonautix.modules.cards.3.title',
        titleFallback: 'Workflow Library',
        copyKey: 'ideonautix.modules.cards.3.copy',
        copyFallback:
          'Mix-and-match canvases for OKRs, research sprints, and retrospectives. Each template includes guidance drawn from our consulting rituals.'
      },
      {
        icon: 'ai',
        titleKey: 'ideonautix.modules.cards.4.title',
        titleFallback: 'AI Brainstorm',
        copyKey: 'ideonautix.modules.cards.4.copy',
        copyFallback:
          'Bounce ideas with a multilingual AI co-founder trained on ethical innovation playbooks. Every suggestion ships with rationale and references.'
      }
    ]
  } as const;

  const statusSection = {
    eyebrowKey: 'ideonautix.status.eyebrow',
    eyebrowFallback: 'Status & invitation',
    titleKey: 'ideonautix.status.title',
    titleFallback: 'Pilot in early 2026',
    copyKey: 'ideonautix.status.copy',
    copyFallback:
      'We are inviting a small circle of founders, educators, and student teams to shape Ideonautix. Pilot members test modules, share feedback in live sessions, and receive lifetime discounts when we launch publicly in spring 2026.',
    bullets: [
      {
        key: 'ideonautix.status.bullets.0',
        fallback: 'Multilingual interface: English & Latvian at pilot, Russian in beta.'
      },
      {
        key: 'ideonautix.status.bullets.1',
        fallback: 'AAA contrast themes and reduced-motion support mirror our design system.'
      },
      {
        key: 'ideonautix.status.bullets.2',
        fallback: 'All AI suggestions include citations and exportable audit trails.'
      }
    ],
    ctaKey: 'ideonautix.status.cta',
    ctaFallback: 'Join the pilot waitlist'
  } as const;

  const useCases = {
    eyebrowKey: 'ideonautix.use_cases.eyebrow',
    eyebrowFallback: 'Use cases',
    titleKey: 'ideonautix.use_cases.title',
    titleFallback: 'Stories from the lab',
    copyKey: 'ideonautix.use_cases.copy',
    copyFallback:
      'Ideonautix was born from our consulting rituals. Each pilot builds on real problems founders and educators face when they lack clear documentation or accessible AI support.',
    items: [
      {
        nameKey: 'ideonautix.use_cases.items.0.name',
        nameFallback: 'Anna · Student entrepreneur',
        storyKey: 'ideonautix.use_cases.items.0.story',
        storyFallback:
          'Anna used Ideonautix to map a sustainable fashion concept. The pitch assistant built a grant-ready deck, while Pomodoro Coach kept her team on track for demo day.'
      },
      {
        nameKey: 'ideonautix.use_cases.items.1.name',
        nameFallback: 'SafeRide · Mobility startup',
        storyKey: 'ideonautix.use_cases.items.1.story',
        storyFallback:
          'SafeRide analysed competitors and regulatory news through the dashboard, rapidly iterated prototypes, and walked into investor meetings with confidence.'
      }
    ]
  } as const;

  const pilot = {
    eyebrowKey: 'ideonautix.pilot.eyebrow',
    eyebrowFallback: 'Pilot access',
    titleKey: 'ideonautix.pilot.title',
    titleFallback: 'Request an invite',
    copyKey: 'ideonautix.pilot.copy',
    copyFallback:
      'Share a few details and we will follow up with onboarding options. We reply within one business day and respect your privacy—data is only used to coordinate pilot participation.',
    form: {
      nameLabelKey: 'ideonautix.pilot.form.name_label',
      nameLabelFallback: 'Name',
      emailLabelKey: 'ideonautix.pilot.form.email_label',
      emailLabelFallback: 'Email',
      roleLabelKey: 'ideonautix.pilot.form.role_label',
      roleLabelFallback: 'Role',
      roleOptions: {
        founder: {
          key: 'ideonautix.pilot.form.role_options.founder',
          fallback: 'Founder / startup team'
        },
        student: {
          key: 'ideonautix.pilot.form.role_options.student',
          fallback: 'Student team'
        },
        educator: {
          key: 'ideonautix.pilot.form.role_options.educator',
          fallback: 'Educator / mentor'
        },
        other: {
          key: 'ideonautix.pilot.form.role_options.other',
          fallback: 'Other collaborator'
        }
      },
      messageLabelKey: 'ideonautix.pilot.form.message_label',
      messageLabelFallback: 'What would you like to explore?',
      submitKey: 'ideonautix.pilot.form.submit',
      submitFallback: 'Submit request',
      successKey: 'ideonautix.pilot.form.success',
      successFallback: 'Thank you! We just opened an email draft—send it to confirm your spot.',
      errorKey: 'ideonautix.pilot.form.error',
      errorFallback: 'Share your name and a valid email so we can reach out.',
      privacyKey: 'ideonautix.pilot.form.privacy',
      privacyFallback:
        'We only use the information you provide to coordinate pilot access. You can opt out at any time by emailing help@algorhythmics.dev.',
      subjectKey: 'ideonautix.pilot.form.subject',
      subjectFallback: 'Ideonautix pilot request'
    }
  } as const;

  const cta = {
    titleKey: 'ideonautix.cta.title',
    titleFallback: 'Need hands-on support?',
    copyKey: 'ideonautix.cta.copy',
    copyFallback:
      'Our consulting team helps adapt Ideonautix modules for enterprise or education partners. We can tailor workflows, build governance, and train your crews.',
    primaryCtaKey: 'ideonautix.cta.primary',
    primaryCtaFallback: 'Consulting services',
    secondaryCtaKey: 'ideonautix.cta.secondary',
    secondaryCtaFallback: 'Chat with us'
  } as const;

  let pilotName = '';
  let pilotEmail = '';
  let pilotRole = 'founder';
  let pilotMessage = '';
  let pilotStatus: 'idle' | 'error' | 'success' = 'idle';
  let pilotError = '';

  const resetPilotStatus = () => {
    if (pilotStatus !== 'idle') pilotStatus = 'idle';
    pilotError = '';
  };

  const handlePilotSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const trimmedEmail = pilotEmail.trim();
    const trimmedName = pilotName.trim();
    if (!trimmedName || !trimmedEmail || !/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      pilotStatus = 'error';
      pilotError = t(pilot.form.errorKey, pilot.form.errorFallback);
      return;
    }

    const subject = encodeURIComponent(t(pilot.form.subjectKey, pilot.form.subjectFallback));
    const body = encodeURIComponent(
      `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nRole: ${pilotRole}\nMessage: ${pilotMessage.trim()}`
    );
    window.location.href = `mailto:help@algorhythmics.dev?subject=${subject}&body=${body}`;
    pilotStatus = 'success';
    pilotName = '';
    pilotEmail = '';
    pilotMessage = '';
    pilotRole = 'founder';
  };
</script>

<Hero
  class="hero--ideonautix"
  variant="halo"
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
        <h2>{t('ideonautix.snapshot.title')}</h2>
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

<Section class="section--modules" data-surface="glow">
  <div class="modules__content" use:revealOnScroll>
    <h2 class="section-title">{t(modules.titleKey, modules.titleFallback)}</h2>
    <p class="section-lead">{t(modules.leadKey, modules.leadFallback)}</p>

    <div class="module-grid" use:staggerReveal>
      {#each modules.cards as module (module.titleKey)}
        <GlassCard class="module-card" halo padding="lg" interactive>
        <div class="module-icon" aria-hidden="true">
          <Icon name={module.icon} size="var(--icon-glyph-lg)" />
        </div>
        <h3>{t(module.titleKey, module.titleFallback)}</h3>
        <p>{t(module.copyKey, module.copyFallback)}</p>
      </GlassCard>
    {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section class="section--status" data-surface="glow">
  <div class="status" use:revealOnScroll>
    <GlassCard class="status-card" padding="lg">
      <span class="section-eyebrow">{t(statusSection.eyebrowKey, statusSection.eyebrowFallback)}</span>
      <h2>{t(statusSection.titleKey, statusSection.titleFallback)}</h2>
      <p>{t(statusSection.copyKey, statusSection.copyFallback)}</p>
      <ul class="status-list">
        {#each statusSection.bullets as bullet (bullet.key)}
          <li>{t(bullet.key, bullet.fallback)}</li>
        {/each}
      </ul>
      <Button href="#pilot-request" variant="gradient">
        {t(statusSection.ctaKey, statusSection.ctaFallback)}
      </Button>
    </GlassCard>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="section--use-cases" data-surface="glow">
  <div class="use-cases" use:revealOnScroll>
    <div class="use-cases-copy">
      <span class="section-eyebrow">{t(useCases.eyebrowKey, useCases.eyebrowFallback)}</span>
      <h2>{t(useCases.titleKey, useCases.titleFallback)}</h2>
      <p>{t(useCases.copyKey, useCases.copyFallback)}</p>
    </div>
    <div class="use-cases-grid" use:staggerReveal>
      {#each useCases.items as story (story.nameKey)}
        <GlassCard padding="md" class="use-case-card" halo>
          <h3>{t(story.nameKey, story.nameFallback)}</h3>
          <p>{t(story.storyKey, story.storyFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="cherry" />

<Section id="pilot-request" class="pilot section--pilot" data-surface="glow">
  <div class="pilot-section" use:revealOnScroll>
    <GlassCard class="pilot-card" padding="lg" particles>
    <span class="section-eyebrow">{t(pilot.eyebrowKey, pilot.eyebrowFallback)}</span>
    <h2>{t(pilot.titleKey, pilot.titleFallback)}</h2>
    <p>{t(pilot.copyKey, pilot.copyFallback)}</p>

    <form class="pilot-form form" on:submit={handlePilotSubmit}>
      <label class="form-field">
        <span>{t(pilot.form.nameLabelKey, pilot.form.nameLabelFallback)}</span>
        <input type="text" bind:value={pilotName} required on:input={resetPilotStatus} />
      </label>

      <label class="form-field">
        <span>{t(pilot.form.emailLabelKey, pilot.form.emailLabelFallback)}</span>
        <input
          type="email"
          bind:value={pilotEmail}
          required
          aria-invalid={pilotStatus === 'error' ? 'true' : 'false'}
          on:input={resetPilotStatus}
        />
      </label>

      <label class="form-field">
        <span>{t(pilot.form.roleLabelKey, pilot.form.roleLabelFallback)}</span>
        <select bind:value={pilotRole} on:change={resetPilotStatus}>
          <option value="founder">{t(pilot.form.roleOptions.founder.key, pilot.form.roleOptions.founder.fallback)}</option>
          <option value="student">{t(pilot.form.roleOptions.student.key, pilot.form.roleOptions.student.fallback)}</option>
          <option value="educator">{t(pilot.form.roleOptions.educator.key, pilot.form.roleOptions.educator.fallback)}</option>
          <option value="other">{t(pilot.form.roleOptions.other.key, pilot.form.roleOptions.other.fallback)}</option>
        </select>
      </label>

      <label class="form-field form--full">
        <span>{t(pilot.form.messageLabelKey, pilot.form.messageLabelFallback)}</span>
        <textarea rows="4" bind:value={pilotMessage} on:input={resetPilotStatus}></textarea>
      </label>

      {#if pilotStatus === 'error' && pilotError}
        <p class="field-error">{pilotError}</p>
      {/if}

      <Button type="submit" variant="gradient" size="lg">
        {t(pilot.form.submitKey, pilot.form.submitFallback)}
      </Button>

      {#if pilotStatus === 'success'}
        <p class="form-status form-status--success">{t(pilot.form.successKey, pilot.form.successFallback)}</p>
      {/if}
    </form>

      <p class="privacy-note">{t(pilot.form.privacyKey, pilot.form.privacyFallback)}</p>
    </GlassCard>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="cta section--cta" data-surface="glow">
  <div class="cta-container" use:revealOnScroll>
    <GlassCard class="cta-card" padding="lg" halo>
      <h2>{t(cta.titleKey, cta.titleFallback)}</h2>
      <p>{t(cta.copyKey, cta.copyFallback)}</p>
      <div class="cta-actions">
        <Button href="/consulting" variant="secondary">
          {t(cta.primaryCtaKey, cta.primaryCtaFallback)}
        </Button>
        <Button href="/contact" variant="gradient">
          {t(cta.secondaryCtaKey, cta.secondaryCtaFallback)}
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
    --section-padding-inline: 0;
  }

  :global(.section > .section__inner) {
    position: relative;
    z-index: var(--z-content);
  }

  :global(.section::before),
  :global(.section::after) {
    content: '';
    position: absolute;
    inset: -18% -18% -26% -18%;
    border-radius: var(--radius-bubble-lg);
    pointer-events: none;
    opacity: 0.24;
    z-index: var(--z-base);
  }

  :global(.section::after) {
    background: linear-gradient(180deg, var(--surface-glow-overlay-fill) 0%, transparent 100%);
    opacity: 0.18;
  }

  :global(.section.section--snapshot) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-secondary: rgba(var(--cherry-pop-rgb), 0.16);
    --section-glow-accent: rgba(var(--ink-rgb), 0.12);
  }

  :global(.section.section--modules) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.26);
    --section-glow-secondary: rgba(var(--cherry-pop-rgb), 0.18);
    --section-glow-accent: rgba(var(--ink-rgb), 0.1);
  }

  :global(.section.section--status) {
    --section-glow-primary: rgba(var(--cherry-pop-rgb), 0.2);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.18);
    --section-glow-accent: rgba(var(--ink-rgb), 0.12);
  }

  :global(.section.section--use-cases) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.24);
    --section-glow-secondary: rgba(var(--cherry-pop-rgb), 0.18);
    --section-glow-accent: rgba(var(--ink-rgb), 0.1);
  }

  :global(.section.section--pilot) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.28);
    --section-glow-secondary: rgba(var(--cherry-pop-rgb), 0.2);
    --section-glow-accent: rgba(var(--ink-rgb), 0.12);
  }

  :global(.section.section--cta) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.32);
    --section-glow-secondary: rgba(var(--cherry-pop-rgb), 0.22);
    --section-glow-accent: rgba(var(--ink-rgb), 0.16);
  }

  .snapshot {
    display: grid;
  }

  :global(.snapshot-card) {
    display: grid;
    gap: var(--cluster-gap-lg);
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
    margin-bottom: var(--space-xl);
  }

  .section-lead {
    max-width: var(--measure-lg);
    margin-bottom: var(--space-3xl);
    color: var(--text-secondary);
    font-size: var(--text-lead);
    line-height: var(--leading-relaxed);
  }

  .hero-highlights {
    display: grid;
    gap: var(--grid-gap-md);
    grid-template-columns: repeat(auto-fit, minmax(var(--tile-min-width-sm), 1fr));
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

  .module-grid {
    display: grid;
    gap: var(--grid-gap-xl);
    grid-template-columns: repeat(auto-fit, minmax(var(--tile-min-width-md), 1fr));
  }

  .modules__content {
    display: grid;
    gap: var(--grid-gap-xl);
  }

  :global(.module-card) {
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 68%, transparent 32%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 28%, transparent 72%);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 64%, var(--cherry-pop) 36%);
  }

  :global(.module-card) h3 {
    font-size: var(--text-card-title);
    line-height: var(--leading-snug);
    margin-bottom: var(--space-md);
  }

  :global(.module-card) p {
    color: var(--text-secondary);
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
  }

  .module-icon {
    inline-size: var(--size-icon-lg);
    block-size: var(--size-icon-lg);
    border-radius: var(--radius-lg);
    background: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.12) 60%, transparent 40%);
    display: grid;
    place-items: center;
    margin-bottom: var(--space-lg);
    color: var(--ideonautix-accent);
  }

  .status {
    display: grid;
    gap: var(--grid-gap-xl);
  }

  :global(.status-card) {
    display: grid;
    gap: var(--cluster-gap-md);
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 66%, transparent 34%);
    --surface-glass-border: color-mix(in srgb, var(--cherry-pop) 26%, transparent 74%);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 62%, var(--cherry-pop) 38%);
  }

  .status-list {
    margin: 0;
    padding-left: calc(var(--space-lg) + var(--space-sm));
    display: grid;
    gap: var(--space-sm);
    color: var(--text-secondary);
  }

  .use-cases {
    display: grid;
    gap: var(--grid-gap-2xl);
    align-items: start;
  }

  .use-cases-grid {
    display: grid;
    gap: var(--grid-gap-lg);
  }

  :global(.use-case-card) {
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 66%, transparent 34%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 28%, transparent 72%);
    --focus-ring-color: color-mix(in srgb, var(--cherry-pop) 54%, var(--aurora-purple) 46%);
  }

  :global(.pilot-card) {
    display: grid;
    gap: var(--grid-gap-lg);
    --surface-glass-bg: color-mix(in srgb, var(--glass-bg-lightest) 68%, transparent 32%);
    --surface-glass-border: color-mix(in srgb, var(--cherry-pop) 28%, transparent 72%);
    --surface-glass-shadow: var(--shadow-card-cherry);
    --focus-ring-color: color-mix(in srgb, var(--cherry-pop) 58%, var(--aurora-purple) 42%);
  }

  .pilot-form {
    --form-gap: var(--grid-gap-md);
    --form-field-radius: var(--radius-md);
    --form-field-padding-y: var(--space-md);
    --form-field-padding-x: var(--space-lg);
    --form-max-width: min(100%, var(--card-max-width-wide));
    --form-field-min-width: min(100%, calc(var(--card-min-width) + var(--space-sm)));
    --form-field-max-width: min(100%, var(--card-max-width-wide));
    --form-label-color: color-mix(in srgb, var(--text) 88%, transparent 12%);
    --form-field-bg: color-mix(in srgb, var(--glass-bg-lightest) 68%, transparent 32%);
    --form-field-border: color-mix(in srgb, var(--surface-field-border) 84%, transparent 16%);
    --form-field-border-focus: color-mix(
      in srgb,
      var(--ideonautix-accent) 58%,
      rgba(var(--cherry-pop-rgb), 0.42) 42%
    );
    --form-focus-ring-color: color-mix(in srgb, var(--ideonautix-accent) 70%, var(--cherry-pop) 30%);
    --form-field-shadow: var(--shadow-card-neutral-soft), var(--shadow-inset-light);
    --form-textarea-min-height: var(--space-5xl);
    --form-error-color: color-mix(in srgb, var(--cherry-pop) 85%, var(--text) 15%);
    --form-status-success-bg: color-mix(in srgb, var(--glass-bg-lightest) 60%, transparent 40%);
    --form-status-success-color: color-mix(
      in srgb,
      var(--ideonautix-accent) 66%,
      var(--text) 34%
    );
  }

  .pilot-form .form-field {
    font-weight: 600;
  }

  .pilot-form .form-status {
    text-wrap: balance;
  }

  .pilot-section,
  .cta-container {
    display: grid;
    justify-items: center;
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
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 32%, transparent 68%);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 60%, var(--cherry-pop) 40%);
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
    .use-cases {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
    }

    .use-cases-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.section::before) {
      animation: none;
    }

    :global(.module-card),
    :global(.status-card),
    :global(.use-case-card),
    :global(.pilot-card),
    :global(.cta-card) {
      transition: none;
    }
  }
</style>
