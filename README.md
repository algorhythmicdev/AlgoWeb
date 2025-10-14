Visual UI/UX Issues
	Issue / Description	Affected Component/Page	Recommended Fix (sample code)
[ ]	Inconsistent Spacing: Ensure all margins, paddings and grid gaps use the unified spacing tokens (--space-*, --grid-gap-*) to maintain the 4‑pt baseline grid
GitHub
. Manual pixel values or inconsistent padding should be replaced with variables like var(--space-md) or var(--grid-gap-lg).	All pages / CSS	Replace hard‑coded spacing. For example, instead of margin:24px;, use margin: var(--space-md);. Confirm containers use the --section-padding-* tokens (e.g. padding: var(--section-padding-desktop) for large screens)
GitHub
.
[ ]	Typography Inconsistencies: All headings/body text must use the defined font stacks and typographic tokens
GitHub
. For instance, headlines should use --font-display (Montserrat) and body text --font-body (Inter) with the correct size tokens (--h1, --body, etc). Any hard‑coded font sizes or families should be replaced.	Global CSS / components	Apply CSS variables: e.g. <h1 style="font: var(--font-display); font-size: var(--h1);">Headline</h1>. Ensure usage of theme text sizes (e.g. var(--h2)) and weights (e.g. font-weight: var(--font-h2-weight))
GitHub
.
[ ]	Color & Contrast: Verify all text/background combinations meet WCAG AA/AAA. Body text (--text) on background (--bg) is AAA in light mode. Secondary elements on colored backgrounds (e.g. banners/buttons) must use correct token pairs. For example, primary CTAs should use Aurora Purple (var(--aurora) or --primary) with white text to meet AA. Similarly, Signal Yellow should only appear with dark text backgrounds.	Buttons, banners	Replace any direct color codes with semantic vars. E.g.:
button.primary { 
  background: var(--aurora); 
  color: var(--cta-primary-text); /* white text */
}


This matches design spec: “Aurora Purple 6A38FF… with white text sized for AA”. Ensure links/banners on --signal use dark text (--text-strong). |
| [ ] | Focus Outlines: All interactive elements (links, buttons) must have visible focus rings. The theme defines focus tokens (--focus-ring and --focus-ring-color) for 3:1 contrast
GitHub
. Check that :focus styles use these. | Global CSS | Add or enforce:

:focus { outline: var(--focus-ring); outline-offset: var(--focus-ring-offset); }


Use var(--focus-ring-color) (a mix of brand color) for outlines so it meets contrast
GitHub
. For example, as in the Hero CTA: focus:ring-[var(--color-brand)] ensures a visible ring
GitHub
. |
| [ ] | Hero Overlay & Animations: Hero backgrounds use animated gradients with neutral overlays for readability
GitHub
. Ensure each hero section includes an overlay (e.g. semi‑transparent white/black) so text remains high‑contrast (AAA). Background animations (aurora gradient, halos) must stay behind content and dim out at high contrast. | Hero components (Hero.svelte or page headers) | Wrap the animated background in two layers:

<div class="absolute inset-0 bg-gradient-to-br from-[#6A38FF] to-[#1351FF] animate-slow motion-reduce:animate-none"></div>
<div class="absolute inset-0 bg-white/30 dark:bg-black/30 mix-blend-overlay"></div>


This matches the reference implementation
GitHub
. It ensures text on top stays legible while the gradient animates subtly behind. Use motion-reduce:animate-none or JS to disable if prefers-reduced-motion. |

Codebase-Level Issues
	Issue / Description	File / Location	Recommended Fix (sample code)
