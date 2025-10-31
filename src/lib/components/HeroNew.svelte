<script lang="ts">
  import { splitReveal } from '$lib/utils/splitText';
  export let title: string;
  export let lead: string = '';
  export let ctaHref: string = '';
  export let ctaLabel: string = '';
  export let variant: 'home'|'ideonautix'|'nodevoyage'|'consulting'|'education'|'team' = 'home';
</script>

<section class="hero section" style="position:relative;overflow:hidden;">
  <div class="hero-beam" data-variant={variant}></div>

  <!-- Variant-specific subtle background -->
  <div class="hero-bg" data-variant={variant} aria-hidden="true"></div>

  <div class="container readable" style="text-align:center; position:relative;">
    <h1 use:splitReveal>{title}</h1>
    {#if lead}<p class="text-secondary reveal" style="margin-top:.5rem;">{lead}</p>{/if}
    {#if ctaHref}<div class="reveal" style="margin-top:1rem;">
      <a class="btn btn-primary" href={ctaHref}>{ctaLabel}</a>
    </div>{/if}
  </div>

  <div class="flow-divider" style="margin-top:var(--space-5)"></div>
</section>

<style>
  .hero-bg {
    position:absolute; inset:-10% -10% auto -10%;
    height: 70vh; pointer-events:none; z-index:-1;
  }
  /* Variant styling: shape gradients using CSS only */
  .hero-bg[data-variant="home"] {
    background:
      radial-gradient(800px 400px at 20% 0%, var(--halo-ai-1), transparent 60%),
      radial-gradient(900px 480px at 80% 10%, var(--halo-ai-2), transparent 65%);
    filter: blur(24px) saturate(1.15);
  }
  .hero-bg[data-variant="ideonautix"] {
    background:
      conic-gradient(from 110deg at 60% 30%, var(--halo-ai-1), transparent 60%),
      radial-gradient(700px 420px at 10% 10%, var(--halo-warm), transparent 62%);
    filter: blur(26px) saturate(1.1);
  }
  .hero-bg[data-variant="nodevoyage"] {
    background:
      radial-gradient(700px 480px at 30% 15%, var(--halo-ai-2), transparent 60%),
      conic-gradient(from -60deg at 70% 20%, var(--halo-ai-1), transparent 55%);
    filter: blur(26px) saturate(1.12);
  }
  .hero-bg[data-variant="consulting"] {
    background:
      radial-gradient(600px 380px at 20% 0%, var(--halo-warm), transparent 60%),
      linear-gradient(90deg, transparent, color-mix(in srgb, var(--halo-ai-1) 35%, transparent), transparent);
    filter: blur(24px);
  }
  .hero-bg[data-variant="education"] {
    background:
      radial-gradient(800px 420px at 80% 0%, var(--halo-ai-1), transparent 60%),
      radial-gradient(600px 360px at 10% 15%, var(--halo-ai-2), transparent 65%);
    filter: blur(26px) saturate(1.1);
  }
  .hero-bg[data-variant="team"] {
    background:
      conic-gradient(from 180deg at 50% 0%, var(--halo-ai-1), transparent 60%),
      radial-gradient(700px 420px at 10% 10%, var(--halo-ai-2), transparent 62%);
    filter: blur(24px) saturate(1.08);
  }
</style>
