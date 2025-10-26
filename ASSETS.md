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
    │   ├── logo-main.png
    │   └── logo-white.png
    ├── founders/
    │   ├── founder-nikita.png
    │   └── founder-slaff.png
    └── products/
        ├── ideonautix-icon.png
        └── nodevoyage-icon.png
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
| `logo-white.png` | Raster export of reverse logo | PNG variant for dark hero backgrounds where SVG filters are restricted. |
| `logo-icon.png` | Raster logomark | PNG square mark for scenarios that require bitmap delivery. |

## Founder Portraits (`static/images/founders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `founder-nikita.png` | Portrait of Nikita Jurtaevs | Production PNG used on the About page and partner highlights. |
| `founder-slaff.png` | Portrait of Vjaceslavs "Slaff" Trosins | Production PNG shipping on team sections. |

## Product Visuals (`static/images/products/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `nodevoyage-icon.png` | NodeVoyage badge used on cards | Production PNG replacing earlier SVG placeholder across the site. |
| `ideonautix-icon.png` | Ideonautix badge used on cards | Production PNG now powering platform showcases and services. |
## Removed / Pending Assets

The following assets were removed in Batch 8 to keep the repository binary-free but are still referenced by the new manifest. Re-export them locally and place the files back under `static/images/**` when ready:

| Expected Location | Notes |
| ----------------- | ----- |
| `static/images/partners/liaa.png` | Partner logo for LIAA (add matching `liaa.webp`). |
| `static/images/partners/reclamefabriek.png` | Partner logo for Reclamefabriek (add matching `reclamefabriek.webp`). |
| `static/images/ideonautix/preview-1.png` | Ideonautix preview still (add matching `preview-1.webp`). |
| `static/images/ideonautix/preview-2.png` | Second Ideonautix preview still (add matching `.webp`). |
| `static/images/nodevoyage/preview-1.png` | NodeVoyage dashboard capture (add matching `.webp`). |
| `static/images/nodevoyage/preview-2.png` | Secondary NodeVoyage capture (add matching `.webp`). |
| `static/images/placeholders/platform-ideonautix.svg` | Legacy placeholder illustration retired in Batch 8. |
| `static/images/placeholders/platform-nodevoyage.svg` | Companion placeholder illustration retired in Batch 8. |

## Maintenance Notes

- Gallery previews currently fall back to the animated SVG placeholder until the PNG/WebP captures listed above are restored.
- Footer partner chips are text-based to avoid binary assets—swap back to manifest-driven images once the partner logo files return.
- Static robots and sitemap files must remain updated whenever routes change so GitHub Pages serves the correct metadata.
- Preserve transparent backgrounds for logos so they render correctly on glass surfaces in both themes.
- When replacing any file, keep the filename stable or update import paths throughout the codebase to avoid broken references.
- Maintain the Open Graph image at 1200 × 630 pixels to satisfy major social media platforms.
- UI grain and glass overlays are now procedurally generated in CSS, so no additional texture bitmaps live under `static/`.
