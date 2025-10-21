<script>
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import { resolveMediaUrl, normaliseRelation } from '$lib/utils';
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
        {@const coverUrl = resolveMediaUrl(featuredImage?.url)}
        {@const categories = normaliseRelation(attributes.categories)}

        <GlassCard interactive class="platform-card">
          {#if coverUrl}
            <img
              src={coverUrl}
              alt={featuredImage.alternativeText || attributes.title}
              class="platform-card__image"
              loading="lazy"
            />
          {/if}

          <div class="platform-card__body">
            <div class="platform-card__eyebrow">
              {#if categories.length}
                <ul class="platform-card__categories" aria-label={$_('platform.card.categories_label')}>
                  {#each categories as category (category.id)}
                    <li>{category.attributes?.name || $_('platform.card.category_fallback')}</li>
                  {/each}
                </ul>
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
    color: var(--text-secondary);
  }

  .platform-catalog__grid {
    display: grid;
    gap: var(--grid-gap-lg);
    grid-template-columns: repeat(auto-fit, minmax(var(--grid-min-card), 1fr));
    justify-content: center;
  }

  :global(.platform-card) {
    display: grid;
    grid-auto-rows: min-content;
    overflow: hidden;
  }

  .platform-card__image {
    width: 100%;
    height: var(--media-thumb-height);
    object-fit: cover;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .platform-card__body {
    display: grid;
    gap: var(--cluster-gap-md);
    padding: var(--component-padding-lg);
  }

  .platform-card__eyebrow {
    min-height: var(--space-md);
  }

  .platform-card__categories {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .platform-card__categories li {
    font-size: var(--text-eyebrow);
    letter-spacing: 0.08em;
    text-transform: uppercase;
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
    transition: color var(--duration-fast) ease;
  }

  .platform-card__title a:hover {
    color: var(--voyage-blue);
  }

  .platform-card__excerpt {
    margin: 0;
    color: var(--text-secondary);
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
  .hero-description {
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary);
  }
</style>

