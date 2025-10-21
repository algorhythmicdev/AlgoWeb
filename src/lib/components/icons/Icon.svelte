<script>
  /** @type {string} */
  export let name;
  /** @type {number | string} */
  export let size = 24;
  /** @type {string} */
  export let className = '';

  let forwardedClass = '';
  $: forwardedClass = $$props.class ?? '';
  $: classes = ['icon', className, forwardedClass].filter(Boolean).join(' ');

  /**
   * Normalises the requested icon size so that callers can either pass a raw
   * number (interpreted as pixels) or a token/string value (e.g. `var(...)`,
   * `1.5rem`). Width/height attributes do not understand CSS variables, so we
   * rely on inline CSS when a non-numeric value is provided.
   * @param {unknown} value
   * @returns {{ width: number | null; css: string }}
   */
  const resolveSize = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return { width: value, css: `${value}px` };
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      const parsed = Number.parseFloat(trimmed);
      const hasUnit = /[a-zA-Z%]/.test(trimmed);

      if (!Number.isNaN(parsed) && !hasUnit) {
        return { width: parsed, css: `${parsed}px` };
      }

      if (trimmed.length > 0) {
        return { width: null, css: trimmed };
      }
    }

    const fallback = 24;
    return { width: fallback, css: `${fallback}px` };
  };

  $: sizeInfo = resolveSize(size);
  $: svgStyle = `inline-size: ${sizeInfo.css}; block-size: ${sizeInfo.css};`;
  $: svgWidth = sizeInfo.width ?? undefined;
  const commonProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24'
  };
</script>

