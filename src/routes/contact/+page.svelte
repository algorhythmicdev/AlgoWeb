<script lang="ts">
    import Hero from "$lib/components/Hero.svelte";
    import GlassCard from "$lib/components/GlassCard.svelte";
    import SectionDivider from "$lib/components/SectionDivider.svelte";
    import Section from "$lib/components/Section.svelte";
    import Button from "$lib/components/Button.svelte";
    import Icon from "$lib/components/icons/Icon.svelte";
    import { revealOnScroll, staggerReveal } from "$lib/animations";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { translateOrFallback } from "$lib/utils/i18n";

    const FALLBACKS = {
        "contact.page.cards.eyebrow": "Connection options",
        "contact.page.cards.heading": "Ways to connect",
        "contact.page.cards.supporting_copy": "Pick the channel that fits your pace and we will reply quickly.",
        "contact.page.form.eyebrow": "Send a message",
        "contact.page.form.title": "We reply within one business day.",
        "contact.page.form.description": "Please share your name, email, and what you would like to explore.",
        "contact.page.form.fields.name.label": "Name",
        "contact.page.form.fields.email.label": "Email",
        "contact.page.form.fields.reason.label": "Reason for contacting",
        "contact.page.form.fields.reason.options.general": "General question",
        "contact.page.form.fields.reason.options.consulting": "Consulting or pilot",
        "contact.page.form.fields.reason.options.education": "Education & community",
        "contact.page.form.fields.reason.options.media": "Media or partnership",
        "contact.page.form.fields.message.label": "Message",
        "contact.page.form.submit": "Send message",
        "contact.page.form.note": "We respond within one business day.",
        "contact.page.form.success": "Thank you! Your email client is opening with a pre-filled message.",
        "contact.page.form.error": "Please fix the highlighted fields.",
        "contact.page.form.errors.name_required": "Please add your name.",
        "contact.page.form.errors.email_required": "We use this to reply.",
        "contact.page.form.errors.email_invalid": "Add a valid email address.",
        "contact.page.form.errors.reason_required": "Select a reason.",
        "contact.page.form.errors.message_required": "Tell us how we can help.",
        "contact.page.form.mailto_subject": "Website enquiry from {name} ({reason}).",
        "contact.page.form.mailto_body": "Name: {name}\nEmail: {email}\nReason: {reason}\n\n{message}.",
        "contact.page.support.section_eyebrow": "Support promise",
        "contact.page.support.section_title": "Responsive, human support every step of the way.",
        "contact.page.support.section_copy": "We pair every pilot, consulting sprint, and classroom programme with clear expectations so you always know when to expect a reply.",
        "contact.page.social.eyebrow": "Stay connected",
        "contact.page.social.title": "Follow along with the studio",
        "contact.page.social.copy": "Pick the network where you want to keep in touch.",
        "contact.page.newsletter.eyebrow": "Team updates",
        "contact.page.newsletter.title": "Subscribe for launch updates.",
        "contact.page.newsletter.copy": "Get a quarterly roundup on NodeVoyage, Ideonautix, and our consulting stories.",
        "contact.page.newsletter.cta": "Email newsletter@algorhythmics.dev.",
        "contact.page.newsletter.secondary": "Read about our solutions.",
        "contact.page.newsletter.note": "Prefer a form? Mention \"Newsletter\" in the message above and we will add you manually.",
    } as const;

    const resolveFallback = (key: string, fallback?: string) =>
        typeof fallback === "string" ? fallback : FALLBACKS[key as keyof typeof FALLBACKS] ?? "";

    const t = (key: string, fallback?: string) =>
        translateOrFallback($_, key, resolveFallback(key, fallback));

    const hero = {
        titleKey: "contact.page.hero.title",
        titleFallback: "Let’s build calm AI together",
        subtitleKey: "contact.page.hero.subtitle",
        subtitleFallback:
            "AlgoRhythmics operates remotely from Latvia, serving partners worldwide. Reach out for product pilots, consulting, or community collaborations.",
        actions: [
            {
                href: "mailto:help@algorhythmics.dev",
                variant: "gradient" as const,
                labelKey: "contact.page.hero.cta_email",
                labelFallback: "Email help@algorhythmics.dev",
            },
            {
                href: "/consulting",
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
                href: "mailto:help@algorhythmics.dev",
                labelKey: "contact.page.cards.general.cta",
                labelFallback: "Email help@algorhythmics.dev",
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
                href: "/consulting",
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
                "Schools, libraries, and community organisations can reach our outreach coordinators at education@algorhythmics.dev.",
            action: {
                href: "mailto:education@algorhythmics.dev",
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
                "For collaborations, press enquiries, or speaking invitations, contact hello@algorhythmics.dev and we will coordinate a session.",
            action: {
                href: "mailto:hello@algorhythmics.dev",
                labelKey: "contact.page.cards.visit.cta",
                labelFallback: "Email hello@algorhythmics.dev",
            },
        },
    ] as const;

    const helpCenter = {
        eyebrowKey: "contact.page.help.eyebrow",
        eyebrowFallback: "Guides & self-serve",
        titleKey: "contact.page.help.title",
        titleFallback: "Help Center now live with calm AI guides",
        copyKey: "contact.page.help.copy",
        copyFallback:
            "Dive into onboarding packs, troubleshooting checklists, and multilingual resources inside our Help Center knowledge base.",
        cta: {
            href: "/",
            labelKey: "contact.page.help.cta",
            labelFallback: "Visit the Help Center",
        },
        noteKey: "contact.page.help.note",
        noteFallback:
            "Need something now? Email help@algorhythmics.dev for personalised guidance or escalation.",
    } as const;

    const supportShowcase = {
        image: "/images/placeholders/help-center-desk.png",
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
        window.location.href = `mailto:help@algorhythmics.dev?subject=${subject}&body=${body}`;
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
        {#each hero.actions as action (action.href)}
            <Button href={action.href} variant={action.variant} size="lg"
                >{t(action.labelKey, action.labelFallback)}</Button
            >
        {/each}
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

<Section id="options" class="contact-options">
    <div class="contact-options__content" use:revealOnScroll>
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

    <div class="contact-options__grid auto-grid" use:staggerReveal>
        {#each contactCards as card (card.titleKey)}
            <GlassCard class="contact-card" padding="lg" halo>
                <div class="card-icon">
                    <Icon name={card.icon} size="var(--icon-glyph-lg)" />
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
</Section>

<SectionDivider tone="neutral" />

<Section id="form" class="contact-form">
    <div class="contact-form__content" use:revealOnScroll>
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
</Section>

<SectionDivider tone="citrus" />

<Section id="support" class="contact-support">
    <div class="contact-support__container" use:revealOnScroll>
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

        <div class="support-grid auto-grid" use:staggerReveal>
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
                            <Icon name={link.icon} size="var(--icon-glyph-sm)" />
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
</Section>

<SectionDivider tone="aurora" />

<Section id="newsletter" class="contact-newsletter">
    <div class="contact-newsletter__content" use:revealOnScroll>
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
                href="mailto:newsletter@algorhythmics.dev"
                variant="gradient"
                >{t("contact.page.newsletter.cta",
                )}</Button
            >
            <Button href="/consulting" variant="secondary"
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
</Section>

<style>
    .support-grid {
        --auto-grid-gap: var(--grid-gap-lg);
        --auto-grid-min: min(100%, var(--card-max-width));
        --auto-grid-max: min(100%, var(--card-max-width-wide));
    }

    :global(.support-card) {
        display: grid;
        gap: var(--cluster-gap-md);
        align-content: start;
        height: 100%;
        width: min(100%, var(--card-max-width));
        margin-inline: auto;
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
        gap: calc(var(--space-xs) * 0.6);
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
        gap: var(--space-md);
    }

    .social-links :global(.btn__content) {
        align-items: center;
        gap: var(--space-md);
    }

    .contact-support__container {
        display: grid;
        gap: var(--grid-gap-xl);
        justify-items: stretch;
    }

    .contact-support__container > .section-heading {
        max-inline-size: var(--measure-lg);
        justify-self: center;
        text-align: center;
    }

    .contact-options__grid {
        --auto-grid-gap: var(--grid-gap-lg);
        --auto-grid-min: min(100%, var(--card-min-width));
        --auto-grid-max: min(100%, var(--card-max-width));
    }

    :global(.contact-card) {
        display: grid;
        gap: var(--cluster-gap-md);
        width: min(100%, var(--card-max-width));
        margin-inline: auto;
    }

    .card-icon {
        inline-size: var(--size-icon-md);
        block-size: var(--size-icon-md);
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
        letter-spacing: var(--tracking-eyebrow);
        text-transform: uppercase;
        color: var(--text-tertiary);
    }

    :global(.form-card) {
        display: grid;
        gap: var(--cluster-gap-md);
        margin: 0 auto;
        --form-max-width: min(100%, var(--content-width-standard));
        --form-field-min-width: min(100%, calc(var(--card-min-width) + var(--space-sm)));
        --form-field-max-width: min(100%, var(--card-max-width));
    }

    .form {
        --form-gap: var(--grid-gap-md);
        --form-field-radius: var(--radius-lg);
        --form-field-padding-y: var(--space-md);
        --form-field-padding-x: var(--space-lg);
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
        --form-field-shadow: var(--shadow-md);
        --form-textarea-min-height: calc(var(--space-5xl) + var(--space-lg));
        --form-note-color: color-mix(in srgb, var(--text) 60%, transparent 40%);
        --form-actions-gap: var(--space-sm);
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

    .contact-newsletter__content :global(.newsletter-card) {
        display: grid;
        gap: var(--cluster-gap-md);
        max-inline-size: var(--content-width-standard);
        margin: 0 auto;
        text-align: center;
    }

    .newsletter-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-md);
        justify-content: center;
    }

    .newsletter-note {
        font-size: var(--text-small);
        color: var(--text-tertiary);
    }

</style>
