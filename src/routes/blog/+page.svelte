<script>
  /**
   * Blog Index Page (Phase 4 - Frontend Integration)
   * Lists all blog posts with dynamic content from CMS
   */
  import Hero from '$lib/components/Hero.svelte';
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import SectionDivider from '$lib/components/SectionDivider.svelte';
  import { staggerReveal } from '$lib/animations';
  import { _ } from '$lib/i18n';

  /** @type {import('./$types').PageData} */
  export let data;
  
  const { posts = [], error } = data;
  
  /**
   * Format date for display
   * @param {string} dateString
   */
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>{$_('blog.meta.title')}</title>
  <meta name="description" content={$_('blog.meta.description')} />
</svelte:head>

<Hero
  class="hero--blog"
  variant="grid"
  title={$_('blog.hero.title')}
  subtitle={$_('blog.hero.subtitle')}
>
  <svelte:fragment slot="description">
    <p class="hero-description">{$_('blog.hero.description')}</p>
  </svelte:fragment>
</Hero>

<SectionDivider label={$_('blog.sections.latest')} tone="aurora" />

<section class="section blog-posts" data-surface="glow">
  <div class="container">
    {#if error}
      <GlassCard padding="lg" class="error-card">
        <div class="error-message">
          <h2>{$_('blog.error.title')}</h2>
          <p>{error}</p>
          <p class="help-text">{$_('blog.error.help')}</p>
        </div>
      </GlassCard>
    {:else if posts.length === 0}
      <GlassCard padding="lg" class="empty-state">
        <div class="empty-message">
          <h2>{$_('blog.empty.title')}</h2>
          <p>{$_('blog.empty.description')}</p>
        </div>
      </GlassCard>
    {:else}
      <div class="posts-grid" use:staggerReveal>
        {#each posts as post}
          <GlassCard as="article" class="post-card" interactive>
            <a href="/blog/{post.slug}" class="post-link">
              {#if post.featuredImage}
                <img 
                  src={post.featuredImage.url} 
                  alt={post.featuredImage.alternativeText || post.title}
                  class="post-image"
                  loading="lazy"
                />
              {/if}
              
              <div class="post-content">
                <div class="post-meta">
                  <time datetime={post.publishDate}>
                    {formatDate(post.publishDate)}
                  </time>
                  {#if post.categories?.length}
                    <span class="post-category">{post.categories[0].name}</span>
                  {/if}
                </div>
                
                <h2 class="post-title">{post.title}</h2>
                
                {#if post.excerpt}
                  <p class="post-excerpt">{post.excerpt}</p>
                {/if}
                
                {#if post.author}
                  <div class="post-author">
                    {$_('blog.card.by', { name: post.author.name ?? '' })}
                  </div>
                {/if}
                
                <div class="post-action">
                  <Button variant="subtle" size="sm">
                    {$_('blog.card.cta')}
                  </Button>
                </div>
              </div>
            </a>
          </GlassCard>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .hero-description {
    font-size: var(--text-body);
    line-height: var(--leading-relaxed);
    color: var(--text-secondary, color-mix(in srgb, var(--text) 82%, transparent 18%));
  }

  .section.blog-posts {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    isolation: isolate;
  }

  :global(.error-card),
  :global(.empty-state) {
    max-width: var(--container-md);
    margin-inline: auto;
    text-align: center;
    display: grid;
    gap: var(--space-lg);
  }

  .error-message h2,
  .empty-message h2 {
    font-size: var(--text-title);
    margin: 0;
  }

  .error-message p,
  .empty-message p {
    color: var(--text-secondary, color-mix(in srgb, var(--text) 78%, transparent 22%));
    line-height: var(--leading-relaxed);
    margin: 0;
  }

  .help-text {
    margin: 0;
    font-size: var(--text-meta);
    color: color-mix(in srgb, var(--text) 68%, transparent 32%);
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: var(--space-2xl);
  }

  :global(.post-card) {
    height: 100%;
    overflow: hidden;
  }

  .post-link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    height: 100%;
  }

  .post-image {
    width: 100%;
    height: clamp(11rem, 24vw, 14rem);
    object-fit: cover;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .post-content {
    padding: var(--component-padding-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    flex: 1;
  }

  .post-meta {
    display: flex;
    gap: var(--space-lg);
    font-size: var(--text-meta);
    color: color-mix(in srgb, var(--voyage-blue) 70%, transparent 30%);
  }

  .post-category {
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .post-title {
    font-size: var(--text-title);
    line-height: var(--leading-snug);
    margin: 0;
  }

  .post-excerpt {
    color: var(--text-secondary, color-mix(in srgb, var(--text) 80%, transparent 20%));
    line-height: var(--leading-relaxed);
    flex: 1;
    margin: 0;
  }

  .post-author {
    font-size: var(--text-meta);
    color: color-mix(in srgb, var(--text) 70%, transparent 30%);
  }

  .post-action {
    margin-top: auto;
  }

  @media (max-width: 768px) {
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
