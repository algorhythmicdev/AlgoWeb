<script>
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import '$lib/styles/theme.css';
  import '$lib/styles/reading.css';
</script>

<div class="header"><div class="container"><Navigation /></div></div>
<div class="container"><slot /></div>
<Footer />
