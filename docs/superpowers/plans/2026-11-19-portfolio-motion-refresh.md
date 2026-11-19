# Portfolio Motion Refresh Implementation Plan

**Goal:** Make the portfolio's scroll and pointer motion perceptible, smooth, responsive, and quieter between routes.

**Architecture:** Keep motion in the existing React/CSS/Three.js stack. Drive hero transforms with a single requestAnimationFrame loop, keep the orb self-contained in Three.js, and let project cards receive lightweight scroll offsets. Preserve semantic reading order and provide still states for reduced motion and touch layouts.

**Tech Stack:** React 19, CSS, Three.js, Zustand (existing app state only).

**Spec:** User request in the active conversation.

## Global Constraints

- The loader plays on the first site entry only; internal route changes have no curtain.
- The original student portrait remains natural color with no CSS image filter.
- Remove decorative hero labels and mascot speech copy; retain essential page content and contact navigation.
- Respect `prefers-reduced-motion`; do not hijack scroll or add horizontal overflow.
- Avoid adding animation dependencies.

## Review Focus

- Touch viewport: no pointer tilt or horizontal page overflow; scroll remains native.
- Reduced motion: hero, orb, project cards, mascot, and entry loader settle without continuous motion.
- Navigation: direct route entry shows the first-entry loader once, internal navigation does not.
- Three.js unavailable: abstract fallback remains visible and the hero layout stays intact.
- Narrow viewport: hero lines and project cards remain readable with no clipped CTA.

## Tasks

### Task 1: Hero parallax and interactive orb

Update `src/App.jsx`, `src/components/OrbitScene.jsx`, `src/components/AbstractOrbitFallback.jsx`, and `src/styles.css`. Split the hero heading into independently animated lines. Use scroll progress for differentiated line offsets, portrait lift/right drift, a slower enlarging circle, and muted-to-blue `web.` color; use pointer position for a small portrait tilt and orb lift. Replace the crystal with a softly glowing wireframe sphere, add hover scale, and remove the floating hero note/coordinates.

### Task 2: Page story motion and route behavior

Update `src/App.jsx`, `index.html`, `src/styles.css`, and `design-system/personal-portfolio/MASTER.md`. Order the home narrative as Hero → About → Work. Add a restrained About handoff, project-card horizontal parallax on desktop with image zoom on hover, and a slower contact reveal. Keep the portal loader on first entry only and remove per-route transition marking and loader copy.

### Task 3: Portrait and companion polish

Update `src/data.js`, `src/App.jsx`, `src/components/WalkingMascot.jsx`, `src/styles.css`, `README.md`, and `docs/portfolio-content-guide.md`. Use the user's original color portrait without filters, remove the mascot speech bubble, and simplify the cat into a friendly two-tone SVG companion with motion feedback. Keep the user's original portrait intact; remove the unused processed monochrome alternate.

## Verification

- Run `npm run build`.
- Inspect home and Work at desktop and mobile widths.
- Confirm first-entry loader and subsequent route behavior in a browser.
