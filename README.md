awesome—here’s a full, production-ready plan to add a CMS-powered Admin area and rebuild the Edu Hub so all articles, modules, downloads, and media come from the CMS. It also includes a clean Vercel (frontend) + Google Cloud (backend CMS) deployment guide with configs you can copy-paste.

📦 Scope (at a glance)

Headless CMS: Strapi v5 (Node.js) on Google Cloud Run + Cloud SQL (Postgres) + Cloud Storage for media (or Cloudinary).

Frontend: SvelteKit on Vercel (@sveltejs/adapter-vercel), SSR + prerender for SEO, revalidate on CMS publish via webhooks.

Admin: Secure /admin UI in SvelteKit for quick ops (optional—Strapi Studio is the primary authoring tool). Route-guarded.

Content: Blog, Edu Hub (modules, lessons, guides, downloads, categories, tags), Pages, Authors, Media—all in CMS.

Accessibility & tokens: reuse your theme tokens (light/dark/HC), AAA contrast, prefers-reduced-motion.

✅ Phase 1 — Choose & provision the CMS

CMS: Strapi v5 (stable, RBAC, REST/GraphQL, draft/publish, media library, webhooks, TypeScript).

Why Strapi over Sanity/Directus:

Self-host on GCP, zero vendor lock-in.

Simple auth/RBAC + media providers.

Excellent SvelteKit integration via REST/GraphQL + webhooks for builds.

🧱 Phase 2 — Content Model (covers Blog + Edu Hub + Materials)

Create in Strapi Admin → Content-Types Builder

Global

Author

name (text, required)

slug (UID from name)

bio (rich text)

avatar (media, single)

(rel) posts/modules (one-to-many)

Category

name (text, required)

slug (UID from name)

type (enum: blog, edu)

Tag

name (text, required)

slug (UID)

Blog

Post

title (text, req) • slug (UID)

excerpt (text) • content (rich text/markdown)

cover (media) • gallery (media multiple)

author (relation to Author)

categories (many) • tags (many)

status (draft/published) • publishAt (datetime)

seoTitle, seoDescription (text)

canonicalUrl (text/url)

Edu Hub

Module

title, slug, summary (short), content (rich text)

thumbnail (media) • banner (media)

level (enum: beginner|intermediate|advanced)

duration (number, minutes)

author (Author)

categories (many) (type=edu), tags (many)

status, publishAt

Lesson

title, slug, content (rich text)

video (media or url), attachments (media multiple)

order (integer)

module (relation → Module)

status, publishAt

Material (for PDFs/zip/code samples/checklists)

title, slug, description

file (media)

module (optional relation)

tags (many) • status, publishAt

Pages (optional, for About/Contact if you want CMS-editable)

Page

title, slug

content (rich text/blocks)

status, publishAt

Permissions/Workflows

Roles: Admin (all), Editor (publish), Author (create/edit own; submit for review).

Turn on Draft & Publish.

Media provider: Google Cloud Storage (or Cloudinary), see Phase 6.

🔐 Phase 3 — Auth & Security (Strapi)

Enable email/password auth for Admin users only (CMS authoring).

Public API permissions:

Allow GET for posts, modules, lessons, materials, authors, categories, tags.

Keep mutation locked (create/update/delete denied to public).

CORS: allow your Vercel domain(s).

./config/middlewares.ts

export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'storage.googleapis.com', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'storage.googleapis.com', 'res.cloudinary.com'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://algorhythmics.dev', 'https://*.vercel.app', 'http://localhost:5173'],
      methods: ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'],
      credentials: true,
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

🧭 Phase 4 — Frontend (Vercel) integration
4.1 SvelteKit adapter & env

package.json

{
  "dependencies": {
    "@sveltejs/adapter-vercel": "^5",
    "@sveltejs/kit": "^2",
    "sanitize-html": "^2"
  }
}


svelte.config.js

import adapter from '@sveltejs/adapter-vercel';
const config = {
  kit: {
    adapter: adapter(),
    alias: { $lib: 'src/lib' }
  }
};
export default config;


.env (Vercel Project → Environment Variables)

