# AlgoRhythmics Asset Inventory

This catalogue mirrors the current contents of the `static/` directory so designers and engineers can keep source files synchronized with the production build. Update this document whenever files are added, removed, or replaced.

## Directory Structure

```
static/
├── favicon.png
├── og-image.png
└── images/
    ├── brand/
    │   ├── logo-icon.png
    │   ├── logo-main.png
    │   └── logo-white.png
    ├── founders/
    │   ├── founder-nikita.png
    │   └── founder-slaff.png
    ├── partners/
    │   ├── brand-deutsche-bank.png
    │   ├── brand-hm.png
    │   ├── brand-kfc.png
    │   ├── brand-klm.png
    │   ├── brand-longchamp.png
    │   ├── brand-mcdonalds.png
    │   ├── brand-puma.png
    │   ├── brand-star-wars.png
    │   ├── liaa-logo.png
    │   └── reclame-fabriek-logo.png
    ├── products/
    │   ├── ideonautix-hero.png
    │   ├── ideonautix-icon.png
    │   ├── nodevoyage-hero.png
    │   └── nodevoyage-icon.png
    └── ui/
```

## Root Assets

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `static/favicon.png` | Browser favicon | 32 × 32 PNG derived from `logo-icon.png`. |
| `static/og-image.png` | Social preview | 1200 × 630 Open Graph and Twitter share image. |

## Brand Assets (`static/images/brand/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `logo-main.png` | Primary logo for light surfaces | Synthetic PNG with light gradient, 600 × 200. |
| `logo-white.png` | Reverse logo for dark surfaces | Synthetic PNG with light gradient, 600 × 200. |
| `logo-icon.png` | Square logomark for avatars and favicons | 200 × 200 generated PNG wordmark. |

## Founder Portraits (`static/images/founders/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `founder-nikita.png` | Portrait of Nikita Jurtaevs | Generated PNG portrait with gradient background. |
| `founder-slaff.png` | Portrait of Vjaceslavs "Slaff" Trosins | Generated PNG portrait with gradient background. |

## Product Visuals (`static/images/products/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `nodevoyage-hero.png` | Hero mockup on NodeVoyage page | Generated PNG hero illustration. |
| `nodevoyage-icon.png` | NodeVoyage badge used on cards | Generated PNG on dark gradient. |
| `ideonautix-hero.png` | Hero mockup on Ideonautix page | Generated PNG hero illustration. |
| `ideonautix-icon.png` | Ideonautix badge used on cards | Generated PNG on dark gradient. |

## Partner and Program Logos (`static/images/partners/`)

| File | Purpose | Notes |
| ---- | ------- | ----- |
| `brand-deutsche-bank.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `brand-hm.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `brand-kfc.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `brand-klm.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `brand-longchamp.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `brand-mcdonalds.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `brand-puma.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `brand-star-wars.png` | Partner logo in monochrome grid | Generated PNG with high-contrast background. |
| `liaa-logo.png` | LIAA partner mark | Generated PNG on dark gradient. |
| `reclame-fabriek-logo.png` | Reclame Fabriek partner mark | Generated PNG on dark gradient. |

## Maintenance Notes

- Current build ships synthetic PNG placeholders generated via Pillow; replace with production artwork as it becomes available.
- Preserve transparent backgrounds for logos so they render correctly on glass surfaces in both themes.
- When replacing any file, keep the filename stable or update import paths throughout the codebase to avoid broken references.
- Maintain the Open Graph image at 1200 × 630 pixels to satisfy major social media platforms.
- UI grain and glass overlays are now procedurally generated in CSS, so no additional texture bitmaps live under `static/`.
