<script lang="ts">
    import Hero from "$lib/components/Hero.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import SectionDivider from "$lib/components/SectionDivider.svelte";
    import Button from "$lib/components/Button.svelte";
    import Icon from "$lib/components/icons/Icon.svelte";
    import { revealOnScroll, staggerReveal } from "$lib/animations";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { translateOrFallback } from "$lib/utils/i18n";

    const t = (key: string, fallback: string) =>
        translateOrFallback($_, key, fallback);

    const hero = {
        titleKey: "contact.page.hero.title",
        titleFallback: "Let’s build calm AI together",
        subtitleKey: "contact.page.hero.subtitle",
        subtitleFallback:
            "AlgoRhythmics operates remotely from Latvia, serving partners worldwide. Reach out for product pilots, consulting, or community collaborations.",
        actions: [
            {
                href: "mailto:help@algorhythmics.com",
                variant: "gradient" as const,
                labelKey: "contact.page.hero.cta_email",
                labelFallback: "Email help@algorhythmics.com",
            },
            {
                href: "/solutions",
                variant: "secondary" as const,
                labelKey: "contact.page.hero.cta_events",
                labelFallback: "Explore our solutions",
            },
        ],
    } as const;

    const heroMedia = {
        image: "/images/placeholders/contact-lobby.png",
        altKey: "contact.page.hero.media.alt",
        altFallback:
            "Lounge area with glass walls, calm lighting, and collaborative screens",
        captionKey: "contact.page.hero.media.caption",
        captionFallback:
            "Our distributed studio keeps a calm “ops lounge” ready for founders, educators, and partners to drop in virtually.",
    } as const;

    const contactCards = [
        {
            icon: "email",
            titleKey: "contact.page.cards.general.title",
            titleFallback: "General enquiries",
            copyKey: "contact.page.cards.general.copy",
            copyFallback:
                "Questions about AlgoRhythmics or our roadmap? Drop us a line and we will reply within one business day.",
            action: {
                href: "mailto:help@algorhythmics.com",
                labelKey: "contact.page.cards.general.cta",
                labelFallback: "Email help@algorhythmics.com",
            },
        },
        {
            icon: "target",
            titleKey: "contact.page.cards.support.title",
            titleFallback: "Product pilots & consulting",
            copyKey: "contact.page.cards.support.copy",
            copyFallback:
                "Partner with us on NodeVoyage, Ideonautix, or bespoke consulting engagements. We co-design pilots and long-term rollouts.",
            action: {
                href: "/solutions",
                labelKey: "contact.page.cards.support.cta",
                labelFallback: "View solutions overview",
            },
        },
        {
            icon: "education",
            titleKey: "contact.page.cards.education.title",
            titleFallback: "Education & community",
            copyKey: "contact.page.cards.education.copy",
            copyFallback:
                "Schools, libraries, and community organisations can reach our outreach coordinators at education@algorhythmics.com.",
            action: {
                href: "mailto:education@algorhythmics.com",
                labelKey: "contact.page.cards.education.cta",
                labelFallback: "Email the outreach team",
            },
        },
        {
            icon: "idea",
            titleKey: "contact.page.cards.visit.title",
            titleFallback: "Partnerships & media",
            copyKey: "contact.page.cards.visit.copy",
            copyFallback:
                "For collaborations, press enquiries, or speaking invitations, contact hello@algorhythmics.com and we will coordinate a session.",
            action: {
                href: "mailto:hello@algorhythmics.com",
                labelKey: "contact.page.cards.visit.cta",
                labelFallback: "Email hello@algorhythmics.com",
            },
        },
    ] as const;

    const supportCommitment = {
        eyebrowKey: "contact.page.support.eyebrow",
        eyebrowFallback: "Support promise",
        titleKey: "contact.page.support.title",
        titleFallback: "Responsive, human support every step of the way",
        copyKey: "contact.page.support.copy",
        copyFallback:
            "We pair every pilot, consulting sprint, and classroom programme with clear expectations so you always know when to expect a reply.",
        bullets: [
            {
                key: "contact.page.support.bullets.0",
                fallback:
                    "Most enquiries receive a personal response within one business day.",
            },
            {
                key: "contact.page.support.bullets.1",
                fallback:
                    "Pilot partners and consulting clients get a dedicated escalation channel with 24-hour turnaround on critical issues.",
            },
            {
                key: "contact.page.support.bullets.2",
                fallback:
                    "We document every conversation transparently so teams can pick up where they left off.",
            },
        ],
    } as const;

    const helpCenter = {
        eyebrowKey: "contact.page.help.eyebrow",
        eyebrowFallback: "Guides & self-serve",
        titleKey: "contact.page.help.title",
        titleFallback: "Help Center now live with calm AI guides",
        copyKey: "contact.page.help.copy",
        copyFallback:
            "Dive into onboarding packs, troubleshooting checklists, and multilingual resources inside our Help Center knowledge base.",
        cta: {
            href: "/help-center",
            labelKey: "contact.page.help.cta",
            labelFallback: "Visit the Help Center",
        },
        noteKey: "contact.page.help.note",
        noteFallback:
            "Need something now? Email help@algorhythmics.com for personalised guidance or escalation.",
    } as const;

    const supportShowcase = {
        image: "/images/placeholders/solutions-suite.svg",
        altKey: "contact.page.support.visual.alt",
        altFallback:
            "Support specialists reviewing calm AI dashboards together",
        captionKey: "contact.page.support.visual.caption",
        captionFallback:
            "Dedicated calm AI specialists keep an eye on every pilot. Expect transparent status dashboards and documented replies.",
    } as const;

    const socialLinks = [
        {
            icon: "linkedin",
            labelKey: "contact.page.social.linkedin",
            labelFallback: "Follow on LinkedIn",
            href: "https://www.linkedin.com/company/algorhythmics",
            descriptionKey: "contact.page.social.linkedin_description",
            descriptionFallback: "Studio updates & hiring notes",
        },
        {
            icon: "twitter",
            labelKey: "contact.page.social.twitter",
            labelFallback: "Join the conversation on X/Twitter",
            href: "https://twitter.com/AlgoRhythmics",
            descriptionKey: "contact.page.social.twitter_description",
            descriptionFallback: "Event recaps & pilot progress",
        },
        {
            icon: "github",
            labelKey: "contact.page.social.github",
            labelFallback: "Explore our open tooling on GitHub",
            href: "https://github.com/AlgoRhythmics",
            descriptionKey: "contact.page.social.github_description",
            descriptionFallback: "Starter kits & calm AI experiments",
        },
    ] as const;

    let formData = {
        name: "",
        email: "",
        reason: "general",
        message: "",
    };

    let errors: Record<string, string> = {};
    let status: "idle" | "success" | "error" = "idle";

    const resetStatus = () => {
        if (status !== "idle") status = "idle";
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!formData.name.trim())
            next.name = t("contact.page.form.errors.name_required",
            );
        if (!formData.email.trim())
            next.email = t("contact.page.form.errors.email_required",
            );
        else if (!/^\S+@\S+\.\S+$/.test(formData.email))
            next.email = t("contact.page.form.errors.email_invalid",
            );
        if (!formData.reason.trim())
            next.reason = t("contact.page.form.errors.reason_required",
            );
        if (!formData.message.trim())
            next.message = t("contact.page.form.errors.message_required",
            );
        errors = next;
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        if (!validate()) {
            status = "error";
            return;
        }

        const subject = encodeURIComponent(
            t("contact.page.form.mailto_subject",
            )
                .replace("{name}", formData.name)
                .replace("{reason}", formData.reason),
        );
        const bodyTemplate = t("contact.page.form.mailto_body",
        );
        const body = encodeURIComponent(
            bodyTemplate
                .replace("{name}", formData.name)
                .replace("{email}", formData.email)
                .replace("{reason}", formData.reason)
                .replace("{message}", formData.message),
        );
        window.location.href = `mailto:help@algorhythmics.com?subject=${subject}&body=${body}`;
        status = "success";
        formData = { name: "", email: "", reason: "general", message: "" };
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
    <svelte:fragment slot="actions">
        <div class="hero-actions">
            {#each hero.actions as action (action.href)}
                <Button href={action.href} variant={action.variant} size="lg"
                    >{t(action.labelKey, action.labelFallback)}</Button
                >
            {/each}
        </div>
    </svelte:fragment>
    <svelte:fragment slot="aside">
        <GlassCard class="hero-media" padding="lg" particles>
            <figure class="media-card">
                <img
                    class="media-card__image"
                    src={heroMedia.image}
                    alt={t(heroMedia.altKey, heroMedia.altFallback)}
                    loading="lazy"
                    width="640"
                    height="400"
                />
                <figcaption class="media-card__caption">
                    {t(heroMedia.captionKey, heroMedia.captionFallback)}
                </figcaption>
            </figure>
        </GlassCard>
    </svelte:fragment>
</Hero>

<section id="options" class="section contact-options" use:revealOnScroll>
    <div class="container">
        <header class="section-heading" data-align="center">
            <span class="section-eyebrow"
                >{t("contact.page.cards.eyebrow")}</span
            >
            <h2>{t("contact.page.cards.heading")}</h2>
            <p>
                {t("contact.page.cards.supporting_copy",
                )}
            </p>
        </header>

        <div class="contact-options__grid" use:staggerReveal>
            {#each contactCards as card (card.titleKey)}
                <GlassCard class="contact-card" padding="lg" halo>
                    <div class="card-icon">
                        <Icon name={card.icon} size={28} />
                    </div>
                    <h3>{t(card.titleKey, card.titleFallback)}</h3>
                    <p>{t(card.copyKey, card.copyFallback)}</p>
                    <Button
                        href={card.action.href}
                        variant="secondary"
                        size="md"
                        >{t(
                            card.action.labelKey,
                            card.action.labelFallback,
                        )}</Button
                    >
                </GlassCard>
            {/each}
        </div>
    </div>
</section>

<SectionDivider tone="neutral" />

<section id="form" class="section contact-form" use:revealOnScroll>
    <div class="container">
        <GlassCard class="form-card" padding="lg" halo>
            <span class="section-eyebrow"
                >{t("contact.page.form.eyebrow")}</span
            >
            <h2>
                {t("contact.page.form.title",
                )}
            </h2>
            <p>
                {t("contact.page.form.description",
                )}
            </p>

            <form class="form" on:submit={handleSubmit}>
                <label class="form-field">
                    <span
                        >{t("contact.page.form.fields.name.label",
                        )}</span
                    >
                    <input
                        type="text"
                        bind:value={formData.name}
                        on:input={resetStatus}
                        aria-invalid={errors.name ? "true" : "false"}
                    />
                    {#if errors.name}
                        <span class="field-error">{errors.name}</span>
                    {/if}
                </label>

                <label class="form-field">
                    <span
                        >{t("contact.page.form.fields.email.label",
                        )}</span
                    >
                    <input
                        type="email"
                        bind:value={formData.email}
                        on:input={resetStatus}
                        aria-invalid={errors.email ? "true" : "false"}
                    />
                    {#if errors.email}
                        <span class="field-error">{errors.email}</span>
                    {/if}
                </label>

                <label class="form-field">
                    <span
                        >{t("contact.page.form.fields.reason.label",
                        )}</span
                    >
                    <select
                        bind:value={formData.reason}
                        on:change={resetStatus}
                        aria-invalid={errors.reason ? "true" : "false"}
                    >
                        <option value="general"
                            >{t("contact.page.form.fields.reason.options.general",
                            )}</option
                        >
                        <option value="consulting"
                            >{t("contact.page.form.fields.reason.options.consulting",
                            )}</option
                        >
                        <option value="education"
                            >{t("contact.page.form.fields.reason.options.education",
                            )}</option
                        >
                        <option value="media"
                            >{t("contact.page.form.fields.reason.options.media",
                            )}</option
                        >
                    </select>
                    {#if errors.reason}
                        <span class="field-error">{errors.reason}</span>
                    {/if}
                </label>

                <label class="form-field">
                    <span
                        >{t("contact.page.form.fields.message.label",
                        )}</span
                    >
                    <textarea
                        rows="6"
                        bind:value={formData.message}
                        on:input={resetStatus}
                        aria-invalid={errors.message ? "true" : "false"}
                    ></textarea>
                    {#if errors.message}
                        <span class="field-error">{errors.message}</span>
                    {/if}
                </label>

                <div class="form-actions">
                    <Button type="submit" variant="gradient" size="lg"
                        >{t("contact.page.form.submit")}</Button
                    >
                    <span class="form-note"
                        >{t("contact.page.form.note",
                        )}</span
                    >
                </div>

                {#if status === "success"}
                    <p class="form-status" role="status">
                        {t("contact.page.form.success",
                        )}
                    </p>
                {:else if status === "error" && Object.keys(errors).length}
                    <p class="form-status" role="alert">
                        {t("contact.page.form.error",
                        )}
                    </p>
                {/if}
            </form>
        </GlassCard>
    </div>
</section>

<SectionDivider tone="citrus" />

<section id="support" class="section contact-support" use:revealOnScroll>
    <div class="container contact-support__container">
        <header class="section-heading">
            <span class="section-eyebrow"
                >{t("contact.page.support.section_eyebrow",
                )}</span
            >
            <h2>
                {t("contact.page.support.section_title",
                )}
            </h2>
            <p>
                {t("contact.page.support.section_copy",
                )}
            </p>
        </header>

        <div class="support-grid" use:staggerReveal>
            <GlassCard class="support-card" padding="lg" halo>
                <span class="section-eyebrow"
                    >{t(
                        supportCommitment.eyebrowKey,
                        supportCommitment.eyebrowFallback,
                    )}</span
                >
                <h2>
                    {t(
                        supportCommitment.titleKey,
                        supportCommitment.titleFallback,
                    )}
                </h2>
                <p>
                    {t(
                        supportCommitment.copyKey,
                        supportCommitment.copyFallback,
                    )}
                </p>
                <ul class="support-list">
                    {#each supportCommitment.bullets as bullet (bullet.key)}
                        <li>{t(bullet.key, bullet.fallback)}</li>
                    {/each}
                </ul>
            </GlassCard>

            <GlassCard class="support-card" padding="lg" particles>
                <figure class="media-card">
                    <img
                        class="media-card__image"
                        src={supportShowcase.image}
                        alt={t(
                            supportShowcase.altKey,
                            supportShowcase.altFallback,
                        )}
                        loading="lazy"
                        width="620"
                        height="388"
                    />
                    <figcaption class="media-card__caption">
                        {t(
                            supportShowcase.captionKey,
                            supportShowcase.captionFallback,
                        )}
                    </figcaption>
                </figure>
            </GlassCard>

            <GlassCard class="support-card" padding="lg">
                <span class="section-eyebrow"
                    >{t(
                        helpCenter.eyebrowKey,
                        helpCenter.eyebrowFallback,
                    )}</span
                >
                <h2>{t(helpCenter.titleKey, helpCenter.titleFallback)}</h2>
                <p>{t(helpCenter.copyKey, helpCenter.copyFallback)}</p>
                <Button href={helpCenter.cta.href} variant="secondary"
                    >{t(
                        helpCenter.cta.labelKey,
                        helpCenter.cta.labelFallback,
                    )}</Button
                >
                <p class="support-note">
                    {t(helpCenter.noteKey, helpCenter.noteFallback)}
                </p>
            </GlassCard>

            <GlassCard class="support-card" padding="lg" halo>
                <span class="section-eyebrow"
                    >{t("contact.page.social.eyebrow")}</span
                >
                <h2>
                    {t("contact.page.social.title",
                    )}
                </h2>
                <p>
                    {t("contact.page.social.copy",
                    )}
                </p>
                <div class="social-links">
                    {#each socialLinks as link (link.href)}
                        <Button
                            href={link.href}
                            variant="subtle"
                            target="_blank"
                            rel="noreferrer noopener"
                            ariaLabel={t(link.labelKey, link.labelFallback)}
                        >
                            <Icon name={link.icon} size={22} />
                            <span class="social-text">
                                <span class="social-label"
                                    >{t(
                                        link.labelKey,
                                        link.labelFallback,
                                    )}</span
                                >
                                <span class="social-description"
                                    >{t(
                                        link.descriptionKey,
                                        link.descriptionFallback,
                                    )}</span
                                >
                            </span>
                        </Button>
                    {/each}
                </div>
            </GlassCard>
        </div>
    </div>
</section>

<SectionDivider tone="aurora" />

<section id="newsletter" class="section contact-newsletter" use:revealOnScroll>
    <div class="container">
        <GlassCard class="newsletter-card" padding="lg">
            <span class="section-eyebrow"
                >{t("contact.page.newsletter.eyebrow")}</span
            >
            <h2>
                {t("contact.page.newsletter.title",
                )}
            </h2>
            <p>
                {t("contact.page.newsletter.copy",
                )}
            </p>
            <div class="newsletter-actions">
                <Button
                    href="mailto:newsletter@algorhythmics.com"
                    variant="gradient"
                    >{t("contact.page.newsletter.cta",
                    )}</Button
                >
                <Button href="/solutions" variant="secondary"
                    >{t("contact.page.newsletter.secondary",
                    )}</Button
                >
            </div>
            <p class="newsletter-note">
                {t("contact.page.newsletter.note",
                )}
            </p>
        </GlassCard>
    </div>
</section>

<style>
    .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-md, 1rem);
        align-items: center;
    }

    .support-grid {
        display: grid;
        gap: clamp(1.6rem, 3vw, 2.4rem);
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }

    :global(.support-card) {
        display: grid;
        gap: clamp(0.8rem, 2.2vw, 1.4rem);
        align-content: start;
        height: 100%;
    }

    .support-list {
        margin: 0;
        padding: 0 0 0 var(--space-md);
        display: grid;
        gap: var(--space-xs);
        list-style: disc;
        list-style-position: outside;
        color: var(--text-secondary);
        font-size: var(--text-small);
    }

    .support-note {
        margin-top: var(--space-sm);
        font-size: var(--text-small);
        color: var(--text-tertiary);
    }

    .social-links {
        display: grid;
        gap: var(--space-sm);
    }

    .social-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.15rem;
    }

    .social-label {
        font-weight: var(--weight-semibold);
    }

    .social-description {
        font-size: var(--text-small);
        color: var(--text-tertiary);
    }

    .social-links :global(.btn) {
        justify-content: flex-start;
        align-items: center;
        gap: 0.75rem;
    }

    .social-links :global(.btn__content) {
        align-items: center;
        gap: 0.75rem;
    }

    .contact-support__container {
        gap: clamp(2.5rem, 6vw, 3.5rem);
    }

    .contact-options__grid {
        display: grid;
        gap: clamp(1.6rem, 3vw, 2.4rem);
    }

    :global(.contact-card) {
        display: grid;
        gap: clamp(1rem, 3vw, 1.6rem);
    }

    .card-icon {
        width: 3rem;
        height: 3rem;
        border-radius: var(--radius-full);
        display: inline-grid;
        place-items: center;
        background: color-mix(
            in srgb,
            var(--glass-bg-lightest) 58%,
            transparent 42%
        );
        color: var(--voyage-blue);
    }

    .section-eyebrow {
        font-size: var(--text-small);
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-tertiary);
    }

    :global(.form-card) {
        display: grid;
        gap: clamp(1rem, 3vw, 1.6rem);
        max-width: 680px;
        margin: 0 auto;
    }

    .form {
        --form-gap: clamp(1rem, 3vw, 1.4rem);
        --form-field-radius: var(--radius-lg);
        --form-field-padding-y: 0.85rem;
        --form-field-padding-x: 1rem;
        --form-label-color: color-mix(
            in srgb,
            var(--text) 88%,
            transparent 12%
        );
        --form-field-bg: color-mix(
            in srgb,
            var(--glass-bg-lightest) 68%,
            transparent 32%
        );
        --form-field-border: color-mix(
            in srgb,
            var(
                    --surface-field-border,
                    color-mix(in srgb, var(--border) 78%, transparent 22%)
                )
                84%,
            transparent 16%
        );
        --form-field-border-focus: color-mix(
            in srgb,
            var(--voyage-blue) 52%,
            rgba(var(--aurora-purple-rgb), 0.42) 48%
        );
        --form-focus-ring-color: color-mix(
            in srgb,
            var(--voyage-blue) 78%,
            var(--aurora-purple) 22%
        );
        --form-field-shadow: 0 12px 24px rgba(var(--ink-rgb), 0.08),
            inset 0 1px 0 rgba(var(--snow-rgb), 0.4);
        --form-textarea-min-height: 180px;
        --form-note-color: color-mix(in srgb, var(--text) 60%, transparent 40%);
        --form-actions-gap: 0.5rem;
        --form-status-success-color: color-mix(
            in srgb,
            var(--voyage-blue) 68%,
            var(--text) 32%
        );
    }

    .form-note {
        text-wrap: balance;
    }

    .form-status {
        text-wrap: balance;
    }

    .contact-newsletter :global(.newsletter-card) {
        display: grid;
        gap: clamp(1rem, 3vw, 1.6rem);
        max-width: 720px;
        margin: 0 auto;
        text-align: center;
    }

    .newsletter-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-md, 1rem);
        justify-content: center;
    }

    .newsletter-note {
        font-size: var(--text-small);
        color: var(--text-tertiary);
    }

    @media (min-width: 960px) {
        .contact-options__grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .form-actions {
            align-items: center;
        }
    }
</style>
