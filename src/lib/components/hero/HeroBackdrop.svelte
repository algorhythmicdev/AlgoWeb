<script>
  import { parallax } from '$utils/animations';

  const VARIANT_MAP = new Map([
    ['aurora-flow', 'aurora-flow'],
    ['aurora', 'aurora-flow'],
    ['grid-ripple', 'grid-ripple'],
    ['mesh', 'grid-ripple'],
    ['glass-parallax', 'glass-parallax'],
    ['prism', 'glass-parallax'],
    ['particle-drift', 'particle-drift'],
    ['constellation', 'particle-drift'],
    ['line-sweep', 'line-sweep'],
    ['wave', 'line-sweep'],
    ['spotlight', 'spotlight']
  ]);

  export let variant =
    /**
     * @type {'aurora-flow' | 'glass-parallax' | 'grid-ripple' | 'particle-drift' | 'line-sweep' | 'spotlight' | 'aurora' | 'mesh' | 'wave' | 'prism' | 'constellation'}
     */
    ('aurora-flow');
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

  $: resolvedVariant = VARIANT_MAP.get(variant) ?? 'aurora-flow';
  $: toneClass = tone ? `hero-backdrop--tone-${tone}` : '';
  $: intensityClass = intensity ? `hero-backdrop--intensity-${intensity}` : '';
  $: baseClasses = ['hero-backdrop', `hero-backdrop--${resolvedVariant}`, toneClass, intensityClass, className]
    .filter(Boolean)
    .join(' ');
  $: particleCount =
    resolvedVariant === 'grid-ripple'
      ? 22
      : resolvedVariant === 'particle-drift'
        ? 26
        : resolvedVariant === 'glass-parallax'
          ? 18
          : 14;
  $: scatter = resolvedVariant === 'grid-ripple'
    ? createScatter(particleCount, 0.42)
    : resolvedVariant === 'glass-parallax'
      ? createScatter(particleCount, 0.38, -0.05)
      : resolvedVariant === 'particle-drift'
        ? createScatter(particleCount, 0.52)
        : [];
</script>

