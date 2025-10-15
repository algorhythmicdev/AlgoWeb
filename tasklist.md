# Remaining Work for Glass UI Refresh

This checklist tracks the outstanding follow-ups needed to finish the dark theme + glass redesign. Each task includes context, the relevant source snippet, and space to tick off progress once complete.

## 🎨 Design Tokens & Theming
- [ ] **Resolve conflicting outreach accent tokens**  
  _Context:_ `body.page-outreach` is declared twice in `src/lib/styles/global.css`. The second block (lines 95-98) overwrites the NodeVoyage accent palette established on lines 89-93, so the outreach pages never inherit the travel blue/yellow blend that the particle network expects.  
  _Snippet:_
  ```css
  body.page-outreach,
  body.page-nodevoyage {
    --accent-primary: var(--nodevoyage-accent);
    --accent-secondary: var(--nodevoyage-highlight);
  }

  body.page-outreach {
    --accent-primary: var(--aurora);
    --accent-secondary: var(--signal);
  }
  ```
  _Next step:_ decide which palette the outreach route should own, remove the duplicate block, and ensure the particle animation picks up the corrected values.

## 🧼 CSS Cleanup
- [ ] **Remove the unused gradient heading animation**  
  _Context:_ `@keyframes bar-pan` and the `.heading` helper in `src/lib/styles/global.css` (lines 355-388) were part of the pre-refresh hero styles, but no template still references `class="heading"`. Keeping them around reintroduces a background gradient the client explicitly asked to retire.  
  _Snippet:_
  ```css
  /* Gradient bar animation */
  @keyframes bar-pan {
    from { background-position: 0% 50%; }
    to   { background-position: 100% 50%; }
  }

  .heading::after {
    background: linear-gradient(var(--grad-angle), var(--grad-a), var(--grad-b));
    animation: bar-pan var(--bar-speed, 16s) ease-in-out infinite alternate;
  }
  ```
  _Next step:_ delete the helper + keyframes and verify no bundler warnings remain.

- [ ] **Strip out the legacy magnetic-card animation block**  
  _Context:_ The entire `.magnetic-card` rule set in `src/lib/styles/animations.css` (lines 109-220) and the orphaned `@keyframes halo-pulse` definition (lines 86-94) are unused now that every surface runs through `<GlassCard>`. They keep gradient overlays and long-running animations in the bundle despite the request to remove leftover effects.  
  _Snippet:_
  ```css
  @keyframes halo-pulse { … }

  .magnetic-card {
    background: color-mix(...);
    /* gradient halo + hover animation */
  }

  @keyframes magnetic-card-halo { … }
  ```
  _Next step:_ excise the unused styles and confirm the navigation shell (the only consumer of `.os-window`) still renders correctly.

## ✅ QA & Regression
- [ ] **Re-run the project checks once the clean-up lands**  
  _Context:_ After removing the unused CSS, rerun the automated suite to ensure the bundle still builds cleanly.  
  _Suggested commands:_
  ```bash
  npm run check
  npm run build
  ```

