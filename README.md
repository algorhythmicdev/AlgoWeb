Phase 1: Headless CMS Evaluation and Selection

kernelics.com
kernelics.com
 Evaluate CMS Options: We reviewed Strapi, Sanity, and Directus. Strapi is a mature, open-source Node.js CMS (with REST/GraphQL APIs and built-in RBAC) that auto-generates content endpoints
kernelics.com
. Sanity is a cloud-first, real-time CMS with a React Studio (great for collaboration, no ops burden)
kernelics.com
. Directus is a database-first CMS that wraps an existing SQL schema with auto APIs
kernelics.com
. All three support rich text, media uploads, tagging and scheduling. For ease of self-hosting, strong SvelteKit integration, and community support, we choose Strapi
kernelics.com
. (Sanity is noted for live editing and scaling but is proprietary; Directus offers DB control but requires a SQL setup.)

Phase 2: CMS Setup and Content Modeling

CMS Backend: Install Strapi (v5) on our server/Cloud (e.g. Google Cloud or Vercel) with a PostgreSQL database. Configure CORS to allow requests from our site (e.g. localhost:5173 in dev)
strapi.io
. Secure the Strapi instance (SSL, firewall).

Authentication & Roles: Use Strapi’s Users & Permissions plugin to create roles (Admin, Editor, Author, Viewer). Configure secure login (JWT) and email verification. Strapi will manage user authentication for content creators; we will also use these credentials in our SvelteKit app to gate the /admin area
strapi.io
.

Content Types (Schemas): Define Strapi content-types for:

Blog Post: Fields: title (string), slug (UID), excerpt (text), content (rich text/Markdown), featured image (media), publishDate (date-time), status (enum: draft/published), categories (relation), tags (relation), author (relation).

Educational Module: Fields: title, slug, description, content (rich text), media attachments (media, multiple images/PDFs/videos), category (e.g. “Core”, “Lab”, etc.), tags, publishDate, status.

Category: Fields: name, slug. (Used to organize posts/modules.)

Tag: Fields: name. (For filtering and SEO.)

Author: Fields: name, bio, avatar (media). (Relates to posts.)

(Optionally, Platform Article: if separate from blog, similar schema.)

Each content-type should have a “published” boolean or status and a “publishAt” field for scheduling. Strapi plugins or lifecycle hooks can enforce publish timing.

Permissions & Workflow: In Strapi settings, allow Editors/Authors to create and schedule content but require Admin approval for publishing. Enable draft/publish workflow. Ensure media library is set up for uploads (e.g. AWS S3 or Cloudinary provider) and configure file size/type limits.

Phase 3: Admin Authentication & Dashboard Route

Secure Admin Route (/admin): Create a protected SvelteKit route at src/routes/admin/. In +page.server.ts, check for a valid session token; if absent, redirect to /login. For example:

// src/routes/admin/+page.server.ts
import { redirect } from '@sveltejs/kit';
export async function load({ cookies }) {
  if (!cookies.get('jwt')) throw redirect(302, '/login');
  // Optionally verify token with Strapi
}


Login Page: Build src/routes/login/+page.svelte with a form for email/password. On submit, POST to Strapi’s auth endpoint (/api/auth/local). E.g.:

const login = async (email, password) => {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password })
  });
  const data = await res.json();
  if (data.jwt) {
    document.cookie = `jwt=${data.jwt}; Path=/; HttpOnly`;
    // Redirect to /admin
  }
};


(Storing JWT in HttpOnly cookie for security; SvelteKit can then send it on server requests.)

Admin Dashboard UI: In src/routes/admin/+page.svelte, display links/forms to manage content. For example: “Manage Blog Posts” and “Manage Modules” sections. Provide an “Add New” button that opens a form. Use Svelte components (e.g. <AdminNav>, <ContentList>, <ContentForm>) to reuse styling. The dashboard should allow listing existing items (with Edit/Delete actions) and opening a modal or new page to create/edit content via Strapi’s REST API.

API Integration: In the admin pages, use fetch (server-side in SvelteKit) to GET/POST to Strapi. For example, to fetch all posts:

export const load = async ({ fetch, cookies }) => {
  const jwt = cookies.get('jwt');
  const res = await fetch(`${STRAPI_URL}/api/posts?populate=author,tags,categories`, {
    headers: { Authorization: `Bearer ${jwt}` }
  });
  const { data } = await res.json();
  return { posts: data };
};


Use similar calls for creating/updating via fetch(strapiUrl, { method: 'POST', headers: {...}, body: formData }). Ensure only authenticated requests (with JWT).

Phase 4: Frontend Integration & Content Pages

Routes & Data Fetching: Implement SvelteKit pages for the public site: e.g. src/routes/education-hub/+page.svelte (hub index), src/routes/education-hub/[slug]/+page.svelte (module detail), src/routes/blog/+page.svelte, and src/routes/blog/[slug]/+page.svelte. In each +page.js or +page.server.ts, use load to fetch data from Strapi. Example for list pages:

export const load = async ({ fetch }) => {
  const res = await fetch(`${STRAPI_URL}/api/posts?populate=author,tags,categories`);
  const { data } = await res.json();
  return { posts: data };
};


For detail pages, filter by slug:

export async function load({ params, fetch }) {
  const res = await fetch(`${STRAPI_URL}/api/posts?filters[slug][$eq]=${params.slug}&populate=author,tags`);
  const { data } = await res.json();
  return { post: data[0] };
}


This leverages Strapi’s REST API queries. Use populate to include relations (author, media, etc.). The content (rich text) can be rendered with a Svelte component, sanitizing it first if necessary (see Phase 7).