<div class={baseClasses} aria-hidden="true">
  {#if resolvedVariant === 'aurora-flow'}
    <span class="hero-backdrop__halo hero-backdrop__halo--aurora-primary"></span>
    <span class="hero-backdrop__halo hero-backdrop__halo--aurora-secondary"></span>
    <span class="hero-backdrop__beam hero-backdrop__beam--aurora"></span>
    <span class="hero-backdrop__spray hero-backdrop__spray--aurora"></span>
  {:else if resolvedVariant === 'grid-ripple'}
    <span class="hero-backdrop__grid hero-backdrop__grid--ripple"></span>
    <div class="hero-backdrop__rings hero-backdrop__rings--ripple">
      <span></span>
      <span></span>
    </div>
    <div class="hero-backdrop__particles hero-backdrop__particles--ripple">
      {#each scatter as particle, index (index)}
        <span
          class="hero-backdrop__particle hero-backdrop__particle--ripple"
          style={`top:${particle.top};left:${particle.left};animation-delay:${particle.delay}s;`}
        ></span>
      {/each}
    </div>
  {:else if resolvedVariant === 'glass-parallax'}
    <div class="hero-backdrop__glass hero-backdrop__glass--one" use:parallax={{ intensity: 18 }}></div>
    <div class="hero-backdrop__glass hero-backdrop__glass--two" use:parallax={{ intensity: 26 }}></div>
    <div class="hero-backdrop__glass hero-backdrop__glass--three" use:parallax={{ intensity: 14 }}></div>
    <div class="hero-backdrop__glints">
      {#each scatter as glint, index (index)}
        <span
          class="hero-backdrop__glint"
          style={`top:${glint.top};left:${glint.left};animation-delay:${glint.delay}s;`}
        ></span>
      {/each}
    </div>
  {:else if resolvedVariant === 'line-sweep'}
    <span class="hero-backdrop__sweep hero-backdrop__sweep--base"></span>
    <span class="hero-backdrop__sweep hero-backdrop__sweep--accent"></span>
    <span class="hero-backdrop__sweep hero-backdrop__sweep--glare"></span>
  {:else if resolvedVariant === 'spotlight'}
    <span class="hero-backdrop__halo hero-backdrop__halo--spotlight"></span>
    <span class="hero-backdrop__ring hero-backdrop__ring--pulse"></span>
    <div class="hero-backdrop__rays">
      <span></span>
      <span></span>
      <span></span>
    </div>
  {:else if resolvedVariant === 'particle-drift'}
    <span class="hero-backdrop__grid hero-backdrop__grid--particle"></span>
    <div class="hero-backdrop__nodes">
      {#each constellationNodes as node, index (index)}
        <span
          class={`hero-backdrop__node ${index === 0 || index === 3 ? 'hero-backdrop__node--major' : 'hero-backdrop__node--minor'}`}
          style={`top:${node.top};left:${node.left};width:${node.size};height:${node.size};`}
        ></span>
      {/each}
    </div>
    <div class="hero-backdrop__particles hero-backdrop__particles--drift">
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

  /* Aurora flow variant */
  .hero-backdrop--aurora-flow .hero-backdrop__halo--aurora-primary {
    width: clamp(28rem, 60vw, 42rem);
    height: clamp(28rem, 60vw, 42rem);
    background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--hero-accent) 72%, transparent 28%) 0%, transparent 68%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.4));
    opacity: var(--hero-backdrop-opacity);
    animation: auroraDrift 18s ease-in-out infinite alternate;
  }

  .hero-backdrop--aurora-flow .hero-backdrop__halo--aurora-secondary {
    width: clamp(24rem, 52vw, 36rem);
    height: clamp(24rem, 52vw, 36rem);
    background: radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--hero-tertiary) 65%, transparent 35%) 0%, transparent 70%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.32));
    opacity: calc(var(--hero-backdrop-opacity) * 0.75);
    animation: auroraDrift 22s ease-in-out infinite alternate-reverse;
  }

  .hero-backdrop--aurora-flow .hero-backdrop__beam--aurora {
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

  .hero-backdrop--aurora-flow .hero-backdrop__spray--aurora {
    width: 120%;
    height: 120%;
    background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--hero-secondary) 35%, transparent 65%) 0%, transparent 65%);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.32));
    opacity: calc(var(--hero-backdrop-opacity) * 0.45);
    animation: auroraPulse 12s ease-in-out infinite;
  }
  /* Grid ripple variant */
  .hero-backdrop--grid-ripple .hero-backdrop__grid--ripple {
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

  .hero-backdrop--grid-ripple .hero-backdrop__rings--ripple {
    width: clamp(30rem, 70vw, 48rem);
    height: clamp(30rem, 70vw, 48rem);
    margin: auto;
  }

  .hero-backdrop--grid-ripple .hero-backdrop__rings--ripple span {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px dashed color-mix(in srgb, var(--hero-grid-line-strong-color) 60%, transparent 40%);
    opacity: 0.65;
    animation: ripplePulse 18s ease-in-out infinite;
  }

  .hero-backdrop--grid-ripple .hero-backdrop__rings--ripple span:nth-child(2) {
    transform: rotate(42deg) scale(0.8);
    animation-duration: 24s;
  }

  .hero-backdrop--grid-ripple .hero-backdrop__particles--ripple {
    width: 0;
    height: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .hero-backdrop--grid-ripple .hero-backdrop__particle--ripple {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--hero-accent) 80%, transparent 20%);
    box-shadow: 0 0 12px color-mix(in srgb, var(--hero-accent) 40%, transparent 60%);
    opacity: 0;
    animation: particleTwinkle 12s ease-in-out infinite;
  }

  .hero-backdrop--grid-ripple .hero-backdrop__particle--ripple:nth-child(odd) {
    animation-duration: 14s;
  }

  .hero-backdrop--grid-ripple .hero-backdrop__particle--ripple:nth-child(3n) {
    animation-delay: 1.6s;
  }

  /* Glass parallax variant */
  .hero-backdrop--glass-parallax .hero-backdrop__glass {
    position: absolute;
    inset: auto;
    border-radius: clamp(1.5rem, 4vw, 2.75rem);
    background: linear-gradient(135deg, color-mix(in srgb, var(--hero-overlay-highlight) 70%, transparent 30%) 0%, color-mix(in srgb, var(--hero-accent) 15%, transparent 85%) 100%);
    border: 1px solid color-mix(in srgb, var(--hero-ring-border) 60%, rgba(255, 255, 255, 0.22) 40%);
    backdrop-filter: blur(22px);
    box-shadow:
      0 28px 60px rgba(15, 23, 42, 0.24),
      inset 0 0 0 1px rgba(255, 255, 255, 0.18);
    opacity: calc(var(--hero-backdrop-opacity) * 0.8);
    transform: translate3d(0, 0, 0);
    will-change: transform;
  }

  .hero-backdrop--glass-parallax .hero-backdrop__glass--one {
    width: clamp(18rem, 42vw, 28rem);
    height: clamp(12rem, 32vw, 20rem);
    top: 6%;
    left: 6%;
  }

  .hero-backdrop--glass-parallax .hero-backdrop__glass--two {
    width: clamp(16rem, 38vw, 24rem);
    height: clamp(11rem, 28vw, 18rem);
    top: 36%;
    right: 10%;
    background: linear-gradient(135deg, color-mix(in srgb, var(--hero-overlay-highlight) 58%, transparent 42%) 0%, color-mix(in srgb, var(--hero-secondary) 24%, transparent 76%) 100%);
  }

  .hero-backdrop--glass-parallax .hero-backdrop__glass--three {
    width: clamp(14rem, 34vw, 20rem);
    height: clamp(10rem, 24vw, 16rem);
    bottom: 4%;
    left: 24%;
    background: linear-gradient(140deg, color-mix(in srgb, var(--hero-overlay-highlight) 52%, transparent 48%) 0%, color-mix(in srgb, var(--hero-tertiary) 18%, transparent 82%) 100%);
  }

  .hero-backdrop--glass-parallax .hero-backdrop__glints {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hero-backdrop--glass-parallax .hero-backdrop__glint {
    position: absolute;
    width: 2px;
    height: clamp(1.5rem, 4vw, 2.25rem);
    background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.85) 40%, transparent 100%);
    opacity: 0;
    animation: glintBlink 6s ease-in-out infinite;
  }

  .hero-backdrop--glass-parallax .hero-backdrop__glint:nth-child(3n) {
    animation-duration: 8s;
  }

  .hero-backdrop--glass-parallax .hero-backdrop__glint:nth-child(4n) {
    animation-delay: 2s;
  }

  /* Line sweep variant */
  .hero-backdrop--line-sweep .hero-backdrop__sweep {
    position: absolute;
    inset: 0;
    margin: auto;
    width: clamp(24rem, 64vw, 38rem);
    height: clamp(12rem, 30vw, 18rem);
    border-radius: clamp(2rem, 5vw, 3.25rem);
    opacity: calc(var(--hero-backdrop-opacity) * 0.6);
    filter: blur(calc(var(--hero-backdrop-blur) * 0.18));
    transform: translate3d(0, 0, 0);
  }

  .hero-backdrop--line-sweep .hero-backdrop__sweep--base {
    background: linear-gradient(130deg, color-mix(in srgb, var(--hero-accent) 65%, transparent 35%) 0%, transparent 80%);
    animation: lineSweep 22s ease-in-out infinite;
  }

  .hero-backdrop--line-sweep .hero-backdrop__sweep--accent {
    background: linear-gradient(140deg, color-mix(in srgb, var(--hero-secondary) 55%, transparent 45%) 0%, transparent 82%);
    animation: lineSweep 24s ease-in-out infinite reverse;
  }

  .hero-backdrop--line-sweep .hero-backdrop__sweep--glare {
    width: clamp(28rem, 70vw, 46rem);
    height: clamp(14rem, 32vw, 20rem);
    background: linear-gradient(150deg, transparent 10%, rgba(255, 255, 255, 0.35) 45%, transparent 90%);
    mix-blend-mode: screen;
    opacity: calc(var(--hero-backdrop-opacity) * 0.35);
    animation: lineGlare 26s linear infinite;
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

  /* Particle drift variant */
  .hero-backdrop--particle-drift .hero-backdrop__grid--particle {
    width: 120%;
    height: 120%;
    background:
      repeating-linear-gradient(0deg, color-mix(in srgb, var(--hero-grid-line-color) 50%, transparent 50%) 0 1px, transparent 1px 48px),
      repeating-linear-gradient(90deg, color-mix(in srgb, var(--hero-grid-line-color) 35%, transparent 65%) 0 1px, transparent 1px 48px);
    opacity: calc(var(--hero-backdrop-opacity) * 0.35);
    transform: translate(-10%, -10%);
    animation: meshSpin 48s linear infinite;
  }

  .hero-backdrop--particle-drift .hero-backdrop__nodes {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
  }

  .hero-backdrop--particle-drift .hero-backdrop__node {
    position: absolute;
    border-radius: 50%;
    background: color-mix(in srgb, var(--hero-accent) 85%, transparent 15%);
    box-shadow: 0 0 16px color-mix(in srgb, var(--hero-accent) 35%, transparent 65%);
    opacity: 0.9;
    animation: constellationTwinkle 12s ease-in-out infinite;
  }

  .hero-backdrop--particle-drift .hero-backdrop__node--major {
    box-shadow:
      0 0 18px color-mix(in srgb, var(--hero-accent) 45%, transparent 55%),
      0 0 32px color-mix(in srgb, var(--hero-secondary) 25%, transparent 75%);
    animation-duration: 18s;
  }

  .hero-backdrop--particle-drift .hero-backdrop__particles--drift {
    width: 0;
    height: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .hero-backdrop--particle-drift .hero-backdrop__particle--star {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--hero-tertiary) 75%, transparent 25%);
    opacity: 0;
    animation: constellationParticle 20s linear infinite;
  }

  .hero-backdrop--particle-drift .hero-backdrop__particle--star:nth-child(odd) {
    animation-duration: 24s;
  }

  .hero-backdrop--particle-drift .hero-backdrop__particles--drift::after {
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
    --hero-accent: var(--cherry-pop);
  }

  .hero-backdrop--tone-atlantic {
    --hero-accent: color-mix(in srgb, var(--voyage-blue) 70%, var(--aurora-purple) 30%);
  }

  .hero-backdrop--tone-evergreen {
    --hero-accent: color-mix(in srgb, var(--accent-secondary, var(--voyage-blue)) 65%, var(--accent-primary, var(--aurora-purple)) 35%);
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

  @keyframes ripplePulse {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      opacity: 0.65;
    }
    50% {
      transform: scale(0.9) rotate(14deg);
      opacity: 0.4;
    }
  }

  @keyframes particleTwinkle {
    0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
    20% { opacity: 1; }
    50% { transform: translate(6px, -6px) scale(1.1); }
    80% { opacity: 0.4; }
    100% { opacity: 0; transform: translate(-4px, 4px) scale(0.8); }
  }

  @keyframes glintBlink {
    0% { opacity: 0; transform: translateY(12px) scaleY(0.6); }
    35% { opacity: 0.8; }
    60% { opacity: 0; transform: translateY(-12px) scaleY(1.1); }
    100% { opacity: 0; transform: translateY(18px) scaleY(0.4); }
  }

  @keyframes lineSweep {
    0% { transform: translate3d(-12%, -6%, 0) rotate(-6deg); }
    50% { transform: translate3d(10%, 4%, 0) rotate(4deg); }
    100% { transform: translate3d(-8%, -3%, 0) rotate(-5deg); }
  }

  @keyframes lineGlare {
    0% { transform: translateX(-60%) rotate(-12deg); opacity: 0; }
    35% { opacity: calc(var(--hero-backdrop-opacity) * 0.4); }
    70% { opacity: calc(var(--hero-backdrop-opacity) * 0.2); }
    100% { transform: translateX(60%) rotate(12deg); opacity: 0; }
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

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop {
    mix-blend-mode: normal;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop__halo,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop__beam,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop__grid,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop__glass,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop__sweep,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop__particle,
  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop__glint {
    opacity: 0.65;
  }

  :global([data-base-theme='dark']) .hero-backdrop--line-sweep {
    mix-blend-mode: lighten;
  }

  :global(:is([data-theme='hc'], [data-theme='contrast'], [data-theme-legacy='contrast'])) .hero-backdrop--line-sweep {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-backdrop__halo,
    .hero-backdrop__beam,
    .hero-backdrop__spray,
    .hero-backdrop__grid,
    .hero-backdrop__ring,
    .hero-backdrop__particle,
    .hero-backdrop__rays span,
    .hero-backdrop__glass,
    .hero-backdrop__sweep,
    .hero-backdrop__glint {
      animation: none !important;
      transform: none !important;
    }
  }
</style>
