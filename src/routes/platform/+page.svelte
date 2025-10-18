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

<div class="container mx-auto px-4 py-12">
  {#if error}
    <GlassCard padding="lg" class="max-w-2xl mx-auto text-center">
      <h2 class="text-2xl font-bold mb-4">{$_('platform.error.title')}</h2>
      <p class="text-gray-600 dark:text-gray-300">{$_('platform.error.help')}</p>
    </GlassCard>
  {:else if articles.length === 0}
    <GlassCard padding="lg" class="max-w-2xl mx-auto text-center">
      <h2 class="text-2xl font-bold mb-4">{$_('platform.empty.title')}</h2>
      <p class="text-gray-600 dark:text-gray-300">{$_('platform.empty.description')}</p>
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
                  {attributes.category.data.attributes?.name || $_('platform.card.category_fallback')}
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
                <span>
                  {$_('platform.card.by', {
                    name: attributes.author.data.attributes?.name || $_('platform.card.author_fallback')
                  })}
                </span>
              {/if}
            </div>

            <div class="mt-4">
              <Button href="/platform/{attributes.slug}" variant="subtle" size="sm">
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
    font-size: clamp(1rem, 2.2vw, 1.3rem);
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, rgba(var(--ink-rgb), 0.8) 12%);
  }
</style>
