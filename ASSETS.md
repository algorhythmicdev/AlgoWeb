# AlgoRhythmics Asset Inventory

This catalogue mirrors the current contents of the `static/` directory so designers and engineers can keep source files synchronized with the production build. Update this document whenever files are added, removed, or replaced.

## Directory Structure

```
static/
├── favicon.svg
├── og-image.svg
├── robots.txt
├── sitemap.xml
└── images/
    ├── brand/
    │   ├── logo-icon.png
    │   ├── logo-icon.svg
    │   ├── logo-main.png
    │   ├── logo-main.svg
    │   ├── logo-white.png
    │   └── logo-white.svg
    ├── founders/
    │   ├── founder-nikita.png
    │   ├── founder-nikita.svg
    │   ├── founder-slaff.png
    │   └── founder-slaff.svg
    ├── placeholders/
    │   ├── platform-ideonautix.svg
    │   └── platform-nodevoyage.svg
    └── products/
        ├── ideonautix-hero.svg
        ├── ideonautix-icon.png
        ├── ideonautix-icon.svg
        ├── nodevoyage-hero.svg
        ├── nodevoyage-icon.png
        └── nodevoyage-icon.svg
```

## Root Assets

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `static/favicon.svg` | Browser favicon | Responsive vector icon derived from the logomark. |
| `static/og-image.svg` | Social preview | 1200 × 630 responsive Open Graph illustration. |
| `static/robots.txt` | Robots policy | Static crawl instructions for GitHub Pages hosting. |
| `static/sitemap.xml` | Sitemap | Hand-curated list of prerendered pages for the static deploy. |

## Brand Assets (`static/images/brand/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `logo-main.png` | Raster export of primary logo | Production-ready PNG for static marketing surfaces. |
| `logo-main.svg` | Primary logo for light surfaces | Capsule logotype with cool glass gradient. |
| `logo-white.png` | Raster export of reverse logo | PNG variant for dark hero backgrounds where SVG filters are restricted. |
| `logo-white.svg` | Reverse logo for dark surfaces | Capsule logotype tuned for dark UI overlays. |
| `logo-icon.png` | Raster logomark | PNG square mark for scenarios that require bitmap delivery. |
| `logo-icon.svg` | Square logomark for avatars and favicons | Gradient tile with stylised AR monogram. |

## Founder Portraits (`static/images/founders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `founder-nikita.png` | Portrait of Nikita Jurtaevs | Production PNG used on the About page and partner highlights. |
| `founder-nikita.svg` | Legacy placeholder for Nikita Jurtaevs | Retained for reference while vector assets are deprecated. |
| `founder-slaff.png` | Portrait of Vjaceslavs "Slaff" Trosins | Production PNG shipping on team sections. |
| `founder-slaff.svg` | Legacy placeholder for Vjaceslavs "Slaff" Trosins | Vector fallback kept for archival purposes. |

## Product Visuals (`static/images/products/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `nodevoyage-hero.svg` | Hero mockup on NodeVoyage page | Lightweight vector scene with balanced gradients. |
| `nodevoyage-icon.png` | NodeVoyage badge used on cards | Production PNG replacing earlier SVG placeholder across the site. |
| `nodevoyage-icon.svg` | Legacy NodeVoyage badge | Kept for archival purposes and future vector exports. |
| `ideonautix-hero.svg` | Hero mockup on Ideonautix page | Lightweight vector orbit scene. |
| `ideonautix-icon.png` | Ideonautix badge used on cards | Production PNG now powering platform showcases and services. |
| `ideonautix-icon.svg` | Legacy Ideonautix badge | Archived vector version of the badge artwork. |

## Experience Placeholders (`static/images/placeholders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `platform-ideonautix.svg` | Ideonautix gallery placeholder | Text-based illustration used until production captures ship. |
| `platform-nodevoyage.svg` | NodeVoyage gallery placeholder | Companion illustration covering the travel dashboard preview. |

## Maintenance Notes

- Gallery previews reuse existing SVG hero artwork until binary uploads can resume; update the entries in `GalleryPreview` when new renders are available. The component accepts either paired WebP/PNG bases or a direct `src` path for future exports.
- Footer partner chips are text-based to avoid binary assets—revise copy or swap to inline SVG if dedicated logos become available upstream.
- Static robots and sitemap files must remain updated whenever routes change so GitHub Pages serves the correct metadata.
- Preserve transparent backgrounds for logos so they render correctly on glass surfaces in both themes.
- When replacing any file, keep the filename stable or update import paths throughout the codebase to avoid broken references.
- Maintain the Open Graph image at 1200 × 630 pixels to satisfy major social media platforms.
- UI grain and glass overlays are now procedurally generated in CSS, so no additional texture bitmaps live under `static/`.
