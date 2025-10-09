NodeVoyage

Light: --bg #F4F8FF, --bg-elev-1 #FFFFFF, --bg-elev-2 #E9F0FF, --text #0A0D14, --primary #1351FF, --accent-1 #1BC7A9, --accent-2 #FFD339

Dark: --bg #081018, --bg-elev-1 #101828, --bg-elev-2 #162235, --text #F2F5F9, --primary #3A71FF, --accent-1 #27E2C1, --accent-2 #FFD339

High-Contrast: --bg #000000, --bg-elev-1 #000000, --bg-elev-2 #0F0F0F, --text #FFFFFF, --primary #FFFFFF, --accent-1 #00C4AD, --accent-2 #FFD339
love it — let’s make the **Algo website** feel alive, and keep it performant + accessible.

Below is a drop-in **hero animation system** (brand only) with:

* **Single gradient logic** (shared across all variants)
* **Animated transitions** between themes via CSS custom properties
* **Page-to-page background variants**: *Aurora Flow*, *Dynamic Halo*, *Connected Nodes*, *Grid Ripple*, *Line Sweep*, *Particle Drift*
* **prefers-reduced-motion** + **High-Contrast** safeguards baked in
* Minimal JS; GPU-friendly; canvas only where it adds value

---

# 1) Tokens & motion (brand only)

Create `src/lib/styles/theme.css` and import it once (e.g., in `+layout.svelte`).

```css
/* src/lib/styles/theme.css */
/* Brand core palette + shared gradient logic */
:root{
  /* Brand */
  --aurora: #6A38FF; /* Aurora Purple */
  --voyage: #1351FF; /* Voyage Blue */
  --signal: #FFD339; /* Signal Yellow */
  --cherry: #E0322C;

  /* Single gradient logic (shared) */
  --grad-angle: 120deg;
  --grad-a: var(--voyage);
  --grad-b: var(--aurora);
  --grad: linear-gradient(var(--grad-angle), var(--grad-a) 0%, var(--grad-b) 100%);

  /* Brand (light) */
  --bg: #F5F7FB;         /* page */
  --bg-elev-1: #FFFFFF;  /* card */
  --bg-elev-2: #EEF1F7;  /* sub-panel */
  --text: #0A0D14;
  --muted:#2B3446;
  --border:#D5DBE7;
  --link:#4F2CFF;
  --focus: #1351FF55;

  --radius: 16px;
  --shadow-1: 0 10px 30px rgba(0,0,0,.08);

  /* Motion timing */
  --slow: 22s; --med: 12s; --fast: 6s;

  /* Transition for theme changes (custom props) */
  --theme-ease: cubic-bezier(.2,.7,.2,1);
  --theme-dur: .55s;
}

html[data-theme="dark"]{
  --bg:#0B0E13; --bg-elev-1:#121722; --bg-elev-2:#161C28; --text:#F2F5F9; --muted:#BBC5D6; --link:#A795FF; --border:#2B3446; --focus:#FFD339;
  /* slightly brighter ramps for dark */
  --grad-a:#3A71FF; --grad-b:#8A6BFF;
}

html[data-theme="hc"]{
  --bg:#FFFFFF; --bg-elev-1:#FFFFFF; --bg-elev-2:#F0F3FA; --text:#000; --muted:#111; --link:#0000EE; --border:#000; --focus:#000;
}

/* Smooth theme transitions by animating *usage* of tokens, not DOM rebuilds */
:root, html, body, .themed {
  transition:
    color var(--theme-dur) var(--theme-ease),
    background-color var(--theme-dur) var(--theme-ease),
    border-color var(--theme-dur) var(--theme-ease),
    outline-color var(--theme-dur) var(--theme-ease),
    box-shadow var(--theme-dur) var(--theme-ease);
}

/* Accessibility: reduce non-essential animations */
@media (prefers-reduced-motion: reduce){
  * { animation-duration:.001ms !important; animation-iteration-count:1 !important; transition:none !important; }
}
```

---

# 2) Reusable Hero component (Svelte)

