<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Section from '$lib/components/Section.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { onMount } from 'svelte';
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
    titleKey: 'consulting.hero_title',
    titleFallback: 'Friendly AI consulting for real teams',
    subtitleKey: 'consulting.hero_subtitle',
    subtitleFallback: 'From strategy to code — helping organizations embed AI responsibly, ethically, and effectively.',
    descriptionKey: 'consulting.hero_description',
    descriptionFallback:
      'We partner with your team to design AI workflows that respect people, processes, and change management. Expect signage-inspired clarity, transparent automation, and rituals that stick.',
    primaryCta: {
      href: '#apply',
      labelKey: 'consulting.hero_cta_primary',
      labelFallback: 'Apply for the pilot'
    },
    secondaryCta: {
      href: '#packages',
      labelKey: 'consulting.hero_cta_secondary',
      labelFallback: 'Review service menu'
    },
    badgeKey: 'consulting.hero_badge',
    badgeFallback: 'Pilot open'
  } as const;

  const heroMedia = {
    image: '/images/placeholders/consulting-studio.png',
    altKey: 'consulting.hero.media.alt',
    altFallback: 'Consulting studio with glass panels, planning walls, and a calm collaboration table',
    captionKey: 'consulting.hero.media.caption',
    captionFallback:
      'Founder-led workshops run in a glassy studio so remote and in-person teams can see the same calm dashboards and rituals.'
  } as const;

  const heroHighlights = [
    { key: 'consulting.hero_rotating.0', fallback: 'Design sessions that translate ideas into clear plans.' },
    { key: 'consulting.hero_rotating.1', fallback: 'Launch AI assistants that teams actually enjoy using.' },
    { key: 'consulting.hero_rotating.2', fallback: 'Pair signage craftsmanship with cloud know-how.' }
  ] as const;

  const heroTestimonial = {
    labelKey: 'consulting.hero_testimonial_label',
    labelFallback: 'Client reflection',
    quoteKey: 'consulting.hero_testimonial_quote',
    quoteFallback: 'AlgoRhythmics turned a complex AI brief into a friendly, repeatable workflow for our team.',
    nameKey: 'consulting.hero_testimonial_name',
    nameFallback: 'Marta Ozoliņa',
    roleKey: 'consulting.hero_testimonial_role',
    roleFallback: 'Innovation Lead, Reclame Fabriek'
  } as const;

  const quickFacts = {
    titleKey: 'consulting.what_title',
    titleFallback: 'What we help you do',
    items: [
      { key: 'consulting.what_1', fallback: 'Design accessible, human-friendly AI workflows.' },
      { key: 'consulting.what_2', fallback: 'Prototype, integrate, and launch with confidence.' },
      { key: 'consulting.what_3', fallback: 'Support your team with training and iteration loops.' }
    ]
  } as const;

  const servicePackages = [
    {
      icon: 'target',
      nameKey: 'consulting.packages.0.name',
      nameFallback: 'Strategy',
      descriptionKey: 'consulting.packages.0.description',
      descriptionFallback: 'Map opportunities, align teams, and define a measurable plan.',
      benefits: [
        { key: 'consulting.packages.0.benefits.0', fallback: 'Discovery workshops' },
        { key: 'consulting.packages.0.benefits.1', fallback: 'AI readiness scorecard' },
        { key: 'consulting.packages.0.benefits.2', fallback: 'Roadmap with next best moves' }
      ]
    },
    {
      icon: 'idea',
      nameKey: 'consulting.packages.1.name',
      nameFallback: 'Build',
      descriptionKey: 'consulting.packages.1.description',
      descriptionFallback: 'Prototype, integrate, and launch calm AI experiences.',
      benefits: [
        { key: 'consulting.packages.1.benefits.0', fallback: 'Rapid proof of concept' },
        { key: 'consulting.packages.1.benefits.1', fallback: 'Integration with your stack' },
        { key: 'consulting.packages.1.benefits.2', fallback: 'Training sessions for your team' }
      ]
    },
    {
      icon: 'people',
      nameKey: 'consulting.packages.2.name',
      nameFallback: 'Care',
      descriptionKey: 'consulting.packages.2.description',
      descriptionFallback: 'Keep the lights on with governance, improvements, and support.',
      benefits: [
        { key: 'consulting.packages.2.benefits.0', fallback: 'Monthly health reviews' },
        { key: 'consulting.packages.2.benefits.1', fallback: 'Iteration backlog' },
        { key: 'consulting.packages.2.benefits.2', fallback: 'On-call support crew' }
      ]
    }
  ] as const;

  const approach = {
    titleKey: 'consulting.approach.title',
    titleFallback: 'How we work',
    introKey: 'consulting.approach.intro',
    introFallback:
      'Every engagement blends signage discipline with collaborative rituals. We reduce noise, document decisions, and co-create calm delivery loops.',
    points: [
      {
        icon: 'education',
        titleKey: 'consulting.approach.points.0.title',
        titleFallback: 'Collaborative discovery',
        descriptionKey: 'consulting.approach.points.0.description',
        descriptionFallback: 'We listen first, mapping opportunities, constraints, and stakeholders so every move respects your context.'
      },
      {
        icon: 'target',
        titleKey: 'consulting.approach.points.1.title',
        titleFallback: 'Responsible delivery',
        descriptionKey: 'consulting.approach.points.1.description',
        descriptionFallback: 'Accessible design, privacy, and change management guide each prototype before it reaches production.'
      },
      {
        icon: 'people',
        titleKey: 'consulting.approach.points.2.title',
        titleFallback: 'Ongoing enablement',
        descriptionKey: 'consulting.approach.points.2.description',
        descriptionFallback: 'Training, documentation, and mentorship keep teams confident long after launch.'
      }
    ]
  } as const;

  const process = {
    titleKey: 'consulting.process_title',
    titleFallback: 'Pilot flow',
    steps: [
      {
        titleKey: 'consulting.process_steps.0.title',
        titleFallback: 'Kickoff call',
        descriptionKey: 'consulting.process_steps.0.description',
        descriptionFallback: 'Understand goals, constraints, and desired outcomes.'
      },
      {
        titleKey: 'consulting.process_steps.1.title',
        titleFallback: 'Design sprint',
        descriptionKey: 'consulting.process_steps.1.description',
        descriptionFallback: 'Prototype the experience and confirm technical approach.'
      },
      {
        titleKey: 'consulting.process_steps.2.title',
        titleFallback: 'Launch support',
        descriptionKey: 'consulting.process_steps.2.description',
        descriptionFallback: 'Ship, measure, and adjust together.'
      }
    ]
  } as const;

  const timeline = {
    titleKey: 'consulting.timeline_title',
    titleFallback: 'Process timeline',
    items: [
      { key: 'consulting.week_1', fallback: 'Week 1: Discovery conversation' },
      { key: 'consulting.week_2', fallback: 'Week 2: Strategy blueprint' },
      { key: 'consulting.week_3_12', fallback: 'Week 3-12: Implementation support' }
    ]
  } as const;

  const benefits = {
    titleKey: 'consulting.benefits_title',
    titleFallback: 'What you get',
    items: [
      { key: 'consulting.benefit_1', fallback: 'Complimentary AI strategy workshop' },
      { key: 'consulting.benefit_2', fallback: 'Hands-on implementation plan' },
      { key: 'consulting.benefit_3', fallback: 'Three months of advisory support' },
      { key: 'consulting.benefit_4', fallback: 'Priority access to our products' }
    ]
  } as const;

  const requirements = {
    titleKey: 'consulting.requirements_title',
    titleFallback: 'Requirements',
    items: [
      { key: 'consulting.req_1', fallback: 'Based in Europe or comfortable with CET hours' },
      { key: 'consulting.req_2', fallback: 'Committed to AI transformation' },
      { key: 'consulting.req_3', fallback: 'Open to collaboration and feedback' }
    ]
  } as const;

  const examples = {
    titleKey: 'consulting.examples.title',
    titleFallback: 'Example engagements',
    introKey: 'consulting.examples.intro',
    introFallback: 'Imagining how calm AI can support your sector helps teams visualise the impact before we start.',
    items: [
      {
        icon: 'education',
        titleKey: 'consulting.examples.items.0.title',
        titleFallback: 'School network feedback assistant',
        descriptionKey: 'consulting.examples.items.0.description',
        descriptionFallback:
          'Co-designed a multilingual assistant so teachers capture student reflections faster while staying GDPR-aligned.',
        metaKey: 'consulting.examples.items.0.meta',
        metaFallback: 'Education • 8-week sprint'
      },
      {
        icon: 'idea',
        titleKey: 'consulting.examples.items.1.title',
        titleFallback: 'Startup go-to-market co-pilot',
        descriptionKey: 'consulting.examples.items.1.description',
        descriptionFallback:
          'Guided a three-person marketing crew with ideation rituals, automated briefs, and inclusive analytics dashboards.',
        metaKey: 'consulting.examples.items.1.meta',
        metaFallback: 'Creative industry • 6-week pilot'
      }
    ]
  } as const;

  const finalCta = {
    titleKey: 'consulting.cta.title',
    titleFallback: 'Ready to join the pilot?',
    copyKey: 'consulting.cta.copy',
    copyFallback:
      'Share your goals and we will choreograph the mix of strategy, build, and care that keeps AI friendly for your teams.',
    primary: {
      href: 'mailto:consulting@algorhythmics.dev',
      labelKey: 'consulting.cta.primary',
      labelFallback: 'Book a consultation'
    },
    secondary: {
      href: null,
      labelKey: 'consulting.cta.secondary',
      labelFallback: 'Download capabilities overview',
      statusKey: 'consulting.cta.secondary_status',
      statusFallback: 'Coming soon'
    }
  } as const;

  const industries = [
    { value: 'technology', labelKey: 'consulting.industries.technology', labelFallback: 'Technology' },
    { value: 'fintech', labelKey: 'consulting.industries.fintech', labelFallback: 'FinTech' },
    { value: 'ecommerce', labelKey: 'consulting.industries.ecommerce', labelFallback: 'E-commerce' },
    { value: 'healthcare', labelKey: 'consulting.industries.healthcare', labelFallback: 'Healthcare' },
    { value: 'education', labelKey: 'consulting.industries.education', labelFallback: 'Education' },
    { value: 'manufacturing', labelKey: 'consulting.industries.manufacturing', labelFallback: 'Manufacturing' },
    { value: 'other', labelKey: 'consulting.industries.other', labelFallback: 'Other' }
  ] as const;

  let formData = {
    company: '',
    name: '',
    email: '',
    phone: '',
    industry: '',
    description: ''
  };

  let errors: Record<string, string> = {};
  let status: 'idle' | 'success' | 'error' = 'idle';

  const resetStatus = () => {
    if (status !== 'idle') status = 'idle';
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.company.trim())
      next.company = t('consulting.form_errors.company_required');
    if (!formData.name.trim())
      next.name = t('consulting.form_errors.name_required');
    if (!formData.email.trim()) next.email = t('consulting.form_errors.email_required');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      next.email = t('consulting.form_errors.email_invalid');
    if (!formData.industry.trim())
      next.industry = t('consulting.form_errors.industry_required');
    if (!formData.description.trim())
      next.description = t('consulting.form_errors.description_required');

    errors = next;
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!validate()) {
      status = 'error';
      return;
    }

    const subject = encodeURIComponent(
      t('consulting.form_mailto_subject', { company: formData.company })
    );
    const bodyTemplate = t('consulting.form_mailto_body');
    const body = encodeURIComponent(
      bodyTemplate
        .replace('{company}', formData.company)
        .replace('{name}', formData.name)
        .replace('{email}', formData.email)
        .replace('{phone}', formData.phone || 'N/A')
        .replace('{industry}', formData.industry)
        .replace('{description}', formData.description)
    );

    window.location.href = `mailto:consulting@algorhythmics.dev?subject=${subject}&body=${body}`;
    status = 'success';
    formData = { company: '', name: '', email: '', phone: '', industry: '', description: '' };
  };

  onMount(() => {
    resetStatus();
  });
