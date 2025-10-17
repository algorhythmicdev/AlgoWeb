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
  <title>Blog - AlgoRhythmics</title>
  <meta name="description" content="Insights, stories, and updates from the AlgoRhythmics team on calm AI, educational technology, and responsible innovation." />
</svelte:head>

<Hero
  class="hero--blog"
  variant="grid"
  title="Blog & Insights"
  subtitle="Stories, research, and perspectives on calm AI"
>
  <svelte:fragment slot="description">
    <p class="hero-description">
      Explore our latest thinking on responsible AI, educational technology, 
      and building inclusive digital experiences.
    </p>
  </svelte:fragment>
</Hero>

<SectionDivider label="Latest Articles" tone="aurora" />

<section class="section blog-posts" data-surface="glow">
  <div class="container">
    {#if error}
      <GlassCard padding="lg" class="error-card">
        <div class="error-message">
          <h2>Content Temporarily Unavailable</h2>
          <p>{error}</p>
          <p class="help-text">
            The blog content is managed through our CMS. Please ensure the Strapi 
            backend is configured and running.
          </p>
        </div>
      </GlassCard>
    {:else if posts.length === 0}
      <GlassCard padding="lg" class="empty-state">
        <div class="empty-message">
          <h2>No Posts Yet</h2>
          <p>Check back soon for insightful articles about calm AI and educational innovation.</p>
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
                    By {post.author.name}
                  </div>
                {/if}
                
                <div class="post-action">
                  <Button variant="subtle" size="sm">Read More →</Button>
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
    font-size: clamp(1rem, 2.2vw, 1.3rem);
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, rgba(var(--ink-rgb), 0.8) 12%);
  }

  .section.blog-posts {
    --section-glow-primary: rgba(var(--aurora-purple-rgb), 0.22);
    --section-glow-secondary: rgba(var(--voyage-blue-rgb), 0.18);
    isolation: isolate;
  }

  :global(.error-card),
  :global(.empty-state) {
    max-width: 42rem;
    margin: 0 auto;
    text-align: center;
  }

  .error-message h2,
  .empty-message h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .error-message p,
  .empty-message p {
    color: color-mix(in srgb, var(--text) 80%, transparent);
    line-height: 1.6;
  }

  .help-text {
    margin-top: 1rem;
    font-size: 0.9rem;
    color: color-mix(in srgb, var(--text) 70%, transparent);
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 2rem;
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
    height: 12rem;
    object-fit: cover;
    border-radius: 0.5rem 0.5rem 0 0;
  }

  .post-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    flex: 1;
  }

  .post-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: color-mix(in srgb, var(--voyage-blue) 70%, transparent);
  }

  .post-category {
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .post-title {
    font-size: 1.25rem;
    line-height: 1.4;
    margin: 0;
  }

  .post-excerpt {
    color: color-mix(in srgb, var(--text) 80%, transparent);
    line-height: 1.6;
    flex: 1;
  }

  .post-author {
    font-size: 0.9rem;
    color: color-mix(in srgb, var(--text) 70%, transparent);
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
