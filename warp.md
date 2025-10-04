# AlgoRhythmics Website - Complete Design System & Fixes

**Last Updated:** 2025-10-03  
**Status:** In Progress → Production Ready

---

## 🎨 Brand Identity

### Colors
```css
/* Primary Colors */
--voyage-blue: #1351FF;      /* Main brand color - trust, technology */
--aurora-purple: #6A38FF;    /* Innovation, creativity */
--signal-yellow: #FFD339;    /* Energy, optimism */
--cherry-red: #E0322C;       /* Urgency, error states */

/* Neutral Palette */
--ink: #0A0A0A;             /* Primary text */
--white: #FFFFFF;           /* Backgrounds, inverse text */
--grey-100: #F5F7FA;        /* Light backgrounds */
--grey-500: #8E96A3;        /* Secondary text */
--grey-800: #2D3748;        /* Dark mode backgrounds */
```

### Typography
```css
/* Headings & Display */
--font-display: 'Montserrat', sans-serif;
--weight-semibold: 600;
--weight-bold: 700;
--weight-extrabold: 800;

/* Body Text */
--font-body: 'Inter', sans-serif;
--weight-regular: 400;
--weight-medium: 500;

/* Scale (Major Third - 1.250) */
--text-tiny: 0.64rem;      /* 10.24px */
--text-small: 0.8rem;      /* 12.8px */
--text-body: 1rem;         /* 16px - base */
--text-title: 1.25rem;     /* 20px */
--text-headline: 1.563rem; /* 25px */
--text-hero: 1.953rem;     /* 31.25px */
--text-display: 2.441rem;  /* 39px */
--text-mega: 3.052rem;     /* 48.83px */
```

### Spacing System
```css
/* Base: 4px */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### Border Radius
```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-2xl: 1.5rem;   /* 24px */
--radius-full: 9999px;  /* Pills/circles */
```

---

## 📐 Layout Standards

### Container Widths
```css
.container {
  max-width: 1280px;  /* Main content */
  padding: 0 var(--space-6);
  margin: 0 auto;
}

.container-narrow {
  max-width: 960px;   /* Reading content */
}

.container-wide {
  max-width: 1536px;  /* Full-width sections */
}
```

### Section Spacing
```css
.section {
  padding: var(--space-16) 0;  /* 64px top/bottom */
}

.section-sm {
  padding: var(--space-12) 0;  /* 48px */
}

.section-lg {
  padding: var(--space-24) 0;  /* 96px */
}

.section-xl {
  padding: 5rem 0;             /* 80px - hero sections */
}
```

### Grid System
```css
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); }

/* Responsive */
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
```

---

## 🎯 Component Standards

### Buttons
```css
.btn {
  padding: var(--space-3) var(--space-6);  /* 12px 24px */
  border-radius: var(--radius-lg);
  font-weight: var(--weight-semibold);
  font-size: var(--text-body);
  transition: all 200ms ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);  /* 16px 32px */
  font-size: var(--text-title);
}

.btn-sm {
  padding: var(--space-2) var(--space-4);  /* 8px 16px */
  font-size: var(--text-small);
}
```

### Cards
```css
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
```

### Form Inputs
```css
input, textarea {
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  font-size: var(--text-body);
  background: var(--bg-elevated);
  transition: all 200ms ease;
}

