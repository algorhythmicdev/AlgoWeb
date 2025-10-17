# Deployment Guide

This guide provides comprehensive instructions for deploying the AlgoRhythmics website with full CMS integration.

## Architecture Overview

The application consists of two primary components:

1. **Strapi CMS Backend** - Content management system (self-hosted or cloud)
2. **SvelteKit Frontend** - Static site with SSR capabilities (Vercel)

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL database (for Strapi production)
- Vercel account (or alternative hosting)
- Domain name configured

## Part 1: Strapi CMS Backend Deployment

### Option A: Docker Deployment (Recommended)

1. **Create Dockerfile in your Strapi directory:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Build Strapi admin
ENV NODE_ENV=production
RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]
```

2. **Create docker-compose.yml:**

```yaml
version: '3'
services:
  strapi:
    build: .
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      APP_KEYS: ${APP_KEYS}
      API_TOKEN_SALT: ${API_TOKEN_SALT}
      NODE_ENV: production
    ports:
      - '1337:1337'
    depends_on:
      - db
    volumes:
      - ./public/uploads:/app/public/uploads

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: strapi
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - strapi-data:/var/lib/postgresql/data

volumes:
  strapi-data:
```

3. **Deploy to Cloud Platform:**

**Google Cloud Run:**
```bash
# Build and push Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/strapi
gcloud run deploy strapi \
  --image gcr.io/PROJECT_ID/strapi \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**DigitalOcean App Platform:**
- Connect your Strapi repository
- Configure environment variables
- Deploy with managed PostgreSQL database

### Option B: VPS/Server Deployment

1. **Install dependencies on server:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql
```

2. **Configure PostgreSQL:**
```bash
sudo -u postgres createuser strapi
sudo -u postgres createdb strapi
sudo -u postgres psql -c "ALTER USER strapi WITH PASSWORD 'your_password';"
```

3. **Set up Strapi:**
```bash
cd /var/www/strapi
npm ci --only=production
NODE_ENV=production npm run build
```

4. **Configure PM2 for process management:**
```bash
npm install -g pm2
pm2 start npm --name "strapi" -- start
pm2 save
pm2 startup
```

5. **Set up Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name cms.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Strapi Environment Variables

Create `.env` file in Strapi root:

```env
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generate-secure-key-1>,<generate-secure-key-2>
API_TOKEN_SALT=<generate-secure-salt>
ADMIN_JWT_SECRET=<generate-secure-secret>
JWT_SECRET=<generate-secure-secret>

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=<your-secure-password>
DATABASE_SSL=false

# CORS (adjust for your domain)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# File Upload (optional - AWS S3)
AWS_ACCESS_KEY_ID=<your-key>
AWS_ACCESS_SECRET=<your-secret>
AWS_REGION=us-east-1
AWS_BUCKET=<your-bucket>
```

**Generate secure keys:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Part 2: SvelteKit Frontend Deployment (Vercel)

### Initial Setup

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Link project:**
```bash
vercel link
```

### Environment Variables

Configure in Vercel dashboard or via CLI:

```bash
# Public variables (exposed to client)
vercel env add PUBLIC_STRAPI_URL production
# Value: https://cms.yourdomain.com

# Private variables (server-side only)
vercel env add STRAPI_API_TOKEN production
# Generate API token in Strapi: Settings > API Tokens

vercel env add JWT_SECRET production
# Use same JWT_SECRET as Strapi for token validation
```

### Vercel Configuration

The `vercel.json` file is already configured with:

- **Framework detection**: Automatic SvelteKit detection
- **Build optimization**: Custom output directory
- **Security headers**: CSP, XSS protection, etc.
- **Caching strategy**: Immutable assets, no-cache for API
- **GitHub integration**: Auto-deployments on push

### Preview and Production Deployment

**Preview deployment (automatic on PR):**
```bash
git push origin feature-branch
# Vercel automatically deploys preview
```

**Production deployment:**
```bash
# Option 1: Deploy via CLI
vercel --prod

