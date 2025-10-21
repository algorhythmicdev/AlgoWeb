<script>
  import { resolveMediaUrl, normaliseRelation } from '$lib/utils';
  import { sanitizeHtml } from '$lib/utils/sanitize';
  import Button from '$lib/components/Button.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import { _ } from '$lib/i18n';

  /** @type {import('./$types').PageData} */
  export let data;

  $: article = data.article;
  $: attributes = article?.attributes || {};
  $: content = attributes.content || '';
  $: safeContent = sanitizeHtml(content);
  $: featuredImage = attributes.featuredImage?.data?.attributes;
  $: featuredImageUrl = resolveMediaUrl(featuredImage?.url);
  $: categories = normaliseRelation(attributes.categories);
  $: tags = normaliseRelation(attributes.tags);
</script>

<svelte:head>
  <title>
    {(attributes.title || $_('platform.slug.default_title')) + ' - ' + $_('platform.slug.title_suffix')}
  </title>
  <meta name="description" content={attributes.excerpt || attributes.description || ''} />
</svelte:head>

<div class="reading-shell reading-shell--narrow">
  <nav class="reading-shell__nav">
    <Button href="/platform" variant="subtle">
      {$_('platform.buttons.back_to_list')}
    </Button>
  </nav>

  <article class="reading-shell__content">
    <GlassCard padding="lg" class="reading-shell__card">
      {#if featuredImageUrl}
        <figure class="reading-shell__media">
          <img
            src={featuredImageUrl}
            alt={featuredImage.alternativeText || attributes.title}
            class="reading-shell__image reading-shell__image--tall"
            loading="lazy"
          />
        </figure>
      {/if}

      <header class="reading-shell__header">
        <h1 class="reading-shell__title">{attributes.title}</h1>

        {#if attributes.excerpt}
          <p class="reading-shell__lead">{attributes.excerpt}</p>
        {/if}

        <div class="reading-shell__meta">
          {#if attributes.publishDate}
            <time datetime={attributes.publishDate}>
              {new Date(attributes.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          {/if}

          {#if attributes.author?.data}
            <span>
              {$_('platform.card.by', {
                values: {
                  name:
                    attributes.author.data.attributes?.name ||
                    $_('platform.card.author_fallback')
                }
              })}
            </span>
          {/if}

          {#if categories.length}
            <ul class="reading-shell__categories" aria-label={$_('platform.card.categories_label')}>
              {#each categories as category (category.id)}
                <li>{category.attributes?.name || $_('platform.card.category_fallback')}</li>
              {/each}
            </ul>
          {/if}
        </div>

        {#if tags.length}
          <div class="reading-shell__tags">
            <span class="reading-shell__tags-label text-eyebrow">
              {$_('platform.card.tags_label')}
            </span>
            {#each tags as tag (tag.id)}
              <span class="tag-chip">{tag.attributes?.name || ''}</span>
            {/each}
          </div>
        {/if}
      </header>

      {#if safeContent}
        <div class="reading-prose">
          {@html safeContent}
        </div>
      {/if}
    </GlassCard>
  </article>

  <nav class="reading-shell__footer">
    <Button href="/platform" variant="secondary">
      {$_('platform.buttons.back_to_list')}
    </Button>
  </nav>
</div>

<style>
  .reading-shell__categories {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    padding: 0;
    margin: 0;
    list-style: none;
    font-size: var(--text-eyebrow);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--voyage-blue) 75%, transparent 25%);
  }
</style>
