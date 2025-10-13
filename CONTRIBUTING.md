Here is a **comprehensive issue and bug tracker for algorhythmics.dev**, bringing together your site vision, repo/upgrade plans, and a fresh inspection of the live and codebase state (from web, paste.txt, and a full browser run). This list is fully actionable for Codex/dev agents and structured in Markdown for team/issue tracker usage.

***

# AlgoRhythmics.dev – Complete UX/UI, Theme & Content Issue Tracker

**Instructions:**  
Delete each row once completed. Grouped by severity: **Critical** (blocking, accessibility, brand), **Moderate** (design polish/consistency), **Minor/Cosmetic**. Each issue includes context, actionable items, and code hints.

***

## Critical Issues

| ID  | Area                | Issue/Problem                                                         | Context/Evidence                                                        | Solution/Action Items                                                                                     | Status  |
|-----|---------------------|----------------------------------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|---------|
| C1  | Theme System        | Light/Dark/HC themes inconsistent; white-only backgrounds on some pages; legacy/floating chooser visible | Multiple CSS files, floating toggler, inconsistent backgrounds, some pages ignore theme[1] | 1. Consolidate all theme tokens (Light, Dark, HC) in a single **theme.css**<br>2. Remove old theme files/togglers<br>3. Apply tokens globally via data-theme, ensure all backgrounds/cards use tokenized CSS<br>4. Visually test all modes page-by-page | Pending |
| C2  | Navigation/Routes   | Unmerged Products, NodeVoyage, Ideonautix pages/links exist in top nav + footer; possible dead routes/CTAs | Separate links/sections for NodeVoyage and Ideonautix, despite a unified Products plan[1][2] | 1. Remove all redundant Nav/Footer/Product links/routes <br>2. Merge into a single Platforms page<br>3. Redirect old routes; update all menu configs/code | Pending  |
| C3  | Hero Sections       | Only Consulting hero matches glassy/grainy/animated plan<br>Other heros are plain gradients/contrast-violating | Home and others use full gradients with text on color, violating AAA/plan; bullet list repeats | 1. Universal Hero.svelte with per-page animation/variant support (aurora, grid, halo etc.)<br>2. Ensure a neutral overlay under text, use animated bar for heading<br>3. Refactor every route's hero<br>4. Place CTA(s) beneath, not over hero graphics     | Pending |
| C4  | Contrast/Accessibility | Numerous low-contrast cases: text over gradients, button on purple, icons on tints | Home, Founders/Partners, Milestones, Button pills. Some links/buttons unreadable in HC/Dark | 1. Use neutral overlays behind all text.<br>2. Enforce minimum AAA for text, 3:1 for non-text (focus, outlines)<br>3. Add/expand prefers-reduced-motion & HighContrast CSS<br>4. Address icons/badges for color+icon, never color alone              | Pending |
| C5  | Cards/Panels        | Inconsistent cards: some glassy/grainy, others use gradient, fat shadows, or white<br>Founders core strengths repeat, partners verbose | Card styles, duplicate/missing grain, repeated content, partner cards overload | 1. Make GlassCard.svelte universal; migrate all panels (Founders, Partners, Milestones) to use it<br>2. Halo/particle/grain variants as per site vision[1][2]<br>3. Remove repeated content (core strengths, bullet lists)<br>4. Limit partners to brief, clear sections | Pending |
| C6  | Duplicated/Dirty Content | Bullet lists appear twice, placeholder copy and unkeyed translations remain | "Shared rituals" etc. listed twice, duplicated in text; en.json is messy | 1. Rewrite all content (excl. Founders text) and centralize in cleaned en.json[1]<br>2. Audit pages/components for literal strings—move to i18n.<br>3. Remove all "AI products with a people-first beat", repeated bullets, and filler copy | Pending |
| C7  | Unused Code/Assets     | Legacy CSS, JS, assets, and old hero/components remain in repo     | Old hero, card, animation scripts, unused nav/menu routes                | 1. Purge unused: old Hero*, card, animation helpers, images<br>2. Remove/merge old theme files<br>3. Run linter and check for dead import/asset references | Pending |

***

## Moderate / Design Consistency

| ID  | Area                | Issue/Problem                                                         | Context/Evidence                                                        | Solution/Action Items                                                                                     | Status  |
|-----|---------------------|----------------------------------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|---------|
| M1  | Buttons/CTAs        | Inconsistent styles: fill, border, rounded, focus; some white on purple fails | Buttons hover at top, some square/rounded, non-token colors, poor focus                  | 1. Use Button.svelte with theme tokens for fill/border/focus<br>2. Animate scale/elevation, never color-only for active<br>3. Ensure all CTAs have neutral+accent contrast (see plan)         | Pending  |
| M2  | Layout/Spacing      | Hero sections, bullet lists, cards, and footers are not aligned to grid or type ramp | Messy margins and paddings, Timeline/Stay in Orbit misalign, all-caps headings             | 1. Use CSS/grid utilities for spacing<br>2. Clamp-based type ramp for headings+body<br>3. Replace all-caps with strong, readable type                 | Pending  |
| M3  | Timeline/Filters    | Timeline overuses colors/gradients, non-interactive, no true filter | Timeline items hard to read, status not filterable                                  | 1. Refactor Timeline to GlassCard items<br>2. Add filter control with visible, accessible buttons<br>3. Status as badge, not card color                   | Pending |
| M4  | Footer              | Footer design inconsistent — too many panels/cards, gradients, hard-to-read links      | Footer uses four panels, pastel/gradient backgrounds, default blue link color                         | 1. Redesign as a single GlassCard on dark neutral; columns for Company/Platforms/Resources/Partners<br>2. Brand accent hover/underline on links                      | Pending |

