<script>
  /**
   * Blog Detail Page (Phase 4 - Frontend Integration)
   * Displays individual blog post with rich content
   */
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import { sanitizeHtml } from '$lib/utils/sanitize';

  /** @type {import('./$types').PageData} */
  export let data;
  
  const { post } = data;
  
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
  
  // Sanitize content for safe rendering (Phase 7 - Security)
  const safeContent = sanitizeHtml(post.content);
</script>

<svelte:head>
  <title>{post.title} - AlgoRhythmics Blog</title>
  <meta name="description" content={post.excerpt || post.title} />
  {#if post.author}
    <meta name="author" content={post.author.name} />
  {/if}
</svelte:head>

<article class="blog-post">
  <div class="container">
    <div class="post-header">
      <div class="breadcrumbs">
        <a href="/blog">← Back to Blog</a>
      </div>
      
      {#if post.featuredImage}
        <img 
          src={post.featuredImage.url} 
          alt={post.featuredImage.alternativeText || post.title}
          class="featured-image"
        />
      {/if}
      
      <div class="post-meta">
        <time datetime={post.publishDate} class="post-date">
          {formatDate(post.publishDate)}
        </time>
        {#if post.categories?.length}
          <div class="post-categories">
            {#each post.categories as category}
              <span class="category-badge">{category.name}</span>
            {/each}
          </div>
        {/if}
      </div>
      
      <h1 class="post-title">{post.title}</h1>
      
      {#if post.excerpt}
        <p class="post-excerpt">{post.excerpt}</p>
      {/if}
      
      {#if post.author}
        <div class="post-author">
          {#if post.author.avatar}
            <img 
              src={post.author.avatar.url} 
              alt={post.author.name}
              class="author-avatar"
            />
          {/if}
          <div class="author-info">
            <div class="author-name">{post.author.name}</div>
            {#if post.author.bio}
              <div class="author-bio">{post.author.bio}</div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
    
    <GlassCard class="post-content-card" padding="lg">
      <div class="post-content prose">
        {@html safeContent}
      </div>
    </GlassCard>
    
    {#if post.tags?.length}
      <div class="post-tags">
        <span class="tags-label">Tags:</span>
        {#each post.tags as tag}
          <span class="tag-badge">{tag.name}</span>
        {/each}
      </div>
    {/if}
    
    <div class="post-footer">
      <Button href="/blog" variant="secondary">← Back to Blog</Button>
    </div>
  </div>
</article>

<style>
  .blog-post {
    padding: 2rem 0 4rem;
  }

  .container {
    max-width: 48rem;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .post-header {
    margin-bottom: 2rem;
  }

  .breadcrumbs {
    margin-bottom: 1.5rem;
  }

  .breadcrumbs a {
    color: var(--voyage-blue);
    text-decoration: none;
    font-size: 0.95rem;
  }

  .breadcrumbs a:hover {
    text-decoration: underline;
  }

  .featured-image {
    width: 100%;
    height: auto;
    max-height: 28rem;
    object-fit: cover;
    border-radius: 0.75rem;
    margin-bottom: 2rem;
  }

  .post-meta {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: color-mix(in srgb, var(--text) 70%, transparent);
  }

  .post-categories {
    display: flex;
    gap: 0.5rem;
  }

  .category-badge {
    padding: 0.25rem 0.75rem;
    background: rgba(var(--voyage-blue-rgb), 0.15);
    border-radius: 0.25rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .post-title {
    font-size: clamp(2rem, 5vw, 2.75rem);
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .post-excerpt {
    font-size: 1.25rem;
    line-height: 1.6;
    color: color-mix(in srgb, var(--text) 85%, transparent);
    margin-bottom: 2rem;
  }

  .post-author {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background: color-mix(in srgb, var(--surface) 50%, transparent);
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  .author-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
  }

  .author-info {
    flex: 1;
  }

  .author-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .author-bio {
    font-size: 0.9rem;
    color: color-mix(in srgb, var(--text) 75%, transparent);
  }

  :global(.post-content-card) {
    margin-bottom: 2rem;
  }

  .post-content {
    line-height: 1.8;
  }

  /* Prose styling for rich content (Phase 7) */
  .prose :global(h2) {
    font-size: 1.75rem;
    margin: 2rem 0 1rem;
  }

  .prose :global(h3) {
    font-size: 1.4rem;
    margin: 1.75rem 0 0.75rem;
  }

  .prose :global(p) {
    margin-bottom: 1.25rem;
  }

  .prose :global(ul),
  .prose :global(ol) {
    margin-bottom: 1.25rem;
    padding-left: 2rem;
  }

  .prose :global(li) {
    margin-bottom: 0.5rem;
  }

  .prose :global(a) {
    color: var(--voyage-blue);
    text-decoration: underline;
  }

  .prose :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin: 1.5rem 0;
  }

  .prose :global(blockquote) {
    border-left: 4px solid var(--voyage-blue);
    padding-left: 1.5rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: color-mix(in srgb, var(--text) 85%, transparent);
  }

  .prose :global(code) {
    background: color-mix(in srgb, var(--text) 8%, transparent);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }

  .prose :global(pre) {
    background: color-mix(in srgb, var(--text) 8%, transparent);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  .prose :global(pre code) {
    background: none;
    padding: 0;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  .tags-label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .tag-badge {
    padding: 0.25rem 0.75rem;
    background: rgba(var(--aurora-purple-rgb), 0.15);
    border-radius: 0.25rem;
    font-size: 0.85rem;
  }

  .post-footer {
    text-align: center;
  }
</style>