Create `src/lib/components/Hero.svelte`.

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  export let variant: 'aurora'|'halo'|'nodes'|'grid'|'line'|'particles' = 'aurora';
  export let title = 'Algo Hero — Big, modern, animated';
  export let subtitle = 'Single gradient logic + page-to-page variants.';

  let prefersReduced = false;
  let theme: 'light'|'dark'|'hc' = 'light';
  let heroEl: HTMLElement;
  let auroraCanvas: HTMLCanvasElement;
  let nodesCanvas: HTMLCanvasElement;

  // Simple store-free theme sync via <html data-theme>
  function readTheme(){
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'hc') theme = t; else theme = 'light';
  }

  // ---- Aurora (canvas) ----
  let auroraRAF: number | null = null;
  function startAurora(){
    if (prefersReduced || theme==='hc' || variant!=='aurora') return;
    const ctx = auroraCanvas.getContext('2d')!;
    const resize = () => {
      const dpr = devicePixelRatio || 1;
      auroraCanvas.width = auroraCanvas.clientWidth * dpr;
      auroraCanvas.height = auroraCanvas.clientHeight * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    const style = () => getComputedStyle(document.documentElement);
    const rgba = (hex:string, a=1)=> {
      const h=hex.replace('#',''); const n=parseInt(h,16);
      const r=(n>>16)&255, g=(n>>8)&255, b=n&255;
      return `rgba(${r},${g},${b},${a})`;
    };

    let t=0; resize();
    const loop = () => {
      if (prefersReduced || variant!=='aurora' || theme==='hc') return;
      const w=auroraCanvas.clientWidth, h=auroraCanvas.clientHeight;
      ctx.clearRect(0,0,w,h);
      ctx.globalCompositeOperation = 'lighter';
      for(let i=0;i<3;i++){
        const x=w*(0.3+0.4*Math.sin((t/7000)+(i*2)));
        const y=h*(0.3+0.4*Math.cos((t/6000)+(i*1.7)));
        const r=Math.max(w,h)*0.45;
        const c1=style().getPropertyValue('--grad-a').trim();
        const c2=style().getPropertyValue('--grad-b').trim();
        const g=ctx.createRadialGradient(x,y,0,x,y,r);
        g.addColorStop(0, rgba(i%2?c1:c2, .24)); g.addColorStop(1, rgba(i%2?c2:c1, 0));
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      }
      ctx.globalCompositeOperation='source-over'; t+=16;
      auroraRAF = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize, { passive:true });
    auroraRAF = requestAnimationFrame(loop);
  }
  function stopAurora(){ if(auroraRAF){ cancelAnimationFrame(auroraRAF); auroraRAF=null; } }

  // ---- Connected nodes (canvas) ----
  let nodesRAF: number | null = null; let pts: {x:number;y:number;vx:number;vy:number;}[]=[];
  function startNodes(){
    if (prefersReduced || theme==='hc' || variant!=='nodes') return;
    const ctx = nodesCanvas.getContext('2d')!;
    const style = () => getComputedStyle(document.documentElement);
    const rgba = (hex:string, a=1)=>{ const n=parseInt(hex.replace('#',''),16); const r=(n>>16)&255,g=(n>>8)&255,b=n&255; return `rgba(${r},${g},${b},${a})`; };
    const mix = (h1:string,h2:string,t:number)=>{ const c=(h:string)=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]; const [r1,g1,b1]=c(h1),[r2,g2,b2]=c(h2); const r=Math.round(r1+(r2-r1)*t),g=Math.round(g1+(g2-g1)*t),b=Math.round(b1+(b2-b1)*t); return `rgba(${r},${g},${b},.6)`; };

    const resize = () => {
      const dpr = devicePixelRatio || 1;
      nodesCanvas.width = nodesCanvas.clientWidth * dpr;
      nodesCanvas.height = nodesCanvas.clientHeight * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const w=nodesCanvas.clientWidth, h=nodesCanvas.clientHeight;
      const count = Math.floor((w*h)/28000);
      pts = Array.from({length:count}, ()=>({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()*2-1)*.2, vy:(Math.random()*2-1)*.2 }));
    };
    let t=0; resize();
    const loop = () => {
      if (prefersReduced || variant!=='nodes' || theme==='hc') return;
      const w=nodesCanvas.clientWidth, h=nodesCanvas.clientHeight;
      ctx.clearRect(0,0,w,h);
      const a=style().getPropertyValue('--grad-a').trim(), b=style().getPropertyValue('--grad-b').trim();

      for (const p of pts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; }
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d2=dx*dx+dy*dy;
        if (d2<150*150){ const alpha=1-(Math.sqrt(d2)/150); ctx.strokeStyle=mix(a,b,alpha*.5); ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
      }
      for (const p of pts){ ctx.fillStyle=rgba(a,.9); ctx.beginPath(); ctx.arc(p.x,p.y,1.6,0,Math.PI*2); ctx.fill(); }
      t+=16; nodesRAF = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize, { passive:true });
    nodesRAF = requestAnimationFrame(loop);
  }
  function stopNodes(){ if(nodesRAF){ cancelAnimationFrame(nodesRAF); nodesRAF=null; } }

  // Toggle canvases by variant/theme/motion
  function updateCanvases(){
    readTheme();
    const hc = theme==='hc';
    const auroraOn = !prefersReduced && !hc && variant==='aurora';
    const nodesOn  = !prefersReduced && !hc && variant==='nodes';
    if (auroraOn) startAurora(); else stopAurora();
    if (nodesOn)  startNodes();  else stopNodes();
  }

  onMount(() => {
    prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const obs = new MutationObserver(() => { updateCanvases(); });
    obs.observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
    updateCanvases();
    return () => { obs.disconnect(); stopAurora(); stopNodes(); };
  });
