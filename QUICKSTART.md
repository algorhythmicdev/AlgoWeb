# Quick Start Guide

Get the AlgoRhythmics website with CMS integration running in 15 minutes.

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- A code editor (VS Code recommended)

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/algorhythmicdev/AlgoWeb.git
cd AlgoWeb

# Install dependencies
npm install
```

## Step 2: Set Up Strapi Backend (5 minutes)

### Option A: Quick Start (SQLite - Development Only)

```bash
# In a new terminal, create Strapi project
cd ..
npx create-strapi-app@latest cms --quickstart

# Wait for Strapi to start (opens admin panel in browser)
# Create your admin account
```

### Option B: Production Setup (PostgreSQL)

```bash
# Install PostgreSQL first
# Then create Strapi with PostgreSQL
cd ..
npx create-strapi-app@latest cms

# Choose:
# - Custom installation
# - PostgreSQL
# - Enter your database credentials
```

## Step 3: Create Content Types in Strapi (5 minutes)

In Strapi Admin Panel (http://localhost:1337/admin):

### Create Collection Types:

1. **Blog Post** (`posts`)
   - Click "Create new collection type"
   - Name: `post` (Strapi will pluralize to `posts`)
   - Add fields:
     - `title` (Text, required)
     - `slug` (UID, from `title`, required)
     - `excerpt` (Text, long text)
     - `content` (Rich text, required)
     - `publishDate` (DateTime, required)
     - `status` (Enumeration: `draft`, `published`, required)
   - Add relations:
     - `categories` (many-to-many with categories)
     - `tags` (many-to-many with tags)
     - `author` (many-to-one with authors)
   - Add media: `featuredImage` (Single media)
   - Save (Strapi will restart)

2. **Educational Module** (`educational-modules`)
   - Same process as posts
   - Add field: `mediaAttachments` (Multiple media)
   - Change relation: `category` (many-to-one)

3. **Platform Article** (`platform-articles`)
   - Same as posts
   - Add field: `platformType` (Enumeration: `NodeVoyage`, `Ideonautix`, `General`)

4. **Category** (`categories`)
   - Simple: `name` (Text, unique), `slug` (UID from name)

5. **Tag** (`tags`)
   - Simple: `name` (Text, unique)

6. **Author** (`authors`)
   - `name` (Text, required)
   - `bio` (Long text)
   - `avatar` (Single media)

**Tip**: See `CMS_SCHEMAS.md` for complete field definitions.

## Step 4: Configure Permissions (2 minutes)

In Strapi Admin Panel:

1. Go to **Settings > Users & Permissions > Roles > Public**
2. Expand each collection type and check:
   - ✅ `find`
   - ✅ `findOne`
3. Click **Save**

## Step 5: Add Sample Content (Optional, 3 minutes)

1. Go to **Content Manager**
2. Create a category: "AI Ethics"
3. Create a tag: "Calm AI"
4. Create an author with your name
5. Create a blog post:
   - Fill in required fields
   - Set status to "published"
   - Link category, tags, and author

## Step 6: Configure Frontend (1 minute)

```bash
# In the AlgoWeb directory
cp .env.example .env

# Edit .env
PUBLIC_STRAPI_URL=http://localhost:1337
```

## Step 7: Start Development (1 minute)

```bash
# In AlgoWeb directory
npm run dev

# Open browser to http://localhost:5173
```

## Verify Everything Works

1. **Homepage**: Should load normally ✅
2. **Blog** (http://localhost:5173/blog): Should show your sample post ✅
3. **Education Hub** (http://localhost:5173/education-hub): Should show modules if created ✅
4. **Platform** (http://localhost:5173/platform): Should show articles if created ✅

## What's Next?

### Create More Content

In Strapi Admin Panel:
- Add more blog posts
- Create educational modules
- Add platform articles
- Organize with categories and tags

### Customize Content Types

Need additional fields? Edit content types in Strapi:
1. Go to **Content-Type Builder**
2. Click on content type to edit
3. Add/modify fields
4. Save (Strapi restarts)

### Deploy to Production

See `DEPLOYMENT.md` for complete deployment instructions:
- Deploy Strapi backend (Docker/VPS/Cloud)
- Deploy frontend to Vercel
- Configure webhooks for auto-deployment

## Common Issues

### "Cannot connect to Strapi"

**Check:**
- Is Strapi running? (`npm run develop` in cms directory)
- Is `PUBLIC_STRAPI_URL` correct in `.env`?
- Are permissions configured for Public role?

**Fix:**
```bash
# In cms directory
npm run develop

# Check http://localhost:1337
```

### "No content showing"

**Check:**
- Have you created content in Strapi?
- Is content status set to "published"?
- Are Public role permissions enabled?

**Fix:**
1. Go to Content Manager
2. Edit content
3. Set status to "published"
4. Save

### "Build errors"

**Check:**
- Node version is 18+ (`node --version`)
- All dependencies installed (`npm install`)

**Fix:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Development Tips

### Hot Reload

Both Strapi and SvelteKit support hot reload:
- Changes in Strapi content: Refresh browser
- Changes in SvelteKit code: Automatic reload

### TypeScript/JSDoc Support

Full type definitions available:
```javascript
/** @type {import('./$types').PageData} */
export let data;
```

### Preview Drafts

To show draft content (development only):
```javascript
// Remove status filter
const posts = await fetchCollection('posts', {
  populate: ['author']
  // No status filter = show all
});
```

### API Testing

Test Strapi API directly:
```bash
# Get all posts
curl http://localhost:1337/api/posts

# Get single post
curl http://localhost:1337/api/posts/1?populate=*
```

## Useful Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npm test             # Run tests

# Strapi (in cms directory)
npm run develop      # Start with auto-reload
npm run build        # Build admin panel
npm start            # Start production mode
```

## Next Steps

1. ✅ Follow `CMS_SCHEMAS.md` for complete schema reference
2. ✅ Read `DEPLOYMENT.md` for production deployment
3. ✅ Check `CMS_SETUP.md` for advanced configuration
4. ✅ Review security best practices in docs

## Getting Help

- **Documentation**: See `CMS_SETUP.md`, `DEPLOYMENT.md`, `CMS_SCHEMAS.md`
- **Strapi Docs**: https://docs.strapi.io
- **SvelteKit Docs**: https://kit.svelte.dev

## Success Checklist

- [ ] Strapi running on http://localhost:1337
- [ ] Frontend running on http://localhost:5173
- [ ] Content types created
- [ ] Permissions configured
- [ ] Sample content published
- [ ] Content visible on frontend

Once all items are checked, you're ready to develop! 🎉
