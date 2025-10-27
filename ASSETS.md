# Assets Ledger (expected vs present)

This file lists the images expected by the UI. Only **present** files (under `static/images/...`) are used by the site. Missing ones render as SVG placeholders until they’re added.

## Partners (footer)
- [ ] /static/images/partners/liaa.png (+ .webp)
- [ ] /static/images/partners/reclamefabriek.png (+ .webp)

## Ideonautix previews (gallery)
- [ ] /static/images/ideonautix/preview-1.png (+ .webp)
- [ ] /static/images/ideonautix/preview-2.png (+ .webp)

## NodeVoyage previews (gallery)
- [ ] /static/images/nodevoyage/preview-1.png (+ .webp)
- [ ] /static/images/nodevoyage/preview-2.png (+ .webp)

### Notes
- Keep PNG + WebP pairs, same basename. Transparent PNG is preferred for logos.
- After adding files, run: `node scripts/scan-assets.mjs`
- The UI will automatically switch from placeholder to the real image when files appear.

## Videos (WebM)
- [x] /static/videos/algorhythmics-promo.webm
- [x] /static/videos/ideonautix-promo.webm
- [x] /static/videos/nodevoyage-promo.webm

### Notes
- File names can vary. The app matches by substring: "algor", "ideonaut", "nodevoy".
- After adding videos, run: `node scripts/scan-assets.mjs`