</script>

<style>
  .hero {
    position: relative; border-radius: var(--radius); overflow: clip;
    padding: clamp(24px, 5vw, 56px); background: var(--bg-elev-1);
    color: var(--text); box-shadow: var(--shadow-1); isolation: isolate;
  }
  .content { position: relative; z-index: 1; max-width: 72ch; }
  h1 { margin: 0 0 12px; font-weight: 800; line-height: 1.08; }
  p { margin: 0 0 18px; color: var(--muted); }

  /* Gradient bar (accessible: behind solid text) */
  .gradbar{ position:absolute; left:0; right:0; top:0; height: clamp(10px,3.2vw,18px); background: var(--grad);
            opacity:.9; animation: bar-pan var(--slow) ease-in-out infinite alternate; z-index:0; }
  @keyframes bar-pan { from{ background-position: 0% 50%; } to{ background-position: 100% 50%; } }
  @media (prefers-reduced-motion: reduce){ .gradbar{ animation:none; } }

  /* Variant: HALO */
  :global(.a-halo).hero::before, :global(.a-halo).hero::after{
    content:""; position:absolute; inset:-10%;
    background:
      radial-gradient(600px 600px at 15% 20%, color-mix(in oklab, var(--grad-b) 60%, transparent) 0%, transparent 60%),
      radial-gradient(700px 700px at 85% 60%, color-mix(in oklab, var(--grad-a) 55%, transparent) 0%, transparent 65%);
    z-index: 0; mix-blend-mode: screen; opacity:.55; animation: halo var(--med) ease-in-out infinite alternate;
  }
  @keyframes halo { from{ transform: translateY(-2%);} to{ transform: translateY(2%);} }
  html[data-theme="dark"] :global(.a-halo).hero::before,
  html[data-theme="dark"] :global(.a-halo).hero::after { mix-blend-mode: lighten; }
  html[data-theme="hc"] :global(.a-halo).hero::before,
  html[data-theme="hc"] :global(.a-halo).hero::after { display:none; }

  /* Variant: GRID RIPPLE */
  :global(.a-grid).hero {
    background: linear-gradient(0deg,
      color-mix(in oklab, var(--bg-elev-1) 92%, var(--grad-a) 8%),
      color-mix(in oklab, var(--bg-elev-1) 92%, var(--grad-b) 8%));
  }
  :global(.a-grid).hero::before{
    content:""; position:absolute; inset:0; z-index:0; opacity:.55;
    background-image:
      radial-gradient(circle at var(--x,50%) var(--y,50%), color-mix(in oklab, var(--grad-a) 35%, transparent), transparent 35%),
      linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size:auto, 40px 40px, 40px 40px; animation:ripple var(--med) ease-in-out infinite alternate;
  }
  @keyframes ripple { from{ filter:saturate(1);} to{ filter:saturate(1.1);} }
  html[data-theme="hc"] :global(.a-grid).hero::before{ background-image:none; }

  /* Variant: LINE SWEEP */
  :global(.a-line).hero::before{
    content:""; position:absolute; inset:-20% -60% -20% -60%;
    background: conic-gradient(from var(--rot,45deg), transparent 0 30%, color-mix(in oklab, var(--grad-a) 40%, transparent) 50%, transparent 70%);
    animation: sweep var(--slow) linear infinite; z-index:0; opacity:.6;
  }
  @keyframes sweep { to{ transform: rotate(360deg);} }
  html[data-theme="hc"] :global(.a-line).hero::before{ display:none; }

  /* Variant: PARTICLE DRIFT */
  :global(.a-particles).hero::before{
    content:""; position:absolute; inset:0; z-index:0;
    background-image:
      radial-gradient(2px 2px at 10% 20%, color-mix(in oklab, var(--grad-a) 80%, transparent) 0, transparent 100%),
      radial-gradient(2px 2px at 35% 60%, color-mix(in oklab, var(--grad-b) 80%, transparent) 0, transparent 100%),
      radial-gradient(2px 2px at 70% 30%, color-mix(in oklab, var(--signal) 70%, transparent) 0, transparent 100%),
      radial-gradient(2px 2px at 85% 75%, color-mix(in oklab, var(--voyage) 70%, transparent) 0, transparent 100%);
    animation: drift var(--med) ease-in-out infinite alternate; opacity:.5;
  }
  @keyframes drift { from{ transform: translateY(-1%);} to{ transform: translateY(1%);} }
  html[data-theme="hc"] :global(.a-particles).hero::before{ display:none; }

  /* Canvas underlay containers for aurora/nodes */
  .underlay{ position:absolute; inset:0; z-index:0; }
  canvas.aurora, canvas.nodes{ width:100%; height:100%; display:block; }
