# AlgoWeb CMS Integration Audit

## Automated Checks
- `npm run lint` → ✅ passed. (See terminal log `npm run lint`.)
- `npm run check` → ❌ fails because `src/hooks.server.js` references `process.env` without Node typings in scope; Svelte Check aborts before any other diagnostics. This contradicts the implementation summary's claim that "No TypeScript/linting errors" remain.
- `npm run test` → ✅ all Vitest suites pass.

## Critical Findings

### 1. Environment handling breaks type checking
- `src/hooks.server.js` reads `process.env.PUBLIC_STRAPI_URL` directly. During `svelte-check`, this produces "Cannot find name 'process'" because the generated TS config for SvelteKit does not expose Node globals to plain `.js` files by default. The project already ships `$env/dynamic/private` and `$env/static/public` helpers elsewhere; the hook should use those instead (for example, `import { env } from '$env/dynamic/private'`).
- Because the hook is part of the top-level layout, the failed check blocks CI pipelines that rely on `npm run check`, despite documentation asserting the checks are clean.

### 2. Education Hub is still static
- The server load in `src/routes/education-hub/+page.server.js` fetches Strapi modules, but `src/routes/education-hub/+page.svelte` renders only hard-coded placeholder arrays and never reads `data.modules`. The live page therefore ignores CMS content entirely even though documentation advertises "Dynamic route: `/education-hub` lists all published modules".
- `src/routes/+layout.js` sets `export const prerender = true;`, and the Education Hub list page does not override it. Contrary to the implementation summary (which promises SSR), `/education-hub` will be pre-rendered at build time, causing stale snapshots and preventing authenticated Strapi calls in production builds.

### 3. Platform article metadata regression
- The Platform catalog and article detail templates both expect a singular `attributes.category` relation, but the documented Strapi schema for `platform-articles` exposes a many-to-many `categories` collection. As a result, category chips never render even when Strapi returns data, and TypeScript would flag this mismatch if the data were typed.
- Both templates inject `featuredImage.url` directly into `<img src>`. Strapi serves relative URLs by default (`/uploads/...`), so the current implementation breaks images unless the CMS is configured to emit absolute URLs. The helper layer should prepend `cmsConfig.apiUrl` when the URL is relative.

### 4. Sanitization is a stub
- `sanitizeHtml` currently returns the raw HTML string with a TODO note, leaving CMS content unsanitized. The implementation summary explicitly lists "Content sanitization before rendering" as complete, so this is both a security gap and a documentation mismatch.

### 5. SEO metadata routing bugs
- The top-level layout tries to pick a `pageConfig` entry by searching for substrings such as `'education'` or `'resources'`, but `/education-hub` and `/educational-outreach` both match the `'education'` branch first. As a result, those routes emit the wrong canonical URL (`https://algorhythmics.com/education`) instead of the intended `/education-hub` or `/educational-outreach` metadata.
- Because the layout prerenders every page, these wrong URLs will be baked into the static output until the routing logic is corrected.

### 6. Sitemap uses the wrong domain
- `src/routes/api/sitemap/+server.js` hard-codes `const SITE_URL = 'https://algorhythmics.dev'` while the main SEO config and documentation point to `https://algorhythmics.com`. Unless Vercel rewrites it later, submitted sitemaps will list the `.dev` domain.

## Additional Observations
- Login route (`src/routes/login`) disables prerendering but has no UI yet; linking to it will produce a blank page.
- The CSP hook currently concatenates directives without including Strapi's `/uploads` host for images. Once asset URLs are fixed to absolute paths, CSP will need matching directives.

## Suggested Next Steps
1. Replace raw `process.env` access in server hooks with `$env/dynamic/private` or `$env/static/public` helpers so type checking succeeds.
2. Wire the Education Hub page to the data returned from `+page.server.js`, add loading/empty states, and disable prerendering on the list route.
3. Update Platform templates to iterate over `categories?.data` and normalize media URLs via a shared helper (e.g., `resolveMediaUrl`).
4. Integrate a real HTML sanitizer such as `isomorphic-dompurify` and enforce it wherever CMS content is rendered.
5. Rework `+layout.js` SEO key detection to use explicit route IDs instead of substring heuristics.
6. Align `SITE_URL` in the sitemap with `siteConfig.url` (or derive it dynamically).