input:focus, textarea:focus {
  border-color: var(--aurora-purple);
  box-shadow: 0 0 0 4px rgba(106, 56, 255, 0.1);
}
```

---

## 🔧 Current Issues & Fixes Needed

### 1. Hero Section
**Issues:**
- Title too large on mobile
- Subtitle not properly centered
- Typewriter animation might cut off text

**Fixes:**
- Reduce font-size on mobile: `--text-hero` instead of `--text-mega`
- Add max-width: 800px to subtitle
- Ensure typewriter has overflow handling

### 2. Products Page
**Issues:**
- Cards too wide on large screens
- Images not loading (need actual assets)
- Badge positioning needs adjustment
- CTA section gradient too intense

**Fixes:**
- Max card width: 600px
- Center cards when only 2 items
- Adjust badge: top-right with padding
- Soften gradient opacity

### 3. Timeline Section
**Issues:**
- Marker alignment off
- Text overlapping on mobile
- Spacing between items inconsistent

**Fixes:**
- Use flexbox for marker + content
- Add proper margin-bottom between items
- Reduce marker size on mobile

### 4. Founders Section
**Issues:**
- Photos placeholder squares
- Card sizing uneven
- Bio text too small

**Fixes:**
- Add border-radius to images
- Fixed card height or min-height
- Increase font-size to --text-body

### 5. Footer
**Issues:**
- Links too close together
- Mobile stacking awkward
- Missing proper grid

**Fixes:**
- Use proper grid: 4 columns → 2 → 1
- Add gap: var(--space-6)
- Increase link padding for touch

### 6. Navigation
**Issues:**
- Mobile menu needs better contrast
- Active state not clear
- Z-index conflicts

**Fixes:**
- Increase backdrop-blur
- Add border-bottom to active link
- Set z-index: 1000

### 7. Forms (Contact, Consulting)
**Issues:**
- Labels too small
- Error states not visible enough
- Button alignment

**Fixes:**
- Label font-size: --text-body
- Red border + background for errors
- Full-width button on mobile

### 8. Community Page
**Issues:**
- Vote buttons too small
- Card hover state missing
- Leaderboard not prominent

**Fixes:**
- Larger vote buttons (48px)
- Add hover: scale(1.02)
- Highlight top 3 with colors

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base: Mobile (320px+) */

@media (min-width: 640px) {  /* sm - Phablets */
  .container { padding: 0 var(--space-8); }
}

@media (min-width: 768px) {  /* md - Tablets */
  .section { padding: var(--space-20) 0; }
}

@media (min-width: 1024px) { /* lg - Desktop */
  .section { padding: var(--space-24) 0; }
}

@media (min-width: 1280px) { /* xl - Large Desktop */
  .container { max-width: 1280px; }
}

@media (min-width: 1536px) { /* 2xl - Extra Large */
  .container-wide { max-width: 1536px; }
}
```

---

## ✅ Priority Fixes (In Order)

### Phase 1: Critical UI/UX (NOW)
1. ✅ Fix all translation keys
2. ✅ Create products page
3. ⚠️ Fix hero section scaling
4. ⚠️ Fix card/component spacing
5. ⚠️ Fix mobile responsiveness

### Phase 2: Polish (NEXT)
6. ⚠️ Add proper animations timing
7. ⚠️ Fix form validation states
8. ⚠️ Improve hover states
9. ⚠️ Fix footer layout
10. ⚠️ Polish navigation

### Phase 3: Content (AFTER)
11. Replace placeholder images
12. Add real founder photos
13. Translate to other languages
14. Add real testimonials/data
15. SEO optimization

---

## 🎨 Glass-Morphism Guidelines

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
}

.glass-subtle {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
}
```

---

## 🚀 Performance Guidelines

### Images
- Use WebP format
- Lazy load below fold
- Responsive srcset
- Max file size: 200KB

### Animations
- Use transform/opacity only
- Max duration: 400ms
- Respect prefers-reduced-motion
- Use will-change sparingly

### Fonts
- Preload display fonts
- Font-display: swap
- Subset to latin characters
- Max 2 font families

---

## 📝 Content Guidelines

### Headings
- H1: One per page, SEO keyword
- H2: Section titles
- H3: Sub-sections
- H4: Card titles

### Paragraphs
- Max width: 65ch (optimal reading)
- Line height: 1.6-1.8
- Paragraph spacing: 1em

### CTAs
- Action-oriented: "Get Started" not "Click Here"
- One primary per section
- High contrast
- Clear benefit

---

## 🎯 Accessibility Checklist

- [ ] Color contrast 4.5:1 minimum
- [ ] All images have alt text
- [ ] Form labels properly associated
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels where needed
- [ ] Semantic HTML structure
- [ ] Skip to main content link

---

## 🔍 SEO Checklist

- [ ] Unique title per page
- [ ] Meta descriptions 150-160 chars
- [ ] OG images 1200x630
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] Mobile-friendly

---

## 📊 Analytics Events to Track

```javascript
// Page views
gtag('event', 'page_view', { page_path: '/products' });

