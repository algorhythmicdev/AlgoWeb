# AlgoRhythmics Website

The official marketing site for AlgoRhythmics, an AI innovation lab developing the NodeVoyage travel platform and the Ideonautix productivity suite.

## Overview

The site presents company positioning, product roadmaps, founder biographies, and contact information in six languages. It includes animated backgrounds, light and dark themes, and reusable UI primitives for consistent branding.

## Key Features

- Homepage with hero, story, product highlights, and milestones
- Dedicated product pages for NodeVoyage and Ideonautix
- Consulting, contact, and community pages with interactive elements
- Persistent theme and language preferences stored in local storage
- SVG-based icon system shared across the application

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
