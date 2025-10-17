# AlgoRhythmics Website - CMS Integration

**Production-ready SvelteKit website with full Strapi CMS integration**

## 🚀 Quick Start

Get up and running in 15 minutes with our [Quick Start Guide](./QUICKSTART.md).

```bash
# 1. Clone and install
git clone https://github.com/algorhythmicdev/AlgoWeb.git
cd AlgoWeb
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Strapi URL

# 3. Start development
npm run dev
```

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get started in 15 minutes
- **[CMS Setup Guide](./CMS_SETUP.md)** - Complete CMS configuration
- **[CMS Schemas Reference](./CMS_SCHEMAS.md)** - Content type definitions
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions

## ✨ Features

### Content Management
- ✅ **Blog System** - Full-featured blog with rich text, categories, tags
- ✅ **Education Hub** - Educational modules with media attachments
- ✅ **Platform Articles** - Platform-specific content (NodeVoyage, Ideonautix)
- ✅ **Dynamic Routing** - Automatic slug-based routing for all content
- ✅ **Media Management** - Upload and manage images, PDFs, videos

### Technical Features
- ✅ **SSR/SSG** - Server-side rendering with optional static generation
- ✅ **SEO Optimized** - Dynamic sitemap, meta tags, semantic HTML
- ✅ **Type Safe** - Full TypeScript/JSDoc annotations
- ✅ **Accessible** - WCAG 2.2 compliant
- ✅ **Security** - Content sanitization, CSP headers, XSS protection
- ✅ **CI/CD** - GitHub Actions workflows for automated deployment
- ✅ **Multi-language** - i18n support with 6 languages

### Developer Experience
- ✅ **Hot Reload** - Instant updates during development
- ✅ **Linting** - ESLint with project-specific rules
- ✅ **Testing** - Vitest with component testing
- ✅ **Documentation** - Comprehensive guides and schemas
- ✅ **Error Handling** - Graceful fallbacks for CMS unavailability

## 🏗️ Architecture

### Frontend (SvelteKit)
- **Framework**: SvelteKit 5
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel (optimized configuration included)
- **Build**: Vite with optimized code splitting

### Backend (Strapi CMS)
- **Version**: Strapi v5
- **Database**: PostgreSQL (production) / SQLite (development)
- **API**: REST API with auto-generated endpoints
- **Authentication**: JWT-based with role-based access control

## 📁 Project Structure

```
AlgoWeb/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable Svelte components
│   │   ├── config/
│   │   │   └── cms.js       # CMS configuration & endpoints
│   │   ├── utils/
│   │   │   ├── api.js       # API integration utilities
│   │   │   └── sanitize.js  # Content sanitization
│   │   └── types/           # TypeScript/JSDoc type definitions
│   ├── routes/
│   │   ├── admin/           # Protected admin dashboard
│   │   ├── blog/            # Blog listing & detail pages
│   │   │   └── [slug]/      # Dynamic blog post routes
│   │   ├── education-hub/   # Education module pages
│   │   │   └── [slug]/      # Dynamic module routes
│   │   ├── platform/        # Platform article pages
│   │   │   └── [slug]/      # Dynamic article routes
│   │   └── api/
│   │       └── sitemap/     # Dynamic sitemap generation
│   └── app.html             # HTML template
├── static/                  # Static assets
│   └── robots.txt          # SEO configuration
├── .github/
│   └── workflows/          # CI/CD workflows
├── vercel.json             # Vercel deployment config
├── .env.example            # Environment template
└── Documentation files     # See below
```

## 🔧 Environment Variables

Required environment variables:

```env
# Public (exposed to client)
PUBLIC_STRAPI_URL=http://localhost:1337

# Private (server-side only)
STRAPI_API_TOKEN=your_api_token
JWT_SECRET=your_jwt_secret
```

Generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🌐 Content Types

### Blog Posts (`/blog`)
Articles, insights, and thought leadership content.

**Fields**: title, slug, excerpt, content, featuredImage, publishDate, status, categories, tags, author

### Educational Modules (`/education-hub`)
Learning resources, courses, and educational materials.

**Fields**: title, slug, description, content, mediaAttachments, category, tags, publishDate, status

### Platform Articles (`/platform`)
Platform-specific content for NodeVoyage and Ideonautix.

**Fields**: title, slug, excerpt, content, featuredImage, publishDate, status, platformType, categories, tags, author

See [CMS_SCHEMAS.md](./CMS_SCHEMAS.md) for complete definitions.

## 🚢 Deployment

### Frontend (Vercel)

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Configure Environment Variables**
   ```bash
   vercel env add PUBLIC_STRAPI_URL production
   vercel env add STRAPI_API_TOKEN production
   vercel env add JWT_SECRET production
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Backend (Strapi)

Multiple deployment options:
- **Docker** (recommended)
- **Google Cloud Run**
- **DigitalOcean App Platform**
- **VPS with PM2**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔄 Webhook Integration

Configure Strapi to trigger rebuilds on content publish:

1. In Strapi: **Settings > Webhooks > Create webhook**
2. URL: `https://api.vercel.com/v1/integrations/deploy/[PROJECT_ID]/[HOOK_ID]`
3. Events: `entry.publish`, `entry.unpublish`, `entry.update`

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Quality Checks
npm run lint             # Run ESLint
npm run check            # Svelte type checking
npm test                 # Run tests
npm run test:watch       # Watch mode for tests

# Internationalization
npm run i18n:check       # Check translation files
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

## 🔒 Security

- **Content Sanitization**: All CMS content sanitized before rendering
- **CSP Headers**: Content Security Policy configured in vercel.json
- **HTTPS Only**: Enforced in production
- **XSS Protection**: Multiple layers of protection
- **Rate Limiting**: Configured in Strapi
- **API Token Rotation**: Regular rotation recommended

## ♿ Accessibility

- WCAG 2.2 Level AA compliant
- Semantic HTML throughout
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader optimized
- High contrast theme support

## 🌍 Internationalization

Supported languages:
- 🇬🇧 English (default)
- 🇱🇻 Latvian
- 🇺🇦 Ukrainian
- 🇫🇷 French
- 🇷🇺 Russian
- 🇪🇸 Spanish

## 📈 Performance

- **Lighthouse Score**: 95+ (target)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Code Splitting**: Automatic per route
- **Image Optimization**: Lazy loading & responsive images
- **CDN**: Vercel Edge Network

## 🐛 Troubleshooting

### CMS Connection Issues

```bash
# Verify Strapi is running
curl http://localhost:1337/api/posts

# Check environment variables
echo $PUBLIC_STRAPI_URL

# Check CORS configuration in Strapi
```

### Build Failures

```bash
# Clear cache
rm -rf .svelte-kit node_modules
npm install
npm run build
```

### Content Not Showing

1. Check content status is "published" in Strapi
2. Verify Public role permissions in Strapi
3. Check browser console for errors
4. Verify API endpoint in Network tab

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

[Your License Here]

## 🔗 Links

- **Website**: https://algorhythmics.dev
- **Strapi Docs**: https://docs.strapi.io
- **SvelteKit Docs**: https://kit.svelte.dev
- **Vercel Docs**: https://vercel.com/docs

## 💬 Support

- **Documentation**: See docs in this repository
- **Issues**: GitHub Issues
- **Email**: [Your Contact Email]

---

**Status**: ✅ Production Ready

Last Updated: 2025-10-17
