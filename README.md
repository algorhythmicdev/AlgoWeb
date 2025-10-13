Upgrade Guide for AlgoRhythmics.dev (2026 Design System Alignment)

This guide provides a detailed audit of the current site and a roadmap for upgrading components, code, and themes to fully realize the 2026 design vision. All recommendations emphasize AAA accessibility compliance, the new frosted-glass + grain aesthetic, and the OS-like interface patterns outlined in the strategy document.

1. UI/UX Component Audit & Critique
Navigation Bar (Header)

Current: The header already implements a sticky, translucent “glass” nav-shell with blur and dynamic behavior. It condenses on scroll (becoming more opaque for readability) and hides on scroll-down to maximize content space
GitHub
. The nav includes a language switcher (“EN”) and theme toggles (“Keep it light / Go dark / High contrast”), plus a prominent “Talk with us” button. It uses proper semantic elements (<nav> with ARIA labels) and includes a skip-link for keyboard users (ensuring direct content access). The hover and focus states on menu links are styled with a soft lift and frosted chip background
GitHub
, which is good for feedback.

Issues & Gaps: These elements largely align with the 2026 vision of “restrained glass” and clear focus indicators. To refine further:

✅ OS-like Styling: Introduce subtle “window” affordances to reinforce the desktop-OS metaphor. For example, a slight draggable cursor hint or minimalist window controls (• ● ■) on very large screens can suggest the nav is a fixed OS top bar (optional).

✅ Focus Visibility: The header’s focus ring uses a blended color that meets the 3:1 contrast rule
GitHub
. Ensure this is highly visible on all backgrounds (e.g. white focus outline on dark mode nav) and consider an animated focus outline (slight glow or pulse) to improve visibility for low-vision users. This aligns with the guideline that focus indicators must be prominent and not color-alone. Currently, the nav trigger (hamburger) adds a visible outline on focus
GitHub
, which is good. We can further emphasize focus on the language and theme toggles (e.g. add a focus style since they are plain text).

✅ Theme Toggle Clarity: The theme switches are text-based. To avoid relying on color or text alone, add an icon or indicator for the current theme. For example, a sun 🌞 icon for light, moon 🌙 for dark, and a contrast icon (high-contrast symbol) for the HC mode can accompany or replace the text labels. This ensures the active theme is recognizable at a glance (and not just by the absence of a link) – fulfilling the “state is never conveyed by color alone” rule. Each toggle should have aria-pressed or similar to denote which theme is active to assistive tech.

High Contrast Mode: The nav already adapts in High Contrast mode by removing background transparency and using a 2px solid border (currentColor) for a clear divider
GitHub
. This is excellent for AAA compliance. Just double-check that the menu icon and text have sufficient contrast in HC (most likely black on white, which is fine).

Code Suggestions (Navbar): Below is a snippet illustrating some enhancements:

<!-- Example: Wrap theme toggles in a button group for clearer structure -->
<div class="theme-toggle-group" role="radiogroup" aria-label="Choose a theme">
  <button class="theme-btn light" aria-pressed="true">
    🌞 <span>Light</span>
  </button>
  <button class="theme-btn dark" aria-pressed="false">
    🌜 <span>Dark</span>
  </button>
  <button class="theme-btn hc" aria-pressed="false">
    ◼️ <span>High Contrast</span>
  </button>
</div>

/* Example CSS: distinct focus style for theme buttons, and icons for context */
.theme-btn:focus-visible {
  outline: 2px solid var(--focus-ring-color); /* existing focus token */
  outline-offset: 3px;
  /* perhaps add a slight glow animation */
}
.theme-btn.light::before { content: "🌞"; margin-right: 0.25rem; }
.theme-btn.dark::before { content: "🌜"; margin-right: 0.25rem; }
.theme-btn.hc::before { content: "◻️"; margin-right: 0.25rem; }


These changes ensure the header fully embodies the 2026 aesthetic: a frosted top bar with OS cues, obvious focus states, and accessible toggles. The nav’s glass blur and gradient background can remain as in current code (mixing Aurora Purple/Voyage Blue into the backdrop)
GitHub
, which already matches the design language.

Hero Section (Jumbotron)

Current: The homepage hero features the tagline “Where logic dances with creativity.” and a brief description, with CTAs like “Explore Our Services”. The hero likely uses a gradient background with overlays for text legibility. (The design tokens define --gradient-hero and overlay variables, implying the hero has a colorful backdrop tempered by a neutral overlay for contrast
GitHub
GitHub
.) The title “AlgoRhythmics” might be highlighted with a gradient text effect or a “halo” background – the codebase has a HaloFX and AnimatedBackground component, suggesting some dynamic visual in the hero. The hero text uses Montserrat for the branded line and is sizable for impact, with Inter for supporting text, aligning with the typography guidelines.

Issues & Gaps: Overall, the hero conveys the brand message well, but we can upgrade it to fully reflect dynamic minimalism and AAA contrast:

✅ Gradient + Overlay: Ensure the background gradient is paired with a semi-opaque neutral overlay behind text. According to the design vision, no body text should sit directly on a raw gradient. If not already done, apply a translucent white/black layer under the tagline and description. The current design tokens include --hero-overlay-opacity and similar
GitHub
, so use those in CSS: e.g. .hero-section { background: var(--gradient-hero), var(--neutral-overlay); }. This maintains the vibrant “Aurora Purple + Voyage Blue” hero look while keeping text easily readable (AAA contrast).

✅ Motion & Depth: Introduce subtle motion to draw interest without overwhelming. The hero can have scroll-linked or time-based animations that honor reduced-motion preferences. For example, a gentle floating grain or a slow pan of the background gradient can add depth. The site already has a useReveal function for scroll reveals
GitHub
GitHub
 – applying this to the hero text and CTAs would create a smooth fade-up entrance as the page loads (with prefers-reduced-motion automatically short-circuiting to no animation, as in current code
GitHub
).

