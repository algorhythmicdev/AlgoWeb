<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { i18n } from '$lib/i18n';
  $: t = $i18n;

  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import { videoAlgorhythmics, productIcons } from '$lib/presentAssets';
  const algVid = videoAlgorhythmics; // string | null
  const ixIcon  = productIcons.find(p => /ideonautix[-_]?icon$/i.test(p))   || '/images/products/ideonautix-icon';
  const nvIcon  = productIcons.find(p => /nodevoyage[-_]?icon$/i.test(p))   || '/images/products/nodevoyage-icon';
</script>

<svelte:head>
  <title>Algorhythmics</title>
  <meta name="description" content="Practical AI tools, consulting, and education—built in Latvia." />
</svelte:head>

<main id="main" class="prose rhythm">

  <!-- Hero -->
  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <div class="glass scrim">
      <div class="h-stack">
        <h1 class="text-strong">{t('home.hero_title')}</h1>
        <p>{t('home.hero_lead')}</p>
        <p><a class="btn btn-primary" href="{appBase}/contact">{t('home.cta')}</a></p>
      </div>
    </div>
  </section>

  <!-- Product cards -->
  <section class="section">
    <h2 class="text-strong">{t('home.products')}</h2>
    <div class="grid">
      <a class="card surface-2 control rhythm-tight" href="{appBase}/ideonautix">
        <div style="display:flex;align-items:center;gap:.75rem">
          <AssetImage assetBase={ixIcon} alt="Ideonautix icon" width={40} height={40} radius={8} />
          <h3 style="margin:0">Ideonautix</h3>
        </div>
        <p>Startup education & productivity toolkit.</p>
        <ul>
          <li>Pitch Assistant</li><li>Competitive Intelligence</li><li>Pomodoro Coach</li>
        </ul>
      </a>
      <a class="card surface-2 control rhythm-tight" href="{appBase}/nodevoyage">
        <div style="display:flex;align-items:center;gap:.75rem">
          <AssetImage assetBase={nvIcon} alt="NodeVoyage icon" width={40} height={40} radius={8} />
          <h3 style="margin:0">NodeVoyage</h3>
        </div>
        <p>AI-assisted trip planning with Nodi.</p>
        <ul>
          <li>Smart suggestions</li><li>Route planning</li><li>Collaboration</li>
        </ul>
      </a>
    </div>
  </section>

  <!-- Promo video -->
  <section class="section beam-wrap">
    <div class="beam beam--dark" aria-hidden="true"></div>
    <div class="grid" style="grid-template-columns: minmax(0,1fr);">
      <div class="card surface-2 control">
        <div class="h-stack">
          <h2 class="text-strong">{t('home.promo')}</h2>
          <VideoPlayer videoBase={algVid} label={t('home.promo')} />
        </div>
      </div>
    </div>
  </section>

  <!-- What we do (3 cards) -->
  <section class="section">
    <h2 class="text-strong">{t('home.what_we_do')}</h2>
    <div class="grid">
      <div class="card surface-2 control">
        <h3>Consulting</h3>
        <p>Automation, data flows, and training. Clear outcomes, shipped fast.</p>
        <a class="btn" href="{appBase}/consulting">Learn more</a>
      </div>
      <div class="card surface-2 control">
        <h3>Products</h3>
        <p>Two focus areas: Ideonautix and NodeVoyage—built in public with a clear roadmap.</p>
        <a class="btn" href="{appBase}/ideonautix">See Ideonautix</a>
      </div>
      <div class="card surface-2 control">
        <h3>Education</h3>
        <p>Plain-language AI programs for Latvian schools and universities.</p>
        <a class="btn" href="{appBase}/education">Programs</a>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section">
    <h2 class="text-strong">{t('home.testimonials')}</h2>
    <div class="grid">
      <blockquote class="card surface-2 control">
        <p>"Clear plan, shipped fast. We finally see results."</p>
        <footer>— Program lead</footer>
      </blockquote>
      <blockquote class="card surface-2 control">
        <p>"They explain things simply and deliver the parts that matter."</p>
        <footer>— Founder</footer>
      </blockquote>
    </div>
  </section>

  <!-- Timeline -->
  <section class="section">
    <h2 class="text-strong">{t('home.timeline')}</h2>
    <div class="grid">
      <div class="card surface-2 control"><strong>2024–2025</strong><br/>Core vision and prototypes.</div>
      <div class="card surface-2 control"><strong>2025</strong><br/>Public website and product previews.</div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section">
    <a class="btn btn-primary" href="{appBase}/contact">{t('home.cta')}</a>
  </section>
</main>
