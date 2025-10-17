<script>
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import Hero from '$lib/components/Hero.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  $: articles = data.articles || [];
  $: error = data.error;
</script>

<svelte:head>
  <title>Platform Articles - AlgoRhythmics</title>
  <meta
    name="description"
    content="Explore platform articles, case studies, and insights about our technology platforms."
  />
</svelte:head>

<Hero class="hero--platform" variant="grid" title="Platform Articles">
  <svelte:fragment slot="description">
    <p class="hero-description">
      Explore in-depth articles about our platforms: NodeVoyage and Ideonautix.
      Learn about the technology, use cases, and real-world implementations.
    </p>
  </svelte:fragment>
</Hero>

<div class="container mx-auto px-4 py-12">
  {#if error}
    <GlassCard padding="lg" class="max-w-2xl mx-auto text-center">
      <h2 class="text-2xl font-bold mb-4">Content Temporarily Unavailable</h2>
      <p class="text-gray-600 dark:text-gray-300">
        The platform articles are managed through our CMS. Please ensure the Strapi
        backend is configured and running.
      </p>
    </GlassCard>
  {:else if articles.length === 0}
    <GlassCard padding="lg" class="max-w-2xl mx-auto text-center">
      <h2 class="text-2xl font-bold mb-4">No Articles Yet</h2>
      <p class="text-gray-600 dark:text-gray-300">
        Check back soon for platform articles and case studies.
      </p>
    </GlassCard>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each articles as article}
        {@const attributes = article.attributes || {}}
        {@const featuredImage = attributes.featuredImage?.data?.attributes}
        
        <GlassCard interactive class="flex flex-col">
          {#if featuredImage}
            <img
              src={featuredImage.url}
              alt={featuredImage.alternativeText || attributes.title}
              class="w-full h-48 object-cover rounded-t-lg"
              loading="lazy"
            />
          {/if}

          <div class="p-6 flex-1 flex flex-col">
            <div class="mb-4">
              {#if attributes.category?.data}
                <span class="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  {attributes.category.data.attributes?.name || 'Platform'}
                </span>
              {/if}
            </div>

            <h3 class="text-xl font-bold mb-2">
              <a href="/platform/{attributes.slug}" class="hover:text-blue-600">
                {attributes.title}
              </a>
            </h3>

            {#if attributes.excerpt}
              <p class="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                {attributes.excerpt}
              </p>
            {/if}

            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
              {#if attributes.publishDate}
                <time datetime={attributes.publishDate}>
                  {new Date(attributes.publishDate).toLocaleDateString()}
                </time>
              {/if}
              
              {#if attributes.author?.data}
                <span>By {attributes.author.data.attributes?.name || 'Anonymous'}</span>
              {/if}
            </div>

            <div class="mt-4">
              <Button href="/platform/{attributes.slug}" variant="subtle" size="sm">
                Read Article →
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
    font-size: clamp(1rem, 2.2vw, 1.3rem);
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, rgba(var(--ink-rgb), 0.8) 12%);
  }
</style>
