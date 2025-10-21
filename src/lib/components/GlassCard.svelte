<script lang="ts">
    type TagName = keyof HTMLElementTagNameMap;
    type Padding = "sm" | "md" | "lg";

    export let as: TagName = "div";
    export let halo = false;
    export let particles = false;
    export let padding: Padding = "md";
    export let interactive = false;

    $: rootClass = [
        "glass-card",
        `glass-card--pad-${padding}`,
        halo ? "glass-card--halo" : "",
        particles ? "glass-card--particles" : "",
        interactive ? "glass-card--interactive" : "",
        typeof $$props.class === "string" ? $$props.class : "",
    ]
        .filter(Boolean)
        .join(" ");
</script>

<svelte:element
    this={as}
    class={rootClass}
    data-variant={halo ? "halo" : particles ? "particles" : undefined}
    {...$$restProps}
>
    <slot />
</svelte:element>

<style>
    .glass-card {
        position: relative;
        display: grid;
        gap: var(--card-gap);
        padding: var(--card-padding-lg);
        border-radius: var(--radius-lg);
        --glass-card-surface: var(
            --card-glass-surface,
            color-mix(
                in srgb,
                var(--surface-glass-bg) 88%,
                transparent 12%
            )
        );
        --glass-card-surface-hover: var(
            --card-glass-surface-hover,
            color-mix(
                in srgb,
                var(--glass-bg-lightest) 48%,
                transparent 52%
            )
        );
        --glass-card-border: var(
            --card-glass-border,
            var(--surface-glass-border)
        );
        --glass-card-border-hover: var(
            --card-glass-border-hover,
            color-mix(
                in srgb,
                var(--glass-card-border) 78%,
                transparent 22%
            )
        );
        --glass-card-shadow: var(
            --card-glass-shadow,
            var(--surface-glass-shadow)
        );
        --glass-card-shadow-hover: var(
            --card-glass-shadow-hover,
            var(--shadow-xl)
        );
        --glass-card-spot-a: var(
            --card-glass-spot-a,
            rgba(var(--voyage-blue-rgb), 0.08)
        );
        --glass-card-spot-b: var(
            --card-glass-spot-b,
            rgba(var(--aurora-purple-rgb), 0.06)
        );
        --glass-card-veil: var(
            --card-glass-veil,
            color-mix(
                in srgb,
                rgba(var(--voyage-blue-rgb), 0.12) 36%,
                transparent 64%
            )
        );
        --glass-card-highlight: var(
            --card-glass-highlight,
            rgba(var(--snow-rgb), 0.12)
        );
        --glass-card-halo: var(
            --card-glass-halo,
            rgba(var(--signal-yellow-rgb), 0.16)
        );
        --glass-card-halo-blur: var(--card-glass-halo-blur, 32px);
        --glass-card-veil-opacity: var(--card-glass-veil-opacity, 0.38);
        --glass-card-halo-opacity: var(--card-glass-halo-opacity, 0.18);
        --glass-card-halo-boost: var(--card-glass-halo-boost, 0.22);
        --glass-card-halo-boost-hover: var(
            --card-glass-halo-boost-hover,
            0.32
        );
        --glass-card-particles-opacity: var(
            --card-glass-particles-opacity,
            0.38
        );
        --glass-card-gap-mobile: var(--card-glass-gap-mobile, var(--space-lg));
        --glass-card-padding-mobile: var(
            --card-glass-padding-mobile,
            var(--space-lg)
        );
        --glass-card-padding-sm-mobile: var(
            --card-glass-padding-sm-mobile,
            var(--space-md)
        );
        --glass-card-padding-lg-mobile: var(
            --card-glass-padding-lg-mobile,
            var(--space-xl)
        );
        --glass-card-focus-ring: var(
            --card-glass-focus-ring,
            color-mix(
                in srgb,
                var(--focus-ring-color) 80%,
                rgba(var(--signal-yellow-rgb), 0.24) 20%
            )
        );
        border: 1px solid var(--glass-card-border);
        background: var(--glass-card-surface);
        color: var(--text);
        overflow: visible;
        isolation: isolate;
        box-shadow: var(--glass-card-shadow);
        backdrop-filter: blur(var(--glass-blur-lg)) saturate(1.12);
        -webkit-backdrop-filter: blur(var(--glass-blur-lg)) saturate(1.12);
        transition:
            background var(--duration-normal) var(--ease-smooth),
            border-color var(--duration-normal) var(--ease-smooth),
            box-shadow var(--duration-normal) var(--ease-smooth),
            transform var(--duration-normal) var(--ease-smooth),
            color var(--duration-normal) var(--ease-smooth);
    }

    .glass-card--pad-sm {
        padding: var(--card-padding-sm);
    }

    .glass-card--pad-lg {
        padding: var(--card-padding-xl);
    }

    .glass-card::before,
    .glass-card::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: var(--z-behind);
        transition:
            opacity var(--duration-smooth) var(--ease-smooth),
            transform var(--duration-smooth) var(--ease-smooth);
    }

    .glass-card::before {
        background: radial-gradient(
                120% 120% at 14% 20%,
                var(--glass-card-spot-a) 0%,
                transparent 62%
            ),
            radial-gradient(
                120% 140% at 80% 16%,
                var(--glass-card-spot-b) 0%,
                transparent 68%
            ),
            linear-gradient(
                180deg,
                var(--glass-card-veil) 0%,
                transparent 45%
            ),
            linear-gradient(
                180deg,
                var(--glass-card-highlight)
                    0%,
                transparent 72%
            );
        opacity: var(--glass-card-veil-opacity);
    }

    .glass-card::after {
        inset: -14%;
        background: radial-gradient(
            120% 120% at 50% 45%,
            color-mix(
                    in srgb,
                    var(--glass-card-halo) 28%,
                    transparent 72%
                )
                0%,
            transparent 70%
        );
        filter: blur(var(--glass-card-halo-blur));
        opacity: var(--glass-card-halo-opacity);
    }

    .glass-card--interactive {
        cursor: pointer;
        transition:
            transform var(--duration-smooth) var(--ease-spring),
            box-shadow var(--duration-smooth) var(--ease-smooth),
            border-color var(--duration-fast) ease,
            background var(--duration-normal) var(--ease-smooth);
    }

    .glass-card--interactive:hover {
        transform: var(--transform-hover-card);
        border-color: var(--glass-card-border-hover);
        box-shadow: var(--glass-card-shadow-hover);
        background: var(--glass-card-surface-hover);
    }

    .glass-card--interactive:active {
        transform: var(--transform-active-card);
        transition-duration: var(--duration-micro);
    }

    .glass-card:focus-within {
        outline: 2px solid var(--glass-card-focus-ring);
        outline-offset: 4px;
    }

    .glass-card--halo::after {
        opacity: var(--glass-card-halo-boost);
        transition:
            opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1),
            transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glass-card--halo:hover::after,
    .glass-card--halo:focus-visible::after,
    .glass-card--halo.glass-card--interactive:hover::after,
    .glass-card--halo.glass-card--interactive:focus-visible::after {
        opacity: var(--glass-card-halo-boost-hover);
        transform: scale(1.01);
    }

    .glass-card--particles::before {
        opacity: var(--glass-card-particles-opacity);
        transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (max-width: 960px) {
        .glass-card {
            width: 100%;
            max-width: 100%;
        }
    }

    @media (max-width: 640px) {
        .glass-card {
            gap: var(--glass-card-gap-mobile);
            padding: var(--glass-card-padding-mobile);
            border-radius: var(--radius-xl);
            width: 100%;
        }

        .glass-card--pad-sm {
            padding: var(--glass-card-padding-sm-mobile);
        }

        .glass-card--pad-lg {
            padding: var(--glass-card-padding-lg-mobile);
        }
    }

    .glass-card :global(*) {
        position: relative;
        z-index: var(--z-text);
    }

    .glass-card :global(h1),
    .glass-card :global(h2),
    .glass-card :global(h3),
    .glass-card :global(h4),
    .glass-card :global(h5),
    .glass-card :global(h6),
    .glass-card :global(p),
    .glass-card :global(span),
    .glass-card :global(a),
    .glass-card :global(button) {
        position: relative;
        z-index: var(--z-text);
    }

    .glass-card :global(h1),
    .glass-card :global(h2),
    .glass-card :global(h3),
    .glass-card :global(h4),
    .glass-card :global(h5),
    .glass-card :global(h6) {
        text-wrap: balance;
        overflow-wrap: break-word;
    }

    .glass-card :global(p) {
        margin: 0;
        max-width: var(--measure-lg);
        line-height: var(--leading-relaxed);
        color: var(--text);
        text-wrap: pretty;
        overflow-wrap: break-word;
    }

    .glass-card :global(ul),
    .glass-card :global(ol) {
        margin: 0;
        padding-left: clamp(var(--space-md), 2.8vw, var(--space-lg));
        display: grid;
        gap: clamp(var(--space-xs), 1.4vw, var(--space-sm));
        line-height: var(--leading-normal);
    }

    .glass-card :global(li) {
        margin: 0;
    }

    .glass-card :global(.card-actions) {
        display: flex;
        flex-wrap: wrap;
        gap: clamp(var(--space-sm), 2vw, var(--space-md));
        align-items: center;
    }

    :global(html[data-theme="hc"] .glass-card) {
        background: var(--bg);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
        border: 2px solid currentColor;
    }

    :global(html[data-theme="hc"] .glass-card::before),
    :global(html[data-theme="hc"] .glass-card::after) {
        display: none;
    }

    :global(html[data-theme="hc"] .glass-card:focus-within) {
        outline: 3px solid currentColor;
        outline-offset: var(--space-xs);
    }

    @media (max-width: 640px) {
        :global(html[data-theme="hc"] .glass-card) {
            background: var(--bg);
            border-width: 3px;
            padding: var(--space-lg);
        }

        :global(html[data-theme="hc"] .glass-card--pad-sm) {
            padding: var(--space-md);
        }

        :global(html[data-theme="hc"] .glass-card--pad-lg) {
            padding: var(--space-xl);
        }

        :global(html[data-theme="hc"] .glass-card p),
        :global(html[data-theme="hc"] .glass-card h1),
        :global(html[data-theme="hc"] .glass-card h2),
        :global(html[data-theme="hc"] .glass-card h3) {
            color: var(--text);
        }
    }

    :global(html[data-theme="hc"] .glass-card--interactive:hover) {
        background: var(--bg);
        border-color: currentColor;
        box-shadow: none;
        transform: none;
    }

    :global(html[data-theme="hc"] .glass-card--interactive:active) {
        transform: scale(0.98);
    }

    @media (prefers-reduced-motion: reduce) {
        .glass-card--interactive,
        .glass-card--interactive:hover,
        .glass-card--interactive:focus-visible {
            transform: none;
            box-shadow: var(--shadow-xl);
        }
    }
</style>
