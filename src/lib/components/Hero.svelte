<script lang="ts">
    type HeroVariant = "aurora" | "grid" | "halo" | "line" | "particles";
    type HeroAlign = "start" | "center";

    const VALID_VARIANTS = new Set<HeroVariant>([
        "aurora",
        "grid",
        "halo",
        "line",
        "particles",
    ]);

    export let variant: HeroVariant | string = "aurora";
    export let title = "";
    export let subtitle = "";
    export let align: HeroAlign = "start";

    type $$Props = {
        class?: string;
        variant?: HeroVariant | string;
        title?: string;
        subtitle?: string;
        align?: HeroAlign;
    };

    const instanceId = Math.random().toString(36).slice(2, 8);
    $: resolvedVariant = VALID_VARIANTS.has(variant as HeroVariant)
        ? (variant as HeroVariant)
        : "aurora";
    $: titleId = title.trim().length ? `hero-${instanceId}-title` : undefined;
    $: leadId = subtitle.trim().length ? `hero-${instanceId}-lead` : undefined;
    $: descriptionId = $$slots.description
        ? `hero-${instanceId}-description`
        : undefined;
    $: highlightsId = $$slots.highlights
        ? `hero-${instanceId}-highlights`
        : undefined;
    $: ariaLabelledBy = titleId ?? undefined;
    $: ariaDescribedBy =
        [leadId, descriptionId, highlightsId].filter(Boolean).join(" ") ||
        undefined;
    $: alignmentClass =
        align === "center" ? "hero--align-center" : "hero--align-start";
    $: hasAside = Boolean($$slots.aside);
    $: extraClass =
        typeof $$props.class === "string" ? $$props.class.trim() : "";
    $: rootClass = [
        "hero",
        alignmentClass,
        hasAside ? "hero--with-aside" : "hero--solo",
        extraClass,
    ]
        .filter(Boolean)
        .join(" ");
</script>

<section
    class={rootClass}
    data-variant={resolvedVariant}
    aria-labelledby={ariaLabelledBy}
    aria-describedby={ariaDescribedBy}
