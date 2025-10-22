<script lang="ts">
    import { withBase } from "$utils/paths";

    type ButtonVariant = "primary" | "secondary" | "subtle" | "gradient";
    type ButtonSize = "md" | "lg";

    export let variant: ButtonVariant = "primary";
    export let size: ButtonSize = "md";
    export let href: string | undefined = undefined;
    export let target: string | undefined = undefined;
    export let rel: string | undefined = undefined;
    export let type: "button" | "submit" | "reset" = "button";
    export let disabled = false;
    export let fullWidth = false;
    export let loading = false;
    export let ariaLabel: string | null = null;
    export let pressed: boolean | undefined = undefined;
    export let elevate = false;

    $: isLink = typeof href === "string" && href.length > 0;
    $: computedRel =
        rel ??
        (isLink && target === "_blank" ? "noopener noreferrer" : undefined);
    $: ariaPressed = pressed === undefined ? undefined : !!pressed;
    $: ariaLabelValue = ariaLabel ?? undefined;
    $: busy = loading ? true : undefined;
    $: resolvedHref = isLink ? withBase(href) ?? undefined : undefined;

    $: classes = [
        "btn",
        `btn--${variant}`,
        size === "lg" ? "btn--lg" : "btn--md",
        fullWidth ? "btn--block" : "",
        loading ? "btn--loading" : "",
        elevate ? "btn--elevate" : "",
        typeof $$props.class === "string" ? $$props.class : "",
    ]
        .filter(Boolean)
        .join(" ");
</script>

{#if isLink}
    <a
        {...$$restProps}
        class={classes}
        href={resolvedHref}
        {target}
        rel={computedRel}
        aria-label={ariaLabelValue}
        aria-busy={busy}
        data-variant={variant}
    >
        <span class="btn__content"><slot /></span>
    </a>
{:else}
    <button
        {...$$restProps}
        class={classes}
        {type}
        disabled={disabled || loading}
        aria-label={ariaLabelValue}
        aria-busy={busy}
        aria-pressed={ariaPressed}
        data-variant={variant}
    >
        <span class="btn__content"><slot /></span>
    </button>
{/if}

<style>
    .btn {
        --btn-bg: var(--button-primary-bg);
        --btn-border: var(--button-primary-border);
        --btn-color: var(--button-primary-color);
        --btn-hover-bg: var(--button-primary-hover-bg);
        --btn-hover-border: var(--button-primary-hover-border);
        --btn-shadow: var(--button-shadow);
        --btn-hover-shadow: var(--button-shadow-hover);
        --btn-focus-ring: var(--button-focus-ring);
        --btn-padding-block: var(--button-padding-block-md);
        --btn-padding-inline: var(--button-padding-inline-md);
        --btn-gap: var(--button-gap);
        --btn-font-size: var(--button-font-size-md);
        --btn-line-height: var(--button-line-height);
        --btn-font-weight: var(--button-font-weight);
        --btn-radius: var(--button-radius);
        --btn-border-width: var(--button-border-width);

        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--btn-gap);
        padding-block: var(--btn-padding-block);
        padding-inline: var(--btn-padding-inline);
        border-radius: var(--btn-radius);
        border: var(--btn-border-width) solid var(--btn-border);
        background: var(--btn-bg);
        color: var(--btn-color);
        font-weight: var(--btn-font-weight);
        font-size: var(--btn-font-size);
        line-height: var(--btn-line-height);
        text-decoration: none;
        cursor: pointer;
        box-shadow: var(--btn-shadow);
        transform: var(--button-transform-rest);
        transition:
            transform var(--button-transition-duration) var(--button-transition-ease),
            box-shadow var(--button-transition-duration) var(--button-shadow-ease),
            background var(--button-surface-duration) var(--button-surface-ease),
            border-color var(--button-surface-duration) var(--button-surface-ease),
            color var(--button-surface-duration) var(--button-surface-ease);
    }

    .btn__content {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
    }

    .btn--lg {
        --btn-padding-block: var(--button-padding-block-lg);
        --btn-padding-inline: var(--button-padding-inline-lg);
        --btn-font-size: var(--button-font-size-lg);
    }

    .btn--block {
        width: 100%;
    }

    .btn--elevate {
        --btn-shadow: var(--button-shadow-elevate);
        --btn-hover-shadow: var(--button-shadow-elevate);
    }

    .btn:hover,
    .btn:focus-visible {
        background: var(--btn-hover-bg);
        border-color: var(--btn-hover-border);
        color: var(--btn-color);
    }

    .btn:hover {
        transform: var(--button-transform-hover);
        box-shadow: var(--btn-hover-shadow);
    }

    .btn:focus-visible {
        outline: none;
        transform: var(--button-transform-hover);
        box-shadow: var(--btn-hover-shadow), var(--btn-focus-ring);
    }

    .btn:active {
        transform: var(--button-transform-active);
        transition-duration: var(--button-active-duration);
    }

    .btn:disabled,
    .btn[aria-disabled="true"] {
        opacity: var(--button-disabled-opacity);
        pointer-events: none;
        box-shadow: none;
        transform: var(--button-transform-rest);
    }

    .btn--secondary {
        --btn-bg: var(--button-secondary-bg);
        --btn-border: var(--button-secondary-border);
        --btn-color: var(--button-secondary-color);
        --btn-hover-bg: var(--button-secondary-hover-bg);
        --btn-hover-border: var(--button-secondary-hover-border);
    }

    .btn--subtle {
        --btn-bg: var(--button-subtle-bg);
        --btn-border: var(--button-subtle-border);
        --btn-color: var(--button-subtle-color);
        --btn-hover-bg: var(--button-subtle-hover-bg);
        --btn-hover-border: var(--button-subtle-border);
        --btn-shadow: var(--button-shadow-subtle);
        --btn-hover-shadow: var(--button-shadow);
    }

    .btn--gradient {
        --btn-bg: var(--button-gradient-bg);
        --btn-border: var(--button-gradient-border);
        --btn-color: var(--button-gradient-color);
        --btn-hover-bg: var(--button-gradient-hover-bg);
        --btn-hover-border: var(--button-gradient-hover-border);
    }

    .btn--loading {
        cursor: var(--button-loading-cursor);
    }

    :global(html[data-theme="hc"] .btn:focus-visible) {
        box-shadow: none;
        outline: var(--button-border-width) solid currentColor;
        outline-offset: calc(var(--border-width-hairline) * 3);
    }

    :global(html[data-theme="hc"] .btn:hover) {
        transform: var(--button-transform-rest);
    }

    :global(html[data-theme="hc"] .btn:active) {
        transform: var(--button-transform-active);
    }

    @media (max-width: 640px) {
        .btn {
            min-height: var(--button-touch-target);
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }

        :global(html[data-theme="hc"] .btn) {
            border-width: var(--border-width-thin);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .btn,
        .btn:hover,
        .btn:focus-visible {
            transition: none;
            transform: none;
        }
    }
</style>
