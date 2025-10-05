# AlgoRhythmics Asset Inventory

This catalogue mirrors the current contents of the `static/` directory so designers and engineers can keep source files synchronized with the production build. Update this document whenever files are added, removed, or replaced.

## Directory Structure

```
static/
├── favicon.png
├── og-image.png
└── images/
    ├── brand/
    │   ├── logo-icon.webp
    │   ├── logo-main.webp
    │   └── logo-white.webp
    ├── founders/
    │   ├── founder-nikita.webp
    │   └── founder-slaff.webp
    ├── partners/
    │   ├── brand-deutsche-bank.webp
    │   ├── brand-hm.webp
    │   ├── brand-kfc.webp
    │   ├── brand-klm.webp
    │   ├── brand-longchamp.webp
    │   ├── brand-mcdonalds.webp
    │   ├── brand-puma.webp
    │   ├── brand-star-wars.webp
    │   ├── liaa-logo.webp
    │   └── reclame-fabriek-logo.webp
    └── products/
        ├── ideonautix-hero.webp
        ├── ideonautix-icon.webp
        ├── nodevoyage-hero.webp
        └── nodevoyage-icon.webp
```

## Root Assets

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `static/favicon.png` | Browser favicon | 32 × 32 PNG derived from `logo-icon.webp`. |
| `static/og-image.png` | Social preview | 1200 × 630 Open Graph and Twitter share image. |

## Brand Assets (`static/images/brand/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `logo-main.webp` | Primary logo for light surfaces | Transparent WebP, 600 × 200. |
| `logo-white.webp` | Reverse logo for dark surfaces | Transparent WebP, 600 × 200. |
| `logo-icon.webp` | Square logomark for avatars and favicons | 200 × 200 WebP. |

## Founder Portraits (`static/images/founders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `founder-nikita.webp` | Portrait of Nikita Jurtaevs | Optimised WebP photograph. |
| `founder-slaff.webp` | Portrait of Vjaceslavs "Slaff" Trosins | Optimised WebP photograph. |

## Product Visuals (`static/images/products/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `nodevoyage-hero.webp` | Hero mockup on NodeVoyage page | High-resolution WebP render. |
| `nodevoyage-icon.webp` | NodeVoyage badge used on cards | Transparent WebP. |
| `ideonautix-hero.webp` | Hero mockup on Ideonautix page | High-resolution WebP render. |
| `ideonautix-icon.webp` | Ideonautix badge used on cards | Transparent WebP. |

## Partner and Program Logos (`static/images/partners/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `brand-deutsche-bank.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `brand-hm.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `brand-kfc.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `brand-klm.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `brand-longchamp.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `brand-mcdonalds.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `brand-puma.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `brand-star-wars.webp` | Partner logo in monochrome grid | Exported with transparent background. |
| `liaa-logo.webp` | LIAA partner mark | Transparent WebP. |
| `reclame-fabriek-logo.webp` | Reclame Fabriek partner mark | Transparent WebP. |

## Maintenance Notes

- Prefer WebP exports to keep bundle size small; only use alternate formats when integrating with third-party platforms that lack WebP support.
- Preserve transparent backgrounds for logos so they render correctly on glass surfaces in both themes.
- When replacing any file, keep the filename stable or update import paths throughout the codebase to avoid broken references.
- Maintain the Open Graph image at 1200 × 630 pixels to satisfy major social media platforms.
