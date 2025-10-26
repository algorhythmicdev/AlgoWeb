<script lang="ts">
  import { Head } from '$lib/seo';
  import GalleryPreview from '$lib/components/GalleryPreview.svelte';
  import { ideonautixPreviews } from '$lib/assets';
  const head = Head({ title:'Ideonautix', description:'Startup education & productivity toolkit.' });
  const features = ['Pitch Assistant','Competitive Intelligence','Pomodoro Coach','Smart Standups','Revenue Dashboard'];
</script>

<svelte:head>{@html head}</svelte:head>

<main id="main" class="prose">
  <h1>Ideonautix</h1>
  <p>Overview and mission in plain language. Built for students, founders, and teams.</p>
  <h2>Features</h2>
  <ul>{#each features as f}<li>{f}</li>{/each}</ul>
  <h2>Preview</h2>
  <GalleryPreview items={ideonautixPreviews} />
</main>