# Option 2: Deploy via Git
git push origin main
# Vercel automatically deploys to production
```

### Custom Domain Configuration

1. **Add domain in Vercel dashboard:**
   - Go to Project Settings > Domains
   - Add your domain (e.g., algorhythmics.dev)

2. **Configure DNS records:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL/TLS:** Automatically provisioned by Vercel

## Part 3: Webhook Integration

### Set up Strapi Webhooks

Configure Strapi to trigger deployments when content is published:

1. **In Strapi Admin Panel:**
   - Go to Settings > Webhooks
   - Click "Create new webhook"

2. **Configure webhook:**
   ```
   Name: Vercel Deploy
   URL: https://api.vercel.com/v1/integrations/deploy/PROJECT_ID/HOOK_ID
   Events: 
     - entry.publish
     - entry.unpublish
     - entry.update (published entries only)
   ```

3. **Get Vercel deploy hook:**
   - Vercel Dashboard > Project > Settings > Git
   - Create Deploy Hook
   - Copy URL

### Test Webhook

1. Publish a blog post in Strapi
2. Check Vercel deployments for triggered build
3. Verify content appears on live site

## Part 4: Content Deployment Strategy

### Static Site Generation (SSG)

For content that changes infrequently:

```javascript
// +page.js
export const prerender = true;
```

### Server-Side Rendering (SSR)

For dynamic content (default for CMS routes):

```javascript
// +page.js
export const prerender = false;
```

### Incremental Static Regeneration (ISR)

SvelteKit doesn't have built-in ISR, but we use:

1. **On-demand revalidation via webhooks**
2. **SSR with edge caching**

## Part 5: Monitoring and Maintenance

### Health Checks

**Strapi health endpoint:**
```bash
curl https://cms.yourdomain.com/_health
```

**SvelteKit health endpoint:**
Create `/src/routes/api/health/+server.js`:
```javascript
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'content-type': 'application/json' }
  });
}
```

### Logging

**Strapi logs:**
- Check PM2: `pm2 logs strapi`
- Check Docker: `docker logs strapi`

**Vercel logs:**
- View in Vercel dashboard
- Real-time: `vercel logs --follow`

### Backup Strategy

**Database backups (daily):**
```bash
#!/bin/bash
# backup-strapi-db.sh
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U strapi strapi > /backups/strapi_${TIMESTAMP}.sql
```

**Media backups:**
- Use S3 for media storage (recommended)
- Or backup `/public/uploads` directory regularly

## Part 6: Performance Optimization

### Strapi Optimizations

1. **Enable caching:**
```javascript
// config/plugins.js
module.exports = {
  'rest-cache': {
    enabled: true,
    config: {
      provider: {
        name: 'memory',
        options: {
          max: 32767,
          maxAge: 3600,
        },
      },
    },
  },
};
```

2. **Database indexing:**
```sql
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_publish_date ON posts(publish_date);
```

### Vercel Optimizations

1. **Image optimization:** Already handled by SvelteKit
2. **Code splitting:** Automatic
3. **Edge caching:** Configured in vercel.json

## Part 7: Security Checklist

- [ ] SSL/TLS enabled on all domains
- [ ] Strapi admin panel uses strong password
- [ ] API tokens rotated regularly
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] CSP headers enabled (vercel.json)
- [ ] Rate limiting enabled on Strapi
- [ ] Regular security updates applied
- [ ] Backups tested and verified

## Part 8: Troubleshooting

### Common Issues

**CMS connection error:**
```bash
# Check Strapi is running
curl https://cms.yourdomain.com/api/posts

# Check CORS configuration
# Verify PUBLIC_STRAPI_URL environment variable
```

**Build failures:**
```bash
# Clear build cache
vercel --force

# Check build logs
vercel logs
```

**Content not updating:**
```bash
# Trigger manual deployment
vercel --prod

# Check webhook is firing
# Verify Strapi webhook URL is correct
```

## Support

For issues or questions:
- **Strapi Documentation:** https://docs.strapi.io
- **SvelteKit Documentation:** https://kit.svelte.dev
- **Vercel Documentation:** https://vercel.com/docs

## Deployment Checklist

Before going live:

- [ ] Strapi backend deployed and accessible
- [ ] Database configured and secured
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] Webhooks configured and tested
- [ ] Content migrated to CMS
- [ ] All routes tested
- [ ] Performance tested (Lighthouse)
- [ ] Security headers verified
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Documentation updated