PUBLIC_STRAPI_URL=https://cms.your-domain.com     # Cloud Run HTTPS URL or custom domain
STRAPI_PREVIEW_TOKEN=xxxxxx                        # optional if using preview-secured endpoints

4.2 API helper (SSR-friendly)

src/lib/api/strapi.ts

const base = import.meta.env.PUBLIC_STRAPI_URL;

type Q = Record<string, any>;
const qs = (q?: Q) => q ? '?' + new URLSearchParams(flatten(q)).toString() : '';

function flatten(obj: Q, prefix = ''): Q {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flatten(v as Q, key));
    else acc[key] = String(v);
    return acc;
  }, {} as Q);
}

export async function get(path: string, query?: Q, fetcher = fetch) {
  const res = await fetcher(`${base}/api/${path}${qs(query)}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Strapi ${path} ${res.status}`);
  return res.json();
}

4.3 Pages: Blog & Edu Hub (lists)

src/routes/blog/+page.server.ts

import { get } from '$lib/api/strapi';
export const prerender = false; // we’ll revalidate via webhook
export async function load({ fetch }) {
  const data = await get('posts', {
    sort: { publishAt: 'desc' },
    populate: { author: true, cover: true, categories: true, tags: true },
    filters: { status: { $eq: 'published' } }
  }, fetch);
  return { posts: data.data };
}


src/routes/education-hub/+page.server.ts

import { get } from '$lib/api/strapi';
export async function load({ fetch, url }) {
  const cat = url.searchParams.get('category');
  const tag = url.searchParams.get('tag');
  const filters: any = { status: { $eq: 'published' } };
  if (cat) filters.categories = { slug: { $eq: cat } };
  if (tag) filters.tags = { slug: { $eq: tag } };
  const modules = await get('modules', {
    sort: { publishAt: 'desc' },
    populate: { author: true, thumbnail: true, categories: true, tags: true },
    filters
  }, fetch);
  return { modules: modules.data };
}

4.4 Details (sanitized content)

src/lib/utils/sanitize.ts

import sanitizeHtml from 'sanitize-html';
export const sanitize = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img','h1','h2','figure','figcaption','iframe']),
    allowedAttributes: {
      a: ['href','name','target','rel'],
      img: ['src','alt','title','loading','width','height'],
      iframe: ['src','title','allow','allowfullscreen']
    },
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }) }
  });


src/routes/education-hub/[slug]/+page.server.ts

import { get } from '$lib/api/strapi';
export async function load({ params, fetch }) {
  const { data } = await get('modules', {
    filters: { slug: { $eq: params.slug } },
    populate: { author: true, banner: true, tags: true, lessons: { populate: { attachments: true, video: true } } }
  }, fetch);
  if (!data?.length) return { status: 404 };
  return { module: data[0] };
}


src/routes/education-hub/[slug]/+page.svelte

<script lang="ts">
  export let data;
  import { sanitize } from '$lib/utils/sanitize';
</script>