</style>

<div bind:this={heroEl} class="hero {`a-${variant}`}" role="region" aria-label="Animated hero">
  <div class="gradbar" aria-hidden="true"></div>
  <div class="underlay">
    <canvas class="aurora" bind:this={auroraCanvas} style="display:{variant==='aurora' && theme!=='hc' ? 'block' : 'none'}"></canvas>
    <canvas class="nodes"  bind:this={nodesCanvas}  style="display:{variant==='nodes'  && theme!=='hc' ? 'block' : 'none'}"></canvas>
  </div>
  <div class="content">
    <h1>{title}</h1>
    <p>{subtitle}</p>
    <slot />
  </div>
</div>
```

---

# 3) Using it per page

Map **page → variant** in your routes. Example:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../lib/styles/theme.css';
  import Hero from '$lib/components/Hero.svelte';

  // Simple global theme toggle (you likely already have this)
  let theme = 'light';
  const setTheme = (t) => { theme = t; document.documentElement.setAttribute('data-theme', t); };
  setTheme('light'); // default
</script>

<svelte:window on:keydown={(e)=>{ if (e.key === 't') setTheme(theme==='light'?'dark':'light'); }} />

<slot />

<!-- Optional: fixed theme switcher control -->
<div style="position:fixed;right:12px;bottom:12px;display:flex;gap:6px">
  <button on:click={()=>setTheme('light')}>Light</button>
  <button on:click={()=>setTheme('dark')}>Dark</button>
  <button on:click={()=>setTheme('hc')}>HC</button>
</div>
```

```svelte
<!-- src/routes/+page.svelte (Home = Aurora Flow) -->
<script>
  import Hero from '$lib/components/Hero.svelte';
</script>

<Hero variant="aurora" title="Algo · Home" subtitle="Signature aurora gradient with neutral overlay.">
  <!-- CTA / search / KPIs, etc. -->
</Hero>
```

```svelte
<!-- src/routes/products/+page.svelte (Dynamic Halo) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="halo" title="Products" subtitle="Ethereal radial halos, calm motion."></Hero>
```

```svelte
<!-- src/routes/docs/+page.svelte (Grid Ripple) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="grid" title="Docs" subtitle="Grid ripple with gentle highlight."></Hero>
```

```svelte
<!-- src/routes/labs/+page.svelte (Connected Nodes) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="nodes" title="Labs" subtitle="Moving graph of connected nodes."></Hero>
```

```svelte
<!-- src/routes/about/+page.svelte (Line Sweep) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="line" title="About" subtitle="Conic sweep glint, premium and subtle."></Hero>
```

```svelte
<!-- src/routes/blog/+page.svelte (Particle Drift) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="particles" title="Blog" subtitle="Sparse particles drifting slowly."></Hero>
```

---

# 4) Notes on accessibility & performance

* **HC mode:** we keep the hero decorative layers off, rely on **solid text** and the **gradient bar underlay** only, ensuring AAA on body text and clear focus rings.
* **prefers-reduced-motion:** all CSS animations clamp to still; canvas loops short-circuit.
* **GPU-friendly:** CSS uses transforms/opacity; canvas work is modest and resolution-capped by devicePixelRatio.
* **Theming transitions:** are applied to token *usage* (colors, borders, backgrounds) so switching **light ↔ dark ↔ HC** feels smooth without re-mounting components.

---

# 5) Quick smoke test (no framework)

