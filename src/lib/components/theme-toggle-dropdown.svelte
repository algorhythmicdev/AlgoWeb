<script lang="ts">
  import { translateOrFallback } from '$lib/utils/i18n';
  import { _ } from '$lib/i18n';
  import Icon from './icons/Icon.svelte';
  import { theme, availableThemes } from '$stores/theme';

  export let className = '';

  const translate = (key: string, fallback: string, params?: Record<string, unknown>) =>
    translateOrFallback($_, key, fallback, params);

  const themeLabels: Record<string, string> = {
    light: 'settings.theme.light',
    dark: 'settings.theme.dark',
    hc: 'settings.theme.contrast'
  };

  const themeIcons: Record<string, string> = {
    light: 'sun',
    dark: 'moon',
    hc: 'contrast'
  };

  const supportedThemes = availableThemes ?? ['light', 'dark', 'hc'];
  const hasMultipleThemes = supportedThemes.length > 1;

  let currentTheme: string = 'light';

  $: currentTheme = $theme ?? 'light';
  $: labelKey = themeLabels[currentTheme] ?? 'settings.theme.light';
  $: fallbackName =
    currentTheme === 'hc'
      ? 'High contrast'
      : currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);
  $: themeName = translate(labelKey, fallbackName);
  $: triggerLabel = translate('settings.theme.trigger_label', 'Switch theme');
  $: ariaLabel = `${triggerLabel} (${themeName})`;
  $: announcement = `${translate('settings.theme.selected', 'Selected theme')}: ${themeName}.`;
  $: iconName = themeIcons[currentTheme] ?? 'sun';
  $: classes = ['quick-control', className].filter(Boolean).join(' ');

  const cycleThemes = () => {
    if (!hasMultipleThemes) return;
    theme.cycle();
  };
</script>

<button
  type="button"
  class={classes}
  data-theme={currentTheme}
  on:click={cycleThemes}
  aria-label={ariaLabel}
  title={ariaLabel}
  aria-disabled={!hasMultipleThemes}
>
  <span class="sr-only" aria-live="polite">{announcement}</span>
  <span class="quick-control__icon" aria-hidden="true">
    <Icon name={iconName} size="var(--space-4)" />
  </span>
</button>
