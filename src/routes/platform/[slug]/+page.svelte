<script>
  import { sanitizeHtml } from '$lib/utils/sanitize';
  import Button from '$lib/components/Button.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  $: article = data.article;
  $: attributes = article?.attributes || {};
  $: content = attributes.content || '';
  $: safeContent = sanitizeHtml(content);
  $: featuredImage = attributes.featuredImage?.data?.attributes;
</script>

<svelte:head>
  <title>{attributes.title || 'Platform Article'} - AlgoRhythmics</title>
  <meta name="description" content={attributes.excerpt || attributes.description || ''} />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <nav class="mb-8">
    <Button href="/platform" variant="subtle">← Back to Platform Articles</Button>
  </nav>

  <article>
    <GlassCard padding="lg">
      {#if featuredImage}
        <img
          src={featuredImage.url}
          alt={featuredImage.alternativeText || attributes.title}
          class="w-full h-auto rounded-lg mb-8"
          loading="lazy"
        />
      {/if}

      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{attributes.title}</h1>
        
        {#if attributes.excerpt}
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">
            {attributes.excerpt}
          </p>
        {/if}

        <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
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
              By {attributes.author.data.attributes?.name || 'Anonymous'}
            </span>
          {/if}

          {#if attributes.category?.data}
            <span>
              {attributes.category.data.attributes?.name || 'Platform'}
            </span>
          {/if}
        </div>

        {#if attributes.tags?.data && attributes.tags.data.length > 0}
          <div class="mt-4 flex flex-wrap gap-2">
            <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">Tags:</span>
            {#each attributes.tags.data as tag}
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                {tag.attributes?.name || ''}
              </span>
            {/each}
          </div>
        {/if}
      </header>

      {#if safeContent}
        <div class="prose dark:prose-invert max-w-none">
          {@html safeContent}
        </div>
      {/if}
    </GlassCard>
  </article>

  <nav class="mt-8">
    <Button href="/platform" variant="secondary">← Back to Platform Articles</Button>
  </nav>
</div>

<style>
  .prose {
    line-height: 1.75;
  }

  .prose :global(h1),
  .prose :global(h2),
  .prose :global(h3) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
  }

  .prose :global(p) {
    margin-bottom: 1em;
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin-left: 1.5em;
    margin-bottom: 1em;
  }

  .prose :global(a) {
    color: var(--voyage-blue);
    text-decoration: underline;
  }

  .prose :global(a:hover) {
    color: var(--aurora-purple);
  }

  .prose :global(img) {
    border-radius: 0.5rem;
    margin: 2rem auto;
  }
</style>