<article class="prose max-w-3xl mx-auto px-4">
  <h1 class="font-montserrat text-3xl md:text-5xl">{data.module.attributes.title}</h1>
  {@html sanitize(data.module.attributes.content)}
  {#if data.module.attributes.lessons?.data?.length}
    <h2 class="mt-12">Lessons</h2>
    <ol class="space-y-6">
      {#each data.module.attributes.lessons.data as l}
        <li class="p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          <h3 class="text-xl font-semibold">{l.attributes.title}</h3>
          {@html sanitize(l.attributes.content ?? '')}
          {#if l.attributes.attachments?.data?.length}
            <div class="mt-2">
              <p class="font-medium">Attachments</p>
              <ul class="list-disc list-inside">
                {#each l.attributes.attachments.data as f}
                  <li><a href={f.attributes.url} rel="noopener" target="_blank">{f.attributes.name}</a></li>
                {/each}
              </ul>
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}
</article>


Apply the same pattern for blog details (src/routes/blog/[slug]).

4.5 ISR/Cache revalidation (Vercel)

Use Vercel Revalidation: create a secure endpoint that Strapi webhooks call on publish.

src/routes/api/revalidate/+server.ts

import { json } from '@sveltejs/kit';
export async function POST({ request, url, locals }) {
  const secret = url.searchParams.get('secret');
  if (secret !== process.env.CMS_WEBHOOK_SECRET) return new Response('Unauthorized', { status: 401 });
  // Vercel revalidate (Next-style) is not native in SvelteKit; instead:
  // Strategy: bump a cache version store or call Vercel build hook for full redeploy.
  // Simple approach:
  await fetch(process.env.VERCEL_BUILD_HOOK!, { method: 'POST' });
  return json({ revalidated: true });
}


In Strapi → Settings → Webhooks: on entry.publish for posts/modules/lessons/materials → POST https://algorhythmics.dev/api/revalidate?secret=...

Alternative: keep prerender = false and rely on low revalidate (60s) in get() helper for near-real-time updates without rebuilds.

🧑‍💻 Phase 5 — Optional lightweight Admin UI in SvelteKit

CMS authoring is primarily in Strapi. If you still want a small internal /admin panel (to trigger rebuilds, inspect content, manage feature flags):

Route guard: only allow authenticated team users (use Vercel Password Protection or your own session).

src/routes/admin/+page.server.ts

import { redirect } from '@sveltejs/kit';
export async function load({ locals }) {
  if (!locals.user?.isAdmin) throw redirect(302, '/login');
  return {};
}


Dashboard UI: list recent posts/modules via public GETs; add a “Trigger Publish” button that hits the revalidate endpoint.

🗂 Phase 6 — Media: Google Cloud Storage provider for Strapi

Install Strapi GCS upload provider:

npm i @strapi/provider-upload-google-cloud-storage


./config/plugins.ts

export default () => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: process.env.GCS_BUCKET,
        publicFiles: true,
        baseUrl: `https://storage.googleapis.com/${process.env.GCS_BUCKET}`,
        uniform: true
      }
    }
  }
});


IAM: Service account with Storage Object Admin on the bucket; set GOOGLE_APPLICATION_CREDENTIALS or use Cloud Run workload identity (recommended).

☁️ Phase 7 — Deploy Strapi to Google Cloud
7.1 Infra (recommended)

Project: algorhythmics-prod

APIs: Enable Cloud Run, Cloud Build, Artifact Registry, Cloud SQL Admin, Secret Manager.

Database: Cloud SQL Postgres 14

Instance: strapi-pg

DB: strapidb • user: strapi • strong password

Storage: Bucket algorhythmics-cms-media

Artifact Registry: repo strapi, region europe-north1

7.2 Dockerize Strapi

Dockerfile

FROM node:20-alpine as deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN NODE_ENV=production npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 8080
CMD ["npm","run","start"]

7.3 Config ENV (Cloud Run / Secret Manager)

STRAPI config (example):

APP_KEYS=xxxx,yyyy,zzzz
API_TOKEN_SALT=xxxx
ADMIN_JWT_SECRET=xxxx
JWT_SECRET=xxxx
HOST=0.0.0.0
PORT=8080
URL=https://cms.algorhythmics.dev

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=/cloudsql/PROJECT:REGION:INSTANCE   # if using SQL Auth proxy socket
DATABASE_PORT=5432
DATABASE_NAME=strapidb
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=********

# GCS
GCS_BUCKET=algorhythmics-cms-media
GOOGLE_APPLICATION_CREDENTIALS=/var/secrets/google/key.json  # or use Workload Identity


Prefer Cloud SQL Auth Proxy sidecar or Cloud Run “Cloud SQL connections” (set in service connections). If using connections, host becomes /cloudsql/PROJECT:REGION:INSTANCE.

7.4 Build & Deploy (Cloud Build → Cloud Run)

Build image → Artifact Registry:

gcloud builds submit --tag europe-north1-docker.pkg.dev/algorhythmics-prod/strapi/cms:v1


Deploy Cloud Run:

gcloud run deploy algorhythmics-cms \
  --image europe-north1-docker.pkg.dev/algorhythmics-prod/strapi/cms:v1 \
  --region europe-north1 \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances algorhythmics-prod:europe-north1:strapi-pg \
  --set-env-vars URL=https://cms.algorhythmics.dev,HOST=0.0.0.0,PORT=8080,... \
  --service-account strapi-runner@algorhythmics-prod.iam.gserviceaccount.com


