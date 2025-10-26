# Pending Marketing Assets

The following static files were removed from the repository so the marketing team can supply final, rights-cleared versions later.
Each asset entry lists the expected destination path (relative to the repo root), the file formats required, and any sizing or copy
considerations needed to keep the UI behaving as designed.

| Asset | Target path | Required formats | Alt text / usage | Notes |
| ----- | ----------- | ---------------- | ---------------- | ----- |
| LIAA partner logo | `static/images/partners/liaa` | `.png` (primary), optional `.svg` | Footer partner ribbon (`alt="LIAA"`) | 200×60 px transparent background preferred so it matches the glass footer chips. |
| Reclame Fabriek partner logo | `static/images/partners/reclamefabriek` | `.png` (primary), optional `.svg` | Footer partner ribbon (`alt="Reclame Fabriek"`) | 200×60 px transparent background preferred; keep colours legible on dark glass. |
| Ideonautix product preview 1 | `static/images/ideonautix/preview-1` | `.webp` + `.png` fallback | Gallery card on /ideonautix | 800×500 px canvas; keep rounded corners and transparent background. |
| Ideonautix product preview 2 | `static/images/ideonautix/preview-2` | `.webp` + `.png` fallback | Gallery card on /ideonautix | 800×500 px canvas with matching style to preview 1. |
| NodeVoyage product preview 1 | `static/images/nodevoyage/preview-1` | `.webp` + `.png` fallback | Gallery card on /nodevoyage | 800×500 px canvas; maintain consistent lighting with Ideonautix set. |
| NodeVoyage product preview 2 | `static/images/nodevoyage/preview-2` | `.webp` + `.png` fallback | Gallery card on /nodevoyage | 800×500 px canvas with subtle depth cues; align with halo/glass palette. |

Provide both the `.webp` and `.png` variants for gallery previews so browsers without WebP support still render correctly. The footer
logos can ship as a single transparent `.png`, but vectors are welcome if licensing allows.
