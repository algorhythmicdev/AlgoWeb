# AlgoRhythmics Asset Inventory

This catalogue mirrors the current contents of the `static/` directory so designers and engineers can keep source files synchronized with the production build. Update this document whenever files are added, removed, or replaced.

## Directory Structure

```
static/
├── favicon.svg
├── og-image.svg
└── images/
    ├── brand/
    │   ├── logo-icon.svg
    │   ├── logo-main.svg
    │   └── logo-white.svg
    ├── founders/
    │   ├── founder-nikita.svg
    │   └── founder-slaff.svg
    ├── partners/
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
    │   ├── solutions-suite.svg
    │   ├── team-nikita.svg
    │   └── team-slaff.svg
    └── products/
        ├── ideonautix-hero.svg
        ├── ideonautix-icon.svg
        ├── nodevoyage-hero.svg
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
| `logo-main.svg` | Primary logo for light surfaces | Capsule logotype with cool glass gradient. |
| `logo-white.svg` | Reverse logo for dark surfaces | Capsule logotype tuned for dark UI overlays. |
| `logo-icon.svg` | Square logomark for avatars and favicons | Gradient tile with stylised AR monogram. |

## Founder Portraits (`static/images/founders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `founder-nikita.svg` | Portrait placeholder for Nikita Jurtaevs | Vector gradient tile with initials until photography is ready. |
| `founder-slaff.svg` | Portrait placeholder for Vjaceslavs "Slaff" Trosins | Vector gradient tile with initials until photography is ready. |

## Product Visuals (`static/images/products/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `nodevoyage-hero.svg` | Hero mockup on NodeVoyage page | Lightweight vector scene with calm gradients. |
| `nodevoyage-icon.svg` | NodeVoyage badge used on cards | Vector triangle mark with maritime palette. |
| `ideonautix-hero.svg` | Hero mockup on Ideonautix page | Lightweight vector orbit scene. |
| `ideonautix-icon.svg` | Ideonautix badge used on cards | Vector mission patch for Ideonautix cards. |

## Partner and Program Logos (`static/images/partners/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `reclame-fabriek-logo.svg` | Reclame Fabriek partner mark | Vector logotype placeholder with glass gradient. |

## Experience Placeholders (`static/images/placeholders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `consulting-studio.png` | Consulting hero imagery | High-fidelity PNG render used across production surfaces. |
| `contact-lobby.png` | Contact page media | Raster artwork powering the contact hero and feature tiles. |
| `dashboard-overview.svg` | Services portfolio card | Dashboard summary tile for service packages. |
| `education-gallery.png` | Education hub hero | Production PNG with richer lighting for the landing hero. |
| `education-lab.png` | Help center and education cards | Raster lab scene optimised for translucent card treatments. |
| `help-center-desk.png` | Help center hero | PNG illustration shipping in the help centre hero. |
| `mobile-preview.svg` | Mobile preview card | Phone shell for responsive product highlights. |
| `platform-ideonautix.svg` | Ideonautix preview | Orbit rings representing Ideonautix modules. |
| `platform-nodevoyage.svg` | NodeVoyage preview | Route wave representing travel automation. |
| `solutions-suite.svg` | Contact solutions panel | Tile cluster for solutions overview cards. |
| `team-nikita.svg` | About page team card | Glass portrait badge for Nikita. |
| `team-slaff.svg` | About page team card | Glass portrait badge for Slaff. |

## Maintenance Notes

- Current build ships synthetic SVG placeholders generated in-code; replace with production artwork as it becomes available.
- Preserve transparent backgrounds for logos so they render correctly on glass surfaces in both themes.
- When replacing any file, keep the filename stable or update import paths throughout the codebase to avoid broken references.
- Maintain the Open Graph image at 1200 × 630 pixels to satisfy major social media platforms.
- UI grain and glass overlays are now procedurally generated in CSS, so no additional texture bitmaps live under `static/`.