Map custom domain (Cloud Run custom domain mappings) → cms.algorhythmics.dev with HTTPS.

For creds, prefer Workload Identity Federation so Cloud Run service account can access GCS/Cloud SQL without keys.

▲ Phase 8 — Deploy Frontend to Vercel
8.1 Project setup

Import GitHub repo to Vercel.

Framework preset: SvelteKit.

Environment variables (Project → Settings → Environment Variables):

PUBLIC_STRAPI_URL=https://cms.algorhythmics.dev

CMS_WEBHOOK_SECRET=xxxx

VERCEL_BUILD_HOOK=https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx (Project → Settings → Deploy Hooks)

8.2 Caching & prerender

Leave list/detail pages as SSR with revalidate (60–300s) or prerender static with webhook rebuilds (above). For global SEO pages (About/Contact), set export const prerender = true.

8.3 Headers & CSP (optional but recommended)

src/hooks.server.ts

import type { Handle } from '@sveltejs/kit';
export const handle: Handle = async ({ event, resolve }) => {
  const res = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === 'content-type'
  });
  res.headers.set('Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: blob: https://storage.googleapis.com https://res.cloudinary.com; media-src 'self' data: blob: https://storage.googleapis.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; frame-src https:");
  return res;
};

🧩 Phase 9 — Edu Hub UX (from CMS)

/education-hub: filters (category/tag), search, level chips, duration, author.

Module page: banner, summary, sanitized content, lesson list, materials list. Download section pulls from Material entity.

Breadcrumbs: Hub → Category → Module.

i18n (optional): add locales in Strapi + localized fields; extend queries with locale.

🧪 Phase 10 — QA & Accessibility

Color tokens for all modes (light/dark/HC), AAA contrast text, ≥3:1 non-text.

prefers-reduced-motion respected for any list reveals.

Images: alt from CMS; document links open in new tab with rel="noopener".

Keyboard nav through filters, lesson list, download buttons.

🔁 Phase 11 — Webhooks & CI/CD

Strapi → Webhook on publish/update:

URL: https://algorhythmics.dev/api/revalidate?secret=CMS_WEBHOOK_SECRET

Events: entry.publish, entry.update for Post, Module, Lesson, Material.

Vercel Deploy Hook: the revalidate API calls your Vercel build hook (cheap/simple).

For heavy traffic, keep SSR with revalidate to avoid full rebuilds.

🧱 Phase 12 — Admin authoring workflow (creators)

Creators use Strapi Admin to:

Create Modules/Lessons/Materials with media.

Set publishAt (schedule) and status=published.

Assign categories/tags; write SEO fields.

On publish: site updates via SSR revalidate (≤60s) or immediate rebuild (webhook).

Optional: /admin (SvelteKit) shows:

Latest published content, quick links to edit in Strapi, manual “Trigger Rebuild”.

📋 Quick task checklist (you can paste into GitHub Projects)

 Provision GCP project, Cloud SQL (Postgres), GCS bucket, Artifact Registry, service account

 Build & deploy Strapi to Cloud Run (+ domain, SSL)

 Add Strapi content-types (Author, Category, Tag, Post, Module, Lesson, Material, Page)

 Configure Roles & Permissions, CORS, Media provider (GCS)

 Add Strapi webhooks (publish/update) → Vercel revalidate endpoint

 Vercel: connect repo, set env vars, enable SvelteKit adapter, deploy

 Implement frontend routes: /blog, /blog/[slug], /education-hub, /education-hub/[slug]

 Sanitize CMS HTML before rendering

 Implement filters/search for Edu Hub

 Apply tokens & accessibility across new pages

 Test light/dark/HC, mobile/desktop

 Load test API (basic), confirm caching/revalidate works

 Document “How to publish” for creators (Strapi guide)

Bonus: minimal “Create content” button (for power users)

If you want an “Add New (opens CMS)” button in the Vercel site for logged admins:

{#if $me?.isAdmin}
  <a class="btn btn-primary" href="https://cms.algorhythmics.dev/admin/content-manager/collectionType/api::module.module" target="_blank" rel="noopener">
    + New Module
  </a>
{/if}