// CTA clicks
gtag('event', 'click', { event_category: 'CTA', event_label: 'Join Waitlist' });

// Form submissions
gtag('event', 'form_submit', { form_id: 'contact_form' });

// Language changes
gtag('event', 'language_change', { language: 'lv' });

// Theme toggles
gtag('event', 'theme_toggle', { theme: 'dark' });
```

---

## 🎭 Animation Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

---

## 🏁 Launch Checklist

### Pre-Launch
- [ ] All pages render correctly
- [ ] No console errors
- [ ] All links work
- [ ] Forms validate
- [ ] Mobile tested
- [ ] Cross-browser tested
- [ ] Performance > 90 (Lighthouse)
- [ ] Accessibility > 90 (Lighthouse)
- [ ] SEO > 90 (Lighthouse)

### Launch
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] Analytics installed
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Backup system

### Post-Launch
- [ ] Monitor Core Web Vitals
- [ ] Review analytics weekly
- [ ] A/B test CTAs
- [ ] Collect user feedback
- [ ] Update content monthly

---

---

## 🎯 EXECUTION PLAN - Level Up Design

### Here is a precise, actionable guide for each request—covering code, markup, CSS, and component logic. Each phase follows modern best practices for SvelteKit sites and guarantees both visual appeal and responsive UX.

***

# **Phase 1: Critical Fixes**

***

### **1.1 Fix Hero typewriter ("AlgoRhythmics")**

- Open your hero section file (e.g. `src/routes/+page.svelte`).
- Replace any existing typewriter action or headline logic with:

```svelte
<script>
  import { typewriter } from '$lib/utils/animations.js';
</script>

