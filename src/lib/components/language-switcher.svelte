<script lang="ts">
  import { onMount } from 'svelte';
  import { _, setLocale } from '$lib/i18n';

  const LOCALES = ['en', 'lv', 'ru'] as const;
  type Locale = (typeof LOCALES)[number];

  function setCookie(name: string, value: string, days = 365) {
    if (typeof document === 'undefined') return;

    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    return document.cookie.split('; ').find((x) => x.startsWith(name + '='))?.split('=')[1] ?? null;
  }

  let locale: Locale = 'en';

  function apply(l: Locale) {
    locale = l;
    setLocale(l);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = l;
    }

    setCookie('locale', l);
  }

  onMount(() => {
    const saved = getCookie('locale');
    if (saved && LOCALES.includes(saved as Locale)) {
      apply(saved as Locale);
    } else {
      apply('en');
    }
  });

  function handleChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as Locale;
    apply(value);
  }
</script>

<label class="visually-hidden" for="locale">{$_('language.label') || 'Language'}</label>
<select id="locale" bind:value={locale} on:change={handleChange}>
  {#each LOCALES as l}
    <option value={l}>{l.toUpperCase()}</option>
  {/each}
</select>