{#if name === 'ai'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3" y="3" width="18" height="18" rx="4" ry="4" class="stroke" />
    <rect x="8" y="8" width="8" height="8" rx="2" class="stroke" />
    <circle cx="12" cy="12" r="1.2" class="fill" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.4 1.4M16.6 16.6L18 18M6 18l1.4-1.4M16.6 7.4 18 6" class="stroke" />
  </svg>
{:else if name === 'map'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3.5 5.2 9 3l6 2 5.5-2.2v15.8L15 21l-6-2-5.5 2.2z" class="stroke" fill="none" />
    <path d="M9 4.2v14.6M15 5.8v14.6" class="stroke" />
  </svg>
{:else if name === 'device'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="7" y="2.5" width="10" height="19" rx="2.2" class="stroke" />
    <circle cx="12" cy="17.5" r="1" class="fill" />
    <rect x="9.2" y="5.5" width="5.6" height="7.8" rx="1" class="stroke" />
  </svg>
{:else if name === 'people'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="9" cy="9" r="3" class="stroke" />
    <circle cx="16" cy="10" r="2.5" class="stroke" />
    <path d="M4.5 19.5c.6-3 3.1-5 6.5-5s5.9 2 6.5 5" class="stroke" />
    <path d="M13.5 19.5c.3-1.6 1.5-2.8 3.1-3.4" class="stroke" />
  </svg>
{:else if name === 'target'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="8" class="stroke" />
    <circle cx="12" cy="12" r="4.5" class="stroke" />
    <circle cx="12" cy="12" r="1.4" class="fill" />
    <path d="M12 4V2M20 12h2M12 20v2M4 12H2" class="stroke" />
  </svg>
{:else if name === 'chart'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 19h16" class="stroke" />
    <rect x="6" y="11" width="3" height="6" class="stroke" />
    <rect x="10.5" y="7" width="3" height="10" class="stroke" />
    <rect x="15" y="9" width="3" height="8" class="stroke" />
  </svg>
{:else if name === 'market'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 10h16l-1.5-5h-13z" class="stroke" />
    <path d="M6 10v8h12v-8" class="stroke" />
    <path d="M10 10v8" class="stroke" />
    <path d="M4 10c0 1.5 1.2 2.7 2.7 2.7S9.4 11.5 9.4 10" class="stroke" />
    <path d="M9.4 10c0 1.5 1.2 2.7 2.7 2.7S14.8 11.5 14.8 10" class="stroke" />
    <path d="M14.8 10c0 1.5 1.2 2.7 2.7 2.7S20.2 11.5 20.2 10" class="stroke" />
  </svg>
{:else if name === 'idea'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 4a5.5 5.5 0 0 0-3.8 9.5c.8.7 1.3 1.7 1.3 2.7v.3h5v-.3c0-1 .5-2 1.3-2.7A5.5 5.5 0 0 0 12 4Z" class="stroke" />
    <path d="M10.5 20h3" class="stroke" />
    <path d="M9.8 17.5h4.4" class="stroke" />
  </svg>
{:else if name === 'bolt'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 2 6 13h4l-1 9 7-12h-4z" class="stroke" />
  </svg>
{:else if name === 'package'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4.5 7 12 3l7.5 4-7.5 4z" class="stroke" />
    <path d="M12 21V11" class="stroke" />
    <path d="M4.5 7v9l7.5 5 7.5-5V7" class="stroke" />
    <path d="M12 7 7 4.5" class="stroke" />
    <path d="M12 7l5-2.5" class="stroke" />
  </svg>
{:else if name === 'close'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="m8 8 8 8m0-8-8 8" class="stroke" />
    <circle cx="12" cy="12" r="8.5" class="stroke" />
  </svg>
{:else if name === 'check'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="9" class="stroke" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5.5" class="stroke" />
  </svg>
{:else if name === 'calendar'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="4" y="5" width="16" height="15" rx="2" class="stroke" />
    <path d="M8 3v4M16 3v4" class="stroke" />
    <path d="M4 9h16" class="stroke" />
    <rect x="8" y="12" width="3" height="3" class="fill" />
  </svg>
{:else if name === 'mail'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3" y="6" width="18" height="12" rx="2" class="stroke" />
    <path d="m5 8 7 5 7-5" class="stroke" />
  </svg>
{:else if name === 'location'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 3a6 6 0 0 0-6 6c0 4.3 6 12 6 12s6-7.7 6-12a6 6 0 0 0-6-6z" class="stroke" />
    <circle cx="12" cy="9" r="2.2" class="stroke" />
  </svg>
{:else if name === 'info'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="9" class="stroke" />
    <path d="M12 16v-4" class="stroke" />
    <circle cx="12" cy="8" r="0.8" class="fill" />
  </svg>
{:else if name === 'alert'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 4 3 19h18L12 4z" class="stroke" />
    <path d="M12 10v4.5" class="stroke" />
    <circle cx="12" cy="16.5" r="0.9" class="fill" />
  </svg>
{:else if name === 'linkedin'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={`${classes} icon-badge`}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3" y="3" width="18" height="18" rx="4" class="stroke" />
    <path
      d="M8.2 9.4h2.1v7.2H8.2zm1-2.8c.7 0 1.2-.5 1.2-1.2s-.5-1.2-1.2-1.2-1.2.5-1.2 1.2.5 1.2 1.2 1.2zm3.2 2.8h2v1c.4-.7 1.2-1.3 2.4-1.3 2.1 0 2.5 1.4 2.5 3.2v4.3h-2.1v-3.7c0-.9-.1-2.1-1.4-2.1-1.4 0-1.6 1-1.6 2.1v3.7h-2.1z"
      class="fill"
    />
  </svg>
{:else if name === 'github'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={`${classes} icon-badge`}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3" y="3" width="18" height="18" rx="4" class="stroke" />
    <path
      d="M12 8.2c-2.2 0-4 1.8-4 4 0 1.8 1.1 3.3 2.7 3.8v-1.9c-.6.1-1.2-.1-1.4-.6-.3-.6-.8-.7-.8-.7-.6-.4 0-.4 0-.4.4 0 .7.5.7.5.3.6.8.5 1 .4 0-.2.1-.5.3-.6-1.7-.2-2.5-.9-2.5-2 0-.4.2-.8.5-1.1-.1-.1-.2-.5 0-1.1 0 0 .4-.1 1.2.5.3-.1.7-.2 1-.2.3 0 .7.1 1 .2.8-.6 1.2-.5 1.2-.5.2.6.1 1 0 1.1.3.3.5.7.5 1.1 0 1.1-.8 1.8-2.5 2 .2.1.4.4.4.9v2c1.6-.5 2.7-2 2.7-3.8 0-2.2-1.8-4-4-4z"
      class="fill"
    />
  </svg>
{:else if name === 'twitter'}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={`${classes} icon-badge`}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3" y="3" width="18" height="18" rx="4" class="stroke" />
    <path
      d="M16.8 8.6c-.4.2-.9.3-1.3.3.5-.3.8-.7 1-.1.1-.1.1-.1 0-.2-.4.2-.9.4-1.4.4-.4-.4-.9-.6-1.5-.6a2.4 2.4 0 0 0-2.4 2.4c0 .2 0 .4.1.6a6.8 6.8 0 0 1-4.9-2.5 2.4 2.4 0 0 0-.3 1.2 2.4 2.4 0 0 0 1.1 2 2.5 2.5 0 0 1-1.1-.3v.1a2.4 2.4 0 0 0 2 2.3 2.5 2.5 0 0 1-1.1 0 2.4 2.4 0 0 0 2.2 1.6A4.8 4.8 0 0 1 7 17.3a6.8 6.8 0 0 0 3.7 1.1c4.4 0 6.8-3.6 6.8-6.8v-.3c.4-.2.8-.6 1.1-.9-.4.1-.8.2-1.2.2.4-.2.7-.6.9-1z"
      class="fill"
    />
  </svg>
{:else}
  <svg
    {...commonProps}
    width={svgWidth}
    height={svgWidth}
    style={svgStyle}
    class={classes}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="6" class="stroke" />
  </svg>
{/if}

<style>
  .icon {
    display: inline-flex;
    color: currentColor;
  }

  .stroke {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    vector-effect: non-scaling-stroke;
  }

  .fill {
    fill: currentColor;
    stroke: none;
  }

  /* badge icons inherit fill styles */
</style>
