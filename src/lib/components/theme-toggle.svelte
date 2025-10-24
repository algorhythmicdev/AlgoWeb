<script lang="ts">
  import { onMount } from 'svelte';
  import { applyTheme, cycleTheme, loadTheme, type Theme } from '$lib/theme';

  let theme: Theme = 'light';

  function apply(t: Theme) {
    theme = t;
    applyTheme(t);
  }

  function cycle() {
    theme = cycleTheme(theme);
  }

  onMount(() => {
    const saved = loadTheme('light');
    apply(saved);
  });
</script>

<button
  type="button"
  aria-label="Toggle theme"
  class="btn-icon"
  on:click={cycle}
>
  <span aria-hidden="true">{theme}</span>
</button>
