# Lumen Companion Memory Assets

This folder stores structured content that the Lumen AI companion can lean on across the site. JSON and Markdown files placed here are safe to import on both the client and server for localized knowledge, prompts, and long-lived persona details.

- `companionProfiles.ts` exposes the localized greetings, suggestions, and knowledge base used by the interface and the server API.
- Additional `.json` or `.md` files can be added to persist reusable copy, onboarding scripts, or extended memories without hard-coding them into the component itself.

Keep entries small and focused so they can be shipped to the browser without impacting initial load.