>
    <div class="hero__background" aria-hidden="true">
        <div
            class="hero__background-layer hero__background-layer--overlay"
        ></div>
    </div>

    <div class="hero__layout">
        <div class="hero__main">
            <div class="hero__content">
                {#if $$slots.status}
                    <div class="hero__status">
                        <slot name="status" />
                    </div>
                {/if}

                {#if titleId}
                    <h1 id={titleId} class="hero__title">{title}</h1>
                {/if}

                {#if leadId}
                    <p id={leadId} class="hero__lead">{subtitle}</p>
                {/if}

                {#if $$slots.description}
                    <div id={descriptionId} class="hero__description">
                        <slot name="description" />
                    </div>
                {/if}

                {#if $$slots.actions}
                    <div class="hero__actions">
                        <slot name="actions" />
                    </div>
                {/if}
            </div>

            {#if $$slots.highlights}
                <div id={highlightsId} class="hero__highlights">
                    <slot name="highlights" />
                </div>
            {/if}
        </div>

        {#if hasAside}
            <div class="hero__aside">
                <slot name="aside" />
            </div>
        {/if}
    </div>
</section>

<style>
    .hero {
        --hero-surface: color-mix(
            in srgb,
            var(--bg-elev-1) 58%,
            transparent 42%
        );
        --hero-surface-elev: var(--bg-elev-1);
        --hero-text: var(--text);
        --hero-grad-start: var(--aurora-purple);
        --hero-grad-stop: var(--voyage-blue);
        --hero-overlay: color-mix(in srgb, var(--bg) 62%, transparent 38%);
        --hero-padding-block: clamp(
            var(--hero-padding-block-mobile),
            var(--hero-padding-block-fluid),
            var(--hero-padding-block-desktop)
        );
        --hero-padding-inline: clamp(
            var(--hero-padding-inline-min),
            var(--hero-padding-inline-fluid),
            var(--hero-padding-inline-max)
        );
        --hero-content-padding: clamp(
            var(--hero-content-padding-min),
            var(--hero-content-padding-fluid),
            var(--hero-content-padding-max)
        );
        --hero-gap: clamp(
            var(--hero-gap-min),
            var(--hero-gap-fluid),
            var(--hero-gap-max)
        );
        --hero-actions-gap: clamp(
            var(--space-md),
            calc(var(--hero-gap) * 0.6),
            var(--space-2xl)
        );
        --hero-max-width: var(--hero-max-width-default);
        --hero-layout-width: var(--hero-layout-width-default);
        --hero-content-max-width: var(--hero-content-max-width-default);
        position: relative;
        isolation: isolate;
        overflow: visible;
        padding-block: var(--hero-padding-block);
        padding-inline: var(--hero-padding-inline);
        width: min(100%, var(--hero-max-width));
        max-inline-size: var(--hero-max-width);
        margin-inline: auto;
        color: var(--text);
        background: var(--hero-surface);
        border-radius: max(0px, var(--glass-card-radius));
        border: none;
        box-shadow: none;
    }

    .hero__background {
        position: absolute;
        inset: 0;
        z-index: var(--z-behind);
        pointer-events: none;
    }

    .hero__background-layer {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        transform: translate3d(0, 0, 0);
    }

    .hero__background-layer--overlay {
        background: var(--hero-overlay);
        mix-blend-mode: normal;
        opacity: 0.4;
    }

    .hero__layout {
        position: relative;
        display: grid;
        gap: var(--hero-gap);
        align-items: start;
        justify-items: stretch;
        width: min(100%, var(--hero-layout-width));
        max-inline-size: var(--hero-layout-width);
        margin-inline: auto;
        z-index: var(--z-content);
    }

    .hero--with-aside .hero__layout {
        gap: var(--hero-gap);
    }

    @media (min-width: 960px) {
        .hero--with-aside .hero__layout {
            grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
        }
    }

    .hero__main {
        display: grid;
        gap: var(--hero-gap);
    }

    .hero__content {
        position: relative;
        z-index: var(--z-content);
        display: grid;
        gap: clamp(var(--grid-gap-md), calc(var(--hero-gap) * 0.75), var(--grid-gap-xl));
        justify-items: start;
        padding: var(--hero-content-padding);
        max-inline-size: var(--hero-content-max-width);
        border-radius: calc(var(--glass-card-radius) * 1.2);
        background: color-mix(
            in srgb,
            var(--surface-glass-bg) 68%,
            transparent 32%
        );
        border: 1px solid color-mix(
            in srgb,
            var(--surface-glass-border) 52%,
            transparent 48%
        );
        box-shadow: var(--surface-glass-shadow);
        backdrop-filter: blur(var(--glass-blur-lg)) saturate(1.08);
        -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(1.08);
        overflow: visible;
        isolation: isolate;
        animation: hero-entrance var(--duration-hero) var(--ease-spring) both;
    }

    .hero__content::before {
        content: "";
        position: absolute;
        inset: -35%;
        background: radial-gradient(
                120% 120% at 12% 20%,
                rgba(var(--voyage-blue-rgb), 0.08),
                transparent 72%
            ),
            radial-gradient(
                140% 140% at 88% 22%,
                rgba(var(--aurora-purple-rgb), 0.06),
                transparent 74%
            );
        opacity: 0.24;
        pointer-events: none;
        transform: translate3d(0, 0, 0);
        transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hero__status {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .hero__title {
        position: relative;
        z-index: var(--z-text);
        margin: 0;
        font-family: var(--font-display);
        font-weight: var(--font-h1-weight);
        font-size: var(--h1);
        line-height: var(--font-h1-line);
        letter-spacing: -0.01em;
        color: var(--text);
        text-wrap: balance;
    }

    .hero__lead {
        position: relative;
        z-index: var(--z-text);
        margin: 0;
        color: var(--text-secondary);
        font-size: var(--text-subtitle);
        line-height: var(--leading-relaxed);
        max-width: var(--measure-md);
        text-wrap: balance;
    }

    .hero--align-center .hero__lead {
        margin-inline: auto;
    }

    .hero__description {
        position: relative;
        z-index: var(--z-text);
        display: grid;
        gap: var(--space-md);
        color: var(--text-secondary);
        font-size: var(--text-body);
        line-height: var(--leading-relaxed);
        max-width: var(--measure-lg);
    }

    .hero__actions {
        position: relative;
        z-index: var(--z-interactive);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        gap: var(--hero-actions-gap);
        margin-top: clamp(var(--space-lg), calc(var(--hero-gap) * 0.8), var(--space-2xl));
    }

    .hero__actions :global(*) {
        flex-shrink: 0;
    }

    .hero--align-center .hero__actions {
        justify-content: center;
    }

    .hero__highlights {
        --hero-highlight-border: color-mix(
            in srgb,
            var(--surface-glass-border) 46%,
            transparent 54%
        );
        --hero-highlight-bg: color-mix(
            in srgb,
            var(--surface-glass-bg) 60%,
            transparent 40%
        );
        --hero-highlight-shadow: var(--surface-glass-shadow);
        position: relative;
        z-index: var(--z-content);
        margin-top: var(--space-2xl);
        padding: clamp(var(--space-2xl), 4vw, var(--space-4xl));
        border-radius: calc(var(--glass-card-radius) * 1.15);
        background: var(--hero-highlight-bg);
        border: 1px solid var(--hero-highlight-border);
        box-shadow: var(--hero-highlight-shadow);
        backdrop-filter: blur(calc(var(--glass-blur-lg) * 0.85)) saturate(1.08);
        -webkit-backdrop-filter: blur(calc(var(--glass-blur-lg) * 0.85))
            saturate(1.08);
        display: grid;
        gap: var(--space-lg);
        isolation: isolate;
        overflow: hidden;
        animation: hero-entrance var(--duration-hero) var(--ease-spring) both;
        animation-delay: var(--duration-micro);
    }

    .hero__highlights::before,
    .hero__highlights::after {
        content: "";
        position: absolute;
        inset: -25% -18% auto -18%;
        height: 120%;
        border-radius: 50%;
        background: radial-gradient(
            120% 120% at 16% 24%,
            color-mix(
                    in srgb,
                    rgba(var(--voyage-blue-rgb), 0.14) 52%,
                    transparent 48%
                )
                0%,
            transparent 72%
        );
        opacity: 0.22;
        pointer-events: none;
        transform: translate3d(0, 0, 0);
        transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hero__highlights::after {
        inset: auto -22% -28% -22%;
        background: radial-gradient(
            140% 140% at 78% 68%,
            color-mix(
                    in srgb,
                    rgba(var(--aurora-purple-rgb), 0.12) 46%,
                    transparent 54%
                )
                0%,
            transparent 74%
        );
        opacity: 0.18;
    }

    .hero__highlights :global(h2),
    .hero__highlights :global(h3) {
        margin: 0;
        font-size: var(--h3);
    }

    .hero__highlights :global(p) {
        margin: 0;
        color: var(--text-secondary);
        line-height: var(--leading-relaxed);
    }

    .hero__highlights :global(ul) {
        position: relative;
        z-index: var(--z-text);
        margin: 0;
        padding-inline-start: 0;
        list-style: none;
        display: grid;
        gap: var(--space-sm);
        color: var(--text-secondary);
    }

    .hero__highlights :global(li) {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: start;
        gap: var(--space-sm);
    }

    .hero__highlights :global(li::before) {
        content: "";
        width: 0.6rem;
        height: 0.6rem;
        margin-top: 0.35rem;
        border-radius: 50%;
        background: var(--gradient-accent);
        box-shadow:
            0 0 0 1px
                color-mix(
                    in srgb,
                    rgba(var(--snow-rgb), 0.82) 60%,
                    transparent 40%
                ),
            0 0 0 6px
                color-mix(
                    in srgb,
                    var(--hero-highlight-bg) 78%,
                    transparent 22%
                );
    }

    .hero__aside {
        display: grid;
        gap: clamp(var(--grid-gap-md), calc(var(--hero-gap) * 0.6), var(--grid-gap-lg));
        align-content: start;
        justify-items: stretch;
        animation: hero-entrance 880ms cubic-bezier(0.23, 1, 0.32, 1) both;
        animation-delay: 160ms;
    }

    .hero--align-center .hero__main {
        text-align: center;
        align-items: center;
    }

    .hero--align-center .hero__content {
        text-align: center;
        justify-items: center;
    }

    .hero--align-center .hero__description,
    .hero--align-center .hero__lead {
        margin-inline: auto;
    }

    .hero--align-center .hero__highlights {
        text-align: left;
    }

    [data-variant="grid"] {
        --hero-grad-start: var(--voyage-blue);
        --hero-grad-stop: var(--signal-yellow);
    }

    [data-variant="halo"] {
        --hero-grad-start: color-mix(
            in srgb,
            var(--aurora-purple) 80%,
            var(--voyage-blue) 20%
        );
        --hero-grad-stop: color-mix(
            in srgb,
            var(--signal-yellow) 70%,
            var(--aurora-purple) 30%
        );
    }

    [data-variant="line"] {
        --hero-grad-start: var(--voyage-blue);
        --hero-grad-stop: var(--cherry-pop);
    }

    [data-variant="particles"] {
        --hero-grad-start: color-mix(
            in srgb,
            var(--aurora-purple) 60%,
            var(--voyage-blue) 40%
        );
        --hero-grad-stop: color-mix(
            in srgb,
            var(--voyage-blue) 40%,
            var(--signal-yellow) 60%
        );
    }

    @keyframes hero-entrance {
        from {
            opacity: 0;
            transform: translate3d(0, 18px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    :global(html[data-theme="hc"] .hero) {
        background: var(--bg);
        border: 2px solid currentColor;
        box-shadow: none;
    }

    :global(html[data-theme="hc"] .hero__background-layer) {
        display: none;
    }

    :global(html[data-theme="hc"] .hero__accent) {
        position: static;
        width: 100%;
        height: var(--space-sm);
        margin-top: var(--space-lg);
        background: currentColor;
        opacity: 1;
    }

    :global(html[data-theme="hc"] .hero__content),
    :global(html[data-theme="hc"] .hero__highlights) {
        background: transparent;
        border: 2px solid currentColor;
        box-shadow: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
    }

    :global(html[data-theme="hc"] .hero__highlights::before),
    :global(html[data-theme="hc"] .hero__highlights::after) {
        display: none;
    }

    :global(html[data-theme="hc"] .hero__highlights :global(li)) {
        grid-template-columns: auto 1fr;
        gap: var(--space-sm);
    }

    :global(html[data-theme="hc"] .hero__highlights :global(li::before)) {
        background: currentColor;
        box-shadow: none;
        width: 0.5rem;
        height: 0.5rem;
    }

    :global([data-base-theme="dark"]) .hero__highlights {
        --hero-highlight-bg: color-mix(
            in srgb,
            rgba(var(--graphite-rgb), 0.92) 68%,
            rgba(var(--voyage-blue-rgb), 0.22) 32%
        );
        --hero-highlight-border: color-mix(
            in srgb,
            rgba(var(--voyage-blue-rgb), 0.52) 58%,
            rgba(255, 255, 255, 0.22) 42%
        );
        --hero-highlight-shadow: 0 24px 64px rgba(6, 10, 20, 0.42),
            0 10px 28px rgba(6, 10, 20, 0.22);
    }

    @media (max-width: 960px) {
        .hero {
            --hero-padding-inline: clamp(
                var(--hero-padding-inline-min),
                6vw,
                var(--hero-padding-inline-max)
            );
        }

        .hero__content {
            padding: clamp(
                var(--hero-content-padding-min),
                6vw,
                var(--hero-content-padding-max)
            );
        }

        .hero__aside {
            width: 100%;
            max-width: 100%;
        }
    }

    @media (max-width: 640px) {
        .hero {
            --hero-padding-block: clamp(
                var(--hero-padding-block-mobile),
                12vw,
                var(--hero-padding-block-desktop)
            );
            --hero-padding-inline: clamp(
                var(--hero-padding-inline-min),
                8vw,
                var(--hero-padding-inline-max)
            );
        }

        .hero__actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
        }

        .hero__content {
            padding: clamp(
                var(--hero-content-padding-min),
                9vw,
                var(--hero-content-padding-max)
            );
            gap: clamp(
                var(--grid-gap-md),
                calc(var(--hero-gap) * 0.7),
                var(--grid-gap-lg)
            );
            width: 100%;
            max-width: 100%;
            margin: 0;
        }

        .hero__highlights {
            margin-top: var(--space-xl);
            padding: clamp(
                var(--component-padding-md),
                9vw,
                var(--component-padding-lg)
            );
        }

        .hero__highlights :global(li) {
            grid-template-columns: auto 1fr;
            align-items: start;
        }

        .hero__highlights :global(li::before) {
            margin-top: var(--space-xs);
        }

        .hero__aside {
            width: 100%;
            padding-inline: 0;
        }

        .hero--align-center .hero__content,
        .hero--align-center .hero__lead,
        .hero--align-center .hero__description {
            max-width: 100%;
            text-align: center;
        }

        :global(html[data-theme="hc"] .hero) {
            border-width: 3px;
            padding-inline: var(--space-md);
        }

        :global(html[data-theme="hc"] .hero__content),
        :global(html[data-theme="hc"] .hero__highlights) {
            border-width: 3px;
            padding: var(--space-lg);
        }

        :global(html[data-theme="hc"] .hero__content::before) {
            display: none;
        }
    }

    @media (max-width: 600px) {
        .hero--align-center .hero__aside {
            justify-self: center;
            text-align: center;
        }
        
        .hero__content {
            max-width: 90%;
            margin: 0 auto;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero__background-layer--gradient,
        .hero__accent {
            animation: none;
            background-position: 50% 50%;
        }

        .hero__actions,
        .hero__highlights,
        .hero__content,
        .hero__aside {
            transition: none;
            animation: none;
        }
    }
</style>
