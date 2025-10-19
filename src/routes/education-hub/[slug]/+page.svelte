<script>
  import { sanitizeHtml } from '$lib/utils/sanitize';
  import Button from '$lib/components/Button.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import { _ } from '$lib/i18n';

  /** @type {import('./$types').PageData} */
  export let data;

  $: module = data.module;
  $: attributes = module?.attributes || {};
  $: content = attributes.content || '';
  $: safeContent = sanitizeHtml(content);
</script>

<svelte:head>
  <title>
    {(attributes.title || $_('education_hub.slug.default_title')) + ' - ' + $_('education_hub.slug.title_suffix')}
  </title>
  <meta name="description" content={attributes.description || attributes.excerpt || ''} />
</svelte:head>

<div class="reading-shell reading-shell--narrow">
  <nav class="reading-shell__nav">
    <Button href="/education-hub" variant="subtle">
      {$_('education_hub.slug.back')}
    </Button>
  </nav>

  <article class="reading-shell__content">
    <GlassCard padding="lg" class="reading-shell__card">
      <header class="reading-shell__header">
        <h1 class="reading-shell__title">{attributes.title}</h1>
        
        {#if attributes.description}
          <p class="reading-shell__lead">{attributes.description}</p>
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

          {#if attributes.category?.data}
            <span>
              {$_('education_hub.slug.category', {
                name: attributes.category.data.attributes?.name || $_('education_hub.slug.category_fallback')
              })}
            </span>
          {/if}
        </div>

        {#if attributes.tags?.data && attributes.tags.data.length > 0}
          <div class="reading-shell__tags">
            {#each attributes.tags.data as tag}
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

      {#if attributes.mediaAttachments?.data && attributes.mediaAttachments.data.length > 0}
        <div class="resource-stack">
          <h2>{$_('education_hub.slug.resources_title')}</h2>
          <div class="resource-grid">
            {#each attributes.mediaAttachments.data as media}
              {#if media.attributes}
                <div class="resource-card">
                  {#if media.attributes.mime?.startsWith('image/')}
                    <img
                      src={media.attributes.url}
                      alt={media.attributes.alternativeText || media.attributes.name}
                      class="resource-card__image"
                      loading="lazy"
                    />
                  {:else}
                    <a
                      href={media.attributes.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="resource-card__link"
                    >
                      {media.attributes.name}
                    </a>
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </GlassCard>
  </article>

  <nav class="reading-shell__footer">
    <Button href="/education-hub" variant="secondary">
      {$_('education_hub.slug.back')}
    </Button>
  </nav>
</div>

<style>
  .resource-stack {
    display: grid;
    gap: var(--space-xl);
    margin-top: var(--space-3xl);
  }

  .resource-stack h2 {
    margin: 0;
  }

  .resource-grid {
    display: grid;
    gap: var(--space-lg);
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  }

  .resource-card {
    display: grid;
    gap: var(--space-sm);
    padding: var(--component-padding-md);
    border-radius: var(--radius-lg);
    border: 1px solid var(--surface-field-border);
    background: color-mix(in srgb, var(--surface-field-bg) 65%, transparent 35%);
  }

  .resource-card__image {
    width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }

  .resource-card__link {
    color: var(--voyage-blue);
    font-size: var(--text-meta);
    font-weight: var(--weight-medium);
  }

  .resource-card__link:hover {
    color: var(--aurora-purple);
  }
</style>
