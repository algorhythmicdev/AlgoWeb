# CMS Setup Guide

This guide covers the implementation of all 8 phases from the README for integrating Strapi CMS with the AlgoRhythmics website.

## Phase 1: Headless CMS Evaluation and Selection

✅ **Decision**: Strapi v5 selected for:
- Open-source with strong SvelteKit support
- Auto-generated REST/GraphQL APIs
- Built-in RBAC and authentication
- Self-hosting capability

## Phase 2: CMS Setup and Content Modeling

### Prerequisites

1. **Install Strapi**:
   ```bash
   npx create-strapi-app@latest cms --quickstart
   ```

2. **Database**: PostgreSQL recommended for production
   ```bash
   # Update .env in Strapi directory
   DATABASE_CLIENT=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=strapi
   DATABASE_USERNAME=strapi
   DATABASE_PASSWORD=your_password
   ```

3. **CORS Configuration**:
   Update `config/middlewares.js` in Strapi:
   ```javascript
   {
     name: 'strapi::cors',
     config: {
       enabled: true,
       origin: ['http://localhost:5173', 'https://yourdomain.com'],
       credentials: true
     }
   }
   ```

### Content Types to Create in Strapi Admin

1. **Blog Post** (`posts`)
   - title (Text, required)
   - slug (UID from title, required)
   - excerpt (Text)
   - content (Rich Text, required)
   - featuredImage (Media, single)
   - publishDate (DateTime, required)
   - status (Enumeration: draft, published)
   - categories (Relation, many-to-many)
   - tags (Relation, many-to-many)
   - author (Relation, many-to-one)

2. **Educational Module** (`educational-modules`)
   - title (Text, required)
   - slug (UID from title, required)
   - description (Text)
   - content (Rich Text, required)
   - mediaAttachments (Media, multiple)
   - category (Relation, many-to-one)
   - tags (Relation, many-to-many)
   - publishDate (DateTime, required)
   - status (Enumeration: draft, published)

3. **Category** (`categories`)
   - name (Text, required, unique)
   - slug (UID from name, required)

4. **Tag** (`tags`)
   - name (Text, required, unique)

5. **Author** (`authors`)
   - name (Text, required)
   - bio (Text)
   - avatar (Media, single)

### Permissions Setup

In Strapi Admin → Settings → Users & Permissions:

1. **Public Role**: Read access to published content
   - posts: find, findOne (with published filter)
   - educational-modules: find, findOne (with published filter)
   - categories: find, findOne
   - tags: find, findOne
   - authors: find, findOne

2. **Authenticated Role**: Full CRUD on content
   - Enable all endpoints for content management

## Phase 3: Admin Authentication & Dashboard Route

✅ **Implemented**:
- `/login` - Authentication page
- `/admin` - Protected dashboard with auth guard
- `src/routes/admin/+layout.server.js` - JWT verification
- `src/lib/utils/api.js` - Login/auth utilities

### Environment Setup

Copy `.env.example` to `.env` and configure:
```env
PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_api_token_here
JWT_SECRET=your_jwt_secret_here
```

## Phase 4: Frontend Integration & Content Pages

✅ **Implemented**:
- `/blog` - Blog post listing with CMS integration
- `/blog/[slug]` - Individual blog post pages
- Dynamic data fetching via `+page.server.js`
- SSR support for SEO

### Usage

Content automatically loads from Strapi when available. If Strapi is not configured, pages show helpful error messages.

## Phase 5: Educational Hub Redesign

The existing `/education-hub` page can be enhanced with dynamic content by:

1. Creating educational modules in Strapi
2. Updating `src/routes/education-hub/+page.server.js` to fetch from CMS
3. Replacing static content arrays with dynamic data

Example:
```javascript
export async function load({ fetch }) {
  const response = await fetchCollection('educational-modules', {
    populate: ['category', 'tags', 'mediaAttachments'],
    filters: { '[status][$eq]': 'published' }
  });
  return { modules: response.data };
}
```

## Phase 6: Admin Dashboard Wireframe & UI Structure

✅ **Implemented**:
- Admin layout with sidebar navigation
- Dashboard home with quick actions
- Consistent design system integration
- Placeholder routes for content management

### Admin Routes Structure
```
/admin                    - Dashboard home
/admin/posts              - List blog posts
/admin/posts/new          - Create new post
/admin/modules            - List educational modules
/admin/modules/new        - Create new module
```

## Phase 7: SEO, Accessibility & Security

✅ **Implemented**:

### SEO
- Dynamic `<title>` and `<meta>` tags per page
- SSR enabled for all content pages
- Structured semantic HTML

### Security
- Content sanitization utilities (`src/lib/utils/sanitize.js`)
- CSP headers in `src/hooks.server.js`
- XSS prevention measures
- HttpOnly cookies for JWT storage

### Accessibility
- WCAG 2.2 compliant structure
- Semantic HTML elements
- Alt text support from CMS
- Keyboard navigation support
- High contrast theme compatibility

### To Add
- Dynamic `sitemap.xml` generation
- Implement actual sanitization library (DOMPurify or sanitize-html)

## Phase 8: File Structure & CI/CD

✅ **Project Structure**:
```
src/
├── lib/
│   ├── config/
│   │   └── cms.js              # CMS configuration
│   ├── types/
│   │   └── cms.js              # TypeScript/JSDoc types
│   ├── utils/
│   │   ├── api.js              # API utilities
│   │   └── sanitize.js         # Content sanitization
│   └── components/
│       └── AdminNav.svelte     # Admin navigation
├── routes/
│   ├── login/                  # Authentication
│   ├── admin/                  # Admin dashboard
│   │   ├── +layout.server.js   # Auth guard
│   │   ├── +layout.svelte      # Admin layout
│   │   └── +page.svelte        # Dashboard home
│   └── blog/                   # Blog routes
│       ├── +page.server.js     # List posts
│       ├── +page.svelte
│       └── [slug]/             # Detail pages
│           ├── +page.server.js
│           └── +page.svelte
└── hooks.server.js             # Security headers
```

### CI/CD Integration

Add to your deployment pipeline:

1. **Environment Variables**: Configure in hosting platform
   - `PUBLIC_STRAPI_URL`
   - `JWT_SECRET`
   - `STRAPI_API_TOKEN`

2. **Build Command**: `npm run build`

3. **Webhooks**: Configure Strapi to trigger rebuild on content publish
   - Settings → Webhooks → Create new webhook
   - URL: Your deployment webhook URL (e.g., Vercel)
   - Events: Entry publish, Entry unpublish

4. **Dual Deployment**:
   - Deploy Strapi backend (Docker/Cloud Run/VPS)
   - Deploy SvelteKit frontend (Vercel/Cloudflare Pages)

## Getting Started

1. **Start Strapi backend** (in separate directory):
   ```bash
   npm run develop
   ```

2. **Configure content types** in Strapi admin panel (http://localhost:1337/admin)

3. **Update .env** with Strapi URL:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start SvelteKit dev server**:
   ```bash
   npm run dev
   ```

5. **Create content** in Strapi admin panel

6. **View content** on frontend at http://localhost:5173/blog

## Next Steps

- [ ] Install and configure Strapi backend
- [ ] Create content types in Strapi admin
- [ ] Configure permissions and roles
- [ ] Add content and test integration
- [ ] Set up media upload provider (S3/Cloudinary)
- [ ] Configure webhooks for auto-deployment
- [ ] Add production environment variables
- [ ] Deploy both applications

## Support

For detailed Strapi documentation, visit: https://docs.strapi.io
For SvelteKit documentation, visit: https://kit.svelte.dev
