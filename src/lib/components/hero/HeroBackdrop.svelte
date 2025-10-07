<script>
  const SUPPORTED = new Set(['aurora', 'mesh', 'wave', 'prism', 'spotlight', 'constellation']);

  export let variant = /** @type {'aurora' | 'mesh' | 'wave' | 'prism' | 'spotlight' | 'constellation'} */ ('aurora');
  export let tone = /** @type {'primary' | 'aurora' | 'citrus' | 'crimson' | 'atlantic' | 'evergreen'} */ ('primary');
  export let intensity = /** @type {'soft' | 'balanced' | 'bold'} */ ('balanced');
  export let className = '';

  /** @param {number} deg */
  const toRad = (deg) => (deg * Math.PI) / 180;

  /**
   * @param {number} count
   * @param {number} radiusScale
   * @param {number} yBias
   */
  const createScatter = (count, radiusScale = 0.45, yBias = 0) =>
    Array.from({ length: Math.max(count, 0) }, (_, index) => {
      const angle = (index * 137.5) % 360;
      const radius = 0.18 + (index / Math.max(count, 1)) * radiusScale;
      const sin = Math.sin(toRad(angle));
      const cos = Math.cos(toRad(angle));
      const top = 50 + (sin * radius + yBias) * 50;
      const left = 50 + cos * radius * 50;
      return {
        top: `${Math.min(92, Math.max(8, top))}%`,
        left: `${Math.min(92, Math.max(8, left))}%`,
        delay: ((index % 7) + 1) * 0.35
      };
    });

  const constellationNodes = [
    { top: '22%', left: '26%', size: '10px' },
    { top: '38%', left: '44%', size: '8px' },
    { top: '56%', left: '32%', size: '7px' },
    { top: '64%', left: '52%', size: '9px' },
    { top: '46%', left: '70%', size: '7px' }
  ];

  $: resolvedVariant = SUPPORTED.has(variant) ? variant : 'aurora';
  $: toneClass = tone ? `hero-backdrop--tone-${tone}` : '';
  $: intensityClass = intensity ? `hero-backdrop--intensity-${intensity}` : '';
  $: baseClasses = ['hero-backdrop', `hero-backdrop--${resolvedVariant}`, toneClass, intensityClass, className]
    .filter(Boolean)
    .join(' ');
  $: particleCount = resolvedVariant === 'mesh' ? 22 : resolvedVariant === 'constellation' ? 26 : resolvedVariant === 'prism' ? 18 : 14;
  $: scatter = resolvedVariant === 'mesh'
    ? createScatter(particleCount, 0.42)
    : resolvedVariant === 'prism'
      ? createScatter(particleCount, 0.38, -0.05)
      : resolvedVariant === 'constellation'
        ? createScatter(particleCount, 0.52)
        : [];
</script>

