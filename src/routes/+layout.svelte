<script lang="ts">
  import '$lib/styles/theme.css';
  import '$lib/styles/global.css';
  import '$lib/styles/typography.css';
  import '$lib/styles/forms.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<Navigation />

<slot />

<Footer />