</script>

<Hero
  class="hero--products"
  variant="halo"
  title={t(hero.titleKey, hero.titleFallback)}
  subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
>
  <svelte:fragment slot="status">
    <span class="hero-badge surface-pill" data-tone="accent">{t(hero.badgeKey, hero.badgeFallback)}</span>
  </svelte:fragment>
  <svelte:fragment slot="description">
    <p class="hero-description">{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <Button href={hero.primaryCta.href} variant="gradient" size="lg">{t(hero.primaryCta.labelKey, hero.primaryCta.labelFallback)}</Button>
    <Button href={hero.secondaryCta.href} variant="secondary" size="lg">{t(hero.secondaryCta.labelKey, hero.secondaryCta.labelFallback)}</Button>
  </svelte:fragment>
  <svelte:fragment slot="highlights">
    <ul class="hero-highlights">
      {#each heroHighlights as highlight (highlight.key)}
        <li>
          <Icon name="idea" size="var(--icon-glyph-sm)" />
          <span>{t(highlight.key, highlight.fallback)}</span>
        </li>
      {/each}
    </ul>
    <p class="hero-spots">
      {t('consulting.spots_remaining', { count: 3 })}
    </p>
  </svelte:fragment>
  <svelte:fragment slot="aside">
    <GlassCard class="testimonial" padding="lg" halo>
      <span class="testimonial__label">{t(heroTestimonial.labelKey, heroTestimonial.labelFallback)}</span>
      <blockquote>
        {t(heroTestimonial.quoteKey, heroTestimonial.quoteFallback)}
      </blockquote>
      <p class="testimonial__meta">
        <strong>{t(heroTestimonial.nameKey, heroTestimonial.nameFallback)}</strong>
        <span>{t(heroTestimonial.roleKey, heroTestimonial.roleFallback)}</span>
      </p>
    </GlassCard>

    <GlassCard class="hero-media consulting-hero-media" padding="lg" particles>
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

<Section class="quick-facts" data-surface="glow">
  <div class="quick-facts__content" use:revealOnScroll>
    <GlassCard class="quick-facts__card" halo>
      <span class="section-eyebrow">{t('consulting.page.quick_facts_eyebrow')}</span>
      <h2>{t(quickFacts.titleKey, quickFacts.titleFallback)}</h2>
      <ul>
        {#each quickFacts.items as item (item.key)}
          <li>
            <Icon name="target" size="var(--icon-glyph-sm)" />
            <span>{t(item.key, item.fallback)}</span>
          </li>
        {/each}
      </ul>
    </GlassCard>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section
  class="packages"
  data-surface="glow"
  id="packages"
  aria-labelledby="packages-heading"
>
  <div class="packages__content" use:revealOnScroll>
    <header class="section-heading">
      <span class="section-eyebrow">{t('consulting.packages_title')}</span>
      <h2 id="packages-heading">{t('consulting.page.packages_title')}</h2>
      <p>
        {t('consulting.page.packages_description')}
      </p>
    </header>

    <div class="packages__grid auto-grid" use:staggerReveal>
      {#each servicePackages as pkg (pkg.nameKey)}
        <GlassCard class="package-card" padding="lg" halo interactive>
          <div class="package-card__header">
            <span class="package-icon" aria-hidden="true">
              <Icon name={pkg.icon} size="var(--icon-glyph-lg)" />
            </span>
            <h3>{t(pkg.nameKey, pkg.nameFallback)}</h3>
          </div>
          <p>{t(pkg.descriptionKey, pkg.descriptionFallback)}</p>
          <ul>
            {#each pkg.benefits as benefit (benefit.key)}
              <li>{t(benefit.key, benefit.fallback)}</li>
            {/each}
          </ul>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<Section class="approach" data-surface="glow">
  <div class="approach__grid" use:revealOnScroll>
    <div class="approach__summary">
      <span class="section-eyebrow">{t('consulting.page.approach_eyebrow')}</span>
      <h2>{t(approach.titleKey, approach.titleFallback)}</h2>
      <p>{t(approach.introKey, approach.introFallback)}</p>
    </div>
    <div class="approach__points" use:staggerReveal>
      {#each approach.points as point (point.titleKey)}
        <GlassCard class="approach-card" halo>
          <div class="approach-card__header">
            <span class="approach-icon" aria-hidden="true">
              <Icon name={point.icon} size="var(--icon-glyph-md)" />
            </span>
            <h3>{t(point.titleKey, point.titleFallback)}</h3>
          </div>
          <p>{t(point.descriptionKey, point.descriptionFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="process" data-surface="glow">
  <div class="process__grid" use:revealOnScroll>
    <div>
      <span class="section-eyebrow">{t('consulting.page.process_eyebrow')}</span>
      <h2>{t(process.titleKey, process.titleFallback)}</h2>
      <ol class="process-steps">
        {#each process.steps as step (step.titleKey)}
          <li>
            <h3>{t(step.titleKey, step.titleFallback)}</h3>
            <p>{t(step.descriptionKey, step.descriptionFallback)}</p>
          </li>
        {/each}
      </ol>
    </div>
    <div class="process__aside">
      <GlassCard class="timeline-card" halo>
        <h3>{t(timeline.titleKey, timeline.titleFallback)}</h3>
        <ul>
          {#each timeline.items as item (item.key)}
            <li>{t(item.key, item.fallback)}</li>
          {/each}
        </ul>
      </GlassCard>
      <GlassCard class="benefits-card" halo>
        <h3>{t(benefits.titleKey, benefits.titleFallback)}</h3>
        <ul>
          {#each benefits.items as item (item.key)}
            <li>{t(item.key, item.fallback)}</li>
          {/each}
        </ul>
      </GlassCard>
    </div>
  </div>
</Section>

<Section class="requirements" data-surface="glow">
  <div class="requirements__grid auto-grid" use:revealOnScroll>
    <GlassCard class="requirements-card" halo>
      <h2>{t(requirements.titleKey, requirements.titleFallback)}</h2>
      <ul>
        {#each requirements.items as item (item.key)}
          <li>
            <Icon name="info" size="var(--icon-glyph-xs)" />
            <span>{t(item.key, item.fallback)}</span>
          </li>
        {/each}
      </ul>
    </GlassCard>
    <GlassCard class="contact-card" halo>
      <span class="section-eyebrow">{t('consulting.page.supporting_info_eyebrow')}</span>
      <h2>{t('consulting.page.supporting_info_title')}</h2>
      <p>
        {t('consulting.page.supporting_info_copy')}
      </p>
      <Button href="mailto:consulting@algorhythmics.dev" variant="secondary" size="md">
        {t('consulting.page.supporting_info_cta')}
      </Button>
    </GlassCard>
  </div>
</Section>

<SectionDivider tone="aurora" />

<Section class="examples" data-surface="glow">
  <div class="examples__content" use:revealOnScroll>
    <header class="section-heading">
      <span class="section-eyebrow">{t('consulting.page.examples_eyebrow')}</span>
      <h2>{t(examples.titleKey, examples.titleFallback)}</h2>
      <p>{t(examples.introKey, examples.introFallback)}</p>
    </header>
    <div class="examples__grid auto-grid" use:staggerReveal>
      {#each examples.items as item (item.titleKey)}
        <GlassCard class="example-card" padding="lg" halo interactive>
          <div class="example-card__header">
            <span class="example-icon" aria-hidden="true">
              <Icon name={item.icon} size="var(--icon-glyph-md)" />
            </span>
            <div>
              <span class="example-meta">{t(item.metaKey, item.metaFallback)}</span>
              <h3>{t(item.titleKey, item.titleFallback)}</h3>
            </div>
          </div>
          <p>{t(item.descriptionKey, item.descriptionFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</Section>

<SectionDivider tone="neutral" />

<Section class="application" data-surface="glow" id="apply">
  <div class="application__content" use:revealOnScroll>
    <GlassCard class="application-card" halo>
      <span class="section-eyebrow">{t('consulting.form_title')}</span>
      <h2>{t('consulting.page.application_title')}</h2>
      <p>{t('consulting.form_intro')}</p>

      {#if status === 'success'}
        <p role="status" class="form-status form-status--success">{t('consulting.form_success')}</p>
      {:else if status === 'error'}
        <p role="alert" class="form-status form-status--error">{t('consulting.form_error')}</p>
      {/if}

      <form class="form" on:submit={handleSubmit}>
        <label class="form-field">
          <span>{t('consulting.form_company')}</span>
          <input
            type="text"
            bind:value={formData.company}
            on:input={resetStatus}
            aria-invalid={errors.company ? 'true' : 'false'}
          />
          {#if errors.company}
            <span class="field-error">{errors.company}</span>
          {/if}
        </label>

        <label class="form-field">
          <span>{t('consulting.form_name')}</span>
          <input
            type="text"
            bind:value={formData.name}
            on:input={resetStatus}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {#if errors.name}
            <span class="field-error">{errors.name}</span>
          {/if}
        </label>

        <label class="form-field">
          <span>{t('consulting.form_email')}</span>
          <input
            type="email"
            bind:value={formData.email}
            on:input={resetStatus}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {#if errors.email}
            <span class="field-error">{errors.email}</span>
          {/if}
        </label>

        <label class="form-field">
          <span>{t('consulting.form_phone')}</span>
          <input type="tel" bind:value={formData.phone} on:input={resetStatus} />
        </label>

        <label class="form-field">
          <span>{t('consulting.form_industry')}</span>
          <select bind:value={formData.industry} on:change={resetStatus} aria-invalid={errors.industry ? 'true' : 'false'}>
            <option value="">{t('consulting.select_industry')}</option>
            {#each industries as industry (industry.value)}
              <option value={industry.value}>{t(industry.labelKey, industry.labelFallback)}</option>
            {/each}
          </select>
          {#if errors.industry}
            <span class="field-error">{errors.industry}</span>
          {/if}
        </label>

        <label class="form-field form--full">
          <span>{t('consulting.form_description')}</span>
          <textarea
            rows="5"
            bind:value={formData.description}
            on:input={resetStatus}
            aria-invalid={errors.description ? 'true' : 'false'}
          ></textarea>
          {#if errors.description}
            <span class="field-error">{errors.description}</span>
          {/if}
        </label>

        <Button type="submit" variant="gradient" size="lg">{t('consulting.form_submit')}</Button>
      </form>
    </GlassCard>
  </div>
</Section>

<Section class="cta" data-surface="glow">
  <div class="cta__content" use:revealOnScroll>
    <GlassCard class="cta-card" padding="lg" halo interactive>
      <span class="section-eyebrow">{t('consulting.page.cta_eyebrow')}</span>
      <h2>{t(finalCta.titleKey, finalCta.titleFallback)}</h2>
      <p>{t(finalCta.copyKey, finalCta.copyFallback)}</p>
      <div class="cta-actions">
        <Button href={finalCta.primary.href} variant="gradient" size="lg">
          {t(finalCta.primary.labelKey, finalCta.primary.labelFallback)}
        </Button>
        {#if finalCta.secondary.href}
          <Button href={finalCta.secondary.href} variant="secondary" size="lg">
            {t(finalCta.secondary.labelKey, finalCta.secondary.labelFallback)}
          </Button>
        {:else}
          <div class="cta-disabled-wrapper">
            <Button variant="secondary" size="lg" aria-disabled="true" class="cta-disabled">
              {t(finalCta.secondary.labelKey, finalCta.secondary.labelFallback)}
            </Button>
            <span class="cta-note">{t(finalCta.secondary.statusKey, finalCta.secondary.statusFallback)}</span>
          </div>
        {/if}
      </div>
    </GlassCard>
  </div>
</Section>

<style>
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: calc(var(--space-xs) + var(--space-3xs));
    font-size: var(--text-small);
    letter-spacing: var(--tracking-tight);
    text-transform: uppercase;
  }

  .hero-description {
    max-width: 68ch;
    margin: 0;
    font-size: var(--text-lead);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
  }

  .hero-highlights {
    display: grid;
    gap: calc(var(--space-sm) - var(--space-xs) / 2);
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: var(--text-small);
  }

  .hero-highlights li {
    display: flex;
    align-items: center;
    gap: calc(var(--space-sm) - var(--space-xs) / 2);
  }

  .hero-highlights :global(.icon) {
    color: var(--accent-secondary);
  }

  :global(.section.quick-facts),
  :global(.section.packages),
  :global(.section.approach),
  :global(.section.process),
  :global(.section.requirements),
  :global(.section.examples),
  :global(.section.application),
  :global(.section.cta) {
    isolation: isolate;
  }

  :global(.section.quick-facts) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.16);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.1);
  }

  :global(.section.packages) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.24);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.approach) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.24);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.process) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  :global(.section.requirements) {
    --section-glow-primary: rgba(var(--signal-yellow-rgb), 0.18);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.16);
    --section-glow-accent: rgba(var(--voyage-blue-rgb), 0.12);
  }

  :global(.section.examples) {
    --section-glow-primary: rgba(var(--voyage-blue-rgb), 0.22);
    --section-glow-secondary: rgba(var(--aurora-purple-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.12);
  }

  :global(.section.application) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.26);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.2);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.14);
  }

  :global(.section.cta) {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.3);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.24);
    --section-glow-accent: rgba(var(--signal-yellow-rgb), 0.18);
  }

  .hero-spots {
    margin-top: calc(var(--space-xl) - var(--space-2xs));
    font-weight: 600;
    color: var(--accent-secondary);
  }

  :global(.testimonial) {
    display: grid;
    gap: var(--space-lg);
  }

  .testimonial__label {
    font-size: var(--text-caption);
    letter-spacing: var(--tracking-meta);
    text-transform: uppercase;
    color: var(--muted);
  }

  :global(.testimonial) blockquote {
    margin: 0;
    font-size: var(--text-lead);
    line-height: var(--leading-relaxed);
    font-style: italic;
  }

  :global(.consulting-hero-media) {
    margin-top: clamp(1rem, 3vw, 1.6rem);
  }

  .testimonial__meta {
    display: grid;
    gap: var(--space-3xs);
  }

  .testimonial__meta span {
    color: var(--muted);
  }

  :global(.quick-facts__card) ul {
    display: grid;
    gap: var(--space-md);
    padding: 0;
    margin: var(--space-xl) 0 0;
    list-style: none;
  }

  :global(.quick-facts__card) li {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    font-size: var(--text-body);
  }

  .packages__grid {
    --auto-grid-gap: var(--grid-gap-xl);
    --auto-grid-min: min(100%, var(--card-min-width));
    --auto-grid-max: min(100%, var(--card-max-width-wide));
  }

  :global(.package-card) {
    display: grid;
    gap: calc(var(--space-lg) + var(--space-2xs));
  }

  .package-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .package-icon {
    display: inline-flex;
    padding: var(--space-md);
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--glass-bg-lightest) 56%, transparent 44%);
    color: var(--accent-secondary);
  }

  :global(.package-card) ul {
    padding-left: calc(var(--space-lg) + var(--space-xs));
    display: grid;
    gap: var(--space-sm);
  }

  .approach__grid {
    display: grid;
    gap: var(--grid-gap-2xl);
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, calc(var(--card-max-width) + var(--space-lg))), 1fr)
    );
    align-items: start;
  }

  .approach__points {
    display: grid;
    gap: var(--grid-gap-lg);
  }

  :global(.approach-card) {
    display: grid;
    gap: var(--space-md);
  }

  .approach-card__header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .approach-icon {
    display: inline-flex;
    padding: calc(var(--space-md) - var(--space-3xs));
    border-radius: var(--radius-full);
    background: color-mix(in srgb, var(--glass-bg-lightest) 54%, transparent 46%);
    color: var(--accent-primary);
  }

  .process__grid {
    display: grid;
    gap: var(--grid-gap-2xl);
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, calc(var(--card-max-width-wide) + var(--space-lg))), 1fr)
    );
    align-items: start;
  }

  .process-steps {
    counter-reset: step;
    display: grid;
    gap: var(--grid-gap-lg);
    padding: 0;
    margin: var(--space-2xl) 0 0;
    list-style: none;
  }

  .process-steps li {
    position: relative;
    padding-left: calc(var(--space-3xl) + var(--space-sm));
  }

  .process-steps li::before {
    counter-increment: step;
    content: counter(step);
    position: absolute;
    left: 0;
    top: var(--space-3xs);
    inline-size: var(--size-icon-sm);
    block-size: var(--size-icon-sm);
    border-radius: var(--radius-full);
    display: grid;
    place-items: center;
    font-weight: 600;
    background: color-mix(in srgb, var(--glass-bg-lightest) 58%, transparent 42%);
    color: var(--accent-primary);
  }

  .process__aside {
    display: grid;
    gap: var(--grid-gap-lg);
  }

  :global(.timeline-card) ul,
  :global(.benefits-card) ul {
    display: grid;
    gap: var(--space-md);
    padding-left: calc(var(--space-lg) + var(--space-xs));
    margin: calc(var(--space-lg) + var(--space-xs)) 0 0;
  }

  .requirements__grid {
    --auto-grid-gap: var(--grid-gap-xl);
    --auto-grid-min: min(100%, var(--card-max-width));
    --auto-grid-max: min(100%, var(--card-max-width-wide));
  }

  :global(.requirements-card) ul {
    display: grid;
    gap: var(--space-md);
    padding: 0;
    margin: calc(var(--space-xl) - var(--space-xs)) 0 0;
    list-style: none;
  }

  :global(.requirements-card) li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
  }

  :global(.requirements-card) :global(.icon) {
    margin-top: var(--space-3xs);
    color: var(--accent-primary);
  }

  .examples__grid {
    --auto-grid-gap: var(--grid-gap-lg);
    --auto-grid-min: min(100%, var(--card-min-width));
    --auto-grid-max: min(100%, var(--card-max-width));
  }

  :global(.example-card) {
    display: grid;
    gap: var(--cluster-gap-md);
    width: min(100%, var(--card-max-width));
    margin-inline: auto;
  }

  .example-card__header {
    display: flex;
    gap: var(--space-lg);
    align-items: flex-start;
  }

  .example-icon {
    display: inline-flex;
    padding: var(--space-md);
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--glass-bg-lightest) 58%, transparent 42%);
    color: var(--accent-tertiary);
  }

  .example-meta {
    display: block;
    font-size: var(--text-label);
    letter-spacing: var(--tracking-meta);
    text-transform: uppercase;
    color: var(--muted);
  }

  :global(.application-card) {
    display: grid;
    gap: var(--cluster-gap-lg);
  }

  .application__content .form {
    --form-gap: var(--grid-gap-md);
    --form-field-radius: var(--radius-md);
    --form-field-padding-y: var(--space-md);
    --form-field-padding-x: var(--space-lg);
    --form-max-width: min(100%, var(--card-max-width-wide));
    --form-field-min-width: min(100%, calc(var(--card-min-width) + var(--space-sm)));
    --form-field-max-width: min(100%, var(--card-max-width-wide));
    --form-label-color: color-mix(in srgb, var(--text) 86%, transparent 14%);
    --form-field-bg: color-mix(in srgb, var(--glass-bg-lightest) 66%, transparent 34%);
    --form-field-border: color-mix(in srgb, var(--surface-field-border) 84%, transparent 16%);
    --form-field-border-focus: color-mix(
      in srgb,
      var(--aurora-purple) 56%,
      rgba(var(--voyage-blue-rgb), 0.42) 44%
    );
    --form-focus-ring-color: color-mix(in srgb, var(--aurora-purple) 70%, var(--voyage-blue) 30%);
    --form-field-shadow: var(--shadow-lg);
    --form-textarea-min-height: calc(var(--space-6xl) - var(--space-md));
    --form-actions-gap: var(--space-sm);
    --form-note-color: color-mix(in srgb, var(--text) 62%, transparent 38%);
    --form-status-padding: var(--space-md) var(--space-lg);
    --form-status-bg: color-mix(in srgb, var(--glass-bg-lightest) 58%, transparent 42%);
    --form-status-success-color: color-mix(in srgb, var(--aurora-purple) 68%, var(--text) 32%);
    --form-status-success-bg: color-mix(in srgb, var(--glass-bg-lightest) 62%, transparent 38%);
    --form-status-error-bg: color-mix(in srgb, var(--glass-bg-lightest) 56%, transparent 44%);
    --form-status-error-color: var(--cherry-pop);
  }

  .application__content .form-status {
    text-wrap: balance;
  }

  :global(.cta-card) {
    display: grid;
    gap: calc(var(--space-xl) - var(--space-xs));
    text-align: left;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
  }

  .cta-disabled-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }

  .cta-note {
    font-size: var(--text-meta);
    color: color-mix(in oklab, var(--text) 70%, transparent 30%);
  }

  :global(.cta-disabled) {
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-spots,
    .process-steps li::before {
      animation: none;
    }
  }
</style>