✅ “Frosted Glass” Elements: Consider a frosted highlight panel behind the hero heading or as a “glass card” containing the key message. This could be a semi-transparent white panel with a slight blur (similar to the .surface-panel style) placed behind the text, giving a calm OS-dialog feel. It would reinforce the tactile feel and ensure contrast. For instance, a translucent card behind “AlgoRhythmics shapes calm AI workflows…” could use the .surface-panel class (which applies blur and a subtle border/shadow)
GitHub
. This echoes the design directive to introduce refined grain and restrained glass in hero/OS shell contexts.

Visual Hierarchy: The hero already uses large, bold text for the main slogan and smaller text for the subtitle/tagline. We should maintain generous line-heights and whitespace around these as currently defined (the CSS uses clamp() to scale spacing, which is great). Verify the color of the hero text is either pure var(--text-primary) on a neutral overlay or uses the gradient text style for the brand name. If gradient text is used (as suggested by the .text-gradient utility
GitHub
), ensure in High Contrast mode it falls back to solid color
GitHub
 – the code already ensures .text-gradient is disabled in HC
GitHub
, which is correct.

Code Suggestions (Hero): To illustrate, here’s how the hero section might be structured and styled after upgrades:

<section class="hero-section section">
  <div class="container">
    <h1>
      <span class="hero-lead">Where logic dances with</span><br/>
      <span class="hero-brand text-gradient">creativity.</span>
    </h1>
    <p class="hero-tagline">AlgoRhythmics builds AI platforms... approachable for everyone.</p>
    <div class="hero-ctas">
      <a href="/services" class="btn primary">Explore Our Services</a>
      <a href="/about" class="btn secondary">Learn About Our Mission</a>
    </div>
  </div>
</section>

