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

### Phase 1: Critical Fixes (NOW)
- [ ] 1.1 Fix Hero typewriter - should type "AlgoRhythmics"
- [ ] 1.2 Make "Where Logic..." static beneath hero title
- [ ] 1.3 Equalize Reality/Mission/Vision card heights and content
- [ ] 1.4 Fix Founders section - equal sizing, side by side
- [ ] 1.5 Update founder info - both work at Reclame Fabriek
- [ ] 1.6 Fix NodeVoyage 4-step boxes (01-04) - prevent text overlap
- [ ] 1.7 Add missing Footer translation keys

### Phase 2: Interactive Enhancements (NEXT)
- [ ] 2.1 Redesign Community voting - make it exciting and interactive
- [ ] 2.2 Redesign Contact page - add personality and engagement
- [ ] 2.3 Add stagger animations to cards
- [ ] 2.4 Add parallax effects to hero backgrounds
- [ ] 2.5 Add hover effects with tilt to product cards
- [ ] 2.6 Add sparkle trails to primary CTAs
- [ ] 2.7 Add morphing blob backgrounds
- [ ] 2.8 Add scroll-triggered reveals throughout

### Phase 3: Polish & Effects (FINAL)
- [ ] 3.1 Add ripple effects to all buttons
- [ ] 3.2 Add magnetic attraction to CTAs
- [ ] 3.3 Add smooth transitions between sections
- [ ] 3.4 Add loading animations
- [ ] 3.5 Add micro-interactions on form inputs
- [ ] 3.6 Test all animations on mobile
- [ ] 3.7 Optimize animation performance
- [ ] 3.8 Final accessibility audit

---

**End of Document**
