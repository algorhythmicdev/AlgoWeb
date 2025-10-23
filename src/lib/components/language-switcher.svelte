<script lang="ts">
  import { translateOrFallback } from '$lib/utils/i18n';
  import { _ } from '$lib/i18n';
  import Icon from './icons/Icon.svelte';
  import { language } from '$stores/language';

  export let className = '';

  const translate = (key: string, fallback: string, params?: Record<string, unknown>) =>
    translateOrFallback($_, key, fallback, params);

  const supportedLanguages: readonly string[] =
    typeof language.getSupportedLanguages === 'function'
      ? language.getSupportedLanguages()
      : ['en'];

  let currentCode = 'en';

  $: currentCode = $language ?? 'en';
  $: fallbackCode = currentCode.toUpperCase();
  $: shortKey = `language_switcher.languages.${currentCode}.short`;
  $: nameKey = `language_switcher.languages.${currentCode}.name`;
  $: currentShort = translate(shortKey, fallbackCode);
  $: currentName = translate(nameKey, fallbackCode);
  $: triggerLabel = translate('language_switcher.trigger_label', 'Switch language');
  $: ariaLabel = `${triggerLabel} (${currentName})`;
  $: groupLabel = translate('language_switcher.group_label', 'Language');
  $: announcement = `${triggerLabel}. ${groupLabel}: ${currentName}.`;
  $: classes = ['quick-control', className].filter(Boolean).join(' ');
  $: hasAlternates = supportedLanguages.length > 1;
  $: currentIndex = supportedLanguages.indexOf(currentCode);

  const resolveNext = () => {
    if (supportedLanguages.length === 0) return currentCode;
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (safeIndex + 1) % supportedLanguages.length;
    return supportedLanguages[nextIndex] ?? currentCode;
  };

  const cycleLanguage = () => {
    if (!hasAlternates) return;
    const next = resolveNext();
    if (next && next !== currentCode) {
      language.set(next);
    }
  };
</script>

<button
  type="button"
  class={classes}
  on:click={cycleLanguage}
  aria-label={ariaLabel}
  title={ariaLabel}
  aria-disabled={!hasAlternates}
>
  <span class="sr-only" aria-live="polite">{announcement}</span>
  <span class="quick-control__icon" aria-hidden="true">
    <Icon name="globe" size="var(--space-4)" />
  </span>
  <span class="quick-control__badge" aria-hidden="true">{currentShort}</span>
</button>
