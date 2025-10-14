<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string, params?: Record<string, unknown>) =>
    translateOrFallback($_, key, fallback, params);

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
      href: 'mailto:consulting@algorhythmics.com',
      labelKey: 'consulting.cta.primary',
      labelFallback: 'Book a consultation'
    },
    secondary: {
      href: '/services#consulting',
      labelKey: 'consulting.cta.secondary',
      labelFallback: 'Download capabilities overview'
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
      next.company = t('consulting.form_errors.company_required', 'Please add your company or initiative name.');
    if (!formData.name.trim())
      next.name = t('consulting.form_errors.name_required', 'Let us know who we will be speaking with.');
    if (!formData.email.trim()) next.email = t('consulting.form_errors.email_required', 'Email helps us reply.');
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      next.email = t('consulting.form_errors.email_invalid', 'Add a valid email address.');
    if (!formData.industry.trim())
      next.industry = t('consulting.form_errors.industry_required', 'Select the industry closest to your work.');
    if (!formData.description.trim())
      next.description = t('consulting.form_errors.description_required', 'Share a little about your goals.');

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
      t('consulting.form_mailto_subject', 'Consulting pilot application from {company}', { company: formData.company })
    );
    const bodyTemplate = t(
      'consulting.form_mailto_body',
      'Company: {company}\nContact: {name}\nEmail: {email}\nPhone: {phone}\nIndustry: {industry}\n\nGoals:\n{description}'
    );
    const body = encodeURIComponent(
      bodyTemplate
        .replace('{company}', formData.company)
        .replace('{name}', formData.name)
        .replace('{email}', formData.email)
        .replace('{phone}', formData.phone || 'N/A')
        .replace('{industry}', formData.industry)
        .replace('{description}', formData.description)
    );

    window.location.href = `mailto:consulting@algorhythmics.com?subject=${subject}&body=${body}`;
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
    <div class="hero-actions">
      <Button href={hero.primaryCta.href} variant="gradient" size="lg">{t(hero.primaryCta.labelKey, hero.primaryCta.labelFallback)}</Button>
      <Button href={hero.secondaryCta.href} variant="secondary" size="lg">{t(hero.secondaryCta.labelKey, hero.secondaryCta.labelFallback)}</Button>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="highlights">
    <ul class="hero-highlights">
      {#each heroHighlights as highlight (highlight.key)}
        <li>
          <Icon name="idea" size={22} />
          <span>{t(highlight.key, highlight.fallback)}</span>
        </li>
      {/each}
    </ul>
    <p class="hero-spots">
      {t('consulting.spots_remaining', '{count} pilot spots remaining', { count: 3 })}
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
  </svelte:fragment>
</Hero>

<section class="quick-facts" use:revealOnScroll>
  <div class="container">
    <GlassCard class="quick-facts__card" halo>
      <span class="section-eyebrow">{t('consulting.page.quick_facts_eyebrow', 'At a glance')}</span>
      <h2>{t(quickFacts.titleKey, quickFacts.titleFallback)}</h2>
      <ul>
        {#each quickFacts.items as item (item.key)}
          <li>
            <Icon name="target" size={22} />
            <span>{t(item.key, item.fallback)}</span>
          </li>
        {/each}
      </ul>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="packages" id="packages" aria-labelledby="packages-heading" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">{t('consulting.packages_title', 'How we help')}</span>
      <h2 id="packages-heading">{t('consulting.page.packages_title', 'Strategy, build, and care in one rhythm')}</h2>
      <p>
        {t(
          'consulting.page.packages_description',
          'Choose the mix that fits your roadmap. Most partnerships weave all three phases together for continuity.'
        )}
      </p>
    </header>

    <div class="packages__grid" use:staggerReveal>
      {#each servicePackages as pkg (pkg.nameKey)}
        <GlassCard class="package-card" padding="lg" halo interactive>
          <div class="package-card__header">
            <span class="package-icon" aria-hidden="true">
              <Icon name={pkg.icon} size={28} />
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
</section>

<section class="approach" use:revealOnScroll>
  <div class="container approach__grid">
    <div class="approach__summary">
      <span class="section-eyebrow">{t('consulting.page.approach_eyebrow', 'Our philosophy')}</span>
      <h2>{t(approach.titleKey, approach.titleFallback)}</h2>
      <p>{t(approach.introKey, approach.introFallback)}</p>
    </div>
    <div class="approach__points" use:staggerReveal>
      {#each approach.points as point (point.titleKey)}
        <GlassCard class="approach-card" halo>
          <div class="approach-card__header">
            <span class="approach-icon" aria-hidden="true">
              <Icon name={point.icon} size={24} />
            </span>
            <h3>{t(point.titleKey, point.titleFallback)}</h3>
          </div>
          <p>{t(point.descriptionKey, point.descriptionFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="process" use:revealOnScroll>
  <div class="container process__grid">
    <div>
      <span class="section-eyebrow">{t('consulting.page.process_eyebrow', 'Pilot flow')}</span>
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
</section>

<section class="requirements" use:revealOnScroll>
  <div class="container requirements__grid">
    <GlassCard class="requirements-card" halo>
      <h2>{t(requirements.titleKey, requirements.titleFallback)}</h2>
      <ul>
        {#each requirements.items as item (item.key)}
          <li>
            <Icon name="info" size={20} />
            <span>{t(item.key, item.fallback)}</span>
          </li>
        {/each}
      </ul>
    </GlassCard>
    <GlassCard class="contact-card" halo>
      <span class="section-eyebrow">{t('consulting.page.supporting_info_eyebrow', 'Need something else?')}</span>
      <h2>{t('consulting.page.supporting_info_title', 'We adapt to complex environments')}</h2>
      <p>
        {t(
          'consulting.page.supporting_info_copy',
          'Regulated industries, multilingual teams, and hybrid infrastructures are welcome. We document every decision for smooth audits.'
        )}
      </p>
      <Button href="mailto:consulting@algorhythmics.com" variant="secondary" size="md">
        {t('consulting.page.supporting_info_cta', 'Email the consulting crew')}
      </Button>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="examples" use:revealOnScroll>
  <div class="container">
    <header class="section-heading">
      <span class="section-eyebrow">{t('consulting.page.examples_eyebrow', 'Sample impact')}</span>
      <h2>{t(examples.titleKey, examples.titleFallback)}</h2>
      <p>{t(examples.introKey, examples.introFallback)}</p>
    </header>
    <div class="examples__grid" use:staggerReveal>
      {#each examples.items as item (item.titleKey)}
        <GlassCard class="example-card" padding="lg" halo interactive>
          <div class="example-card__header">
            <span class="example-icon" aria-hidden="true">
              <Icon name={item.icon} size={26} />
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
</section>

<SectionDivider tone="neutral" />

<section class="application" id="apply" use:revealOnScroll>
  <div class="container">
    <GlassCard class="application-card" halo>
      <span class="section-eyebrow">{t('consulting.form_title', 'Apply for the pilot')}</span>
      <h2>{t('consulting.page.application_title', 'Tell us about your team')}</h2>
      <p>{t('consulting.form_intro', 'Tell us a little about your team so we can tailor the session.')}</p>

      {#if status === 'success'}
        <p role="status" class="form-status form-status--success">{t('consulting.form_success', 'Application received! We\'ll reach out within 48 hours.')}</p>
      {:else if status === 'error'}
        <p role="alert" class="form-status form-status--error">{t('consulting.form_error', 'Something went wrong. Please try again.')}</p>
      {/if}

      <form class="form" on:submit={handleSubmit}>
        <label>
          <span>{t('consulting.form_company', 'Company')}</span>
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

        <label>
          <span>{t('consulting.form_name', 'Contact name')}</span>
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

        <label>
          <span>{t('consulting.form_email', 'Email')}</span>
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

        <label>
          <span>{t('consulting.form_phone', 'Phone (optional)')}</span>
          <input type="tel" bind:value={formData.phone} on:input={resetStatus} />
        </label>

        <label>
          <span>{t('consulting.form_industry', 'Industry')}</span>
          <select bind:value={formData.industry} on:change={resetStatus} aria-invalid={errors.industry ? 'true' : 'false'}>
            <option value="">{t('consulting.select_industry', 'Select industry...')}</option>
            {#each industries as industry (industry.value)}
              <option value={industry.value}>{t(industry.labelKey, industry.labelFallback)}</option>
            {/each}
          </select>
          {#if errors.industry}
            <span class="field-error">{errors.industry}</span>
          {/if}
        </label>

        <label class="form--full">
          <span>{t('consulting.form_description', 'Describe your AI needs')}</span>
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

        <Button type="submit" variant="gradient" size="lg">{t('consulting.form_submit', 'Submit application')}</Button>
      </form>
    </GlassCard>
  </div>
</section>

<section class="cta" use:revealOnScroll>
  <div class="container">
    <GlassCard class="cta-card" padding="lg" halo interactive>
      <span class="section-eyebrow">{t('consulting.page.cta_eyebrow', 'Next steps')}</span>
      <h2>{t(finalCta.titleKey, finalCta.titleFallback)}</h2>
      <p>{t(finalCta.copyKey, finalCta.copyFallback)}</p>
      <div class="cta-actions">
        <Button href={finalCta.primary.href} variant="gradient" size="lg">{t(finalCta.primary.labelKey, finalCta.primary.labelFallback)}</Button>
        <Button href={finalCta.secondary.href} variant="secondary" size="lg">{t(finalCta.secondary.labelKey, finalCta.secondary.labelFallback)}</Button>
      </div>
    </GlassCard>
  </div>
</section>

<style>
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: var(--text-small);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .hero-description {
    max-width: 68ch;
    margin: 0;
    font-size: clamp(1.05rem, 2.6vw, 1.3rem);
    line-height: 1.6;
    color: var(--text-secondary, color-mix(in srgb, var(--text) 82%, rgba(var(--ink-rgb), 0.4) 18%));
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .hero-highlights {
    display: grid;
    gap: 0.6rem;
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: var(--text-small);
  }

  .hero-highlights li {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .hero-highlights :global(.icon) {
    color: var(--accent-secondary, var(--voyage-blue));
  }

  .hero-spots {
    margin-top: 1.4rem;
    font-weight: 600;
    color: var(--accent-secondary, var(--voyage-blue));
  }

  :global(.testimonial) {
    display: grid;
    gap: 1rem;
  }

  .testimonial__label {
    font-size: var(--text-caption);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted, color-mix(in srgb, var(--text) 60%, rgba(var(--ink-rgb), 0.3) 40%));
  }

  :global(.testimonial) blockquote {
    margin: 0;
    font-size: clamp(1.05rem, 2.4vw, 1.35rem);
    line-height: 1.6;
    font-style: italic;
  }

  .testimonial__meta {
    display: grid;
    gap: 0.1rem;
  }

  .testimonial__meta span {
    color: var(--muted, color-mix(in srgb, var(--text) 60%, rgba(var(--ink-rgb), 0.3) 40%));
  }

  :global(.quick-facts__card) ul {
    display: grid;
    gap: 0.75rem;
    padding: 0;
    margin: 1.5rem 0 0;
    list-style: none;
  }

  :global(.quick-facts__card) li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
  }

  .packages__grid {
    display: grid;
    gap: clamp(1.5rem, 3vw, 2.4rem);
  }

  @media (min-width: 900px) {
    .packages__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  :global(.package-card) {
    display: grid;
    gap: 1.1rem;
  }

  .package-card__header {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .package-icon {
    display: inline-flex;
    padding: 0.75rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent-secondary, var(--voyage-blue)) 14%, transparent 86%);
    color: var(--accent-secondary, var(--voyage-blue));
  }

  :global(.package-card) ul {
    padding-left: 1.2rem;
    display: grid;
    gap: 0.5rem;
  }

  .approach__grid {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
  }

  @media (min-width: 960px) {
    .approach__grid {
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      align-items: start;
    }
  }

  .approach__points {
    display: grid;
    gap: 1.4rem;
  }

  :global(.approach-card) {
    display: grid;
    gap: 0.8rem;
  }

  .approach-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .approach-icon {
    display: inline-flex;
    padding: 0.65rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent-primary, var(--aurora-purple)) 16%, transparent 84%);
    color: var(--accent-primary, var(--aurora-purple));
  }

  .process__grid {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
  }

  @media (min-width: 1024px) {
    .process__grid {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    }
  }

  .process-steps {
    counter-reset: step;
    display: grid;
    gap: 1.4rem;
    padding: 0;
    margin: 2rem 0 0;
    list-style: none;
  }

  .process-steps li {
    position: relative;
    padding-left: 3.2rem;
  }

  .process-steps li::before {
    counter-increment: step;
    content: counter(step);
    position: absolute;
    left: 0;
    top: 0.1rem;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 600;
    background: color-mix(in srgb, var(--accent-primary, var(--aurora-purple)) 18%, transparent 82%);
    color: var(--accent-primary, var(--aurora-purple));
  }

  .process__aside {
    display: grid;
    gap: 1.4rem;
  }

  :global(.timeline-card) ul,
  :global(.benefits-card) ul {
    display: grid;
    gap: 0.8rem;
    padding-left: 1.2rem;
    margin: 1.2rem 0 0;
  }

  .requirements__grid {
    display: grid;
    gap: clamp(1.6rem, 4vw, 2.4rem);
  }

  @media (min-width: 860px) {
    .requirements__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  :global(.requirements-card) ul {
    display: grid;
    gap: 0.75rem;
    padding: 0;
    margin: 1.4rem 0 0;
    list-style: none;
  }

  :global(.requirements-card) li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  :global(.requirements-card) :global(.icon) {
    margin-top: 0.2rem;
    color: var(--accent-primary, var(--aurora-purple));
  }

  .examples__grid {
    display: grid;
    gap: clamp(1.5rem, 3vw, 2.4rem);
  }

  @media (min-width: 900px) {
    .examples__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  :global(.example-card) {
    display: grid;
    gap: 1rem;
  }

  .example-card__header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .example-icon {
    display: inline-flex;
    padding: 0.75rem;
    border-radius: 18px;
    background: color-mix(in srgb, var(--accent-tertiary, var(--signal-yellow)) 18%, transparent 82%);
    color: var(--accent-tertiary, var(--signal-yellow));
  }

  .example-meta {
    display: block;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted, color-mix(in srgb, var(--text) 60%, rgba(var(--ink-rgb), 0.3) 40%));
  }

  :global(.application-card) {
    display: grid;
    gap: 1.5rem;
  }

  .form {
    display: grid;
    gap: 1.2rem;
  }

  .form label {
    display: grid;
    gap: 0.4rem;
  }

  .form input,
  .form select,
  .form textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent 20%);
    background: color-mix(in srgb, var(--bg-elev-1) 98%, rgba(var(--ink-rgb), 0.04) 2%);
    color: var(--text);
    font-size: 1rem;
  }

  .form textarea {
    resize: vertical;
    min-height: 160px;
  }

  .form--full {
    grid-column: 1 / -1;
  }

  .field-error {
    color: var(--cherry-pop);
    font-size: 0.9rem;
  }

  .form-status {
    margin: 0;
    padding: 0.75rem 1rem;
    border-radius: 14px;
    font-weight: 600;
  }

  .form-status--success {
    background: color-mix(in srgb, var(--accent-primary, var(--aurora-purple)) 16%, transparent 84%);
    color: var(--accent-primary, var(--aurora-purple));
  }

  .form-status--error {
    background: color-mix(in srgb, var(--cherry-pop) 16%, transparent 84%);
    color: var(--cherry-pop);
  }

  :global(.cta-card) {
    display: grid;
    gap: 1.4rem;
    text-align: left;
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-spots,
    .process-steps li::before {
      animation: none;
    }
  }
</style>
