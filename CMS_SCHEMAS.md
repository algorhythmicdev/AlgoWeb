# CMS Content Type Schemas

This document provides complete schema definitions for all Strapi content types used in the AlgoRhythmics website.

## Content Types Overview

1. **Blog Post** (`posts`) - Blog articles and insights
2. **Educational Module** (`educational-modules`) - Learning resources and courses
3. **Platform Article** (`platform-articles`) - Platform-specific content (NodeVoyage, Ideonautix)
4. **Category** (`categories`) - Content categorization
5. **Tag** (`tags`) - Content tagging for filtering
6. **Author** (`authors`) - Content creators and contributors

---

## 1. Blog Post (`posts`)

Blog articles, insights, and thought leadership content.

### Fields

| Field Name | Type | Required | Unique | Description |
|------------|------|----------|--------|-------------|
| `title` | Text (String) | ✅ | ❌ | Post title |
| `slug` | UID (from title) | ✅ | ✅ | URL-friendly identifier |
| `excerpt` | Text (Long) | ❌ | ❌ | Short summary for previews |
| `content` | Rich Text | ✅ | ❌ | Main article content (Markdown/HTML) |
| `featuredImage` | Media (Single) | ❌ | ❌ | Hero image for post |
| `publishDate` | DateTime | ✅ | ❌ | Publication date and time |
| `status` | Enumeration | ✅ | ❌ | Values: `draft`, `published` |
| `categories` | Relation (many-to-many) | ❌ | ❌ | Related categories |
| `tags` | Relation (many-to-many) | ❌ | ❌ | Related tags |
| `author` | Relation (many-to-one) | ❌ | ❌ | Content author |

### Relations

- **categories**: Many-to-Many with `categories` collection
- **tags**: Many-to-Many with `tags` collection
- **author**: Many-to-One with `authors` collection

### Example JSON

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Introduction to Calm AI",
      "slug": "introduction-to-calm-ai",
      "excerpt": "Explore the principles of calm, ethical AI development.",
      "content": "# Introduction\n\nCalm AI represents...",
      "publishDate": "2026-01-15T10:00:00.000Z",
      "status": "published",
      "featuredImage": {
        "data": {
          "attributes": {
            "url": "/uploads/calm_ai_hero.jpg",
            "alternativeText": "Calm AI illustration"
          }
        }
      },
      "categories": {
        "data": [
          {
            "attributes": {
              "name": "AI Ethics"
            }
          }
        ]
      },
      "tags": {
        "data": [
          {
            "attributes": {
              "name": "Calm AI"
            }
          }
        ]
      },
      "author": {
        "data": {
          "attributes": {
            "name": "Dr. Jane Smith"
          }
        }
      }
    }
  }
}
```

### Frontend Usage

```javascript
// List all posts
const posts = await fetchCollection('posts', {
  populate: ['author', 'tags', 'categories', 'featuredImage'],
  filters: { '[status][$eq]': 'published' },
  sort: 'publishDate:desc'
});

// Get single post by slug
const post = await fetchBySlug('posts', 'introduction-to-calm-ai', {
  populate: ['author', 'tags', 'categories', 'featuredImage']
});
```

---

## 2. Educational Module (`educational-modules`)

Learning resources, courses, and educational content.

### Fields

| Field Name | Type | Required | Unique | Description |
|------------|------|----------|--------|-------------|
| `title` | Text (String) | ✅ | ❌ | Module title |
| `slug` | UID (from title) | ✅ | ✅ | URL-friendly identifier |
| `description` | Text (Long) | ❌ | ❌ | Module overview |
| `content` | Rich Text | ✅ | ❌ | Main educational content |
| `mediaAttachments` | Media (Multiple) | ❌ | ❌ | Images, PDFs, videos |
| `category` | Relation (many-to-one) | ❌ | ❌ | Module category (Core, Lab, etc.) |
| `tags` | Relation (many-to-many) | ❌ | ❌ | Related tags |
| `publishDate` | DateTime | ✅ | ❌ | Publication date |
| `status` | Enumeration | ✅ | ❌ | Values: `draft`, `published` |
| `author` | Relation (many-to-one) | ❌ | ❌ | Content creator |

### Relations

- **category**: Many-to-One with `categories` collection
- **tags**: Many-to-Many with `tags` collection
- **author**: Many-to-One with `authors` collection

### Example JSON

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "AI Ethics for Educators",
      "slug": "ai-ethics-for-educators",
      "description": "A comprehensive guide to teaching AI ethics in the classroom.",
      "content": "# Module Overview\n\nThis module covers...",
      "publishDate": "2026-02-01T09:00:00.000Z",
      "status": "published",
      "mediaAttachments": {
        "data": [
          {
            "attributes": {
              "url": "/uploads/lesson_plan.pdf",
              "name": "lesson_plan.pdf",
              "mime": "application/pdf"
            }
          }
        ]
      },
      "category": {
        "data": {
          "attributes": {
            "name": "Core Curriculum"
          }
        }
      }
    }
  }
}
```