***

## Minor / Cosmetic

| ID  | Area                | Issue/Problem                                                         | Context/Evidence                                                        | Solution/Action Items                                                                                     | Status  |
|-----|---------------------|----------------------------------------------------------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|---------|
| D1  | Animation Polish    | Some sections lack slow gradient/halo/particle FX, abrupt transitions in/out           | Static heroes except Consulting; odd reveals; missing fade/intersection observer | 1. Add slow-moving gradient w/ grain overlay via custom property animation.<br>2. Use fade/reveal observer for hero/cards<br>3. Sync to prefers-reduced-motion | Pending  |
| D2  | Iconography         | Icons have mixed scale, stroke, and non-token colors; badge icons lack outlines        | Bullet/partner/timeline icons inconsistent                                                      | 1. Use a consistent icon set (Lucide, outline-2px)<br>2. Always include outline or filled icon with accent background, not color only | Pending  |
| D3  | SEO/Layout Meta     | Subpages missing meta tags, accessibility roles                                       | No per-page svelte:head; missing aria labels in buttons/nav                                    | 1. Add load/svelte:head tag to each route<br>2. Role and aria-label as needed on interactives       | Pending  |

***

## General Key Upgrade Snippets

Below are some **universal code patterns** for refactor (adapt as needed):

```css
/* theme.css -- universal theme token structure */
:root,
[data-theme='light'] {
  --bg: #f5f7fb;
  --bg-elev-1: #fff;
  --text: #0a0d14;
  --primary: #6a38ff;
  --accent: #1351ff;
  /* ... */
}
[data-theme='dark'] { /* ... */ }
[data-theme='hc']   { /* ... */ }
/* Add transitions for theme change */
* { transition: background-color .55s, color .55s; }
```

```svelte
<!-- Universal Hero.svelte (variant via prop) -->
<script>
  export let title, subtitle, variant='aurora';
</script>
<div class="hero {variant}">
  <div class="gradient-bar"></div>
  <h1>{title}</h1>
  <p>{subtitle}</p>
  <slot />
</div>
<!-- overlay & grain via CSS; see plan for class structure -->
```

```svelte
<!-- Button.svelte with accessible focus, neutral+accent -->
<button class="btn" aria-label="{label}">
  <slot />
</button>
<style>
  .btn { background: var(--bg-elev-1); border: 2px solid var(--primary); }
  .btn:focus { outline: 3px solid var(--primary); outline-offset: 3px; }
</style>
```

```json
// en.json
{
  "hero_title": "Where logic dances with creativity",
  "hero_subtitle": "Accessible AI for travel and founders, built with signage discipline.",
  "platforms_nodevoyage": "Your AI-powered travel companion — plan, explore, and remember journeys effortlessly.",
  "platforms_ideonautix": "The productivity suite for modern creators — where every idea gets momentum.",
  "cta_explore": "Explore our platforms",
  ...
}
```

***

## Additional Notes

- Confirm ALL issues in **every theme** (light, dark, high contrast).
- Test ALL language settings for: text overflow, placeholder copy, broken layouts, unkeyed strings.
- Use browser and accessibility tools (Lighthouse/axe) before marking fixes as complete.

***

**Next Steps:**  
After each fix, delete from this tracker and mark with a commit referencing the issue ID for auditability.

***

This issue framework, with context/code, enables precise step-by-step cleanup and modernization for a unified, premium-grade AlgoRhythmics.dev experience, matching both your plan and live requirements.

[1](https://algorhythmics.dev/)
[2](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/40327484/695ff11e-14bd-48de-b0fa-2ab650669394/paste.txt)
[3](https://algorhythmics.dev/)
[4](https://algorhythmics.dev/contact)
[5](https://algorhythmics.dev/platforms)
[6](https://algorhythmics.dev/community)
[7](https://algorhythmics.dev/consulting)
[8](https://algorhythmics.dev/#platforms)
[9](https://algorhythmics.dev/platforms#nodevoyage)
[10](https://algorhythmics.dev/platforms#ideonautix)
[11](https://reclamefabriek.eu/)
[12](mailto:nikita@algorhythmics.com)
[13](https://linkedin.com/in/nikita-jurtaevs)
[14](mailto:slaff@algorhythmics.com)
[15](https://linkedin.com/in/slaff-trosins)
[16](mailto:AlgoRhythmics.dev@gmail.com)
[17](https://algorhythmics.dev/#story)
[18](https://algorhythmics.dev/#founders)
[19](https://algorhythmics.dev/#vision)
[20](https://algorhythmics.dev/#timeline)
[21](https://algorhythmics.dev/#partners)
[22](https://linkedin.com/company/algorhythmics)
[23](https://github.com/algorhythmics)