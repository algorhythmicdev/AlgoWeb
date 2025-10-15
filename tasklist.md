# Remaining Work for Glass UI Refresh

> ✅ **Status:** All follow-ups below have been implemented and verified as of this pass. Tests were re-run to confirm the bundle still builds cleanly.

This checklist tracks the outstanding follow-ups needed to finish the dark theme + glass redesign. Each task includes context, the relevant source snippet, and space to tick off progress once complete.

## 🎨 Design Tokens & Theming
- [x] **Resolve conflicting outreach accent tokens**
  _Context:_ `body.page-outreach` is declared twice in `src/lib/styles/global.css`. The second block (lines 95-98) overwrites the NodeVoyage accent palette established on lines 89-93, so the outreach pages never inherit the travel blue/yellow blend that the particle network expects.
  _Snippet:_
  ```css
  body.page-outreach,
  body.page-nodevoyage {
    --accent-primary: var(--nodevoyage-accent);
    --accent-secondary: var(--nodevoyage-highlight);
  }

  body.page-outreach {
    --accent-primary: var(--aurora);
    --accent-secondary: var(--signal);
  }
  ```
  _Next step:_ decide which palette the outreach route should own, remove the duplicate block, and ensure the particle animation picks up the corrected values.

- [x] **Backfill tertiary accent tokens for route palettes**
  _Context:_ The updated particle renderer now reads `--accent-tertiary` to complete the brand cycle, but several `body.page-*` palettes in `src/lib/styles/global.css` only set primary and secondary accents. Without the tertiary token, the animation falls back to the default yellow and skips route-specific highlights.
  _Snippet:_
  ```css
  body.page-products {
    --accent-primary: var(--aurora);
    --accent-secondary: var(--voyage);
    --accent-tertiary: var(--signal);
  }
  ```
  _Next step:_ Define `--accent-tertiary` alongside the other accent tokens for every themed route so the canvas always cycles through the intended triad.

## 🧼 CSS Cleanup
- [x] **Remove the unused gradient heading animation**
  _Context:_ `@keyframes bar-pan` and the `.heading` helper in `src/lib/styles/global.css` (lines 355-388) were part of the pre-refresh hero styles, but no template still references `class="heading"`. Keeping them around reintroduces a background gradient the client explicitly asked to retire.  
  _Snippet:_
  ```css
  /* Gradient bar animation */
  @keyframes bar-pan {
    from { background-position: 0% 50%; }
    to   { background-position: 100% 50%; }
  }

  .heading::after {
    background: linear-gradient(var(--grad-angle), var(--grad-a), var(--grad-b));
    animation: bar-pan var(--bar-speed, 16s) ease-in-out infinite alternate;
  }
  ```
  _Next step:_ delete the helper + keyframes and verify no bundler warnings remain.

- [x] **Strip out the legacy magnetic-card animation block**
  _Context:_ The entire `.magnetic-card` rule set in `src/lib/styles/animations.css` (lines 109-220) and the orphaned `@keyframes halo-pulse` definition (lines 86-94) are unused now that every surface runs through `<GlassCard>`. They keep gradient overlays and long-running animations in the bundle despite the request to remove leftover effects.  
  _Snippet:_
  ```css
  @keyframes halo-pulse { … }

  .magnetic-card {
    background: color-mix(...);
    /* gradient halo + hover animation */
  }

  @keyframes magnetic-card-halo { … }
  ```
  _Next step:_ excise the unused styles and confirm the navigation shell (the only consumer of `.os-window`) still renders correctly.

## ✅ QA & Regression
- [x] **Re-run the project checks once the clean-up lands**
  _Context:_ After removing the unused CSS, rerun the automated suite to ensure the bundle still builds cleanly.
  _Suggested commands:_
  ```bash
  npm run check
  npm run build
  ```

## 🌌 Particle Network Follow-ups
- [x] **Restore light-theme visibility for the particle canvas**
  _Context:_ The revamped node rendering looked vibrant in dark mode but washed out over the bright hero backgrounds. Increase contrast in the light palette and adjust the canvas blend/filters in `src/lib/components/ParticleNetwork.svelte` so the animation reads clearly without overpowering copy.
  _Snippet:_
  ```svelte
  .particle-network[data-theme='light'] {
    opacity: 0.82;
    mix-blend-mode: multiply;
    filter: saturate(1.35) contrast(1.22) brightness(0.94);
  }
  ```
  _Next step:_ Deepen the light-theme particle cores, bump stroke weights, and boost the canvas contrast to keep the lattice visible against white glass surfaces.

- [x] **Cycle node borders through the brand palette**
  _Context:_ Edge strokes previously stayed close to the fill color, so the animated nodes never showcased the accent spectrum. Update the particle drawing logic to darken the outline in light mode and to animate through primary/secondary/tertiary hues.
  _Snippet:_
  ```ts
  const rimColor = palette.isDark ? cycleColor : shadeRgb(cycleColor, 0.28);
  context.strokeStyle = withAlpha(rimColor, palette.isDark ? 0.88 : 0.95);
  ```
  _Next step:_ Ensure connection lines and pointer glows pick up the same tonal tweaks so every motion element reflects the page's brand accents.

- [x] **Animate lattice links with the accent spectrum**
  _Context:_ Even after the node borders began cycling, the connection lines still used a static blue/purple mix, so the network didn't fully express the tertiary accents. Blend the per-frame brand color sequence into the link renderer and pointer glow inside `src/lib/components/ParticleNetwork.svelte`.
  _Snippet:_
  ```ts
  const phase = ((a.phase + b.phase) * 0.5 + lastTimestamp / 5400) % 1;
  const cycleColor = brandCycleColor(palette, phase);
  const linkColor = mixRgb(cycleColor, palette.link, 0.32 + strength * 0.18);
  ```
  _Next step:_ Keep the halo intensity tuned for both light and dark themes so the motion reads crisply against glass backgrounds.

