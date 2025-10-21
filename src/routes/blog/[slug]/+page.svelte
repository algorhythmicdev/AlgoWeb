<script lang="ts">
  /**
   * Blog Detail Page (Phase 4 - Frontend Integration)
   * Displays individual blog post with rich content
   */
  import GlassCard from '$lib/components/GlassCard.svelte';
  import Button from '$lib/components/Button.svelte';
  import { sanitizeHtml } from '$lib/utils/sanitize';
  import { _ } from '$lib/i18n';

  import type { NormalisedPost } from '$lib/utils/strapi';
  import type { PageData } from './$types';

  export let data: PageData;

  const post: NormalisedPost = data.post;

  /**
   * Format date for display
   * @param {string} dateString
   */
  function formatDate(dateString: string | undefined) {
    if (!dateString) return '';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return '';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Sanitize content for safe rendering (Phase 7 - Security)
  const safeContent = sanitizeHtml(post.content ?? '');

  const featuredImage = post.featuredImage;
  const authorAvatar = post.author?.avatar;
  const categories = post.categories;
  const tags = post.tags;
</script>

<svelte:head>
  <title>{post.title} - {$_('blog.slug.title_suffix')}</title>
  <meta name="description" content={post.excerpt || post.title} />
  {#if post.author}
    <meta name="author" content={post.author.name} />
  {/if}
</svelte:head>

<article class="blog-post">
  <div class="reading-shell">
    <div class="post-header">
      <div class="breadcrumbs">
        <a href="/blog">{$_('blog.buttons.back_to_blog')}</a>
      </div>
      
      {#if featuredImage}
        <img
          src={featuredImage.url}
          alt={featuredImage.alt}
          class="featured-image reading-shell__image reading-shell__image--tall"
        />
      {/if}

      <div class="post-meta reading-shell__meta">
        <time datetime={post.publishDate} class="post-date">
          {formatDate(post.publishDate)}
        </time>
        {#if categories.length}
          <div class="post-categories">
            {#each categories as category}
              <span class="category-badge">{category}</span>
            {/each}
          </div>
        {/if}
      </div>
      
      <h1 class="reading-shell__title">{post.title}</h1>

      {#if post.excerpt}
        <p class="reading-shell__lead">{post.excerpt}</p>
      {/if}

      {#if post.author}
        <div class="post-author">
          {#if authorAvatar}
            <img src={authorAvatar.url} alt={authorAvatar.alt} class="author-avatar" />
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
    
    <GlassCard class="post-content-card reading-shell__card" padding="lg">
      <div class="post-content reading-prose">
        {@html safeContent}
      </div>
    </GlassCard>

      {#if tags.length}
        <div class="post-tags reading-shell__tags">
          <span class="tags-label text-eyebrow">{$_('blog.slug.tags_label')}</span>
          {#each tags as tag}
            <span class="tag-chip">{tag}</span>
          {/each}
        </div>
      {/if}

    <div class="post-footer reading-shell__footer">
      <Button href="/blog" variant="secondary">
        {$_('blog.buttons.back_to_blog')}
      </Button>
    </div>
  </div>
</article>

<style>
  .blog-post {
    padding-block: clamp(var(--space-2xl), 8vw, var(--space-5xl));
  }

  .post-header {
    display: grid;
    gap: var(--space-xl);
  }

  .breadcrumbs {
    margin-bottom: var(--space-lg);
  }

  .breadcrumbs a {
    color: var(--voyage-blue);
    text-decoration: none;
    font-size: var(--text-meta);
    font-weight: var(--weight-medium);
  }

  .breadcrumbs a:hover {
    text-decoration: underline;
  }

  .featured-image {
    margin-bottom: 0;
  }

  .post-meta {
    gap: var(--space-lg);
    align-items: center;
  }

  .post-categories {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .category-badge {
    padding-block: var(--chip-padding-block);
    padding-inline: calc(var(--chip-padding-inline) + var(--space-3xs));
    border-radius: var(--radius-full);
    background: color-mix(in srgb, rgba(var(--voyage-blue-rgb), 0.22) 60%, transparent 40%);
    font-size: var(--text-label);
    font-weight: var(--weight-semibold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .post-author {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-lg);
    align-items: center;
    padding: var(--component-padding-md);
    background: color-mix(in srgb, var(--surface-field-bg) 55%, transparent 45%);
    border-radius: var(--radius-lg);
  }

  .author-avatar {
    width: var(--avatar-size-sm);
    height: var(--avatar-size-sm);
    border-radius: 50%;
    object-fit: cover;
  }

  .author-info {
    display: grid;
    gap: var(--space-xs);
  }

  .author-name {
    font-weight: var(--weight-semibold);
    font-size: var(--text-meta);
  }

  .author-bio {
    font-size: var(--text-meta);
    color: color-mix(in srgb, var(--text) 72%, transparent 28%);
  }

  :global(.post-content-card) {
    margin-bottom: var(--space-3xl);
  }

  .reading-prose {
    gap: var(--cluster-gap-md);
  }

  .reading-prose :global(blockquote) {
    border-inline-start: var(--border-width-thick) solid var(--voyage-blue);
    padding-inline-start: var(--space-xl);
    margin-block: var(--space-2xl);
    font-style: italic;
    color: color-mix(in srgb, var(--text) 85%, transparent 15%);
  }

  .reading-prose :global(code) {
    background: color-mix(in srgb, var(--text) 8%, transparent);
    padding-block: var(--space-2xs);
    padding-inline: calc(var(--space-xs) + var(--space-3xs));
    border-radius: var(--radius-sm);
    font-size: var(--text-caption);
  }

  .reading-prose :global(pre) {
    background: color-mix(in srgb, var(--text) 8%, transparent);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
    overflow-x: auto;
    margin-block: var(--space-2xl);
  }

  .reading-prose :global(pre code) {
    background: none;
    padding: 0;
  }

  .post-tags {
    gap: var(--space-sm);
    margin-bottom: var(--space-2xl);
  }

  .tags-label {
    font-weight: var(--weight-semibold);
    font-size: var(--text-meta);
  }

  .post-footer {
    text-align: center;
  }
</style>
