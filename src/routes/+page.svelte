<script lang="ts">
  import { base as appBase } from '$app/paths';
  import { i18n } from '$lib/i18n';
  $: t = $i18n;

  import VideoPlayer from '$lib/components/VideoPlayer.svelte';
  import AssetImage from '$lib/components/AssetImage.svelte';
  import Card from '$lib/components/Card.svelte';
  import { videoAlgorhythmics, productIcons } from '$lib/presentAssets';
  const algVid = videoAlgorhythmics; // string | null
  const ixIcon  = productIcons.find(p => /ideonautix[-_]?icon$/i.test(p))   || '/images/products/ideonautix-icon';
  const nvIcon  = productIcons.find(p => /nodevoyage[-_]?icon$/i.test(p))   || '/images/products/nodevoyage-icon';
  const contactHref = `${appBase}/contact`;
  const ideonautixHref = `${appBase}/ideonautix`;
  const nodevoyageHref = `${appBase}/nodevoyage`;
  const consultingHref = `${appBase}/consulting`;
  const educationHref = `${appBase}/education`;
</script>

<svelte:head>
  <title>Algorhythmics</title>
  <meta name="description" content="Practical AI tools, consulting, and education—built in Latvia." />
</svelte:head>

<main id="main" class="prose rhythm">

  <section class="section hero-gradient hero-halo" style="position:relative">
    <div class="container" style="padding: clamp(3rem, 6vw, 6rem) 0;">
      <div class="frosted card" style="max-width: 820px; margin: 0 auto; text-align:center; padding: clamp(2.5rem, 6vw, 3.5rem);">
        <h1 class="text-strong" style="margin:0 0 .5rem">{t('home.hero_title')}</h1>
        <p class="text-secondary" style="margin:0 0 1.5rem">{t('home.hero_lead')}</p>
        <a class="btn btn-primary" href={contactHref}>{t('home.cta')}</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container" style="display:grid; gap: var(--space-5, 2rem);">
      <div style="text-align:center;">
        <h2 class="text-strong" style="margin-bottom:.5rem">{t('home.products')}</h2>
        <p class="text-secondary" style="margin:0 auto; max-width: 52ch;">
          Practical tools built in public with partners who need them today.
        </p>
      </div>
      <div class="grid" style="gap: var(--space-5, 2rem);">
        <Card as="a" elevation={1} className="rhythm-tight" href={ideonautixHref}>
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem;">
            <AssetImage assetBase={ixIcon} alt="Ideonautix icon" width={44} height={44} radius={12} />
            <h3 class="text-strong" style="margin:0">Ideonautix</h3>
          </div>
          <p class="text-secondary" style="margin:0 0 .75rem;">
            Startup education & productivity toolkit.
          </p>
          <ul class="text-secondary" style="margin:0; padding-left:1.1rem;">
            <li>Pitch Assistant</li>
            <li>Competitive Intelligence</li>
            <li>Pomodoro Coach</li>
          </ul>
        </Card>
        <Card as="a" elevation={1} className="rhythm-tight" href={nodevoyageHref}>
          <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem;">
            <AssetImage assetBase={nvIcon} alt="NodeVoyage icon" width={44} height={44} radius={12} />
            <h3 class="text-strong" style="margin:0">NodeVoyage</h3>
          </div>
          <p class="text-secondary" style="margin:0 0 .75rem;">
            AI-assisted trip planning with Nodi.
          </p>
          <ul class="text-secondary" style="margin:0; padding-left:1.1rem;">
            <li>Smart suggestions</li>
            <li>Route planning</li>
            <li>Collaboration</li>
          </ul>
        </Card>
      </div>
    </div>
  </section>

  <section class="section" style="background: var(--bg-elev-2);">
    <div class="container" style="display:grid; gap: var(--space-5, 2rem);">
      <div style="text-align:center;">
        <h2 class="text-strong" style="margin-bottom:.5rem">{t('home.what_we_do')}</h2>
        <p class="text-secondary" style="margin:0 auto; max-width: 56ch;">
          We pair practical automation with education so teams learn while they ship.
        </p>
      </div>
      <div class="grid" style="gap: var(--space-5, 2rem);">
        <Card elevation={2} className="rhythm-tight" heading="Consulting">
          <p class="text-secondary">
            Automation, data flows, and training. Clear outcomes, shipped fast.
          </p>
          <a class="btn" href={consultingHref}>Learn more</a>
        </Card>
        <Card elevation={2} className="rhythm-tight" heading="Education">
          <p class="text-secondary">
            Plain-language AI programs for Latvian schools and universities.
          </p>
          <a class="btn" href={educationHref}>Programs</a>
        </Card>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container" style="display:grid; gap: var(--space-5, 2rem);">
      <h2 class="text-strong" style="margin-bottom:0; text-align:center;">{t('home.promo')}</h2>
      <Card elevation={2} className="rhythm-tight" as="section">
        <VideoPlayer videoBase={algVid} label={t('home.promo')} />
      </Card>
    </div>
  </section>

  <section class="section">
    <div class="container" style="display:grid; gap: var(--space-5, 2rem);">
      <h2 class="text-strong" style="margin-bottom:0; text-align:center;">{t('home.testimonials')}</h2>
      <div class="grid" style="gap: var(--space-4, 1.5rem);">
        <Card as="blockquote" elevation={2} className="rhythm-tight">
          <p class="text-secondary" style="margin:0 0 .75rem;">"Clear plan, shipped fast. We finally see results."</p>
          <footer class="text-strong">— Program lead</footer>
        </Card>
        <Card as="blockquote" elevation={2} className="rhythm-tight">
          <p class="text-secondary" style="margin:0 0 .75rem;">"They explain things simply and deliver the parts that matter."</p>
          <footer class="text-strong">— Founder</footer>
        </Card>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container" style="display:grid; gap: var(--space-4, 1.5rem);">
      <h2 class="text-strong" style="margin-bottom:0; text-align:center;">{t('home.timeline')}</h2>
      <div class="grid" style="gap: var(--space-4, 1.5rem);">
        <Card elevation={2} className="rhythm-tight" heading="2024–2025">
          <p class="text-secondary" style="margin:0;">Core vision and prototypes.</p>
        </Card>
        <Card elevation={2} className="rhythm-tight" heading="2025">
          <p class="text-secondary" style="margin:0;">Public website and product previews.</p>
        </Card>
      </div>
    </div>
  </section>

  <section class="section" style="text-align:center;">
    <a class="btn btn-primary" href={contactHref}>{t('home.cta')}</a>
  </section>
</main>
