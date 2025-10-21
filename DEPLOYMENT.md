# Deployment Guide

This guide provides comprehensive instructions for deploying the AlgoRhythmics website with full CMS integration.

## Architecture Overview

The application consists of two primary components:

1. **Strapi CMS Backend** - Content management system (self-hosted or cloud)
2. **SvelteKit Frontend** - Containerized Node adapter service (Google Cloud Run)

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL database (for Strapi production)
- Google Cloud project with Cloud Build, Artifact Registry, and Cloud Run enabled
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

## Part 2: SvelteKit Frontend Deployment (Google Cloud Run)

The frontend ships as a container image so it can run consistently in Cloud Run, Cloud Run Jobs, or any OCI-compatible platform.

### 1. Build locally (optional)

```bash
# Build production assets and start the Node adapter server locally
npm run build
node build
```

### 2. Container image

The provided `Dockerfile` produces a slim Node 20 image:

```bash
# Build and tag the container
docker build -t europe-west1-docker.pkg.dev/PROJECT_ID/web/frontend:local .

# Run locally on port 3000
docker run -p 3000:3000 \
  -e PUBLIC_STRAPI_URL=https://cms.algorhythmics.dev \
  europe-west1-docker.pkg.dev/PROJECT_ID/web/frontend:local
```

Key runtime environment variables:

| Variable | Description |
| --- | --- |
| `PUBLIC_STRAPI_URL` | Public URL for the Strapi CMS (exposed to the browser) |
| `STRAPI_API_TOKEN` | Server-only API token for authenticated Strapi requests |
| `CMS_WEBHOOK_SECRET` | Secret used to validate incoming webhook calls |

### 3. Cloud Build pipeline

The root `cloudbuild.yaml` automates container builds and Cloud Run deployments. Before running the pipeline, create the required Secret Manager entries and service account:

```bash
# Example secrets (store plain values in Secret Manager)
echo 'super-secret-token' | gcloud secrets create STRAPI_API_TOKEN --data-file=-
echo 'cms-webhook-secret' | gcloud secrets create CMS_WEBHOOK_SECRET --data-file=-

# Service account used by Cloud Build to deploy to Cloud Run
gcloud iam service-accounts create web-runner --display-name="Web Runner"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:web-runner@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:web-runner@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

Trigger a build:

```bash
gcloud builds submit --config cloudbuild.yaml --substitutions _REGION=europe-west1
```

Cloud Build will:

1. Build and push `europe-west1-docker.pkg.dev/$PROJECT_ID/web/frontend:$SHORT_SHA`
2. Deploy the image to Cloud Run (`algorhythmics-web`) with required environment variables and secrets

If you prefer to deploy manually after the image is built:

```bash
gcloud run deploy algorhythmics-web \
  --image europe-west1-docker.pkg.dev/$PROJECT_ID/web/frontend:$SHORT_SHA \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --service-account web-runner@$PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars PUBLIC_STRAPI_URL=https://cms.algorhythmics.dev,NODE_ENV=production
```

### 4. Domain & HTTPS

1. Map your custom domain to the Cloud Run service:
   ```bash
   gcloud run domain-mappings create --service algorhythmics-web --domain www.algorhythmics.dev --region europe-west1
   ```
2. Update DNS records with the A/AAAA and TXT values returned by the command above.
3. Cloud Run automatically provisions TLS certificates after DNS is verified.

### 5. CI/CD recommendations

- Configure a Cloud Build trigger on the `main` branch to run `cloudbuild.yaml` on every push.
- Use additional substitutions (e.g., `_REGION`) if you need multiple environments.
- Grant `run.invoker` role to the identities that need to access the deployed service privately.

## Part 3: Webhook Integration

### Set up Strapi Webhooks

Configure Strapi to trigger deployments when content is published:

1. **In Strapi Admin Panel:**
   - Go to Settings > Webhooks
   - Click "Create new webhook"

2. **Configure webhook:**
   ```
   Name: Cloud Build Deploy
   URL: https://cloudbuild.googleapis.com/v1/projects/$PROJECT_ID/triggers/$TRIGGER_ID:run
   Events:
     - entry.publish
     - entry.unpublish
     - entry.update (published entries only)
   Headers:
     - X-CloudBuild-Token: <TRIGGER_SECRET>
   ```

3. **Create Cloud Build webhook trigger:**
   ```bash
   gcloud builds triggers create webhook \
     --name strapi-content \
     --region europe-west1 \
     --build-config cloudbuild.yaml \
     --substitutions _REGION=europe-west1
   ```
   The command prints the trigger URL and secret token. Paste both into the Strapi webhook configuration.

### Test Webhook

1. Publish a blog post in Strapi
2. Check Cloud Build history for a triggered build
3. Verify content appears on the live Cloud Run site

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

**Cloud Run logs:**
- View in Cloud console (Operations > Logging)
- Real-time: `gcloud logs tail --project $PROJECT_ID --service algorhythmics-web`

**Cloud Build logs:**
- View builds in Cloud Build history
- CLI: `gcloud builds log --stream $BUILD_ID`

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

### Cloud Run Optimizations

1. **Image optimization:** Already handled by SvelteKit
2. **Code splitting:** Automatic via Vite and SvelteKit
3. **Edge caching:** Front the service with Cloud CDN or Cloud Armor caching rules as needed

## Part 7: Security Checklist

- [ ] SSL/TLS enabled on all domains
- [ ] Strapi admin panel uses strong password
- [ ] API tokens rotated regularly
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] CSP headers enabled (see `src/hooks.server.js`)
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
# Rebuild locally to surface errors
docker build -t frontend-test .

# Stream Cloud Build logs from the last run
gcloud builds log --stream $(gcloud builds list --limit=1 --format='value(ID)')
```

**Content not updating:**
```bash
# Trigger manual deployment
gcloud builds submit --config cloudbuild.yaml --substitutions _REGION=europe-west1

# Check webhook is firing
gcloud builds list --filter="triggerId=strapi-content" --region europe-west1
```

## Support

For issues or questions:
- **Strapi Documentation:** https://docs.strapi.io
- **SvelteKit Documentation:** https://kit.svelte.dev
- **Cloud Run Documentation:** https://cloud.google.com/run/docs
- **Cloud Build Documentation:** https://cloud.google.com/build/docs

## Deployment Checklist

Before going live:

- [ ] Strapi backend deployed and accessible
- [ ] Database configured and secured
- [ ] Environment variables and secrets configured in Cloud Run / Cloud Build
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
