<script lang="ts">
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import Button from '$lib/components/Button.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  import { revealOnScroll, staggerReveal } from '$lib/animations';
  import { _ } from 'svelte-i18n';
  import { translateOrFallback } from '$lib/utils/i18n';

  const t = (key: string, fallback: string, params?: Record<string, unknown>) =>
    translateOrFallback($_, key, fallback, params);

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
      href: '/solutions',
      labelKey: 'ideonautix.hero.secondary_cta',
      labelFallback: 'Back to solutions overview'
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
        'We only use the information you provide to coordinate pilot access. You can opt out at any time by emailing help@algorhythmics.com.',
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
    window.location.href = `mailto:help@algorhythmics.com?subject=${subject}&body=${body}`;
    pilotStatus = 'success';
    pilotName = '';
    pilotEmail = '';
    pilotMessage = '';
    pilotRole = 'founder';
  };
</script>

<Hero
  variant="halo"
  align="center"
  title={t(hero.titleKey, hero.titleFallback)}
  subtitle={t(hero.subtitleKey, hero.subtitleFallback)}
>
  <svelte:fragment slot="description">
    <p>{t(hero.descriptionKey, hero.descriptionFallback)}</p>
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <div class="hero-actions">
      <Button href={hero.primaryCta.href} variant="gradient" size="lg">
        {t(hero.primaryCta.labelKey, hero.primaryCta.labelFallback)}
      </Button>
      <Button href={hero.secondaryCta.href} variant="secondary" size="lg">
        {t(hero.secondaryCta.labelKey, hero.secondaryCta.labelFallback)}
      </Button>
    </div>
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