<div class={baseClasses} aria-hidden="true">
  {#if resolvedVariant === 'aurora'}
    <span class="hero-backdrop__halo hero-backdrop__halo--aurora-primary"></span>
    <span class="hero-backdrop__halo hero-backdrop__halo--aurora-secondary"></span>
    <span class="hero-backdrop__beam hero-backdrop__beam--aurora"></span>
    <span class="hero-backdrop__spray hero-backdrop__spray--aurora"></span>
  {:else if resolvedVariant === 'mesh'}
    <span class="hero-backdrop__grid hero-backdrop__grid--mesh"></span>
    <div class="hero-backdrop__rings hero-backdrop__rings--mesh">
      <span></span>
      <span></span>
    </div>
    <div class="hero-backdrop__particles hero-backdrop__particles--mesh">
      {#each scatter as particle, index (index)}
        <span
          class="hero-backdrop__particle"
          style={`top:${particle.top};left:${particle.left};animation-delay:${particle.delay}s;`}
        ></span>
      {/each}
    </div>
  {:else if resolvedVariant === 'wave'}
    <span class="hero-backdrop__wave hero-backdrop__wave--one"></span>
    <span class="hero-backdrop__wave hero-backdrop__wave--two"></span>
    <span class="hero-backdrop__wave hero-backdrop__wave--accent"></span>
    <div class="hero-backdrop__spark-lines">
      <span></span>
      <span></span>
    </div>
  {:else if resolvedVariant === 'prism'}
    <div class="hero-backdrop__prisms">
      <span class="hero-backdrop__prism hero-backdrop__prism--one"></span>
      <span class="hero-backdrop__prism hero-backdrop__prism--two"></span>
      <span class="hero-backdrop__prism hero-backdrop__prism--three"></span>
    </div>
    <span class="hero-backdrop__halo hero-backdrop__halo--prism"></span>
    <div class="hero-backdrop__particles hero-backdrop__particles--prism">
      {#each scatter as particle, index (index)}
        <span
          class="hero-backdrop__particle hero-backdrop__particle--prism"
          style={`top:${particle.top};left:${particle.left};animation-delay:${particle.delay}s;`}
        ></span>
      {/each}
    </div>
  {:else if resolvedVariant === 'spotlight'}
    <span class="hero-backdrop__halo hero-backdrop__halo--spotlight"></span>
    <span class="hero-backdrop__ring hero-backdrop__ring--pulse"></span>
    <div class="hero-backdrop__rays">
      <span></span>
      <span></span>
      <span></span>
    </div>
  {:else if resolvedVariant === 'constellation'}
    <span class="hero-backdrop__grid hero-backdrop__grid--constellation"></span>
    <div class="hero-backdrop__nodes">
      {#each constellationNodes as node, index (index)}
        <span
          class={`hero-backdrop__node ${index === 0 || index === 3 ? 'hero-backdrop__node--major' : 'hero-backdrop__node--minor'}`}
          style={`top:${node.top};left:${node.left};width:${node.size};height:${node.size};`}
        ></span>
      {/each}
    </div>
    <div class="hero-backdrop__particles hero-backdrop__particles--constellation">
      {#each scatter as particle, index (index)}
        <span
          class="hero-backdrop__particle hero-backdrop__particle--star"
          style={`top:${particle.top};left:${particle.left};animation-delay:${particle.delay}s;`}
        ></span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .hero-backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: -1;
    mix-blend-mode: normal;
    --hero-backdrop-opacity: 0.72;
    --hero-backdrop-blur: clamp(120px, 20vw, 220px);
  }

  .hero-backdrop--intensity-soft {
    --hero-backdrop-opacity: 0.52;
  }

  .hero-backdrop--intensity-bold {
    --hero-backdrop-opacity: 0.85;
  }

  .hero-backdrop__halo,
  .hero-backdrop__beam,
  .hero-backdrop__spray,
  .hero-backdrop__grid,
  .hero-backdrop__ring,
  .hero-backdrop__wave,
  .hero-backdrop__prism {
    position: absolute;
    inset: 0;
    margin: auto;
    pointer-events: none;
  }

  .hero-backdrop__particles,
  .hero-backdrop__rings,
  .hero-backdrop__prisms,
  .hero-backdrop__rays,
  .hero-backdrop__spark-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hero-backdrop__particles,
  .hero-backdrop__nodes {
    width: 0;
    height: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  /* Aurora variant */
  .hero-backdrop--aurora .hero-backdrop__halo--aurora-primary {
    width: clamp(28rem, 60vw, 42rem);
    height: clamp(28rem, 60vw, 42rem);
    background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--hero-accent) 72%, transparent 28%) 0%, transparent 68%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.4));
    opacity: var(--hero-backdrop-opacity);
    animation: auroraDrift 18s ease-in-out infinite alternate;
  }

  .hero-backdrop--aurora .hero-backdrop__halo--aurora-secondary {
    width: clamp(24rem, 52vw, 36rem);
    height: clamp(24rem, 52vw, 36rem);
    background: radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--hero-tertiary) 65%, transparent 35%) 0%, transparent 70%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.32));
    opacity: calc(var(--hero-backdrop-opacity) * 0.75);
    animation: auroraDrift 22s ease-in-out infinite alternate-reverse;
  }

  .hero-backdrop--aurora .hero-backdrop__beam--aurora {
    width: 140%;
    height: clamp(12rem, 32vw, 20rem);
    background: conic-gradient(
      from 180deg,
      color-mix(in srgb, var(--hero-accent) 68%, transparent 32%) 0deg,
      transparent 90deg,
      color-mix(in srgb, var(--hero-secondary) 58%, transparent 42%) 140deg,
      transparent 250deg,
      color-mix(in srgb, var(--hero-tertiary) 58%, transparent 42%) 360deg
    );
    filter: blur(calc(var(--hero-backdrop-blur) * 0.25));
    opacity: calc(var(--hero-backdrop-opacity) * 0.6);
    animation: auroraSweep 24s linear infinite;
  }

  .hero-backdrop--aurora .hero-backdrop__spray--aurora {
    width: 120%;
    height: 120%;
    background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--hero-secondary) 35%, transparent 65%) 0%, transparent 65%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.32));
    opacity: calc(var(--hero-backdrop-opacity) * 0.45);
    animation: auroraPulse 12s ease-in-out infinite;
  }

  /* Mesh variant */
  .hero-backdrop--mesh .hero-backdrop__grid--mesh {
    width: clamp(26rem, 62vw, 44rem);
    height: clamp(26rem, 62vw, 44rem);
    border-radius: 50%;
    background:
      repeating-conic-gradient(
        from 0deg,
        color-mix(in srgb, var(--hero-grid-line-color) 65%, transparent 35%) 0deg 6deg,
        transparent 6deg 12deg
      );
    mask: radial-gradient(circle at center, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 45%, transparent 75%);
    opacity: calc(var(--hero-backdrop-opacity) * 0.6);
    animation: meshSpin 26s linear infinite;
  }

  .hero-backdrop--mesh .hero-backdrop__rings--mesh {
    width: clamp(30rem, 70vw, 48rem);
    height: clamp(30rem, 70vw, 48rem);
    margin: auto;
  }

  .hero-backdrop--mesh .hero-backdrop__rings--mesh span {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--hero-grid-line-strong-color) 60%, transparent 40%);
    opacity: 0.65;
    animation: meshFloat 18s ease-in-out infinite;
  }

  .hero-backdrop--mesh .hero-backdrop__rings--mesh span:nth-child(2) {
    transform: rotate(42deg) scale(0.8);
    animation-duration: 24s;
  }

  .hero-backdrop--mesh .hero-backdrop__particles--mesh {
    width: 0;
    height: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .hero-backdrop--mesh .hero-backdrop__particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--hero-accent) 80%, transparent 20%);
    box-shadow: 0 0 12px color-mix(in srgb, var(--hero-accent) 40%, transparent 60%);
    opacity: 0;
    animation: particleTwinkle 12s ease-in-out infinite;
  }

  .hero-backdrop--mesh .hero-backdrop__particle:nth-child(odd) {
    animation-duration: 14s;
  }

  .hero-backdrop--mesh .hero-backdrop__particle:nth-child(3n) {
    animation-delay: 1.6s;
  }

  /* Wave variant */
  .hero-backdrop--wave .hero-backdrop__wave {
    width: 140%;
    height: clamp(10rem, 26vw, 16rem);
    border-radius: 45% 55% 55% 45% / 60% 40% 60% 40%;
    opacity: calc(var(--hero-backdrop-opacity) * 0.65);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.25));
    animation: waveDrift 24s ease-in-out infinite;
  }

  .hero-backdrop--wave .hero-backdrop__wave--one {
    top: 18%;
    background: linear-gradient(120deg, color-mix(in srgb, var(--hero-accent) 55%, transparent 45%) 0%, transparent 80%);
  }

  .hero-backdrop--wave .hero-backdrop__wave--two {
    top: 54%;
    animation-duration: 28s;
    animation-direction: reverse;
    background: linear-gradient(140deg, color-mix(in srgb, var(--hero-secondary) 55%, transparent 45%) 0%, transparent 85%);
  }

  .hero-backdrop--wave .hero-backdrop__wave--accent {
    width: 120%;
    top: 40%;
    background: linear-gradient(120deg, color-mix(in srgb, var(--hero-tertiary) 42%, transparent 58%) 0%, transparent 75%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.18));
    animation-duration: 20s;
    animation-direction: alternate;
  }

  .hero-backdrop--wave .hero-backdrop__spark-lines {
    width: 100%;
    height: 100%;
  }

  .hero-backdrop--wave .hero-backdrop__spark-lines span {
    position: absolute;
    width: clamp(12rem, 34vw, 20rem);
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--hero-accent) 80%, transparent 20%) 40%, transparent 100%);
    left: 20%;
    top: 28%;
    transform-origin: left center;
    animation: waveSpark 14s linear infinite;
  }

  .hero-backdrop--wave .hero-backdrop__spark-lines span:nth-child(2) {
    top: 70%;
    left: auto;
    right: 18%;
    transform-origin: right center;
    animation-duration: 18s;
    animation-direction: reverse;
  }

  /* Prism variant */
  .hero-backdrop--prism .hero-backdrop__prisms {
    width: 100%;
    height: 100%;
  }

  .hero-backdrop--prism .hero-backdrop__prism {
    position: absolute;
    width: clamp(7rem, 20vw, 12rem);
    height: clamp(9rem, 24vw, 16rem);
    background: linear-gradient(140deg, color-mix(in srgb, var(--hero-accent) 75%, transparent 25%) 0%, color-mix(in srgb, var(--hero-secondary) 60%, transparent 40%) 100%);
    opacity: calc(var(--hero-backdrop-opacity) * 0.7);
    clip-path: polygon(15% 0%, 85% 0%, 100% 65%, 50% 100%, 0% 65%);
    filter: drop-shadow(0 24px 60px color-mix(in srgb, var(--hero-accent) 35%, transparent 65%));
    animation: prismFloat 20s ease-in-out infinite;
  }

  .hero-backdrop--prism .hero-backdrop__prism--one {
    left: 18%;
    top: 10%;
  }

  .hero-backdrop--prism .hero-backdrop__prism--two {
    right: 14%;
    top: 22%;
    animation-duration: 24s;
  }

  .hero-backdrop--prism .hero-backdrop__prism--three {
    left: 32%;
    top: 46%;
    width: clamp(8rem, 24vw, 14rem);
    height: clamp(10rem, 28vw, 18rem);
    animation-duration: 26s;
  }

  .hero-backdrop--prism .hero-backdrop__halo--prism {
    width: clamp(28rem, 62vw, 42rem);
    height: clamp(28rem, 62vw, 42rem);
    background: radial-gradient(circle, color-mix(in srgb, var(--hero-accent) 58%, transparent 42%) 0%, transparent 70%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.28));
    opacity: calc(var(--hero-backdrop-opacity) * 0.6);
    animation: prismGlow 18s ease-in-out infinite;
  }

  .hero-backdrop--prism .hero-backdrop__particles--prism {
    width: 0;
    height: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .hero-backdrop--prism .hero-backdrop__particle--prism {
    position: absolute;
    width: 4px;
    height: 12px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--hero-secondary) 80%, transparent 20%);
    opacity: 0;
    transform-origin: center;
    animation: prismShard 16s linear infinite;
  }

  .hero-backdrop--prism .hero-backdrop__particle--prism:nth-child(odd) {
    animation-duration: 20s;
  }

  /* Spotlight variant */
  .hero-backdrop--spotlight .hero-backdrop__halo--spotlight {
    width: clamp(26rem, 58vw, 40rem);
    height: clamp(26rem, 58vw, 40rem);
    background: radial-gradient(circle, color-mix(in srgb, var(--hero-accent) 75%, transparent 25%) 0%, transparent 68%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.35));
    opacity: var(--hero-backdrop-opacity);
    animation: spotlightPulse 14s ease-in-out infinite;
  }

  .hero-backdrop--spotlight .hero-backdrop__ring--pulse {
    width: clamp(20rem, 44vw, 32rem);
    height: clamp(20rem, 44vw, 32rem);
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--hero-secondary) 65%, transparent 35%);
    opacity: calc(var(--hero-backdrop-opacity) * 0.6);
    animation: spotlightPulse 10s ease-in-out infinite reverse;
  }

  .hero-backdrop--spotlight .hero-backdrop__rays {
    width: 100%;
    height: 100%;
  }

  .hero-backdrop--spotlight .hero-backdrop__rays span {
    position: absolute;
    width: clamp(18rem, 48vw, 30rem);
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--hero-tertiary) 80%, transparent 20%) 40%, transparent 100%);
    left: 50%;
    top: 50%;
    transform-origin: left center;
    animation: spotlightSpin 18s linear infinite;
  }

  .hero-backdrop--spotlight .hero-backdrop__rays span:nth-child(2) {
    transform-origin: right center;
    animation-duration: 20s;
    animation-direction: reverse;
  }

  .hero-backdrop--spotlight .hero-backdrop__rays span:nth-child(3) {
    transform-origin: center;
    animation-duration: 24s;
    opacity: 0.6;
  }

  /* Constellation variant */
  .hero-backdrop--constellation .hero-backdrop__grid--constellation {
    width: 120%;
    height: 120%;
    background:
      repeating-linear-gradient(0deg, color-mix(in srgb, var(--hero-grid-line-color) 50%, transparent 50%) 0 1px, transparent 1px 48px),
      repeating-linear-gradient(90deg, color-mix(in srgb, var(--hero-grid-line-color) 35%, transparent 65%) 0 1px, transparent 1px 48px);
    opacity: calc(var(--hero-backdrop-opacity) * 0.35);
    transform: translate(-10%, -10%);
    animation: meshSpin 48s linear infinite;
  }

  .hero-backdrop--constellation .hero-backdrop__nodes {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
  }

  .hero-backdrop--constellation .hero-backdrop__node {
    position: absolute;
    border-radius: 50%;
    background: color-mix(in srgb, var(--hero-accent) 85%, transparent 15%);
    box-shadow: 0 0 16px color-mix(in srgb, var(--hero-accent) 35%, transparent 65%);
    opacity: 0.9;
    animation: constellationTwinkle 12s ease-in-out infinite;
  }

  .hero-backdrop--constellation .hero-backdrop__node--major {
    box-shadow:
      0 0 18px color-mix(in srgb, var(--hero-accent) 45%, transparent 55%),
      0 0 32px color-mix(in srgb, var(--hero-secondary) 25%, transparent 75%);
    animation-duration: 18s;
  }

  .hero-backdrop--constellation .hero-backdrop__particles--constellation {
    width: 0;
    height: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .hero-backdrop--constellation .hero-backdrop__particle--star {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--hero-tertiary) 75%, transparent 25%);
    opacity: 0;
    animation: constellationParticle 20s linear infinite;
  }

  .hero-backdrop--constellation .hero-backdrop__particle--star:nth-child(odd) {
    animation-duration: 24s;
  }

  .hero-backdrop--constellation .hero-backdrop__particles--constellation::after {
    content: '';
    position: absolute;
    width: clamp(28rem, 64vw, 46rem);
    height: clamp(28rem, 64vw, 46rem);
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--hero-grid-line-strong-color) 60%, transparent 40%);
    opacity: 0.35;
    filter: blur(0.8px);
    animation: meshSpin 36s linear infinite;
  }

  /* Tone adjustments (inherit from wrapper but safe fallback) */
  .hero-backdrop--tone-aurora {
    --hero-accent: var(--aurora-purple);
  }

  .hero-backdrop--tone-citrus {
    --hero-accent: var(--signal-yellow);
  }

  .hero-backdrop--tone-crimson {
    --hero-accent: var(--cherry-red);
  }

  .hero-backdrop--tone-atlantic {
    --hero-accent: color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
  }

  .hero-backdrop--tone-evergreen {
    --hero-accent: color-mix(in srgb, #00a676 65%, var(--voyage-blue) 35%);
  }

  @keyframes auroraDrift {
    0% { transform: translate(-6%, -4%) scale(0.94); }
    50% { transform: translate(4%, 2%) scale(1.02); }
    100% { transform: translate(-3%, 6%) scale(0.96); }
  }

  @keyframes auroraSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes auroraPulse {
    0%, 100% { opacity: calc(var(--hero-backdrop-opacity) * 0.35); }
    50% { opacity: calc(var(--hero-backdrop-opacity) * 0.6); }
  }

  @keyframes meshSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes meshFloat {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(0.92) rotate(12deg); }
  }

  @keyframes particleTwinkle {
    0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
    20% { opacity: 1; }
    50% { transform: translate(6px, -6px) scale(1.1); }
    80% { opacity: 0.4; }
    100% { opacity: 0; transform: translate(-4px, 4px) scale(0.8); }
  }

  @keyframes waveDrift {
    0% { transform: translate(-12%, 0) rotate(-4deg); }
    50% { transform: translate(8%, -2%) rotate(3deg); }
    100% { transform: translate(-10%, 1%) rotate(-2deg); }
  }

  @keyframes waveSpark {
    0% { transform: scaleX(0.3) translateY(0); opacity: 0; }
    20% { opacity: 1; }
    50% { transform: scaleX(1) translateY(-8px); }
    100% { transform: scaleX(0.4) translateY(4px); opacity: 0; }
  }

  @keyframes prismFloat {
    0% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(4deg); }
    100% { transform: translateY(0) rotate(-3deg); }
  }

  @keyframes prismGlow {
    0%, 100% { opacity: calc(var(--hero-backdrop-opacity) * 0.55); }
    50% { opacity: calc(var(--hero-backdrop-opacity) * 0.75); }
  }

  @keyframes prismShard {
    0% { opacity: 0; transform: translate(-10px, 10px) scale(0.6) rotate(0deg); }
    20% { opacity: 1; }
    50% { transform: translate(6px, -8px) scale(1.05) rotate(18deg); }
    100% { opacity: 0; transform: translate(-12px, 12px) scale(0.7) rotate(-10deg); }
  }

  @keyframes spotlightPulse {
    0%, 100% { transform: scale(0.96); opacity: var(--hero-backdrop-opacity); }
    50% { transform: scale(1.05); opacity: calc(var(--hero-backdrop-opacity) * 0.8); }
  }

  @keyframes spotlightSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes constellationTwinkle {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  @keyframes constellationParticle {
    0% { opacity: 0; transform: scale(0.6); }
    20% { opacity: 1; }
    50% { transform: scale(1.2); }
    100% { opacity: 0; transform: scale(0.6); }
  }

  :global([data-theme='contrast']) .hero-backdrop {
    mix-blend-mode: normal;
  }

  :global([data-theme='contrast']) .hero-backdrop__halo,
  :global([data-theme='contrast']) .hero-backdrop__beam,
  :global([data-theme='contrast']) .hero-backdrop__grid,
  :global([data-theme='contrast']) .hero-backdrop__particle {
    opacity: 0.65;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-backdrop__halo,
    .hero-backdrop__beam,
    .hero-backdrop__spray,
    .hero-backdrop__grid,
    .hero-backdrop__ring,
    .hero-backdrop__wave,
    .hero-backdrop__prism,
    .hero-backdrop__particle,
    .hero-backdrop__rays span,
    .hero-backdrop__spark-lines span,
    .hero-backdrop__prism {
      animation: none !important;
    }
  }
</style>
