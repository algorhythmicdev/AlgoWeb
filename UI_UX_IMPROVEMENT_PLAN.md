Below is a drop-in hero animation system (brand only) with:

Single gradient logic (shared across all variants)

Animated transitions between themes via CSS custom properties

Page-to-page background variants: Aurora Flow, Dynamic Halo, Connected Nodes, Grid Ripple, Line Sweep, Particle Drift

prefers-reduced-motion + High-Contrast safeguards baked in

Minimal JS; GPU-friendly; canvas only where it adds value

1) Tokens & motion (brand only)

Create src/lib/styles/theme.css and import it once (e.g., in +layout.svelte).

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

2) Reusable Hero component (Svelte)

Create src/lib/components/Hero.svelte.

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

3) Using it per page

Map page → variant in your routes. Example:

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

<!-- src/routes/+page.svelte (Home = Aurora Flow) -->
<script>
  import Hero from '$lib/components/Hero.svelte';
</script>

<Hero variant="aurora" title="Algo · Home" subtitle="Signature aurora gradient with neutral overlay.">
  <!-- CTA / search / KPIs, etc. -->
</Hero>

<!-- src/routes/products/+page.svelte (Dynamic Halo) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="halo" title="Products" subtitle="Ethereal radial halos, calm motion."></Hero>

<!-- src/routes/docs/+page.svelte (Grid Ripple) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="grid" title="Docs" subtitle="Grid ripple with gentle highlight."></Hero>

<!-- src/routes/labs/+page.svelte (Connected Nodes) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="nodes" title="Labs" subtitle="Moving graph of connected nodes."></Hero>

<!-- src/routes/about/+page.svelte (Line Sweep) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="line" title="About" subtitle="Conic sweep glint, premium and subtle."></Hero>

<!-- src/routes/blog/+page.svelte (Particle Drift) -->
<script> import Hero from '$lib/components/Hero.svelte'; </script>
<Hero variant="particles" title="Blog" subtitle="Sparse particles drifting slowly."></Hero>

4) Notes on accessibility & performance

HC mode: we keep the hero decorative layers off, rely on solid text and the gradient bar underlay only, ensuring AAA on body text and clear focus rings.

prefers-reduced-motion: all CSS animations clamp to still; canvas loops short-circuit.

GPU-friendly: CSS uses transforms/opacity; canvas work is modest and resolution-capped by devicePixelRatio.

Theming transitions: are applied to token usage (colors, borders, backgrounds) so switching light ↔ dark ↔ HC feels smooth without re-mounting components.
