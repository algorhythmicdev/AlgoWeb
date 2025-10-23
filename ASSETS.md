# AlgoRhythmics Asset Inventory

This catalogue mirrors the current contents of the `static/` directory so designers and engineers can keep source files synchronized with the production build. Update this document whenever files are added, removed, or replaced.

## Directory Structure

```
static/
├── favicon.svg
├── og-image.svg
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
    ├── partners/
    │   ├── Reclame-Fabriek-Cube.png
    │   └── reclame-fabriek-logo.svg
    ├── placeholders/
    │   ├── ChatGPT Image Oct 20, 2025, 11_05_12 AM.png
    │   ├── consulting-studio.png
    │   ├── contact-lobby.png
    │   ├── dashboard-overview.svg
    │   ├── education-gallery.png
    │   ├── education-lab.png
    │   ├── help-center-desk.png
    │   ├── mobile-preview.svg
    │   ├── platform-ideonautix.svg
    │   ├── platform-nodevoyage.svg
    │   └── solutions-suite.svg
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

## Partner and Program Logos (`static/images/partners/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `Reclame-Fabriek-Cube.png` | Reclame Fabriek partner badge | Production cube lockup displayed in the site footer. |
| `reclame-fabriek-logo.svg` | Legacy Reclame Fabriek logotype | Vector placeholder retained for reference. |

## Experience Placeholders (`static/images/placeholders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `consulting-studio.png` | Consulting hero imagery | High-fidelity PNG render used across production surfaces. |
| `contact-lobby.png` | Contact page media | Raster artwork powering the contact hero and feature tiles. |
| `dashboard-overview.svg` | Legacy services portfolio card | Archived SVG tile kept for reference; replaced by NodeVoyage/Ideonautix PNG badges. |
| `education-gallery.png` | Education hub hero | Production PNG with richer lighting for the landing hero. |
| `education-lab.png` | Help center and education cards | Raster lab scene optimised for translucent card treatments. |
| `help-center-desk.png` | Help center hero | PNG illustration shipping in the help centre hero. |
| `mobile-preview.svg` | Legacy mobile preview card | Retired SVG shell kept for archival purposes. |
| `platform-ideonautix.svg` | Legacy Ideonautix preview | Placeholder orbit scene replaced by production PNG badge. |
| `platform-nodevoyage.svg` | Legacy NodeVoyage preview | Placeholder route wave replaced by production PNG badge. |
| `solutions-suite.svg` | Legacy contact solutions panel | Archived cluster tile retained for design reference. |

## Maintenance Notes

- Production PNG artwork now replaces earlier SVG placeholders for founders, partners, and product badges. Retain the SVG files for archival use only.
- Legacy team card SVGs have been removed from `static/images/placeholders/` now that the production portraits live under `static/images/founders/`.
- Preserve transparent backgrounds for logos so they render correctly on glass surfaces in both themes.
- When replacing any file, keep the filename stable or update import paths throughout the codebase to avoid broken references.
- Maintain the Open Graph image at 1200 × 630 pixels to satisfy major social media platforms.
- UI grain and glass overlays are now procedurally generated in CSS, so no additional texture bitmaps live under `static/`.
