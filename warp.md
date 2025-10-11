# Rapid Actions Backlog

This file lists the highest-impact follow-up items surfaced during the latest UI and UX audit. Use it as the working checklist for the next iteration.

## Outstanding Tasks

- [x] **Language Dropdown Accessibility** — Added roving tabindex semantics, active descendant management, and tab handling so the menu meets custom listbox guidance.

- [x] **Mobile Menu Focus Trap** — Bound the primary nav to a focus trap, locked body scroll while open, and restored the original scroll position after closing.

- [x] **Consulting Page Form Copy** — Rewrote helper copy in every locale to reference the Strategy, Build, and Care packages with localized messaging.

- [x] **Partner Logo Optimization** — Tuned partner logos with explicit dimensions, async decoding, and low fetch priority to defer network cost on slower devices.

- [x] **Testing Coverage** — Extended Vitest configuration with jsdom, added icon rendering specs, verified theme persistence side effects, and enforced helper localization across dictionaries.

## Recently Addressed

- Replaced all emoji usage with neutral copy and SVG icons.
- Added Escape key handling and focus return to the language switcher.
- Updated `ASSETS.md` to mirror the contents of `static/images`.
- Documented the end-to-end visual audit in `doc.md`.