.hero-section {
  /* Hero background: frosted Aurora/Voyage gradient with overlay */
  background: linear-gradient(140deg, rgba(19,81,255,0.92), rgba(106,56,255,0.88) 48%, rgba(255,211,57,0.8) 100%), 
              color-mix(in srgb, var(--bg-primary) 70%, transparent 30%); /* neutral overlay mix */
  color: var(--text-primary);
  position: relative;
}
.hero-section::before {
  /* Add a fine grain texture over the hero for a tactile feel */
  content: ""; 
  position: absolute; inset: 0;
  background-image: var(--grain-texture);
  opacity: 0.03;             /* slightly higher grain in hero */
  pointer-events: none;
}
.hero-brand {
  /* If using gradient text for brand name */
  display: inline-block;
  background: var(--gradient-heading);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-ctas a.btn {
  /* ensure CTA buttons meet AA contrast on color */
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}


In this snippet, the hero background uses the defined gradient with an overlay (mixing in --bg-primary which is a neutral) to satisfy the rule that text never sits directly on pure gradients. We’ve added a grain overlay (opacity:0.03) on the hero, slightly higher than the global 0.025, to emphasize texture at this large scale (per the vision of adding ultra-low contrast grain for tactile feel). The CTA buttons should use the Aurora Purple or Voyage Blue as appropriate but with font sizing/weight ensuring at least AA contrast for the text on the colored button (the current site’s Tailwind/Tokens already handle this by using white text on purple, and adjusting blue intensity if needed for smaller text).

Key Highlights & Content Sections

Current: Below the hero, the site lists “Key highlights” – four pillars such as Innovative AI Solutions, Educational Impact, etc., each with a one-line description
algorhythmics.dev
algorhythmics.dev
. Further down, under “What we offer”, the site outlines AI Consulting, Flagship Platforms, Educational Outreach with bullet points and CTA links
algorhythmics.dev
algorhythmics.dev
algorhythmics.dev
. These sections likely use a simple grid or flex layout to arrange content. From the code and design tokens, it appears these sections currently use a flat neutral background (white in light mode) with dark text – ensuring high contrast (e.g. Ink #0A0D14 on Cloud #F5F7FB yields ~12:1 contrast, AAA【25†】). This is in line with the guidance to use neutral cards for content surfaces to maintain AAA text contrast.

Issues & Gaps: To fully realize the OS-like “desktop workspace” feel, we should present these content blocks as windowed panels or cards rather than just text on a page:

✅ Windowed Panels: Wrap each major content block (the highlight list, the offerings, etc.) in a <div class="surface-panel"> or equivalent GlassCard component. The .surface-panel class in the codebase already provides a frosted-glass panel styling: it sets a translucent background with backdrop-blur (20px) and a subtle border and shadow
GitHub
. Using this will give each section a subtle “raised window” appearance, as if these highlights are separate app windows on a desktop. For example, the three offering columns (Consulting, Platforms, Outreach) can each be inside a .surface-panel card with border-radius: var(--radius-xl) and some margin between them. This aligns with the strategy of desktop-OS feel with windowed workspaces and resizable panes for web platforms. It also introduces visual separation and depth without losing contrast (the panel uses a mostly neutral backdrop).

✅ Layout & Grid: Use a responsive grid to mimic an “arranged windows” layout. Currently, the site likely stacks these sections vertically. We can improve the visual layout by, for instance, showing the four Key Highlights as cards in a 2x2 grid on desktop, or the three Offerings as side-by-side panels. Tailwind can be used here (e.g., grid grid-cols-1 md:grid-cols-2 gap-8 etc.) or custom CSS. Ensuring sufficient whitespace (the site uses clamp for section padding which is good) keeps the UI calm and content-focused.

✅ Interactive Hover: While these highlight panels are mostly static text, we can add slight hover or focus effects to indicate interactivity or simply to add polish. For instance, on hover, a panel might lift by 2px or brighten slightly (transform: translateY(-2px) with a shadow) to create a sense of depth (the design vision mentions hover elevations and reveals to support wayfinding). If the highlight items are not links, the hover effect can be purely decorative. But if they link to sub-pages, ensure a visible focus style as well (maybe the entire card gets a focus outline similar to buttons).

✅ Icons or Illustrations: To help young or non-expert users (kids, elders) quickly grok the content, consider adding simple icons next to section titles. The design system advises using rounded, simple icons for clarity at small sizes. For example, an icon of a lightbulb for “Innovative AI”, a graduation cap for “Educational Impact”, etc., can be placed before those headings. Use SVG icons with sufficient contrast (or our icon component). Keep them stylistically consistent (line icons with 2px stroke as noted in the guidelines). These visual cues will make the content more scannable and approachable without heavy reading, aiding users of all ages.

Code Suggestions (Sections):

<section class="section highlights">
  <div class="container grid md:grid-cols-2 gap-8">
    <div class="surface-panel">
      <h3><svg><!-- icon --></svg> Innovative AI Solutions</h3>
      <p>NodeVoyage and Ideonautix adapt to your journeys and workflows with playful precision.</p>
    </div>
    <!-- ...other 3 highlight panels ... -->
  </div>
</section>

<section class="section offerings">
  <div class="container grid md:grid-cols-3 gap-6">
    <div class="surface-panel offering-card">
      <h3>AI Consulting &amp; Integration</h3>
      <ul class="bullets">
        <li>Discovery workshops grounded in signage-inspired clarity</li>
        <li>Pilot roadmaps with opt-out controls and transparent docs</li>
        <li>Training and change support to keep teams confident</li>
      </ul>
      <a href="/contact" class="btn primary">Request a Consultation</a>
    </div>
    <!-- ...Platforms card... Outreach card... -->
  </div>
</section>

.offering-card h3 {
  margin-bottom: 0.5rem;
  font: var(--font-display); /* Montserrat */
}
.offering-card .bullets li {
  margin-left: 1rem;
  list-style: inside disc;
}
.surface-panel:hover {
  /* Hover elevation effect */
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.surface-panel:focus-within {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}


In this code, each content block is enclosed in a surface-panel which automatically applies the frosted glass styling (blur, semi-transparent background) from our design tokens
GitHub
. We leverage Tailwind’s grid classes for brevity (assuming Tailwind is configured; if not, the .grid styles can be in CSS). The focus-within style ensures keyboard users tabbing into links inside a panel still see a visible outline on the panel – this large outline helps those with limited vision know which panel they’re in, satisfying WCAG non-text contrast requirements.

By structuring content as above, the site will start to feel like a desktop with multiple windows rather than a flat page, while still being responsive and accessible. This implements the OS-like design goal in a user-friendly way.

Footer

Current: The footer contains the AlgoRhythmics logo, tagline (“Calm AI tools grounded in signage craft.”), status (“Pre-company — Ideju Kauss October 2025”), location (Daugavpils, Latvia), and contact email
algorhythmics.dev
. It also has columns of links under headings “Company”, “Solutions & tools”, “Resources”, plus a Partners section highlighting a collaborator with a brief description and external link
algorhythmics.dev
algorhythmics.dev
. Social media links are listed as text (“LinkedIn”, “Twitter”, etc.) at the bottom. Structurally, it uses appropriate elements: <nav> for link groups, <aside> for the partner info, and presumably <footer> wrapper. The background in light mode is a light neutral (var(--bg-elev-1) which is white
GitHub
) with a thin top border. Text is in a secondary color (gray)
GitHub
. This matches the design approach of keeping footers muted and neutral to let main content shine.

Issues & Gaps: The footer is well-organized and mostly accessible, but a few enhancements can align it with the new aesthetic and AAA compliance:

✅ Contrast in Dark Mode: Ensure the footer text meets AAA contrast on the dark theme background. Currently, the footer uses --text-secondary for most text
GitHub
. In dark mode, --text-secondary is a mid-gray (#8B9299)
GitHub
 on a dark card background (#121722). This yields about a 5.7:1 contrast (short of AAA 7:1 for normal text). We should lighten the footer text in dark mode to at least meet 7:1. We can map footer text to --muted (which in dark theme is a lighter gray, #BBC5D6
GitHub
) or simply override footer { color: #BBC5D6; } when data-base-theme='dark'. This small change pushes contrast to AAA without overpowering the design.

✅ Frosted Footer Bar: To continue the frosted glass theme all the way down, we can give the footer a slight frosted effect. One idea is to make the footer background translucent and blurred, like a “dock” or taskbar. For example, using backdrop-filter: blur(10px) on the footer with a semi-transparent background (background: color-mix(in srgb, var(--bg-elev-1) 85%, transparent)) would make it feel like a glass dock over whatever is beneath (in practice just the page background). This should be subtle, since footers typically should not distract. We’d also need to darken the text a bit more in light mode if the footer becomes translucent over a light page (or keep a mostly opaque footer). If a frosted footer is too visually busy, maintaining a solid neutral color is acceptable as it provides a visual “grounding” element at the bottom.

Taskbar Concept: As an alternative to a traditional footer style, consider a fixed “taskbar” at the bottom of the screen on desktop view. This would truly mimic an OS. The taskbar could contain key links (or even the same content as the current footer but arranged horizontally with icons). For instance, a left side could have the logo and “© 2026” info, center could have minimal nav icons, right side could have social icons. This is an ambitious redesign, so it depends on the desired user experience. If implemented, ensure it’s responsive (perhaps collapsing to a normal footer on mobile) and keyboard-accessible (tab order through icons). The design strategy did mention dock/taskbar patterns for the web, so this could be a forward-looking enhancement. However, if time is short, a stylized footer with slight glass effect can suffice.

Code Suggestions (Footer):

To address contrast and aesthetic:

footer.footer {
  background-color: var(--bg-elev-1); /* default white */
  color: var(--text-secondary);
  border-top: 1px solid var(--border);
  /* Add a subtle backdrop blur effect */
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
html[data-base-theme="dark"] footer.footer {
  color: #bbc5d6; /* lighter text for dark mode AAA */
  background-color: rgba(18,23,34, 0.8); /* a translucent dark background */
}
html[data-theme="hc"] footer.footer {
  background: #ffffff !important;
  color: #000000 !important;
  backdrop-filter: none !important;
}


If converting to a fixed taskbar:

footer.footer {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  backdrop-filter: blur(10px);
  background: color-mix(in srgb, var(--bg-elev-1) 90%, transparent);
}
footer .social-links a::before {
  /* Example: add icons for social links */
  content: attr(aria-label);
  /* In HC mode, these could just show text or high-contrast icons */
}


This CSS keeps the footer content but styles it like a translucent bar. We’ve added a dark-mode override to use an 80% opaque dark background so that white text in the footer still has a solid backdrop (ensuring contrast). In high contrast mode, we remove the transparency and blur for maximum clarity
GitHub
GitHub
.

By implementing these footer changes, we uphold AAA contrast (e.g. using #BBC5D6 on #121722 in dark, which is ~8:1 contrast) and propagate the frosted aesthetic to the page’s end. The footer will still serve its informational purpose while subtly echoing the OS shell feeling (especially if using the taskbar approach, per the design goal of merging OS-like affordances into the web experience).

2. Code-Level Improvements & Snippets

Building on the UI critique, below are specific code-level recommendations and examples (primarily in Svelte/Tailwind context) to fix bugs and improve structure:

Centralize Design Tokens: The site already has a theme.css with custom properties for colors, spacing, etc. Ensure Tailwind config also knows these values for utility classes. For example, in tailwind.config.js map the design colors:

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: '#0A0D14',         // dark text
        cloud: '#F5F7FB',       // light bg
        aurora: '#6A38FF',      // Aurora Purple
        voyage: '#1351FF',      // Voyage Blue
        signal: '#FFD339',      // Signal Yellow
        cherry: '#E0322C',      // Cherry Pop
        night: '#0B0E13',       // dark bg
        graphite: '#1A1D23',    // dark surface
        snow: '#F2F5F9'        // light text on dark
      }
    }
  }
}


This allows using Tailwind classes like bg-aurora or text-cloud if needed in markup, which can simplify templates. It also makes it easy to adjust palette in one place. (Note: The site mostly uses CSS vars, so this is optional, but for consistency, connecting Tailwind to the token values can prevent mismatches.)

Spacing and Sizing: The design uses a 4px baseline grid with responsive scaling. The code shows --space-sm, --space-md tokens etc. You can continue using these via utility classes or CSS. For example, apply p-[var(--space-md)] in Svelte (Tailwind might not parse CSS vars directly, so you might instead use classes like p-4 md:p-6 approximating the clamp). The snippet under highlights already uses gap-8 (Tailwind) which roughly corresponds to a medium space. Consistency is key: define section paddings once (the .section class in global.css already does with clamp()
GitHub
). Use those section classes in all pages for uniform vertical rhythm.

Component Structure: Refactor repetitious structures into Svelte components where possible. For example, a Card component for repetitive panel layouts (like highlights or offerings) could be created. The codebase has a GlassCard.svelte; if it’s not already in use, repurpose it to encapsulate the frosted panel markup. That component can accept props like tone (accent tone) or slot content. This way, pages remain clean and the glass effect is consistently applied. E.g.:

<!-- GlassCard.svelte (conceptual) -->
<div class="surface-panel" data-tone={accentTone}>
  <slot />
</div>


Then in pages:

<GlassCard accentTone="accent">
  <h3>Educational Outreach</h3>
  <p>In partnership with LIAA... AI literacy to classrooms...</p>
  <Button href="/outreach" ...>Join the Programme</Button>
</GlassCard>


This uses the existing .surface-panel styles and ensures any future tweaks to panel styling are done in one place.

Visual Bug Fixes: If any visual bugs exist (like overflow issues with the frosted backdrop, or text overlapping on resize), address them with CSS containment or adjustments. For example, adding isolation: isolate; on .section (already present in global.css
GitHub
) is great to ensure each section’s pseudo-elements (like grain overlays) don’t bleed out. Continue to use modern CSS like color-mix() for blending colors – the code shows extensive use of color-mix for borders and backgrounds which is very future-friendly. Just verify browser support or provide fallbacks if needed (most modern browsers support it now).

State Management: The Svelte stores for navigation and theme are well-used (e.g., $navigation.isMenuOpen controlling the mobile menu). Make sure to reset states on route changes if needed (e.g., close the mobile menu when navigating). The current Navigation.svelte does call navigation.closeMenu() on link clicks
GitHub
GitHub
 which is good. Also ensure the LanguageSwitcher and ThemeToggle components properly use ARIA attributes (like aria-expanded on language menu, which likely they do). These aren’t visual per se, but code-level accessibility tweaks – which are crucial for AAA compliance.

Focus Trapping & Modals: If introducing new modals or panels (say a “Preview NodeVoyage” modal window), leverage the existing focusTrap action in Navigation.svelte
GitHub
 by generalizing it. The code already has a robust focus trap implementation for the nav menu; consider moving that to a utility and reusing for any popup windows. Additionally, ensure Escape key closes modals, and add aria-modal="true" and appropriate roles to modals. These code patterns follow the same logic seen in the nav (close on Escape is implemented at 
GitHub
).

✅ Performance & Cleanup: Remove any legacy code that doesn’t serve the new design. The animations.js has a normalization for old “glass-card” classes
GitHub
 – if we unify on .os-window or .surface-panel, ensure all instances are updated and then drop legacy class usage. This keeps the codebase clean. Similarly, check for any unused Tailwind classes or stray utility first (maybe there’s an old .glass-card class definition that can be deleted if everything uses .surface-panel now).

In summary, these code-level changes focus on reusability (creating components for repeated patterns), consistency (centralized tokens and styles), and maintaining accessibility (through ARIA and focus handling). They set the foundation for an easier refactor: developers can start applying surface-panel and related classes to sections, confident that the core styles meet the new design standards for blur, grain, and contrast.

3. Updated Tailwind Design Tokens (2026 Aesthetic)

The new design language introduces a shared Aurora Purple theme with platform-specific accents, all while enforcing WCAG 2.2 AAA. Here are the key design tokens to update or verify in your Tailwind/CSS:

Colors: Adopt the 2026 palettes as custom properties and Tailwind colors. The core brand palette for AlgoRhythmics is:

auroraPurple = #6A38FF – Aurora Purple (common primary across brand)

signalYellow = #FFD339 – Signal Yellow (accent for attention states)

Neutral background and text: cloud = #F5F7FB (light bg) and ink = #0A0D14 (dark ink text) – these provide a clean high-contrast base (Ink on Cloud is AAA).

For dark mode neutrals: night = #0B0E13 (deep dark bg) and snow = #F2F5F9 (light text) – Snow on Night is AAA. Use graphite = #1A1D23 for raised dark surfaces (cards), as it’s slightly lighter than Night for differentiation.

Platform accents: If showcasing NodeVoyage or Ideonautix:

voyageBlue = #1351FF (a vivid blue for NodeVoyage), used in gradients and links.

slate = #1B2230 (a deep slate for Ideonautix UI elements).

cherryPop = #E0322C (vibrant red for warnings/errors) common to both.

These are mostly in code already (as --voyage-blue, --slate-base, etc.). Ensure Tailwind knows them if needed (as shown in the config snippet above).
All text color tokens should map to these neutrals and accents appropriately. For example, --text-primary on light = Ink, on dark = Snow; --link color on light = Voyage Blue (for clickable text) and on dark = a lavender (#A795FF as in code) which ensures link text is AAA on dark
GitHub
【53†】. Double-check those link colors against backgrounds; the current choice yields ~7.16:1 contrast on dark, which is good.

Typography: Continue using Montserrat for headlines and Inter for body text. These are already likely included via @font-face or Google Fonts. In Tailwind, you could define fontFamily: { sans: ['Inter', ...fallbacks], display: ['Montserrat', ...] } for convenience. Key typographic tokens to maintain:

Font sizes and line-heights (the site uses custom properties like --font-h1-size, --font-body-line etc. in typography.css). Keep the generous line-height (e.g. ~1.5 for body text
GitHub
) to aid readability for long content and multiple languages.

Scaling: Ensure that text is easily scalable (the user should be able to zoom 200% or increase OS font size and content remains accessible). Using rem units (as done) means it will scale automatically. For truly adaptive text for kids/elders, you might consider a toggle to increase base font-size or provide alternate styles with larger text. This isn’t explicitly in the 2026 design doc, but it’s a AAA consideration. For now, sticking to a base font ~16px and ensuring headings are distinctive (as they are with Montserrat and colored or gradient) should suffice.

Spacing & Layout: The design uses 4pt grid increments – in code, we see --space-sm: clamp(0.5rem, 1vw, 0.75rem) etc.
GitHub
. These map to roughly 8px, 12px, etc., scaled fluidly. In Tailwind, you might approximate these with spacing utilities (e.g., p-4 for 16px, p-6 for 24px). However, since the site already employs clamp() for responsiveness, continue using those CSS custom properties for margins/gaps (as done in .footer-grid and others). The goal is a consistent rhythm across pages – e.g., same padding around each section, uniform gap between grid items, etc., so the site feels “calm and breathable” as intended.

Radii and Shadows: The tokens indicate using moderately rounded corners: --radius: 16px (and larger radii for full pills)
GitHub
. Keep using those (Tailwind’s default rounded-lg is 0.5rem ~ 8px, so you might define a larger custom radius class or use the CSS var for exact 16px rounding on cards). The design calls for soft, non-intrusive shadows – e.g., --shadow-1: 0 10px 30px rgba(0,0,0,0.08)
GitHub
. These are used on panels and modals to create separation. Verify that the shadow intensity and spread are consistent with design (you may adjust the existing ones slightly to match examples given, like maybe a 24px blur for larger modals). For high contrast mode, remove decorative shadows entirely
GitHub
 (the code already sets box-shadow: none for surface elements in HC
GitHub
).

Grain & Frosted Glass: Introduce or confirm tokens for the grain texture and glass blur:

The code defines --grain-texture (an inline SVG noise pattern) and uses --grain-opacity at different values
GitHub
GitHub
. Standardize grain usage: perhaps a base opacity of 0.025 globally, slightly higher (0.05) on elements that need more tactile feel (nav, hero), and 0 in high contrast (as done: --grain-opacity: 0 in HC
GitHub
). Tailwind doesn’t directly handle this, so just ensure the CSS custom props are applied where needed. For example, add background-image: var(--grain) in the .section::before (which we saw in global.css) to overlay grain on all sections
GitHub
.

For blur, use a consistent blur radius for glass panels – e.g., 20px as in .surface-panel
GitHub
, and slightly more for nav when scrolling (--surface-glass-blur: 26px in nav when not condensed
GitHub
). These choices seem to align with a smooth glass effect. The frosted glass tokens should include:

--glass-blur: 18px (default)
GitHub
 which is used in backdrop-filter.

--glass-bg and --glass-border default to subtle white transparencies
GitHub
; but nav and panels override them with color-mix including accent hues (giving that slight purple/blue tint). Continue to leverage color-mix with Aurora Purple and Voyage Blue in borders for brand feel – e.g., the nav border mixes blue and white
GitHub
, giving a cool tinted line. These nuanced tokens make the glass feel polished and are fine to keep as is.

In summary, most tokens from the design system are already present in the code. The upgrade here is about verifying values against the design spec and tweaking where needed:

Aurora Purple at the right hex (ensure no deviation like using #8A6BFF unless intentionally for dark mode – actually the code uses a slightly lighter purple in dark theme #8a6bff
GitHub
 to account for contrast on dark, which is clever).

Enforcing AAA contrast by adjusting text-secondary in dark, as noted.

Making sure Light, Dark, High Contrast themes each have complete token sets. The site’s theme.css defines all three modes with data attributes
GitHub
GitHub
. Double-check those definitions against spec:

Light: Ink on Cloud (done)
GitHub
GitHub
.

Dark: Snow on Night (done)
GitHub
GitHub
.

High Contrast: Black on White with minimal accents (done, they set primary #4400FF etc., but essentially everything is high contrast)
GitHub
GitHub
. The design guideline explicitly says offer an HC toggle with AAA and pattern redundancy (no info conveyed by color only) – our high contrast mode does exactly that by removing grain, blur, and using currentColor outlines
GitHub
GitHub
. So tokens here are fine – just ensure any new UI element you add also respects high contrast (e.g., if you add an icon, provide an outline alternative or label in HC mode).

By updating and reaffirming these design tokens, the site’s Tailwind setup and CSS will fully embody the 2026 AAA-compliant frosted-glass aesthetic. It provides a single source of truth for colors and sizing, making it easier to maintain consistency as you refactor components.

4. Light, Dark, and High Contrast Theme Definitions

To comply with WCAG AAA, each theme variant needs careful color choices and testing. Below is a breakdown of the expected Light, Dark, and High Contrast themes, using Aurora Purple as the common thread:

🌞 Light Theme: The Light theme uses a very light background and dark text for maximum contrast. Primary surfaces are Cloud white (#F5F7FB) and cards are pure white (#FFF) for a clean look. Body text is Ink black (#0A0D14), yielding AAA contrast on Cloud. Aurora Purple (#6A38FF) is used for primary action elements (e.g. buttons, links) – on the light background, purple itself is quite vibrant, so ensure button text on purple is white and at least 14px bold (or use a slightly darker purple for small text). Voyage Blue (#1351FF) might accent some headings or links, but should be used sparingly to not reduce contrast (on white it’s ~4.5:1 against white for normal text, so mainly use it for larger or bold elements or alongside an outline). Signal Yellow (#FFD339) is only used alongside dark text or as an accent icon, never as a background for body text because yellow against white wouldn’t meet contrast. The Light theme should also incorporate neutral gray tones (e.g., --ash or the text-secondary) for secondary text, but as we noted, keep those above 7:1 (the current #25324B on white is ~12:1, which is good). Focus indicators in light mode often use a mix of Voyage Blue and white
GitHub
 to be visible on light backgrounds (the code’s focus ring is a whitish-blue outline
GitHub
). Test all interactive elements in light theme with a contrast checker – they should meet at least AA, and ideally AAA. Since the palette was chosen for AAA, you should find body text and large icons are AAA, and things like button text at least AA (often AAA too, e.g., white on purple is ~7.9:1 which is AAA for large text and AA for normal).

🌚 Dark Theme: The Dark theme inverts neutrals: backgrounds are Night black (#0B0E13) and Graphite (#1A1D23) for cards. Text flips to Snow off-white (#F2F5F9) as the primary color. This yields AAA contrast (Snow on Graphite ~13:1). Aurora Purple remains in play as an accent, but on dark mode it may need to be lightened or saturated differently to stand out – the tokens show a slightly brighter purple (#8A6BFF) used in dark mode for primary, likely for this reason
GitHub
. So use the token rather than raw #6A38FF on dark surfaces to ensure it pops (the code’s --primary is adjusted in dark). Focus outlines in dark mode use a mix of Voyage Blue and a light tint (#dde7ff)
GitHub
, which creates a visible halo on dark backgrounds. Voyage Blue and Signal Yellow can be used for highlights in dark mode as well, but be mindful: pure #1351FF on near-black is extremely vivid – that’s fine for small accents (it meets contrast easily), but large swaths of bright blue can cause visual vibration. The design advice is to use strong focus rings and shadows to separate elements in dark mode, rather than bright neon blocks. So, for example, use Aurora Purple for icons or small highlights, and use shading (drop shadows, borders) to delineate components instead of large colored surfaces. Dark theme should be tested with common forms and cards under low-light conditions to ensure no element blends into the background (the slight Graphite vs Night difference helps here). Also verify that semi-transparency effects (glass panels) still provide enough backdrop in dark mode – e.g., the nav glass in dark uses a bit more opacity (70% card + 30% blur layer)
GitHub
, which seems to work. If any dark glass feels too transparent (text not as readable), bump up its --surface-glass-strong to include a bit more opaque base.

⚫ High Contrast Theme: The High Contrast theme is a special mode aimed at users with low vision or specific contrast needs. In this mode, colors are reduced to essentially black, white, and a few high-contrast accents. The site’s HC tokens set background to pure white and text to pure black
GitHub
, which is ideal (contrast 21:1). All decorative gradients, shadows, and textures are turned off
GitHub
GitHub
 – as we saw, --grain-opacity is 0, --glass-blur is 0, and even the gradient variables are overridden so that any gradient becomes a solid currentColor fill
GitHub
. This ensures nothing compromises legibility. Aurora Purple is still the base “color” (#4400FF in HC mode as per code, which is a very saturated purple)
GitHub
, but it will only appear for things like links or icons, and even then, we maintain contrast. E.g., the HC palette in code uses a darker yellow (#b78300) for accent to have more contrast than bright yellow
GitHub
. In high contrast, borders and focus indicators are typically 2px solid black (or white when on a dark element) – the code sets currentColor for focus outlines
GitHub
, meaning it will use whatever the text color is (black or white) which is a clever way to ensure contrast. In practice, a focused link in HC mode might show a black outline on a white background – that’s 21:1 contrast, perfect. Check interactive components in HC: for example, a button normally purple would in HC be either black text on white or vice versa (depending on how you implement it; the code’s HC definitions make primary = #4400FF and treat it as an accent, but one could decide to force buttons to grayscale in HC for simplicity). The main point is HC mode should have no reliance on color to convey information – use underlines, shapes, labels. The design doc emphasizes redundancy in high contrast. E.g., if a form field is required and normally indicated by a colored outline, also add an asterisk or label so HC users know. If a link is usually just colored, in HC you might underline it. Our current implementation seems to cover this by using default browser focus and link styles in HC (which are often underlined). High contrast theme should be tested with a color blindness simulator or simply by viewing it in grayscale – things like icons should still be decipherable (the outline icons recommended help here).

In code, these theme differences are activated via the data-base-theme and data-theme="hc" attributes on <html> or <body>. The site already toggles these when the user selects a theme. Just make sure any new CSS respects these conditions. For example, if you add a custom component with a colored background, add a rule under [data-theme='hc'] .your-component { background: transparent; border: 1px solid #000; } so that it transforms in HC mode. The base theme definitions we reviewed in theme.css should cover most elements globally.

5. Layout Redesign for an OS-like Desktop Feel

One of the ambitious goals for 2026 is to make the web experience mimic a desktop operating system where appropriate. Here are suggestions to nudge the layout in that direction, without harming usability:

Multi-Window Layouts: As discussed for content sections, treat major parts of pages as draggable or at least visually separate “windows.” In a future iteration, you might make some panels draggable within the viewport (using a tiny script or Svelte action for drag). For now, even a static simulation (with panels offset or overlapping slightly) can convey the idea. For instance, on a wide screen, you could intentionally overlap the edge of the “NodeVoyage Preview” panel with the “Ideonautix Preview” panel by a few pixels, as if two app windows are open. Be cautious to not actually hide content behind another – this is more of a visual hint of overlap (maybe use margin-left: -20px on one). Use shadows to differentiate layers. This approach should be used sparingly on marketing pages, but could be powerful in a dashboard or demo page. It gives that sense of depth and multiple workspaces, aligning with the “windowed workspaces” concept.

Dock/Taskbar Behavior: If implementing a fixed bottom bar (taskbar), consider also a “start menu” style overlay for navigation. For example, clicking an AlgoRhythmics logo button on the taskbar could pop up a menu (similar to a start menu) with links (Home, About, etc.). This would replace the need for a traditional nav menu at top on desktop. It’s an advanced design move and might be overkill now, but it’s something to keep in mind as you evolve the site. The key is to do it in a way that doesn’t confuse users – OS metaphors are cool for those who recognize them, but basic navigation must remain clear. Perhaps keep the regular nav for now and treat the “OS shell” elements as progressive enhancement (maybe an Easter egg mode or a toggle in a future “experience mode” setting).

Resizable Panes in Content: For any pages that show a lot of data (maybe case studies or documentation pages), you could allow the user to toggle between a full-page view and a split view, as if they are arranging windows. For example, a documentation page could have a left pane (table of contents) and a right pane (content) that the user can drag to resize. Web APIs (CSS grid with draggable dividers) can achieve this. It aligns with giving users a sense of control like on a desktop. This is more applicable to web app interfaces (NodeVoyage app itself) than the marketing site, but implementing it in smaller ways on the site (like a before-and-after comparison window, etc.) can set the stage.

Desktop Wallpaper Aesthetic: Consider the site background (outside the content container) to be like a desktop wallpaper – perhaps a subtle gradient or abstract image that ties into the brand (with very low opacity so as not to distract). The design doc mentions whitespace and calm backgrounds, so don’t go too far here. But a hint of a wallpaper (like a faint Aurora gradient in the corners) plus the grain texture can subconsciously evoke an OS desktop behind the floating windows of content.

In implementing these, always maintain responsiveness. On mobile, the OS paradigm shifts to mobile OS (the doc suggests Flutter apps will feel like mobile OS) – for the web site on small screens, you’ll likely stick to a normal vertical scroll layout (windows will just stack full-width, taskbar might just become a regular footer). That’s fine; we can have these OS-like enhancements visible on larger screens where there’s room to play.

Finally, any such layout changes should be accessible: if content is visually overlapping, it should still be logically ordered in HTML for screen readers. If draggable, ensure keyboard alternatives (maybe arrow keys to move a focus on a “window”). These are complex, but mention them as goals. For now, the actionable step is to style content in separate containers (already covered) and perhaps implement the fixed footer bar as the first step toward a dock.

6. Accessibility, Focus & Motion Enhancements

To reach WCAG 2.2 AAA, we must not only hit contrast ratios but also ensure keyboard accessibility, focus management, and reduced motion options are top-notch. Here are additional enhancements on that front:

Dynamic Focus Indicators: The site has good focus outlines; make them even more pronounced and dynamic. For example, add a CSS animation on focus (a brief pulse or an expanding ring) to help cognitively reinforce focus movement. This can be done with @keyframes on a pseudo-element. However, be sure to disable such animation if prefers-reduced-motion is set (which you can detect in CSS). The design guidelines explicitly call for focus rings that meet non-text contrast 3:1 – our current outlines (light blue on dark, etc.) do this. We just ensure they’re present on all interactive elements: links, buttons, form fields, toggle switches, etc. Doing a tab-through test of the site is crucial: each tab stop should be visible. If any custom component (like a card link) is missing an outline, add one (e.g., via the :focus-visible utility we saw in global.css
GitHub
 which covers most elements by default).

Motion & Reduced Motion: The motion system should be “purposeful and subtle”, with respect for users who prefer reduced motion. Continue using the prefers-reduced-motion media query (we see it used for text gradient and in JS for reveals
GitHub
GitHub
). Expand this to any new animations: for instance, if you add a hovering parallax effect in hero or a spinning icon, wrap it in a @media (prefers-reduced-motion: no-preference) query so it doesn’t run for those who opt out. Also avoid motion in places like forms or long-reading content to prevent distraction. Save the fancy animations for entry transitions, hero sections, or illustrations. We should also test keyboard-triggered animations: e.g., if a user tabs to a link that triggers a tooltip or submenu, ensure that doesn’t cause any jarring motion (maybe just a fade-in).

Semantic HTML Upgrades: Go through the HTML structure and verify semantics: use <main> for main content (wrap the primary sections on each page in <main role="main">), which helps screen reader users jump content. The skip-link already targets an element with id="content" presumably – ensure that id is on the main content container. Use <header> and <footer> tags for those regions (likely already done). Ensure every <section> has an appropriate heading (which it seems to: “Key highlights” has an h2, etc.). For form elements, use proper <label> for inputs and fieldset/legend for groups. The i18n keys for form helper text and error messages are there – make sure those are tied to inputs via aria-describedby. These semantic touches don’t change the visual design but are crucial for AAA (which includes assistive tech considerations).

Text for All Ages: “Better text layering for kids/elder users” likely means making content comprehensible and readable by varying abilities. Some strategies:

Use plain language in critical places (the site’s copy is somewhat marketing-flavored but still clear; just avoid unnecessary jargon in UI labels).

Ensure text is layered on high-contrast backgrounds (we’ve done that with overlays).

Possibly provide an alternate text size toggle as mentioned. Not strictly required by WCAG, but it can be a nice feature. For now, ensure that if someone zooms in or uses browser reader mode, the site’s layout doesn’t break. The fluid spacing should accommodate that.

For older users, having visible cues is important: we’ve added icons, underlines for links, etc., to reinforce meaning beyond just text color. Continue this practice (e.g., an external link has an icon indicating it opens a new site, as done in the footer partner link with an SVG arrow
GitHub
).

Testing: Once updates are in place, test the site with a variety of tools:

Use a contrast checker for all text/background pairs – the design doc mandates AAA for body text, AA for any larger or incidental text if AAA can’t be met. Our aim is AAA across the board where humanly possible.

Test with screen reader (NVDA/VoiceOver) to ensure the flow of content is logical. E.g., does the nav menu announce submenus properly? The code’s ARIA labels (like aria-label={$_('nav.resources_panel_label')}) show they considered this
GitHub
GitHub
. Keep that up.

Test keyboard navigation thoroughly (we did focus on focus outlines; also ensure you can access all interactive elements by keyboard – e.g., is there any on-hover content that also needs a focus or click event to trigger for keyboard? Provide that).

Consider cognitive load: the calm design and familiar OS patterns should help users with cognitive disabilities by providing a consistent frame of reference. Don’t introduce patterns that are too unfamiliar without explanation (the OS paradigm is recognizable to most, but if you did something truly novel, you’d want a tooltip or guide).

By implementing these accessibility and motion enhancements, you ensure the site is not only visually aligned with 2026 goals but also holistically accessible. The design system explicitly frames accessibility as a first-class citizen (multiple mentions of AAA, focus, opt-out controls, localization). Embracing that will improve UX for everyone.

For example, the focus state pairing with shape changes guideline – we have done this by adding icons and outlines (shape change: e.g., the nav submenu opens not just by color but by an actual menu panel shape appearing, which is a non-color indication of state). Continue to look for such opportunities: if something toggles, does its label or shape change? If a section is active, is it only highlighted by color or also an icon? These subtle improvements make a big difference for users who might not distinguish color well or who are navigating by voice/screen reader.

7. WCAG 2.2 AAA Compliance Checklist

To wrap up, here’s a checklist of AAA compliance as it pertains to our updates – ensure all are satisfied:

Contrast: All text is AAA (7:1) against its background (or 4.5:1 for large text, though we strive for 7:1 everywhere). We adjusted dark mode secondary text to hit this. Verify placeholder text in forms is at least 4.5:1 (often placeholders are lighter; our CSS sets them via color-mix to be 74% of text-secondary
GitHub
 – that likely meets AA but maybe not AAA; consider making placeholders a bit darker or use <label> floating labels instead of relying on placeholders). Non-text elements (icons, borders, focus outlines) have at least 3:1 contrast against adjacent colors, which our focus ring color choices address.

Keyboard Accessibility: No keyboard trap, and the focus order is logical. The mobile nav focus trap implemented ensures users can escape menus
GitHub
GitHub
. Continue using such patterns wherever modals or overlays exist.

Timing: No critical information disappears automatically. (Not much timed content on site, but if any auto-rotating banners or such are added, allow pause controls or obey reduced-motion.)

Content on Hover/Focus: Ensure any content that appears on hover (tooltips, submenus) is also accessible via focus and stays visible long enough to be read. The nav submenu in code appears on hover and focus-within – that’s good. Just confirm it is mouse-leave/focus-out that hides it, which is standard.

Forms: Provide clear error messages and instructions. The i18n strings for form errors and helper text indicate the site plans for this
GitHub
GitHub
. Implement those visibly (e.g., below each field) and ensure errors are described to screen readers (use aria-live="polite" on an error message container). Also, use asterisks or “(required)” labels for required fields as the text suggests (with a note that “All fields marked * are required.”
GitHub
). This is both an accessibility and UX improvement.

Language and Localization: The site is multilingual (we see EN, LV, RU, etc.). Make sure the lang attribute on HTML changes accordingly when switching language. This helps screen readers use correct pronunciation. Also verify that all strings (even alt text of images, ARIA labels, etc.) are localized via the i18n system. AAA accessibility includes catering to a broad audience, and supporting multiple languages is part of that (which the site is doing). Also check that the English copy is plain and clear, and that translations are accurate and easy to read in their language.

By following this guide, developers should be able to immediately start refactoring the AlgoRhythmics.dev site. The result will be a UI that feels modern and “futuristic yet calm”, with an OS-like interface metaphor that still works in a browser, and an experience that is welcoming to all users – fulfilling the vision of “innovation that feels welcoming”
GitHub
 and accessible. Each recommendation above references either the design system mandates or current code behavior, so you can cross-check as you implement:

Use the design system quotes (cited) as a checklist for compliance (e.g., “neutral overlays so no body copy sits directly on blends” – did we do that? Yes, in hero overlay).

Use the code references to locate where changes are needed (e.g., adjusting dark theme text-secondary – in theme.css under [data-base-theme="dark"] – and footer styles in Footer.svelte CSS).

Once these upgrades are applied, the site will not only look aligned with AlgoRhythmics’ 2026 branding (frosted glass, grain textures, Aurora accents) but will also function like a robust, accessible application interface ready for the future. Calm, clear, collaborative – and now fully modernized. 🚀
