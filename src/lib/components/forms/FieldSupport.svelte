<script>
  import { Icon } from '$lib/components';

  /** @type {'helper' | 'error'} */
  export let tone = 'helper';
  /** @type {string} */
  export let message = '';
  /** @type {string | undefined} */
  export let id = undefined;
  /** @type {'polite' | 'assertive'} */
  export let announce = 'polite';

  const iconByTone = {
    helper: 'info',
    error: 'alert'
  };
</script>

{#if message}
  <p
    class={`field-support field-support--${tone}`}
    id={id}
    role={tone === 'error' ? 'alert' : undefined}
    aria-live={tone === 'error' ? announce : undefined}
  >
    <Icon
      name={iconByTone[tone]}
      size={16}
      style={`color: ${tone === 'error' ? 'var(--critical, #E0322C)' : 'var(--voyage-blue)'}; margin-top: 0.1rem;`}
    />
    <span>{message}</span>
  </p>
{/if}

<style>
  .field-support {
    margin-top: 0.5rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: flex-start;
    font-size: var(--text-caption);
    line-height: 1.45;
    color: var(--text-secondary);
  }

  .field-support--error {
    color: var(--critical-text, var(--error-strong, var(--critical, #E0322C)));
  }

  @media (prefers-reduced-motion: no-preference) {
    .field-support {
      transition: color var(--duration-fast, 0.2s) var(--ease-out, ease);
    }
  }
</style>
