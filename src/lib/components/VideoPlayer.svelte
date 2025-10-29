<script lang="ts">
  import { asset } from '$app/paths';
  export let srcWebm: string;    // '/videos/algorhythmics.webm'
  export let poster: string | null = null;
  export let className = '';
  $: webm = asset(srcWebm);
  $: posterUrl = poster ? asset(poster) : null;
</script>

<video
  class={`ratio-16x9 ${className}`}
  poster={posterUrl}
  autoplay
  muted
  loop
  playsinline
  preload="metadata">
  <source src={webm} type="video/webm" />
</video>

<style>
  video { background: var(--bg-elev-2); }
</style>