<section class="section section--modules" use:revealOnScroll>
  <div class="container">
    <h2 class="section-title">{t(modules.titleKey, modules.titleFallback)}</h2>
    <p class="section-lead">{t(modules.leadKey, modules.leadFallback)}</p>

    <div class="module-grid" use:staggerReveal>
      {#each modules.cards as module (module.titleKey)}
        <GlassCard class="module-card" halo padding="lg" interactive>
          <div class="module-icon" aria-hidden="true">
            <Icon name={module.icon} size={28} />
          </div>
          <h3>{t(module.titleKey, module.titleFallback)}</h3>
          <p>{t(module.copyKey, module.copyFallback)}</p>
        </GlassCard>
      {/each}
    </div>
  </div>
</section>

<SectionDivider tone="aurora" />

<section class="section section--status" use:revealOnScroll>
  <div class="container status">
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
</section>

<SectionDivider tone="neutral" />

<section class="section section--use-cases" use:revealOnScroll>
  <div class="container use-cases">
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
</section>

<SectionDivider tone="cherry" />

<section id="pilot-request" class="section pilot section--pilot" use:revealOnScroll>
  <div class="container">
    <GlassCard class="pilot-card" padding="lg" particles>
      <span class="section-eyebrow">{t(pilot.eyebrowKey, pilot.eyebrowFallback)}</span>
      <h2>{t(pilot.titleKey, pilot.titleFallback)}</h2>
      <p>{t(pilot.copyKey, pilot.copyFallback)}</p>

      <form class="pilot-form" on:submit={handlePilotSubmit}>
        <div class="form-grid">
          <label>
            <span>{t(pilot.form.nameLabelKey, pilot.form.nameLabelFallback)}</span>
            <input type="text" bind:value={pilotName} required on:input={resetPilotStatus} />
          </label>

          <label>
            <span>{t(pilot.form.emailLabelKey, pilot.form.emailLabelFallback)}</span>
            <input
              type="email"
              bind:value={pilotEmail}
              required
              aria-invalid={pilotStatus === 'error' ? 'true' : 'false'}
              on:input={resetPilotStatus}
            />
          </label>

          <label>
            <span>{t(pilot.form.roleLabelKey, pilot.form.roleLabelFallback)}</span>
            <select bind:value={pilotRole} on:change={resetPilotStatus}>
              <option value="founder">{t(pilot.form.roleOptions.founder.key, pilot.form.roleOptions.founder.fallback)}</option>
              <option value="student">{t(pilot.form.roleOptions.student.key, pilot.form.roleOptions.student.fallback)}</option>
              <option value="educator">{t(pilot.form.roleOptions.educator.key, pilot.form.roleOptions.educator.fallback)}</option>
              <option value="other">{t(pilot.form.roleOptions.other.key, pilot.form.roleOptions.other.fallback)}</option>
            </select>
          </label>
        </div>

        <label>
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
          <p class="success">{t(pilot.form.successKey, pilot.form.successFallback)}</p>
        {/if}
      </form>

      <p class="privacy-note">{t(pilot.form.privacyKey, pilot.form.privacyFallback)}</p>
    </GlassCard>
  </div>
</section>

<SectionDivider tone="neutral" />

<section class="section cta section--cta" use:revealOnScroll>
  <div class="container">
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
</section>

<style>
  .section {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: clamp(3rem, 8vw, 5rem) 0;
  }

  .section > .container {
    position: relative;
    z-index: 1;
  }

  .section::before,
  .section::after {
    content: '';
    position: absolute;
    inset: -18% -18% -26% -18%;
    border-radius: clamp(36px, 7vw, 64px);
    pointer-events: none;
    opacity: 0.82;
    z-index: 0;
  }

  .section::after {
    background-image: var(--grain, var(--grain-texture));
    background-size: 280px 280px;
    mix-blend-mode: soft-light;
    opacity: 0.09;
  }

  .section--modules::before {
    background:
      radial-gradient(90% 100% at 14% 18%, rgba(var(--aurora-purple-rgb), 0.32), transparent 72%),
      radial-gradient(70% 90% at 84% 20%, rgba(var(--cherry-pop-rgb), 0.24), transparent 74%),
      linear-gradient(140deg, rgba(var(--ink-rgb), 0.12), transparent 62%);
    animation: ideonautixPulse 48s ease-in-out infinite alternate;
  }

  .section--status::before {
    inset: -22% -24% -30% -24%;
    border-radius: clamp(42px, 9vw, 74px);
    background:
      conic-gradient(from 160deg, rgba(var(--aurora-purple-rgb), 0.28), rgba(var(--cherry-pop-rgb), 0.24), rgba(var(--aurora-purple-rgb), 0.26));
    mask: radial-gradient(88% 88% at 52% 22%, rgba(0, 0, 0, 0.82), transparent 82%);
    animation: ideonautixOrbit 56s linear infinite;
  }

  .section--use-cases::before {
    background:
      radial-gradient(70% 95% at 16% 32%, rgba(var(--cherry-pop-rgb), 0.2), transparent 72%),
      radial-gradient(90% 115% at 82% 10%, rgba(var(--aurora-purple-rgb), 0.26), transparent 76%),
      linear-gradient(180deg, rgba(var(--ink-rgb), 0.16), transparent 70%);
    animation: ideonautixPulse 52s ease-in-out infinite alternate-reverse;
  }

  .section--pilot::before {
    inset: -24% -18% -28% -18%;
    border-radius: clamp(44px, 9vw, 76px);
    background:
      radial-gradient(110% 130% at 18% 24%, rgba(var(--aurora-purple-rgb), 0.32), transparent 74%),
      radial-gradient(85% 115% at 80% 26%, rgba(var(--cherry-pop-rgb), 0.28), transparent 72%),
      linear-gradient(140deg, rgba(var(--ink-rgb), 0.1), transparent 64%);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--aurora-purple) 26%, transparent 74%);
  }

  .section--cta::before {
    inset: -16% -22% -30% -22%;
    border-radius: clamp(48px, 10vw, 82px);
    background:
      radial-gradient(120% 120% at 12% 22%, rgba(var(--aurora-purple-rgb), 0.3), transparent 76%),
      radial-gradient(85% 110% at 84% 18%, rgba(var(--cherry-pop-rgb), 0.24), transparent 72%),
      linear-gradient(130deg, rgba(var(--ink-rgb), 0.12), transparent 60%);
    animation: ideonautixPulse 44s ease-in-out infinite;
  }

  .section--status::after {
    opacity: 0.06;
  }

  .section--pilot::after {
    opacity: 0.1;
  }

  .section-title {
    font-family: var(--font-heading, 'Montserrat', sans-serif);
    font-size: clamp(2.1rem, 5vw, 2.9rem);
    margin-bottom: clamp(1rem, 3vw, 1.5rem);
  }

  .section-lead {
    max-width: 52ch;
    margin-bottom: clamp(2rem, 6vw, 3rem);
    color: var(--text-secondary, color-mix(in srgb, var(--text) 80%, transparent 20%));
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .hero-highlights {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    text-align: left;
  }

  .hero-eyebrow {
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.75rem;
    color: var(--text-tertiary, color-mix(in srgb, var(--text) 65%, transparent 35%));
    margin-bottom: 0.25rem;
  }

  .module-grid {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2.5rem);
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  :global(.module-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--aurora-purple-rgb), 0.18) 12%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 38%, transparent 62%);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 68%, var(--cherry-pop) 32%);
  }

  :global(.module-card) h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  :global(.module-card) p {
    color: var(--text-secondary, color-mix(in srgb, var(--text) 78%, transparent 22%));
  }

  .module-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 16px;
    background: color-mix(in srgb, rgba(var(--aurora-purple-rgb), 0.18) 70%, rgba(255, 255, 255, 0.82) 30%);
    display: grid;
    place-items: center;
    margin-bottom: 1rem;
    color: var(--ideonautix-accent, var(--aurora-purple));
  }

  .status {
    display: grid;
    gap: 2rem;
  }

  :global(.status-card) {
    display: grid;
    gap: 1.25rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--aurora-purple-rgb), 0.16) 12%);
    --surface-glass-border: color-mix(in srgb, var(--cherry-pop) 34%, transparent 66%);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 64%, var(--cherry-pop) 36%);
  }

  .status-list {
    margin: 0;
    padding-left: 1.5rem;
    display: grid;
    gap: 0.5rem;
    color: var(--text-secondary, color-mix(in srgb, var(--text) 75%, transparent 25%));
  }

  .use-cases {
    display: grid;
    gap: clamp(2rem, 6vw, 3.5rem);
    align-items: start;
  }

  .use-cases-grid {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2.4rem);
  }

  :global(.use-case-card) {
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 90%, rgba(var(--aurora-purple-rgb), 0.15) 10%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 34%, transparent 66%);
    --focus-ring-color: color-mix(in srgb, var(--cherry-pop) 58%, var(--aurora-purple) 42%);
  }

  :global(.pilot-card) {
    display: grid;
    gap: 1.5rem;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 86%, rgba(var(--aurora-purple-rgb), 0.2) 14%);
    --surface-glass-border: color-mix(in srgb, var(--cherry-pop) 40%, transparent 60%);
    --surface-glass-shadow: 0 28px 70px rgba(24, 18, 38, 0.28);
    --focus-ring-color: color-mix(in srgb, var(--cherry-pop) 62%, var(--aurora-purple) 38%);
  }

  .pilot-form {
    display: grid;
    gap: 1.5rem;
    max-width: 620px;
  }

  .form-grid {
    display: grid;
    gap: 1rem;
  }

  .form-grid label,
  .pilot-form label {
    display: grid;
    gap: 0.5rem;
    font-weight: 600;
  }

  input,
  select,
  textarea {
    border-radius: 12px;
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent 20%);
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: color-mix(in srgb, var(--bg-elev-1) 96%, rgba(var(--aurora-purple-rgb), 0.08) 4%);
    color: var(--text);
  }

  textarea {
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: 3px solid color-mix(in srgb, var(--ideonautix-accent, var(--aurora-purple)) 70%, var(--cherry-pop) 30%);
    outline-offset: 3px;
  }

  .field-error {
    color: var(--cherry-pop, #e0322c);
  }

  .success {
    color: var(--ideonautix-accent, var(--aurora-purple));
    font-weight: 600;
  }

  .privacy-note {
    font-size: 0.95rem;
    color: var(--text-tertiary, color-mix(in srgb, var(--text) 60%, transparent 40%));
  }

  :global(.cta-card) {
    display: grid;
    gap: 1.2rem;
    text-align: center;
    --surface-glass-bg: color-mix(in srgb, var(--bg-elev-1) 88%, rgba(var(--aurora-purple-rgb), 0.22) 12%);
    --surface-glass-border: color-mix(in srgb, var(--aurora-purple) 42%, transparent 58%);
    --focus-ring-color: color-mix(in srgb, var(--aurora-purple) 62%, var(--cherry-pop) 38%);
  }

  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  @keyframes ideonautixPulse {
    0% {
      transform: translate3d(-2%, -1%, 0) scale(1.02) rotate(-1deg);
    }

    55% {
      transform: translate3d(1.8%, 1.2%, 0) scale(1.05) rotate(1.1deg);
    }

    100% {
      transform: translate3d(-1%, 2%, 0) scale(1.01) rotate(-0.6deg);
    }
  }

  @keyframes ideonautixOrbit {
    0% {
      transform: rotate(0deg) scale(1.08);
    }

    100% {
      transform: rotate(-360deg) scale(1.08);
    }
  }

  @media (min-width: 720px) {
    .form-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
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
    .section::before {
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