### Frontend Usage

```javascript
// List all modules
const modules = await fetchCollection('educational-modules', {
  populate: ['category', 'tags', 'mediaAttachments'],
  filters: { '[status][$eq]': 'published' },
  sort: 'publishDate:desc'
});

// Get single module
const module = await fetchBySlug('educational-modules', 'ai-ethics-for-educators', {
  populate: ['category', 'tags', 'mediaAttachments', 'author']
});
```

---

## 3. Platform Article (`platform-articles`)

Platform-specific content for NodeVoyage and Ideonautix.

### Fields

| Field Name | Type | Required | Unique | Description |
|------------|------|----------|--------|-------------|
| `title` | Text (String) | ✅ | ❌ | Article title |
| `slug` | UID (from title) | ✅ | ✅ | URL-friendly identifier |
| `excerpt` | Text (Long) | ❌ | ❌ | Short summary |
| `content` | Rich Text | ✅ | ❌ | Main article content |
| `featuredImage` | Media (Single) | ❌ | ❌ | Hero image |
| `publishDate` | DateTime | ✅ | ❌ | Publication date |
| `status` | Enumeration | ✅ | ❌ | Values: `draft`, `published` |
| `platformType` | Enumeration | ❌ | ❌ | Values: `NodeVoyage`, `Ideonautix`, `General` |
| `categories` | Relation (many-to-many) | ❌ | ❌ | Related categories |
| `tags` | Relation (many-to-many) | ❌ | ❌ | Related tags |
| `author` | Relation (many-to-one) | ❌ | ❌ | Content author |

### Relations

- **categories**: Many-to-Many with `categories` collection
- **tags**: Many-to-Many with `tags` collection
- **author**: Many-to-One with `authors` collection

### Example JSON

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "NodeVoyage Climate Missions Guide",
      "slug": "nodevoyage-climate-missions-guide",
      "excerpt": "Learn how to create engaging climate-focused learning journeys.",
      "content": "# Getting Started\n\nNodeVoyage enables...",
      "platformType": "NodeVoyage",
      "publishDate": "2026-03-10T14:00:00.000Z",
      "status": "published",
      "featuredImage": {
        "data": {
          "attributes": {
            "url": "/uploads/nodevoyage_missions.jpg"
          }
        }
      }
    }
  }
}
```

### Frontend Usage

```javascript
// List all platform articles
const articles = await fetchCollection('platform-articles', {
  populate: ['author', 'tags', 'categories', 'featuredImage'],
  filters: { '[status][$eq]': 'published' },
  sort: 'publishDate:desc'
});

// Filter by platform type
const nodeVoyageArticles = await fetchCollection('platform-articles', {
  populate: ['featuredImage'],
  filters: {
    '[status][$eq]': 'published',
    '[platformType][$eq]': 'NodeVoyage'
  }
});
```

---

## 4. Category (`categories`)

Content organization and filtering.

### Fields

| Field Name | Type | Required | Unique | Description |
|------------|------|----------|--------|-------------|
| `name` | Text (String) | ✅ | ✅ | Category name |
| `slug` | UID (from name) | ✅ | ✅ | URL-friendly identifier |
| `description` | Text (Long) | ❌ | ❌ | Category description |

### Example Values

- Core Curriculum
- Educational Labs
- AI Ethics
- Product Updates
- Case Studies
- Community
- Platform Features

### Frontend Usage

```javascript
// List all categories
const categories = await fetchCollection('categories');

// Filter content by category
const posts = await fetchCollection('posts', {
  filters: {
    '[categories][slug][$eq]': 'ai-ethics'
  }
});
```

---

## 5. Tag (`tags`)

Flexible content tagging for filtering and discovery.

### Fields

| Field Name | Type | Required | Unique | Description |
|------------|------|----------|--------|-------------|
| `name` | Text (String) | ✅ | ✅ | Tag name |

### Example Values

- Calm AI
- Accessibility
- Education Technology
- Responsible Innovation
- Climate Action
- Signage Design
- Inclusive Design
- Developer Tools

### Frontend Usage

```javascript
// List all tags
const tags = await fetchCollection('tags');