- [x] **Preserve particle positions during layout shifts**
  _Context:_ `configureCanvas` rebuilt the entire particle array on every resize, so the lattice popped and lost its color phase when the viewport changed. Keeping existing particles delivers smoother responsiveness.
  _Snippet:_
  ```ts
  if (!preserveParticles || particles.length === 0 || !resized) {
    particles = Array.from({ length: count }, () => new Particle(width, height));
  }
  ```
  _Next step:_ Scale particles, velocity, and radii when the canvas resizes and only add or remove particles to match the target density.

- [x] **Ignore no-op resize observer triggers**
  _Context:_ Even with `preserveParticles = true`, the observer still respawned the array whenever the canvas dimensions stayed the same because the logic short-circuited on `!resized`. That caused color-phase popping during layout recalculations that don't change the canvas box.
  _Snippet:_
  ```ts
  const shouldRebuild = !preserveParticles || particles.length === 0;

  if (shouldRebuild) {
    particles = Array.from({ length: count }, () => new Particle(width, height));
  } else {
    if (resized) {
      // scale existing particle state
    }
  }
  ```
  _Next step:_ Only rebuild when the particle array is empty or preservation is disabled while still syncing the count and scaling when actual size deltas occur.

## ✨ Interaction & Performance Polish
- [x] **Add touch + pen support for the particle glow**
  _Context:_ The canvas only listened for mouse movement, so the pointer halo never appeared for touch or stylus users on tablets and phones. Those visitors saw a static background even though the lattice reacts to cursor proximity on desktop.
  _Snippet:_
  ```ts
  const pointerSupported = typeof window.PointerEvent !== 'undefined';

  if (pointerSupported) {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
  } else {
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
  }
  ```
  _Next step:_ Track the active pointer ID, update the glow position for touchmove/touchstart events, and deactivate the halo when the pointer ends so mobile users get the same interactive feedback.

- [x] **Skip redundant canvas reconfiguration when nothing changed**
  _Context:_ `configureCanvas(true)` still reset the backing store and re-ran the density sync on every ResizeObserver callback even when the device pixel ratio and element dimensions were identical. That triggered extra context work and line width recalculations during benign layout passes.
  _Snippet:_
  ```ts
  if (!shouldRebuild && !resized && sameDensity && ctx) {
    lastCanvasWidth = width;
    lastCanvasHeight = height;
    return;
  }
  ```
  _Next step:_ Bail out early when the dimensions and particle count already match the target so idle observer events stay cheap.

- [x] **Pause the lattice when the tab is hidden**
  _Context:_ The animation loop kept requesting frames while the page was in a background tab, wasting battery on laptops and mobile devices. We already respect `prefers-reduced-motion`, but we should also sleep when the document is hidden.
  _Snippet:_
  ```ts
  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      deactivatePointer();
      stop();
    } else if (!prefersReducedMotion) {
      start();
    }
  }
  ```
  _Next step:_ Wire up the visibility listener during mount and remove it on teardown so the animation auto-pauses in the background and resumes when the user returns.

## 📱 Responsive Polish
- [x] **Scale navigation controls for compact viewports**
  _Context:_ On sub-600px screens the language switcher, theme toggle, and trigger crowd the logo causing wrapping and overflow. Tighten spacing, shrink the toggle controls, and adjust the nav container padding so the bar remains balanced on phones.
  _Snippet:_
  ```svelte
  @media (max-width: 600px) {
    .nav-actions {
      gap: clamp(0.5rem, 4vw, 0.75rem);
    }
  }
  ```
  _Next step:_ Verify the header aligns with the logo and menu button without overlap at 320px and resizes smoothly across breakpoints.
  _Progress update:_ Language and theme switchers collapse into a "Quick controls" block inside the mobile drawer below 520px, freeing the toolbar to stay within 320px widths without wrapping.

- [x] **Tune particle density for coarse pointers**
  _Context:_ The background lattice rendered too many nodes on mobile, taxing GPUs and dulling the glow radius on touch devices. Detect coarse pointers, ease particle density, and adapt the pointer halo radius so the animation feels responsive on handhelds.
  _Snippet:_
  ```ts
  const useCoarseDensity = coarsePointer || shortSide < 720;
  const density = useCoarseDensity ? 36000 : 28000;
  pointerPull = Math.max(MIN_POINTER_PULL, base);
  ```
  _Next step:_ Exercise the animation on both desktop and mobile simulators to confirm smooth motion and consistent accent cycling.

## 📱 Navigation Polish
- [x] **Simplify the mobile header layout**
  _Context:_ The mobile navbar felt cramped with glass controls competing for space. On narrow phones the header should collapse to a lightweight bar with the brand mark and a single menu trigger.
  _Next step:_ Let the leading group expand, push the trigger to the edge, and hide decorative window chrome below 720 px so the top bar stays usable on small screens.
  _Progress update:_ The toolbar now collapses to a single menu button on handsets, with the logo relocating to a drawer header alongside the quick controls so the compact top bar stays clean.

- [x] **Let the drawer stack links vertically and scroll**
  _Context:_ The drawer kept desktop spacing, forcing navigation links to wrap horizontally on sub-400 px devices.
  _Next step:_ Give the menu card a viewport-based max-height with overflow, widen the tap targets, and reflow the link list into a simple column so every route is legible on phones.