[ ]	Hard‑coded Values vs Tokens: Some components may be using explicit colors, sizes or spacings instead of the semantic variables. Audit for any literal values (e.g. #1351FF, padding: 1rem) and replace with tokens from theme.css.	Various Svelte/CSS files	Search for raw colors (e.g. #6A38FF, px) and replace. Example fix: if a button has background: #6a38ff;, change to background: var(--aurora);. If padding is fixed, replace with e.g. padding: var(--component-padding-md);. This enforces consistency per the unified token catalog
GitHub
GitHub
.
[ ]	Unused or Legacy Routes: Verify legacy content routes. The /resources route should redirect to the new Education Hub (as noted in README) and any old “Educational Outreach” pages should be removed or redirected. Keeping unused pages can confuse navigation.	src/routes/resources/+page.js, src/routes/educational-outreach	For /resources: ensure +page.js does redirect(307, '/education-hub'). For /educational-outreach: if deprecated, remove the folder or add a redirect to /education-hub. This aligns with “legacy resources redirect” in docs
GitHub
.
[ ]	Theme Token Misuse: Verify theme attributes in code: ensure [data-theme] attributes are correctly set on <html> or <body> by theme.ts. Also ensure components use semantic classes (e.g. .hero--nodevoyage, .hero-landing) to apply page-specific accent tokens
GitHub
.	src/lib/stores/theme.ts, component classes	In theme.ts, applyThemeAttributes() should set the data-theme attribute on <html>. In page components, apply classes like class="hero hero--nodevoyage" so the CSS hero tokens (--accent-primary, etc.) apply as intended
GitHub
. Fix any mismatches.
[ ]	Glass Card Reusability: Components such as <GlassCard> should use the same frosted‑glass effect tokens (blur, transparency) everywhere. Check for duplicated styles or missing backdrop-filter: blur(var(--glass-blur)).	GlassCard.svelte	Use the theme’s glass tokens:
.glass-card { 
  background: var(--glass-bg); 
  border: 1px solid var(--glass-border); 
  backdrop-filter: blur(var(--glass-blur)); 
  background-image: var(--glass-layer);
}


This ensures the “glass” appearance matches the design system
GitHub
. |

Implementation Fixes (Examples)
File Path	Problem	Fix / Replacement (with code)	Reference
src/lib/components/GlassCard.svelte	Missing glass blur/filter. Cards should use frosted glass tokens per design.	Add styles:	
.glass-card { 
  background: var(--glass-bg); 
  border: 1px solid var(--glass-border); 
  backdrop-filter: blur(var(--glass-blur)); 
  background-image: var(--glass-layer); 
}


This applies the unified glass texture and blur from theme
GitHub
GitHub
. | Theme tokens
GitHub
GitHub
 |
| src/routes/+layout.svelte (or equivalent) | Keyboard shortcut “t” toggle not bound / missing. | In <script>, add:

window.addEventListener('keydown', e => {
  if (e.key === 't') theme.toggle();
});


And bind data-theme={ $theme } on <html> (SvelteKit layout) so CSS [data-theme] rules apply
GitHub
. Ensure high‑contrast shortcut works. | Theme store
GitHub
GitHub
 |
| src/lib/components/Navigation.svelte | Incomplete aria labels: icon buttons lack descriptive text. | For icon-only links/buttons, add aria-label. Example:

<button aria-label="Toggle theme"><Icon name="theme" /></button>


This ensures screen readers have context
GitHub
. (All images/icons should have alt or aria-label.) | Accessibility Best Practices
GitHub
 |
| Any component using gradients (e.g. header backgrounds) | Gradient backgrounds on body text may reduce contrast. | Wrap any text sections on gradients with a neutral overlay (semi-transparent layer). E.g. add:

<div class="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay"></div>


just above the text. This follows the hero overlay pattern to keep text AAA-readable
GitHub
. | Design guidelines
GitHub
 |

Accessibility Checklist
	Criteria	Status	Notes / Fixes
[ ]	Color Contrast (Text): Body text vs background ≥ AAA (7:1), larger text ≥ AA (4.5:1).		Default tokens (--text on --bg) are AAA. Verify all text uses these. Use --text-secondary-base, etc.
[ ]	Color Contrast (Non-text): UI elements (borders, icons) ≥ 3:1.		Focus rings use var(--focus-ring-color) calculated for ≥3:1. Check subtle elements (icons) use --link, --divider, etc.
[ ]	Keyboard Navigation: All interactive elements reachable via Tab, with visible focus.		Ensure all <button>, <a> are focusable and have :focus styles. The layout code already “implements focus traps”
GitHub
. Manually test tab order.
[ ]	ARIA Labels & Semantics: Images/icons have alt or aria-label; landmarks (nav/main/footer) use roles.		E.g. logo <img> should have alt="AlgoRhythmics logo". Nav uses <nav>. Icon buttons include aria-label (e.g. Theme toggle).
[ ]	Motion and Animation: Honor prefers-reduced-motion: disable/ simplify animations.		Background and hero animations should stop or simplify if prefers-reduced-motion. As in example, use motion-reduce:animate-none or JS detection
GitHub
.
[ ]	Accessible Colors: No information by color alone – e.g. focus/active indicated by outline or shape changes (3:1).		Buttons use both color and outline (as shown) for states
GitHub
. Ensure error/warning states use icons/labels, not just red.
[ ]	Text Alternatives: All images have descriptive alt. Decorative images use alt="" or aria-hidden="true".		Audit any <img> tags. Make sure <img src="tech.png" alt="Student using VR headset" /> instead of missing alt.
Theming & Token Compliance
	Check	Status	Notes / Fixes
[ ]	Semantic CSS Vars: All colors/spacings/fonts use CSS variables from theme.css (e.g. --bg, --text, --card, --primary)
GitHub
GitHub
.		Confirm no hard-coded values remain. E.g. use var(--cloud) for backgrounds and var(--ink) for text by default.
[ ]	Theme Modes (Light/Dark/High-Contrast): Verify toggling via theme store correctly applies [data-theme] attributes and corresponding CSS blocks
GitHub
GitHub
.		Switch UI (button or “t” key) cycles through themes. Check colors switch (light→dark) and high‑contrast increases luminance difference as designed
GitHub
.
[ ]	Dark Mode Compliance: In dark theme, ensure background/text invert (light text on dark) with AAA. E.g. --text becomes light on --night.		Dark mode CSS should use --text: var(--snow) on --night: #0b0e13 for AA. Confirm these are applied.
[ ]	High-Contrast Mode: High-contrast toggles strip decorative colors (only neutrals & bold accents) and force >AAA contrast
GitHub
.		Check [data-theme='hc'] overrides: text black on white, simple controls. E.g. theme.css sets --text: #000, --bg: #fff for HC
GitHub
.
[ ]	Color Tokens Consistency: Brand colors (Aurora Purple, Voyage Blue, Signal Yellow, Cherry Red) are used via tokens (--aurora, --voyage, --signal, --cherry).		E.g. --aurora is defined as #6A38FF
GitHub
. Ensure buttons/links use var(--aurora) not variants. For errors, use var(--cherry) (#E0322C).
[ ]	Light/Dark Variation: Verify accent usage per scheme (e.g. Ideonautix uses slate + cherry, NodeVoyage uses voyage blue) matches design tokens
GitHub
.		If a page is labeled .hero--nodevoyage, it should use voyage-blue accent; .hero--ideonautix uses slate and cherry accents. Fix class names or CSS if misaligned.
Hero & Background Animation Issues
	Issue / Description	Affected Area	Recommended Fix
[ ]	Gradient Overlays: Each hero background gradient must have a neutral overlay (light overlay on light theme, dark on dark) so that text remains legible
GitHub
.	Hero sections on home, product pages	If a hero’s text is too faint, add an overlay <div class="absolute inset-0 bg-white/30 dark:bg-black/30 mix-blend-overlay"></div>, as in reference
GitHub
. This ensures AAA contrast over the animated gradient.
[ ]	Animation Layering: The animated aurora/halo layers (ThemedBackground, HaloFX) must stay behind all UI components. Ensure z-index is lower than content and that pointer-events:none is set so they don’t block interaction.	Background components (ThemedBackground.svelte, etc.)	In CSS: .background { z-index: var(--z-background); pointer-events: none; }. Content containers should be z-index: var(--z-base) or higher. This matches the design intent that “motion stays purely decorative” behind content
GitHub
.
[ ]	Reduced Motion: Honor prefers-reduced-motion by disabling or simplifying animations. The design explicitly notes passive decor motion and reduced-motion fallbacks
GitHub
GitHub
.	Global / Background scripts	Use CSS media queries or JS: e.g.
@media (prefers-reduced-motion: reduce) {
  .animate-fly-around { animation: none; }
}


Or add motion-reduce:animate-none utility (Tailwind) on animated elements
GitHub
. Ensure any looping animations stop under reduced-motion. |
| [ ] | Particle/Veil Visibility: Background effects like particles and dust should not obscure content. Ensure opacity is low (≈0.1–0.2) and intensity is reduced in high-contrast mode
GitHub
. | ThemedBackground.svelte, HaloFX.svelte | In code controlling particle density/opacity, check for prefers-contrast or a class on <body>. For high-contrast mode, set these layers to minimal (as done in theme.css: --grain-opacity: 0 in HC mode
GitHub
). Use the theme’s ambient intensity tokens per route. |
| [ ] | Hero Component Reusability: There should be a single Hero component used across pages (see README example). Duplicate hero code in each page is error-prone. | src/lib/components/Hero.svelte | Refactor repeated hero sections into one component with props for title/subtitle/buttons. Use the code structure from the example
GitHub
. Ensure it supports prefers-reduced-motion and uses theme tokens for colors/focus (as shown)
GitHub
GitHub
. |

Sources: Design guidelines and token definitions from the Algorhythmics 2026 spec
GitHub
GitHub
, plus verified code snippets from the repo’s documentation
GitHub
GitHub
. All fixes align with WCAG2.2 AA/AAA requirements and the brand’s unified theming system.
