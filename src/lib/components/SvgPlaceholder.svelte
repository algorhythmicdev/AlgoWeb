<script lang="ts">
  import { onMount } from 'svelte';
  export let label = 'Image';
  export let width = 1200;   // intrinsic for layout
  export let height = 750;
  export let radius = 12;

  const id = Math.random().toString(36).slice(2);
  const gradA = '#8b5cf6'; // brand violet
  const gradB = '#06b6d4'; // cyan
  let prefersReducedMotion = false;

  onMount(() => {
    const media = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => (prefersReducedMotion = media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  });
</script>

<svg {width} {height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label} placeholder`} style="display:block;border-radius:{radius}px;overflow:hidden;border:1px solid var(--border)">
  <defs>
    <linearGradient id={"g-"+id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color={gradA}/>
      <stop offset="100%" stop-color={gradB}/>
    </linearGradient>
    <linearGradient id={"s-"+id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0)" />
      <stop offset="50%" stop-color="rgba(255,255,255,.22)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </linearGradient>
    <pattern id={"hatch-"+id} patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">
      <rect width="14" height="14" fill="rgba(0,0,0,.15)"/>
      <path d="M 0 0 L 0 14 M 7 0 L 7 14" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
    </pattern>
  </defs>

  <rect x="0" y="0" width={width} height={height} fill={`url(#g-${id})`} opacity="0.25"/>
  <rect x="0" y="0" width={width} height={height} fill={`url(#hatch-${id})`} />
  <g>
    <rect x={width*0.08} y={height*0.74} width={width*0.84} height={height*0.16} rx="10" fill="rgba(0,0,0,.25)"/>
    <text x="50%" y="86%" text-anchor="middle" fill="rgba(255,255,255,.85)" style="font: 600 28px Montserrat, system-ui">{label}</text>
  </g>

  <!-- Shimmer sweep -->
  {#if prefersReducedMotion}
    <rect x="-30%" y="-5%" width="60%" height="110%" fill={`url(#s-${id})`} opacity="0.35" />
  {:else}
    <rect x="-30%" y="-5%" width="60%" height="110%" fill={`url(#s-${id})`}>
      <animate attributeName="x" values="-30%;100%" dur="2.8s" repeatCount="indefinite"/>
    </rect>
  {/if}
</svg>
