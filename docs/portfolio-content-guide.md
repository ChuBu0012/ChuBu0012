# Portfolio content and interaction research

Research snapshot: 19 November 2026. This is a practical synthesis for a personal portfolio template, not a claim that one visual trend fits every profession.

## What makes a portfolio worth continuing through

1. **State the person and value quickly.** A visitor should understand who made the site, what they do, and the kind of work they take on without waiting for an intro animation.
2. **Curate work and give it a story.** Strong projects need enough context to show judgment: the problem, constraints, the contributor's role, key decisions, the outcome, and what evidence supports it. The work itself should stay prominent and easy to scan.
3. **Make navigation and contact obvious.** Visitors often arrive from a résumé or social link with a specific question. Project links, useful professional profiles, and a direct email route should be easy to find on both a phone and desktop.
4. **Let personality show through choices.** A custom interaction or graphic can make a site memorable when it expresses the maker's point of view. Treat it as a supporting layer; it should not hide project evidence or make a visitor learn a game to navigate.
5. **Use motion to reward attention, not delay it.** Scroll-linked response, hover details, transitions, and 3D can create a memorable rhythm. Keep the reading order intact, allow reduced motion, and give a static scene / content fallback.

The current portfolio applies those ideas across a short landing page and focused About, Projects, Experience, Contact, and project case-study routes. A restrained orbital sphere and layered portrait parallax give the hero personality; a persistent contact action stays available without overlay copy. The case-study pages use honest, clearly labeled starter copy until real project evidence is supplied.

## Inspiration and observed conversation

- [Bruno Simon's portfolio](https://bruno-simon.com/) turns the portfolio into a playful driving world. Its instructions expose mouse / keyboard, touch, and gamepad controls, and its options include quality and renderer choices. Takeaway: an immersive interaction can be the work itself, but it needs discoverable controls and device-aware alternatives.
- [Adrien Quéchon's portfolio](https://mesh3d.gallery/website/adrien-quechon) pairs restrained monochrome typography and one expressive Three.js shader with a scroll-led introduction and selected work. Takeaway: a single coherent 3D motif can carry personality without turning every section into an effect.
- A recent [r/UXDesign discussion about case studies and hiring managers](https://www.reddit.com/r/UXDesign/comments/1vygj4j/are_case_studies_still_what_hiring_managers_want/) debates how much process detail people actually read. Another [portfolio-review discussion](https://www.reddit.com/r/UXDesign/comments/1odg3pv/i_just_reviewed_200_resumes_portfolios_ama/) includes advice to show context and explain why the work was made, not just present screens. These are useful qualitative signals, not representative surveys; the practical takeaway is concise evidence with enough context to understand the developer's role and decisions.
- [Creative Bloq's 2026 discussion with creative leaders](https://www.creativebloq.com/professional-development/creative-careers/in-the-age-of-social-media-do-designers-still-need-a-website-in-2026) argues for fast, clear sites with selective work and context about the brief, problem, and solution. It frames a personal site as a deeper destination after social discovery.

## Design system

- **Mood:** editorial minimalism with a quiet, playful edge. Warm off-white paper, near-black ink, restrained periwinkle-blue accent, and cool project-specific color fields.
- **Typography:** Manrope for display and body; DM Mono for labels and metadata; Georgia italic for a human editorial contrast.
- **Layout:** large typographic hero, open margins, clear section rhythm, two-column project grid on desktop and single-column cards on mobile.
- **Interaction:** scroll parallax across the portrait, orbital sphere, hero copy, About transition, and Work cards; a slow portal zoom on first entry; scroll reveal, subtle card movement, copy-email feedback, and a persistent contact action.
- **Accessibility:** semantic page structure, skip link, visible focus, descriptive portrait alt text, reduced-motion rules, and content that does not depend on hover.
- **Performance:** Three.js is dynamically imported; scene pixel ratio is capped, geometry is created once and disposed, and rendering pauses when offscreen or the tab is hidden. The 1086 × 1448 student portrait is a transparent WebP with intrinsic dimensions and no CSS image filter.

The local UI/UX Pro Max searches recommended scroll-triggered storytelling, neutral portfolio layouts, restrained accents, reduced-motion handling, and a Three.js pixel-ratio cap / requestAnimationFrame loop. The periwinkle-blue accent and warm paper tone adapt to the user's monochrome preference; no KMUTT brand colors are used. The hero's abstract orbital sphere keeps the technical personality while leaving the supplied natural-color portrait clear and avoiding a literal hardware mockup.

## Personal details and honest placeholders

Known personal information is limited to the name **Pornput Sooduappatham**, profession **Software Developer**, and education at **King Mongkut’s University of Technology Thonburi (KMUTT)**. The degree/program, study dates, work history, awards, email, and public profile URLs were not supplied. Those fields remain plainly editable placeholders in `src/data.js`; the template avoids inventing credentials, impact metrics, or personal links. Starter project pages are labeled and instruct the owner to replace their copy before publishing.

Suggested information hierarchy:

- Landing: full name, developer title, concise introduction, portrait, work previews, strengths, education highlight, and contact CTA.
- About: background, interests, working values, and education.
- Projects: short, curated index; each case study explains context, challenge, role, implementation choices, stack, and outcome.
- Experience: roles, contributions, education, awards, competitions, and community activity.
- Contact: email, professional links, and résumé download when a real résumé is supplied.

## SEO essentials to personalize

- Use a unique title and concise description that match the person's actual role and focus.
- Use descriptive project names and headings. Keep visible copy and links in semantic HTML, not only inside the WebGL scene.
- Replace the Open Graph image with a real social preview, update Person JSON-LD and `sameAs`, and use the final canonical domain.
- The production build pre-renders the home, informational, project-index, and case-study routes so initial HTML includes real headings and route metadata. Set `SITE_URL` at build time to emit canonical URLs, `og:url`, `sitemap.xml`, and `robots.txt` for the final domain.
- Give real work images useful alt text, compress them (AVIF / WebP), set intrinsic dimensions, and lazy-load below-the-fold media.

Google Search Central notes that Google queues JavaScript pages for rendering, but server-side or pre-rendering can make pages faster for users and crawlers; it also recommends unique descriptive titles and snippets. See [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

## Motion and Three.js references

- [web.dev: Animation and motion accessibility](https://web.dev/learn/accessibility/motion) recommends respecting `prefers-reduced-motion`, using restraint, and giving people control over motion-heavy experiences.
- [Three.js: How to dispose of objects](https://threejs.org/manual/pages/how-to-dispose-of-objects.html) explains that geometries, materials, and textures need explicit disposal to release GPU resources.
