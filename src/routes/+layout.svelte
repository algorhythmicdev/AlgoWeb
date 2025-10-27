<script>
  import '$lib/styles/theme.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="header surface-1 control"><div class="container"><Navigation /></div></div>
<div class="container surface-0"><slot /></div>
<Footer />
