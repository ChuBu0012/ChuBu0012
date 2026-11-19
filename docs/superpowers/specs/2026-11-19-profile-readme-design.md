# GitHub Profile README Design

## Intent

Create a concise, evidence-led developer landing page for the `ChuBu0012/ChuBu0012` profile repository. The README should show Most's interests, verified technical foundation, strongest project story, achievements, and contact links in a visitor's first 10–15 seconds.

## Design direction

Use an editorial portfolio feel with modern developer details: restrained ink and periwinkle colors, a small abstract orbital banner, clear headings, generous spacing, and a few monochrome labeled icons. Avoid rainbow badges, animation, generic claims, and multiple statistics widgets.

## Goals

- Open with Most's preferred name and identity as a Software Developer and IT student.
- Connect interests in UX research, product development, software engineering, AI/LLM applications, architecture, and creative technology in natural prose.
- Group verified technical capabilities without implying unsupported expertise.
- Feature QuantFlow as the primary project using the capabilities provided in the user brief; include repository or demo links only when verified.
- Retain concise, supplied achievements and education details.
- Use at most one GitHub activity visualization and make the page readable if it fails to load.

## Non-goals and anti-goals

- Do not invent a QuantFlow contribution, project URL, demo, or stack.
- Do not add unsupported skills from the candidate list when project evidence is unavailable.
- Do not publish the phone number or use the configured portfolio URL while it returns 404.
- Do not turn the page into a wall of badges or GitHub statistics.

## Known information and constraints

- The profile repository is `ChuBu0012/ChuBu0012`. The user chose `ChuBu0012` as the GitHub identity, despite the CV linking to `Pornput0012`.
- The user specifies the preferred name **Most**, role **Software Developer / IT Student**, and interests in Software Engineering, AI/LLM applications, UX research, product development, architecture, and creative technology.
- The CV supplies Information Technology at KMUTT (2023–present, GPA 3.80), email, LinkedIn URL, and selected work experience. Do not include the phone number or the CV's stale “third-year” summary.
- QuantFlow is described in the user brief as an AI-assisted quantitative UX research platform with workflow management, questionnaire evaluation via Research Lint, sample-size planning, and AI-assisted analysis. A public repository search for both GitHub accounts found no QuantFlow repo. Its proposed Vue/TypeScript/Node/Hono/Prisma/PostgreSQL stack is not verified; omit the stack and links until they are.
- Verified technology evidence includes TypeScript, JavaScript, Python, Java, Go, C/C++, Vue.js, React, Node.js, Express.js, Spring Boot, Go Fiber, MySQL, MongoDB, Docker, Linux, Nginx, GitHub Actions, Tailwind CSS, Vite, Three.js, and Zustand across the supplied CV, public repositories, and current portfolio source. Keep the public skill groups concise.
- Hono.js, Prisma, Zod, PostgreSQL, RabbitMQ, Pinia, and Figma were not found in the accessible CV/repository evidence. Do not present them as verified skills.
- The current profile repository contains a React/Vite portfolio with Three.js and Zustand. Its configured Vercel homepage returned HTTP 404, so link to the source repository only.
- LinkedIn and email destinations are supplied by the CV. The public email is appropriate for the contact section; omit the phone number.
- Use the existing top-languages card as the only stats widget. The external service is best-effort; descriptive alt text and surrounding content provide graceful degradation.
- Use GitHub Flavored Markdown and supported image markup only. No CSS, JavaScript, or animation.

## Content order

1. Minimal orbital banner, preferred name, role, and concise introduction.
2. About Me with a natural connection between interests and engineering approach.
3. Technical Skills: a small icon row and short grouped text categories.
4. Featured Projects: QuantFlow first, then the verifiable portfolio repository.
5. Selected experience, achievements, and education.
6. One top-languages card.
7. Minimal contact and builder-minded closing.

## External services

- Shields.io provides a small set of static technology/contact badges.
- `github-readme-stats.vercel.app` provides the top-languages card and may be unavailable.
- The banner and email icon are local SVG assets.
