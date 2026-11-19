# MOST. — Pornput Sooduappatham

A multi-page React portfolio for a software developer. The visual system pairs warm monochrome surfaces with a periwinkle-blue accent, a supplied transparent portrait, and a custom Three.js wireframe sphere. Scroll and pointer parallax give the hero layers different speeds while the text and page structure remain standard HTML.

## Start locally

```bash
npm install
npm run dev
```

## Pages

- `/` — Personal introduction, featured projects, expertise, education highlight, and a contact CTA.
- `/about` — Background, approach, values, and education.
- `/projects` — Project index with technology tags.
- `/projects/:slug` — Case-study template for each project.
- `/experience` — Work experience, KMUTT education, and highlights.
- `/contact` — Email, professional profile links, and optional résumé link.

All public routes use real links and the production build pre-renders each page into its own HTML file. React hydrates that markup in the browser, while Vite's development server keeps the same routes available locally. Configure `SITE_URL` to your final origin when building to add canonical URLs, Open Graph URLs, a sitemap, and `robots.txt`:

```bash
SITE_URL=https://your-domain.example npm run build
```

Without `SITE_URL`, route HTML is still pre-rendered, but domain-dependent SEO files are omitted so the template does not publish a fake canonical domain.

## Personalize before publishing

1. Edit `src/data.js`: introduction and About copy, values, expertise, email, location, social handles, degree/program, study years, project examples, and any experience or highlights.
2. Replace the starter project descriptions and outcomes with truthful project context, your role, technical decisions, and evidence. The UI labels starter case studies so they are not presented as real accomplishments.
3. Add a résumé PDF to `public/` and set `profile.resumeUrl` to its path to show the résumé link.
4. The original `public/pornput_kmutt_photo_nisit.png` is preserved. The hero and About page use its transparent, original-color WebP export at `public/pornput_kmutt_photo_nisit.webp`, with no image filter.
5. Update title, meta description, Open Graph card, Person JSON-LD, favicon, and social links in `index.html` and `public/` if your public profile changes.
6. Update `design-system/personal-portfolio/MASTER.md` if you change the design tokens.

The email and profile links are intentionally placeholders until you supply the real URLs. A persistent contact shortcut stays easy to reach without adding copy over the portrait.

## Motion and performance

- Scroll parallax moves hero copy, portrait, circle, orb, About transition, and Work cards at different rates. It uses passive scroll events and requestAnimationFrame, and turns off when `prefers-reduced-motion` is enabled.
- A text-free periwinkle portal plays on first entry in a tab. Internal page changes stay immediate and do not show the loader.
- The Three.js module loads separately from the main page code. The hero uses a softly glowing wireframe sphere with fine orbital rings and satellites. It responds to pointer and scroll, pauses outside the viewport or while the tab is hidden, caps pixel ratio, and disposes its GPU resources on unmount.
- The portrait has reserved dimensions and is prioritized as the hero image. Replace project art with optimized AVIF/WebP and descriptive alt text when you add real images.

## Stack

- React + Vite
- Zustand for small UI state
- Three.js for the developer-themed hero scene
- Plain CSS tokens, responsive layout, and route-based page templates