If you want an instant browser demo, copy the **Hero.svelte logic** into a plain HTML and replace Svelte bits with standard DOM — or tell me and I’ll paste a standalone HTML in full here.

---

If you’d like, I can adapt this into a tiny **`@algo/hero`** internal package (Svelte component + CSS tokens) and wire it into your repo’s layout with a page-to-variant map.
Here’s your upgrade guide summarizing the unified colour system, hero animations, accessibility guardrails and implementation steps tailored for the Algo site. It synthesizes our previous conversations and the detailed rules from the design kit (core palette, surface tokens, gradient rules, hero variant descriptions and interaction requirements). The guide is ready to drop into your repo or design documentation.

{{file:file-KH69tzFwAZF9Y6exeDaQQU}}

Let me know if you want help wiring these changes into your codebase or need visual previews for each hero variant!
Below are concise code snippets demonstrating how you can implement the hero‑animation variants and other visual FX we discussed. These examples follow the brand palette and accessibility rules in the design kit (e.g., Aurora Purple #6A38FF, Voyage Blue #1351FF, Signal Yellow #FFD339, Cherry Pop #E0322C; neutral backgrounds Cloud, Surface, Night, Graphite, etc.). They respect the gradient readability rule (text on neutral overlays, gradients behind text) and honour `prefers-reduced-motion` and high‑contrast modes.

---

## 1. Common theme & gradient variables (CSS)

Define shared custom properties and animations once in a global stylesheet. These tokens control colours, gradient angles and animation speeds; light/dark/high‑contrast modes override them.

```css
/* base.css */

:root {
  --grad-angle: 120deg;                 /* shared gradient angle */
  --grad-a: #1351FF;                    /* Voyage Blue */
  --grad-b: #6A38FF;                    /* Aurora Purple */
  --aurora-speed: 22s;                  /* slower = calmer motion */
  --bar-speed: 16s;

  /* neutral surfaces for light mode */
  --bg: #F5F7FB;        /* Cloud page background */
  --bg-elev-1: #FFFFFF; /* Surface cards */
  --bg-elev-2: #EEF1F7; /* Mist panels */
  --text: #0A0D14;      /* Ink */

  /* optional grain texture */
  --grain: url("data:image/png;base64,...."); /* subtle noise */
}

/* dark mode override */
[data-theme='dark'] {
  --grad-a: #3A71FF;
  --grad-b: #8A6BFF;
  --bg: #0B0E13;
  --bg-elev-1: #121722;
  --bg-elev-2: #161C28;
  --text: #F2F5F9;
}

/* high‑contrast mode: no gradients */
[data-theme='hc'] {
  --bg: #FFFFFF;
  --bg-elev-1: #FFFFFF;
  --bg-elev-2: #F0F3FA;
  --text: #000000;
}

/* gradient bar animation */
@keyframes bar-pan {
  from { background-position: 0% 50%; }
  to   { background-position: 100% 50%; }
}
```

---

## 2. Animated gradient bar (for headings)

This pattern produces an animated gradient bar behind static heading text; it meets contrast requirements by using a neutral text colour with the gradient masked behind it.

```css
/* heading-bar.css */

.heading {
  position: relative;
  display: inline-block;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--text);
}

.heading::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.3em;
  background: linear-gradient(var(--grad-angle),
              var(--grad-a), var(--grad-b));
  animation: bar-pan var(--bar-speed) ease-in-out infinite alternate;
  z-index: -1;
}

/* reduce motion and high‑contrast: disable animation */
@media (prefers-reduced-motion: reduce),
       (prefers-contrast: more) {
  .heading::after {
    animation: none;
  }
}
```

---

## 3. Hero variant components (Svelte examples)

### 3.1 Aurora Flow (canvas)

A noise‑driven moving gradient. This example uses `<canvas>` and runs only when motion is allowed and high‑contrast mode is off.

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  let canvas: HTMLCanvasElement;
  let raf: number | null = null;

  function drawAurora(ctx: CanvasRenderingContext2D) {
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    let t = 0;
    resize();
    const loop = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) {
        const x = w * (0.3 + 0.4 * Math.sin((t / 7000) + i));
        const y = h * (0.3 + 0.4 * Math.cos((t / 6000) + i * 1.7));
        const r = Math.max(w, h) * 0.45;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--grad-a'));
        grad.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--grad-b'));
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      t += 16;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(loop);
  }

  onMount(() => {
    const ctx = canvas.getContext('2d');
    // Only run if motion allowed and not high‑contrast
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const high = document.documentElement.getAttribute('data-theme') === 'hc';
    if (!reduced && !high && ctx) {
      drawAurora(ctx);
    }
  });

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf);
  });