// Filter content by tag
const posts = await fetchCollection('posts', {
  filters: {
    '[tags][name][$eq]': 'Calm AI'
  }
});
```

---

## 6. Author (`authors`)

Content creators and contributors.

### Fields

| Field Name | Type | Required | Unique | Description |
|------------|------|----------|--------|-------------|
| `name` | Text (String) | ✅ | ❌ | Author name |
| `bio` | Text (Long) | ❌ | ❌ | Author biography |
| `avatar` | Media (Single) | ❌ | ❌ | Profile picture |
| `email` | Email | ❌ | ✅ | Contact email |
| `role` | Text (String) | ❌ | ❌ | Author role/title |

### Example JSON

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Dr. Jane Smith",
      "bio": "AI Ethics researcher and educator with 10+ years experience.",
      "role": "Lead Researcher",
      "avatar": {
        "data": {
          "attributes": {
            "url": "/uploads/jane_smith.jpg"
          }
        }
      }
    }
  }
}
```

---

## Strapi Configuration Steps

### 1. Create Content Types

In Strapi Admin Panel (http://localhost:1337/admin):

1. Go to **Content-Type Builder**
2. Create each collection type following the schemas above
3. Add all fields with proper configurations
4. Set up relations between content types
5. Save and rebuild Strapi

### 2. Configure Permissions

In **Settings > Users & Permissions > Roles**:

#### Public Role
- **posts**: find, findOne
- **educational-modules**: find, findOne
- **platform-articles**: find, findOne
- **categories**: find, findOne
- **tags**: find, findOne
- **authors**: find, findOne

#### Authenticated Role
- All content types: find, findOne, create, update, delete

### 3. Add Content

1. Navigate to **Content Manager**
2. Create sample content for each type
3. Set status to "published"
4. Add relations (categories, tags, authors)
5. Upload media assets

---

## Querying Best Practices

### 1. Always Populate Relations

```javascript
// ❌ Don't
const posts = await fetchCollection('posts');

// ✅ Do
const posts = await fetchCollection('posts', {
  populate: ['author', 'tags', 'categories', 'featuredImage']
});
```

### 2. Filter by Status

```javascript
// Always filter for published content in production
const posts = await fetchCollection('posts', {
  filters: { '[status][$eq]': 'published' }
});
```

### 3. Optimize Field Selection

```javascript
// For list views, only fetch needed fields
const posts = await fetchCollection('posts', {
  fields: ['title', 'slug', 'excerpt', 'publishDate'],
  populate: ['featuredImage']
});
```

### 4. Implement Pagination

```javascript
const posts = await fetchCollection('posts', {
  page: 1,
  pageSize: 10,
  sort: 'publishDate:desc'
});
```

---

## Media Handling

### Upload Provider Configuration

For production, configure a cloud storage provider:

**AWS S3:**
```javascript
// config/plugins.js
module.exports = {
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET')
        }
      }
    }
  }
};
```

### Image Optimization

Use responsive image techniques:

```svelte
<img
  src={featuredImage.url}
  alt={featuredImage.alternativeText}
  loading="lazy"
  width={featuredImage.width}
  height={featuredImage.height}
/>
```

---

## Security Considerations

### 1. Content Sanitization

Always sanitize HTML content before rendering:

```javascript
import { sanitizeHtml } from '$lib/utils/sanitize';
const safeContent = sanitizeHtml(post.content);
```

### 2. API Token Security

- Never expose `STRAPI_API_TOKEN` to client-side code
- Use server-side API routes for authenticated requests
- Rotate tokens regularly

### 3. Rate Limiting

Configure rate limiting in Strapi:

```javascript
// config/middlewares.js
module.exports = {
  settings: {
    rateLimit: {
      enabled: true,
      max: 100,
      duration: 60000
    }
  }
};
```

---

## Migration & Import

### Bulk Import Script

```javascript
// scripts/import-content.js
const posts = [
  {
    title: 'Post Title',
    slug: 'post-title',
    content: '# Content...',
    status: 'published',
    publishDate: new Date()
  }
];

for (const post of posts) {
  await createItem('posts', post, JWT_TOKEN);
}
```

---

## Troubleshooting

### Common Issues

1. **Relation not populating**: Check field names match exactly
2. **404 on API calls**: Verify collection name (plural) in endpoint
3. **Unauthorized**: Check API token and permissions
4. **CORS errors**: Update Strapi CORS configuration

### Debug Queries

```javascript
// Log full response for debugging
const response = await fetchCollection('posts', { populate: '*' });
console.log(JSON.stringify(response, null, 2));
```

---

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io)
- [REST API Reference](https://docs.strapi.io/dev-docs/api/rest)
- [Content Manager Guide](https://docs.strapi.io/user-docs/content-manager)
