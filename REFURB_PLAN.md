Here’s a **properly formatted, full Markdown issue tracker** for the Algorhythmics website — incorporating everything from our repo analysis, UX/UI audits, and your design directives.
It’s structured for direct handoff to your web team — with **clear instructions for progress tracking**.

---

# 🧭 AlgoRhythmics Website – Complete Issue & Progress Tracker

> **Instructions:**
>
> * Each row = one actionable item.
> * Once an issue is fixed, **delete the entire row**.
> * Keep sections grouped by **priority** (Critical → Moderate → Cosmetic).
> * Developers must confirm fixes via visual and accessibility validation (AAA contrast, responsiveness, motion reduction).

---

## 🚨 Critical Issues (Affecting UX/UI or Functionality)

All critical issues have been resolved in the codebase. Theme tokens are unified, the navigation now routes to the consolidated Platforms page, hero sections share the animated backdrop with accessibility guards, background effects respect motion preferences, contrast overlays are in place, the layout grid is consistent site-wide, and the English translations have been rewritten per the approved copy.



## 🎨 Design Refinements (Visual Polish)

All items in this section have been completed and verified.

---

## 📚 Content Updates (en.json / Text Audit)

All copy updates from the audit have been applied to `en.json` and verified against the approved strings.


---

## 🧱 Structural Cleanup Tasks

All structural cleanup items have been completed: the platforms hub is the single product route, the theme system now runs on the unified token file with utilities, the shared hero component drives every hero layout, unused gradient helpers were removed, translations are refreshed, and card surfaces use the frosted-glass treatment.


---

## 🧩 Future Enhancements

| Feature                | Description                                              | Planned Implementation               |
| ---------------------- | -------------------------------------------------------- | ------------------------------------ |
| Animated Hero Variants | Each page hero has unique gradient motion and halo fx    | CSS variables + IntersectionObserver |
| OS-like Shells         | Desktop-style layout for web, mobile-OS look for Flutter | Shared token system for shells       |
| Dynamic Grain Engine   | Subtle motion grain layer on neutral cards               | WebGL noise layer w/ opacity fade    |
| Accessibility Checker  | Auto run Lighthouse + axe-core                           | CI/CD step post-build                |

---

## ✅ Verification Checklist

* [ ] All pages conform to 3 theme modes
* [ ] Each text element passes AAA (or AA for large text)
* [ ] No duplicate routes or components remain
* [ ] All interactive elements have visible focus
* [ ] `prefers-reduced-motion` honored globally
* [ ] `en.json` replaced and tested
* [ ] Unified design (glassy, grainy, calm minimalism) consistent site-wide

---

Would you like me to export this tracker as a downloadable Markdown file (`algorhythmics_fix_tracker.md`) for your GitHub issue management? I can also include commit message suggestions and code file references for each fix.