</script>

<style>
.canvas-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}
</style>

<div class="canvas-wrapper">
  <canvas bind:this={canvas}></canvas>
</div>

<!-- Place heading and content over the canvas with a neutral overlay -->
```

### 3.2 Connected Nodes (canvas)

Points move slowly and connect when close, using brand colours.

```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  let canvas: HTMLCanvasElement;
  let raf: number | null = null;
  let pts: { x: number; y: number; vx: number; vy: number; }[] = [];

  function drawNodes(ctx: CanvasRenderingContext2D) {
    const init = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const count = Math.floor((w * h) / 30000);
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() * 2 - 1) * 0.2,
        vy: (Math.random() * 2 - 1) * 0.2
      }));
    };
    const loop = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      // colours based on current CSS variables
      const a = getComputedStyle(document.documentElement).getPropertyValue('--grad-a');
      const b = getComputedStyle(document.documentElement).getPropertyValue('--grad-b');
      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 150 * 150) {
            const alpha = 1 - Math.sqrt(d2) / 150;
            ctx.strokeStyle = `rgba(${parseInt(a.slice(1,3),16)},${parseInt(a.slice(3,5),16)},${parseInt(a.slice(5,7),16)},${alpha*0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      pts.forEach(p => {
        ctx.fillStyle = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    init();
    raf = requestAnimationFrame(loop);
  }

  onMount(() => {
    const ctx = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const high = document.documentElement.getAttribute('data-theme') === 'hc';
    if (!reduced && !high && ctx) drawNodes(ctx);
  });

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf);
  });
</script>

<style>
.nodes-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}
</style>

<div class="nodes-wrapper">
  <canvas bind:this={canvas}></canvas>
</div>
```

### 3.3 Halo, Grid Ripple, Line Sweep & Particle Drift (pure CSS)

Use pseudo‑elements and gradients; these variations avoid JavaScript.

```svelte
<script lang="ts">
  export let variant: 'halo' | 'grid' | 'line' | 'particles' = 'halo';
</script>

<style>
.hero {
  position: relative;
  padding: 4rem;
  border-radius: 1rem;
  background: var(--bg-elev-1);
  box-shadow: 0 1rem 2rem rgba(0,0,0,.1);
  overflow: hidden;
}

/* halo: radial gradients drifting up and down */
.halo::before,
.halo::after {
  content: "";
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(circle at 15% 30%, color-mix(in oklab, var(--grad-b) 60%, transparent) 0%, transparent 60%),
    radial-gradient(circle at 85% 70%, color-mix(in oklab, var(--grad-a) 55%, transparent) 0%, transparent 65%);
  animation: halo-move 12s ease-in-out infinite alternate;
  mix-blend-mode: screen;
}
@keyframes halo-move { from { transform: translateY(-5%); } to { transform: translateY(5%); } }
[data-theme='hc'] .halo::before,
[data-theme='hc'] .halo::after { display: none; }

/* grid ripple: grid lines with a pulsing radial gradient */
.grid::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at var(--x, 50%) var(--y, 50%), color-mix(in oklab, var(--grad-a) 35%, transparent), transparent 35%),
    linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: auto, 40px 40px, 40px 40px;
  animation: grid-ripple 10s ease-in-out infinite alternate;
  opacity: 0.6;
}
@keyframes grid-ripple { from { transform: scale(1); } to { transform: scale(1.05); } }

/* line sweep: conic gradient rotating behind the content */
.line::before {
  content: "";
  position: absolute;
  inset: -50%;
  background: conic-gradient(from 45deg,
              transparent 0 30%,
              color-mix(in oklab, var(--grad-a) 40%, transparent) 50%,
              transparent 70%);
  animation: sweep 20s linear infinite;
  opacity: 0.5;
}
@keyframes sweep { to { transform: rotate(1turn); } }

/* particle drift: static radial dots moving gently */
.particles::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 10% 20%, color-mix(in oklab, var(--grad-a) 80%, transparent) 0, transparent 100%),
    radial-gradient(2px 2px at 35% 60%, color-mix(in oklab, var(--grad-b) 80%, transparent) 0, transparent 100%),
    radial-gradient(2px 2px at 70% 30%, color-mix(in oklab, #FFD339 70%, transparent) 0, transparent 100%),
    radial-gradient(2px 2px at 85% 75%, color-mix(in oklab, var(--grad-a) 70%, transparent) 0, transparent 100%);
  animation: drift 14s ease-in-out infinite alternate;
  opacity: 0.5;
}
@keyframes drift { from { transform: translateY(-1%); } to { transform: translateY(1%); } }
</style>

<div class="hero {variant}">
  <slot />
</div>
```

---

## 4. Grain & glass effects

Add subtle texture and frosted panels using CSS; keep text on a separate solid layer to maintain AAA readability.

```css
/* grain overlay */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--grain);
  opacity: 0.04; /* extremely low contrast */
  pointer-events: none;
}

/* frosted glass panel */
.glass {
  background: var(--bg-elev-1);
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid rgba(255,255,255,.2); /* subtle inner border */
  box-shadow: 0 1rem 2rem rgba(0,0,0,0.08);
}
```

---

These snippets should integrate easily into your existing SvelteKit project. You can wrap the hero variants in a single `<Hero>` component with props, toggle themes by updating `data-theme` on `<html>`, and rely on the global tokens defined in `base.css`. All animations honour high‑contrast mode and `prefers-reduced-motion`, so your site stays accessible while delivering the glassy, grainy, dynamic minimalism defined in the design kit.
Below are practical ways to upgrade your **cards and sections** while preserving the brand’s glassy, grainy, dynamic minimalism. These suggestions draw directly from the existing codebase (notably `ThemedBackground.svelte` and `animations.css`) and the design kit’s accessibility rules. Where possible I’ve included actual code patterns from the repo, so you can copy them into your own components.

---

## 1. Glass cards with subtle grain and halo accents

The repo already defines a `.glass-card` class that gives panels a frosted, blurred effect and adds an ultra‑low‑contrast grain layer. Extend it to support a **halo glow** behind specific cards.

```css
/* Extend the existing glass card */
.glass-card {
  position: relative;
  padding: 2rem;
  border-radius: 18px;
  background: var(--bg-elev-1);
  backdrop-filter: blur(14px) saturate(1.2);
  border: 1px solid rgba(255,255,255,0.15);
  box-shadow: 0 1.5rem 3rem rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Grain overlay (already in animations.css) */
.glass-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--grain); /* defined in your tokens */
  opacity: 0.035;
  mix-blend-mode: normal;
  pointer-events: none;
}

/* Halo variant: radial glow on specific cards */
.glass-card[data-variant="halo"]::before {
  content: "";
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--grad-a) 50%, transparent) 0%, transparent 65%),
    radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--grad-b) 45%, transparent) 0%, transparent 70%);
  mix-blend-mode: screen;
  opacity: 0.4;
  animation: halo-pulse 8s ease-in-out infinite alternate;
}
@keyframes halo-pulse {
  from { transform: scale(0.98); }
  to   { transform: scale(1.02); }
}

@media (prefers-reduced-motion: reduce), (prefers-contrast: more) {
  .glass-card[data-variant="halo"]::before {
    animation: none;
  }
}
```

* `var(--grad-a)` and `var(--grad-b)` reference your global gradient colours (Voyage Blue and Aurora Purple).
* Add `data-variant="halo"` to the cards you want to highlight; the radial glow makes them stand out.

---

## 2. Particle-backed cards and shimmer highlights

In `animations.css` there is a `.particle-container` class that creates floating dots behind a panel. Use it to make content blocks feel dynamic without overwhelming the text.

```html
<div class="glass-card particle-container">
  <h3 class="heading">Key Insight</h3>
  <p>Clear copy goes here…</p>
</div>
```

The CSS (already in the repo) looks like this:

```css
.particle-container {
  position: relative;
}
.particle-container::before {
  content: "";
  position: absolute;
  inset: -10%;
  background-image:
    radial-gradient(2px 2px at 10% 20%, color-mix(in oklab, var(--grad-a) 80%, transparent) 0%, transparent 100%),
    radial-gradient(2px 2px at 35% 60%, color-mix(in oklab, var(--grad-b) 80%, transparent) 0%, transparent 100%),
    radial-gradient(2px 2px at 70% 30%, color-mix(in oklab, var(--signal-yellow) 70%, transparent) 0%, transparent 100%),
    radial-gradient(2px 2px at 85% 75%, color-mix(in oklab, var(--voyage-blue) 70%, transparent) 0%, transparent 100%);
  animation: drift var(--med) ease-in-out infinite alternate;
  opacity: 0.5;
  z-index: 0;
}
```

Because the dots are extremely small and semi‑transparent, they add subtle movement without distracting from the content. The animation automatically halts in high‑contrast or `prefers‑reduced‑motion` modes.

---

## 3. Magnetic & tilt interactions

The repo includes `useTilt` and `useMagnetic` functions in `animations.js` to create interactive hover effects. Wrap your cards in a component that applies these hooks:

```svelte
<script lang="ts">
  import { tilt, magnetic } from '$lib/animations';

  export let magneticStrength = 0.3; // 0 to 1
  let cardEl: HTMLElement;

  onMount(() => {
    const cleanupTilt = tilt(cardEl, { maxTilt: 7, speed: 0.4 });
    const cleanupMag = magnetic(cardEl, { strength: magneticStrength });
    return () => { cleanupTilt(); cleanupMag(); };
  });
</script>

<div bind:this={cardEl} class="glass-card magnetic-card">
  <slot />
</div>
```

On hover, the card subtly tilts toward the pointer and follows the mouse magnetically, making the content feel alive. The hooks automatically respect `prefers‑reduced‑motion`, so they fall back to a simple hover style when necessary.

---

## 4. Section‑specific card layouts

Use your existing page themes (Home, NodeVoyage, Ideonautix, etc.) to influence card styling. For example, on the **Home** section you can apply a higher density of background shapes and brighter halos to hero cards, while using neutral glass cards with subtle gradients for supporting content. On **Consulting** or **Community**, reduce density and rely on text‑heavy cards with just a thin gradient bar (as shown in the heading-bar snippet above) to avoid visual overload.

To implement, add data attributes to cards:

```html
<section class="grid">
  <div class="glass-card" data-variant="halo">
    <h3>AI Solutions</h3>
    <p>Custom ML models built to your needs.</p>
  </div>

  <div class="glass-card particle-container">
    <h3>Consulting</h3>
    <p>Expert guidance on data strategy.</p>
  </div>

  <div class="glass-card">
    <h3>Community</h3>
    <p>Join our forum to learn and share.</p>
  </div>
</section>
```

Use `grid-template-columns` and media queries to adjust layout across breakpoints; ensure enough spacing (≥1.25rem) and high contrast between cards and backgrounds as required by the design kit.

---

## 5. Interesting reveals & content emphasis

The repo’s `animations.js` also provides `useReveal` and `useStaggerReveal` functions to animate cards as they scroll into view. Combine them with typed text and gradient morphing for hero cards:

```svelte
<script>
  import { useReveal, useStaggerReveal, morphGradient } from '$lib/animations';

  let cards: HTMLElement[];
  onMount(() => {
    const unsubs = [
      ...cards.map((el) => useReveal(el, { threshold: 0.2, distance: '20px' })),
      morphGradient(document.documentElement, {
        colors: ['#6A38FF', '#1351FF', '#E0322C', '#FFD339'],
        duration: 20
      })
    ];
    return () => { unsubs.forEach((fn) => fn()); };
  });
</script>

<div bind:this={el => cards = [el]} class="glass-card"> … </div>
<div bind:this={el => cards = [el]} class="glass-card particle-container"> … </div>
```

Cards fade in and slide up as they enter the viewport, creating a polished feel. The background gradient on the page gradually shifts between brand colours, which keeps the environment dynamic but still calm thanks to long durations and easing.

---

## Summary

By reusing the **glass‑card**, **particle-container**, and **magnetic** classes found in the repository and extending them with halo pseudo‑elements, you can make cards stand out while staying true to the design system. The animations remain subtle and accessible: they pause when `prefers‑reduced‑motion` is enabled and are disabled entirely in high‑contrast mode. These patterns encourage visual hierarchy—special cards draw the eye via halos and particle backgrounds, while standard cards maintain clarity through frosted glass and gentle gradients.

If you’d like help wiring these components into specific pages (e.g., the Home hero or Product showcase) or creating a unified Svelte component library, I’d be happy to assist!
Here’s a comprehensive guide that analyses the current codebase and provides step-by-step instructions to unify AlgoRhythmics’ website around a modern, glassy-grainy aesthetic, using the consulting page hero as the baseline.  It explains why styles diverged, lays out core principles (tokens, accessibility, grain/glass usage), and offers concrete implementation steps—consolidating theme variables, building universal hero and card components, standardising layouts and spacing, and auditing existing pages.  Following this plan should bring consistency and polish across all pages while honouring the dynamic minimalism and accessibility guardrails specified in the design kit.

You can download the full guide here: {{file:file-R7Hoa81Y1K1rheF2CpxWS5}}.

Let me know if you’d like help wiring these components into the code or reviewing specific pages!