<h1 use:typewriter={{ text: 'AlgoRhythmics', speed: 32, loop: false }}>AlgoRhythmics</h1>
```
- Remove any inner markup that tries to animate "Where Logic..."; this should be static beneath.

***

### **1.2 "Where Logic..." Static Subtitle**

Just beneath the hero title:

```svelte
<h2 class="hero-subheading">Where Logic Dances with Creativity</h2>
```
- In CSS, use `.hero-subheading { font-size: clamp(1.1rem, 3vw, 1.6rem); margin-top: 0.75em; font-weight: 400; }`

***

### **1.3 Equal Height Card for Reality/Mission/Vision**

- Wrap cards in a flex/grid container.
- Apply min-height and padding to cards:
```css
.cards-row {
  display: flex;
  gap: 2rem;
  align-items: stretch;
}
.card {
  flex: 1;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 1.5rem;
}
@media (max-width: 700px) {
  .cards-row { flex-direction: column; }
}
```
- All card content (text, title, even short one) should be visually balanced and of similar length.

***

### **1.4 Founders Section: Equal Size, Side by Side**

- Use flexbox with a fixed (or min/max) width for founder blocks:
```css
.founders-row {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}
.founder-card {
  width: 100%;
  max-width: 320px;
  min-width: 210px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.founder-photo { width: 172px; height: 172px; object-fit: cover; border-radius: 46% 54% 44% 56%/42% 60% 40% 58%; }
```
- Use a responsive `.founders-row` to wrap on small screens.

***

### **1.5 Update Founder Info**

- Edit founders’ bio text in your JSON/data or directly in Svelte:

```json
{
  "founders": [
    { "name": "Nikita", "role": "Co-founder, AlgoRhythmics", "company": "Reclame Fabriek" },
    { "name": "Slaff", "role": "Co-founder, AlgoRhythmics", "company": "Reclame Fabriek" }
  ]
}
```
- In component: `"Works at Reclame Fabriek"`

***

### **1.6 NodeVoyage 4-Step Boxes: Prevent Overlap**

- Ensure step boxes use grid/flex.
- Apply fixed `.step-box` min-height and overflow-wrap:
```css
.steps-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;}
.step-box { min-height: 170px; overflow-wrap: break-word; padding: 1rem; box-sizing: border-box; }
@media (max-width: 900px) {
  .steps-row { grid-template-columns: 2fr 2fr; }
}
@media (max-width: 550px) {
  .steps-row { grid-template-columns: 1fr; }
}
```
- Use only brief, wrapped text, avoidvery long words.

***

### **1.7 Add Footer Translation Keys**

- Ensure all languages have:
  - products, company, about, careers, blog, legal, privacy, terms, cookies, rights, made_in.
- Add any missing keys from footer to ALL translation files.

***

### **Unified Text Sizing Across Site**

- Set CSS variables for scaling:
```css
:root {
  --h1: clamp(2rem, 6vw, 2.6rem);
  --h2: clamp(1.3rem, 3vw, 1.75rem);
  --h3: clamp(1.1rem, 2vw, 1.38rem);
  --text: clamp(.95rem, 1.8vw, 1.08rem);
  --small: clamp(.82rem, 1vw, .93rem);
}
h1 { font-size: var(--h1); }
h2 { font-size: var(--h2); }
h3 { font-size: var(--h3); }
body, p, span, input, button { font-size: var(--text); }
.small { font-size: var(--small); }
```
- Apply across all headings/labels/paragraphs for visual unity and mobile readability.

***

# **Phase 2: Interactive Enhancements**

***

- **Redesign Community Voting**: Use `<ul use:staggerReveal>` on feature list; apply hover, click, confetti/sparkle trails; animate vote count change.
- **Contact Page Personality**: Use typewriter/random message, morph blob SVG, animated icons, text input effects.
- **Card Stagger Animation**: `<section use:staggerReveal={{ stagger:90 }}>` for sections/lists.
- **Parallax Hero**: `<div class="hero-bg" use:parallax={{ intensity:40 }}>` for backgrounds or images.
- **Tilt Hover**: `<div class="product-card" use:tilt>` for product cards.
- **Sparkle Trail**: `<a class="cta" use:sparkleTrail>Join Now</a>` for special CTAs.
- **Morphing Blob Background**: Use `<svg><path use:morphBlob fill="#XYZ"/></svg>` for hero/section art.
- **Scroll Reveal**: `<div use:reveal={{ y:32, duration:650 }}>` for all feature and section blocks.

***

# **Phase 3: Polish & Effects**

***

- **Ripple All Buttons**: Add `use:ripple` everywhere `<button>` is used.
- **Magnetic CTAs**: `use:magnetic` for main/important buttons.
- **Smooth Section Transition**: Use CSS transitions (`transition: opacity .7s, transform .7s;`) and scroll-linked fade/reveal.
- **Loading Animations**: On page load, overlay fade spinner, or animation using Lottie/SVG if desired.
- **Form Micro-interactions**: Animate border/focus using CSS, show icons on valid input, shake/flash on invalid.
- **Test on Mobile**: Open all UI on phones, check tap/focus/scroll/animation smoothness.
- **Optimize Performance**: Use `will-change: transform;` for animated layers; requestAnimationFrame for JS-based effects; avoid animating large DOM trees.
- **Accessibility**: Always include `aria-label`, tabindex, alt text for icons/images, check with Lighthouse.

***

# **Summary Checklist**

| Area   | Action |
|--------|--------|
| Hero   | Svelte use:typewriter for logo; static subtitle below; size h1/h2 with CSS vars |
| Cards/Steps | Use flex/grid; min-height; test on low-res screens |
| Founder | Update bios in JSON; equal card CSS |
| Voting/Contact | Stagger, tilt, sparkle, morph, ripple, magnetic, parallax via Svelte actions |
| Footer | Add keys for each translation; code for all languages |
| General | Use CSS vars for all core text sizes; test every viewport |
| Polish | Add all JS/CSS interactive effects; performance, accessibility |

***

Apply these steps and your site will deliver a visually crisp, exciting, performant UX both for desktop and mobile, across all languages and all screens.