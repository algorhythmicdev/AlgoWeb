# Rapid Actions Backlog

This file lists the highest-impact follow-up items surfaced during the latest UI and UX audit. Use it as the working checklist for the next iteration.

## Outstanding Tasks

1. **Language Dropdown Accessibility**  
   Implement arrow-key navigation and a roving tabindex pattern in `language-switcher.svelte`. Confirm the existing Escape key support and focus return behave consistently across browsers.

2. **Mobile Menu Focus Trap**  
   When the navigation menu is open on small screens, trap focus inside the menu container and restore scroll position when closing.

3. **Consulting Page Form Copy**  
   Localize helper descriptions for the consulting intake form once the final service packages are approved.

4. **Partner Logo Optimization**  
   Investigate lazy-loading strategies for the partner logo grid to reduce initial payload on slower devices.

5. **Testing Coverage**  
   Add component tests that confirm theme persistence, translation loading, and icon rendering across light and dark themes.

## Recently Addressed

- Replaced all emoji usage with neutral copy and SVG icons.
- Added Escape key handling and focus return to the language switcher.
- Updated `ASSETS.md` to mirror the contents of `static/images`.
- Documented the end-to-end visual audit in `doc.md`.
