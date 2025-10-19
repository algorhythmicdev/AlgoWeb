<script>
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import { _ } from '$lib/i18n';

  /** @type {import('./$types').PageData} */
  export let data;

  $: articles = data.articles || [];
  $: error = data.error;
</script>

<svelte:head>
  <title>{$_('platform.meta.title')}</title>
  <meta name="description" content={$_('platform.meta.description')} />
</svelte:head>

<Hero class="hero--platform" variant="grid" title={$_('platform.hero.title')}>
  <svelte:fragment slot="description">
    <p class="hero-description">{$_('platform.hero.description')}</p>
  </svelte:fragment>
</Hero>

<div class="platform-catalog">
  {#if error}
    <GlassCard padding="lg" class="platform-catalog__status">
      <h2>{$_('platform.error.title')}</h2>
      <p>{$_('platform.error.help')}</p>
    </GlassCard>
  {:else if articles.length === 0}
    <GlassCard padding="lg" class="platform-catalog__status">
      <h2>{$_('platform.empty.title')}</h2>
      <p>{$_('platform.empty.description')}</p>
    </GlassCard>
  {:else}
    <div class="platform-catalog__grid">
      {#each articles as article}
        {@const attributes = article.attributes || {}}
        {@const featuredImage = attributes.featuredImage?.data?.attributes}

        <GlassCard interactive class="platform-card">
          {#if featuredImage}
            <img
              src={featuredImage.url}
              alt={featuredImage.alternativeText || attributes.title}
              class="platform-card__image"
              loading="lazy"
            />
          {/if}

          <div class="platform-card__body">
            <div class="platform-card__eyebrow">
              {#if attributes.category?.data}
                <span class="platform-card__category text-eyebrow">
                  {attributes.category.data.attributes?.name || $_('platform.card.category_fallback')}
                </span>
              {/if}
            </div>

            <h3 class="platform-card__title">
              <a href="/platform/{attributes.slug}">
                {attributes.title}
              </a>
            </h3>

            {#if attributes.excerpt}
              <p class="platform-card__excerpt">
                {attributes.excerpt}
              </p>
            {/if}

            <div class="platform-card__meta">
              {#if attributes.publishDate}
                <time datetime={attributes.publishDate}>
                  {new Date(attributes.publishDate).toLocaleDateString()}
                </time>
              {/if}

              {#if attributes.author?.data}
                <span class="platform-card__author">
                  {$_('platform.card.by', {
                    values: {
                      name:
                        attributes.author.data.attributes?.name ||
                        $_('platform.card.author_fallback')
                    }
                  })}
                </span>
              {/if}
            </div>

            <div class="platform-card__cta">
              <Button href="/platform/{attributes.slug}" variant="subtle">
                {$_('platform.card.cta')}
              </Button>
            </div>
          </div>
        </GlassCard>
      {/each}
    </div>
  {/if}
</div>

<style>
  .hero-description {
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary, color-mix(in srgb, var(--text) 82%, transparent 18%));
  }

  .platform-catalog {
    width: min(100%, var(--container-xl));
    margin-inline: auto;
    padding-inline: clamp(var(--space-xl), 6vw, var(--space-4xl));
    padding-block: clamp(var(--space-2xl), 7vw, var(--space-5xl));
    display: grid;
    gap: var(--space-3xl);
  }

  :global(.platform-catalog__status) {
    max-width: var(--container-md);
    margin-inline: auto;
    text-align: center;
    display: grid;
    gap: var(--space-lg);
  }

  :global(.platform-catalog__status h2) {
    margin: 0;
  }

  :global(.platform-catalog__status p) {
    margin: 0;
    color: var(--text-secondary, color-mix(in srgb, var(--text) 76%, transparent 24%));
  }

  .platform-catalog__grid {
    display: grid;
    gap: var(--space-2xl);
    grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  }

  :global(.platform-card) {
    display: grid;
    grid-auto-rows: min-content;
    overflow: hidden;
  }

  .platform-card__image {
    width: 100%;
    height: clamp(12rem, 28vw, 14rem);
    object-fit: cover;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .platform-card__body {
    display: grid;
    gap: var(--space-lg);
    padding: var(--component-padding-lg);
  }

  .platform-card__eyebrow {
    min-height: var(--space-md);
  }

  .platform-card__category {
    color: color-mix(in srgb, var(--voyage-blue) 78%, transparent 22%);
  }

  .platform-card__title {
    font-size: var(--text-title);
    line-height: var(--leading-snug);
    margin: 0;
  }

  .platform-card__title a {
    color: inherit;
    text-decoration: none;
    transition: color var(--duration-fast, 220ms) ease;
  }

  .platform-card__title a:hover {
    color: var(--voyage-blue);
  }

  .platform-card__excerpt {
    margin: 0;
    color: var(--text-secondary, color-mix(in srgb, var(--text) 78%, transparent 22%));
    line-height: var(--leading-relaxed);
  }

  .platform-card__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-lg);
    font-size: var(--text-meta);
    color: color-mix(in srgb, var(--text) 70%, transparent 30%);
  }

  .platform-card__meta time {
    font-variant-numeric: tabular-nums;
  }

  .platform-card__author {
    text-align: right;
  }

  .platform-card__cta {
    margin-top: auto;
  }

  @media (max-width: 720px) {
    .platform-card__meta {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
