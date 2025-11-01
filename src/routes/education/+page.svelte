<script lang="ts">
  import { base } from '$app/paths';
  import { i18n } from '$lib/i18n';
  $: t = $i18n;
  import HeroEpic from '$lib/components/HeroEpic.svelte';
  import CardHalo from '$lib/components/CardHalo.svelte';
  import AnimatedDivider from '$lib/components/AnimatedDivider.svelte';
  import RevealOnScroll from '$lib/components/RevealOnScroll.svelte';
  import Icon from '$lib/components/icons/Icon.svelte';
  const contactHref = `${base}/contact`;
</script>

<svelte:head>
  <title>{t('education.page_title')}</title>
  <meta name="description" content={t('education.page_description')} />
</svelte:head>

<main id="main">
  <HeroEpic
    title={t('education.hero_title')}
    subtitle={t('education.hero_subtitle')}
    description={t('education.hero_description')}
    ctaLabel={t('education.hero_cta')}
    ctaHref="/contact"
    variant="coral"
    particleType="dots"
    size="large"
    animatedTitle={true}
  />

  <AnimatedDivider variant="wave" theme="coral" spacing="spacious" />

  <section class="page container section-spacing">
    <RevealOnScroll animation="fade-up" delay={100}>
      <h2 class="section-title">{t('education.programs_title')}</h2>
    </RevealOnScroll>

    <div class="grid cols-2 programs-grid">
      <RevealOnScroll animation="fade-up" delay={100}>
        <CardHalo halo="coral" interactive glass>
          <h3 style="color:var(--ai-coral-1); margin-top:0; display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="graduation-cap" size={24} />
            {t('education.program_1_title')}
          </h3>
          <p>{t('education.program_1_description')}</p>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={200}>
        <CardHalo halo="quantum" interactive glass>
          <h3 style="color:var(--ai-quantum-1); margin-top:0; display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="lightbulb" size={24} />
            {t('education.program_2_title')}
          </h3>
          <p>{t('education.program_2_description')}</p>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={300}>
        <CardHalo halo="cyber" interactive glass>
          <h3 style="color:var(--ai-cyber-1); margin-top:0; display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="chart-bar" size={24} />
            {t('education.program_3_title')}
          </h3>
          <p>{t('education.program_3_description')}</p>
        </CardHalo>
      </RevealOnScroll>

      <RevealOnScroll animation="fade-up" delay={400}>
        <CardHalo halo="neural" interactive glass>
          <h3 style="color:var(--ai-neural-1); margin-top:0; display: flex; align-items: center; gap: 0.5rem;">
            <Icon name="rocket" size={24} />
            {t('education.program_4_title')}
          </h3>
          <p>{t('education.program_4_description')}</p>
        </CardHalo>
      </RevealOnScroll>
    </div>

    <div class="cta-card">
      <RevealOnScroll animation="scale" delay={500}>
        <CardHalo halo="matrix" glass>
          <h3 style="color:var(--ai-matrix-1); margin-top:0; font-size:1.75rem">{t('education.cta_title')}</h3>
          <p style="font-size:1.125rem; margin:1.5rem 0">{t('education.cta_description')}</p>
          <a class="btn btn-primary" href={contactHref} style="font-size:1.125rem; padding:1rem 2rem">{t('education.cta_button')}</a>
        </CardHalo>
      </RevealOnScroll>
    </div>
  </section>
</main>

<style>
  .section-spacing {
    margin-top: 4rem;
    margin-bottom: 4rem;
  }
  
  .section-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    font-weight: 700;
  }
  
  .programs-grid {
    gap: 2rem;
  }
  
  .cta-card {
    margin-top: 3rem;
    text-align: center;
    padding: 2.5rem;
  }
  
  @media (max-width: 768px) {
    .section-spacing {
      margin-top: 3rem;
      margin-bottom: 3rem;
    }
    
    .cta-card {
      padding: 1.5rem;
    }
  }
</style>