Rendering Logic (SSR/ISR): Enable SvelteKit’s SSR (default) for SEO
svelte.dev
. For pages with static content (published posts/modules), use export const prerender = true to statically generate at build time. Example:

// In blog/[slug]/+page.js
export const csr = false;
export const prerender = true;


This satisfies SEO and performance
strapi.io
svelte.dev
. For frequently changing content, rely on incremental rebuilds (e.g. a webhook to redeploy on Strapi publish).

UI Components: Update or create components (e.g. <PostCard>, <ModuleCard>, <HeroBanner>) to display dynamic content. Reuse the existing design system classes (colors, fonts, etc.) from src/lib/styles or Tailwind config to maintain consistency. For example, use the same <Header> and <Footer> layouts as the rest of the site.

Styling & Animations: Use Svelte transitions or CSS animations consistent with the theme (glassmorphism, subtle fades) for content loading. Ensure hover/focus states match the established design. (E.g. use svelte:transition for list item reveal.)

Phase 5: Educational Hub Redesign

Dynamic Content: The Education Hub (at /education-hub) should list modules (with filters by category/tag). Fetch these from Strapi as above. Support sorting or category tabs (e.g. “Core Courses”, “Labs”, “Community”).

Interactive Features: If needed, allow authors to schedule modules, set visibility (public vs partner-only). Implement UI controls for these (e.g. “Publish on” date picker). Use Strapi’s API to save scheduling.

Media Handling: Enable content creators to upload images, PDFs, or videos in the editor. In Strapi, configure the Media Library and any upload providers. In SvelteKit, ensure images use <img alt={...} src={...}> with responsive sizes. Store caption/alt text in the CMS and apply it in the template for accessibility.

Phase 6: Admin Dashboard Wireframe & UI Structure

Dashboard Layout: Design the /admin interface with a sidebar (navigation links: “All Posts”, “Add Post”, “All Modules”, “Add Module”, “Media Library”, “Settings”) and a main panel. Use existing spacing/grid (e.g. Tailwind CSS classes) for consistency. For example:

<div class="flex h-full">
  <nav class="w-64 bg-white shadow-lg">
    <!-- links -->
  </nav>
  <main class="flex-1 p-6 overflow-auto">
    <!-- dynamic content (lists/forms) -->
  </main>
</div>


Content Lists: Each list view (Posts, Modules) shows a table or grid of items with columns: Title, Status, Publish Date, Actions (Edit/Delete). Include a button “+ New” at top right.

Editor Forms: The create/edit form includes fields matching the CMS schema (title input, slug, rich text editor for content, image upload, tag/category selects, publish date picker, status toggle). Use the same form styles as public site (inputs with standard classes). For rich text, use a WYSIWYG editor (Strapi’s default or a Svelte wrapper).

Styling: Apply the corporate design system (colors, fonts) to all admin components. Reuse utility classes (bg-gray-50, text-primary, etc.) so the admin panel visually aligns with the main site.

Phase 7: SEO, Accessibility & Security

svelte.dev
svelte.dev
 SEO: Ensure every page has unique <title> and <meta name="description"> based on content (fetch and inject via <svelte:head>). Use SvelteKit’s SSR to render content for crawlers
svelte.dev
. Generate a dynamic sitemap.xml endpoint (e.g. src/routes/sitemap.xml/+server.js) that lists all blog and module URLs
svelte.dev
.

Accessibility: Follow WCAG 2.2 guidelines (as company policy). Every image must have descriptive alt text from the CMS. Use semantic HTML (e.g. headings in order, <button> for actions). Ensure keyboard navigation works (e.g. focus states visible). Use ARIA roles if needed (e.g. role="dialog" for modals). The design system already targets accessibility, so reuse its components (e.g. color contrast).

wisp.blog
 User Content Safety: Sanitize all HTML/content from the CMS before injecting it into the page to prevent XSS
wisp.blog
. For example, use a library like sanitize-html on the server:

import sanitizeHtml from 'sanitize-html';
const clean = sanitizeHtml(post.content, { allowedTags: [...], allowedAttributes: {...} });


Only allow safe tags (e.g. <p>,<h1>,<a>,<ul>,<li>, etc.). Strapi’s rich text can be sanitized in load() or a helper before rendering with {@html}. Implement a Content Security Policy (CSP) header in hooks.server.js to restrict scripts and frames
dev.to
.

Animations & Performance: Use SvelteKit’s automatic code-splitting and image optimization. Mark interactive scripts to defer when possible. Limit animations to CSS transforms (no layout thrashing). Test Core Web Vitals and adjust (e.g. lazy-load below-the-fold images).

Phase 8: File Structure & CI/CD

Project Structure: Create new directories/components under src/lib (e.g. components/Admin*, utils/api.js). In src/routes, add admin/, login/, blog/, and education-hub/ folders as above. Update the main +layout.svelte to include the <slot /> and shared header/footer. Optionally create src/routes/(protected)/+layout.ts to handle auth redirection.

Styling Config: Ensure Tailwind or CSS variables include any new styles from the design system (check tailwind.config.js and src/lib/styles.css). Import any new fonts or icons needed.

Deployment: Add environment variables (STRAPI_URL, JWT secrets) to the deployment pipeline. Set up two deployments: one for Strapi (Docker or Node process) and one for the SvelteKit site (Vercel/Cloudflare). On Strapi content publish, trigger a rebuild of the site (webhook integration). Implement a CI step to run linting, build and test before deploy.
