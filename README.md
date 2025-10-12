# AlgoRhythmics Website

The official marketing site for AlgoRhythmics, an AI innovation lab developing the NodeVoyage travel platform and the Ideonautix productivity suite.

## Overview

The site presents company positioning, product roadmaps, founder biographies, and contact information in six languages. It includes animated backgrounds, light and dark themes, and reusable UI primitives for consistent branding.

## Key Features

- Homepage with hero, story, product highlights, and milestones
- Unified platforms page featuring NodeVoyage and Ideonautix previews
- Consulting, contact, and community pages with interactive elements
- Persistent theme and language preferences stored in local storage
- SVG-based icon system shared across the application
- Footer partner spotlight sourced from the shared `brands.json` dataset and rendered with the reusable `GlassCard` shell

## Design System (2026 Refurb)

- **Surfaces:** Aurora Mist (light), Midnight Nebula (dark), and Obsidian Matrix (high contrast) power the refreshed OS-window shells.
- **Palette:** Voyage Blue, Aurora Purple, Signal Yellow, and Cherry Pop drive navigation, accents, metrics, and alerts while maintaining WCAG AAA contrast.
- **Themes:** High-contrast mode now mirrors tokenised borders, focus rings, and frosted glass treatments for parity with light and dark experiences.
- **Tokens:** All colour, spacing, and motion variables live in `src/lib/styles/theme.css`. New surfaces should consume these tokens rather than defining ad-hoc values.

## Motion Blueprint

- **Timing tokens:** `--duration-micro` (120 ms), `--duration-ui` (240 ms), `--duration-hero` (520 ms), and `--duration-epic` (720 ms) guide micro to hero interactions.
- **Easing tokens:** `--ease-out-soft`, `--ease-in-out`, `--ease-snappy`, and `--ease-spring` align Svelte actions and CSS transitions across the site.
- **Svelte actions:** `useReveal`, `useStaggerReveal`, `tilt`, `magnetic`, and `morphGradient` respect reduced-motion fallbacks and share the same timing tokens.

## QA & Accessibility Checklist

- Verified light, dark, and high-contrast modes for the home, products, community, consulting, and contact routes on desktop breakpoints.
- Exercised keyboard navigation, focus outlines, and reduced-motion settings to ensure essential content remains visible without animation.
- Confirmed the marketing build pipeline is clean by running `npm run build` with zero warnings before release.

## Motion QA Checklist

- Profile hero reveals, staggered parallax, and CTA sparkles in Chrome DevTools to keep frame times under 4 ms on mid-tier hardware.
- Toggle `prefers-reduced-motion` in the browser to verify reveals, blobs, and parallax actions respect static fallbacks.
- Inspect animation layers to ensure only GPU-friendly opacity/transform properties animate, preventing layout thrash on scroll.

## Tech Stack

- **Framework:** SvelteKit 2
- **Runtime:** Vercel Edge (configured for server-side rendering)
- **Styling:** Custom CSS with design tokens and utility classes
- **Internationalization:** `svelte-i18n` with six locale files (EN, LV, RU, UK, FR, ES)
- **Tooling:** ESLint, Prettier, and svelte-check via npm scripts

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/algorhythmics/website.git
cd website
npm install
```

Run the development server:

```bash
npm run dev
```

Open the site at `http://localhost:5173` (use `--host` to expose the server on your network if required).

## Verification Commands

- `npm run check` — type checking with `svelte-check`
- `npm run lint` — linting with ESLint
- `npm run build` — production build
- `npm run preview` — preview the production build locally

## Project Structure

```
algorhythmics-website/
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable components (including icons and toasts)
│   │   ├── data/            # Static JSON content such as product metadata
│   │   ├── i18n/            # Locale definitions and setup helpers
│   │   ├── stores/          # Theme and language stores
│   │   ├── styles/          # Design tokens and global styles
│   │   └── utils/           # Animation utilities and helpers
│   └── routes/              # SvelteKit routes for each page
├── static/                  # Public assets (favicons, social previews, imagery)
├── package.json             # Scripts and dependency definitions
└── svelte.config.js         # Framework configuration
```

## Maintainers

- Nikita Jurtaevs — Co-Founder and CEO
- Vjaceslavs "Slaff" Trosins — Co-Founder and CTO

Contact the team at `AlgoRhythmics.dev@gmail.com`.

## License

Copyright © 2025 AlgoRhythmics. All rights reserved.
