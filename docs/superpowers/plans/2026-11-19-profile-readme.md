# GitHub Profile README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `ChuBu0012/ChuBu0012`'s root README as an editorial, evidence-led developer landing page centered on Most and QuantFlow.

**Architecture:** Keep the profile page in GitHub Flavored Markdown. Use a local orbital SVG banner, concise profile copy, a small set of labeled monochrome badges, grouped verified skills, one top-languages card, and project details with only confirmed links.

**Tech Stack:** GitHub Markdown, local SVG assets, Shields.io badges, one `github-readme-stats` image URL.

**Spec:** `docs/superpowers/specs/2026-11-19-profile-readme-design.md`

## Global Constraints

- Follow the supplied editorial-portfolio direction and keep the page scannable in 10–15 seconds.
- Do not invent QuantFlow implementation details, contribution, stack, repository, or demo links.
- Use only technologies supported by the CV or accessible repositories; omit unverified candidates such as Hono, Prisma, Zod, PostgreSQL, RabbitMQ, Pinia, and Figma.
- Keep badges and stats compact; use only one top-languages card and retain alt text if it fails to load.
- Use the CV-confirmed LinkedIn and email destinations; omit the phone number and the portfolio homepage that returned HTTP 404.
- Do not add tests or dependencies for this Markdown-only change.

## Review Focus

- Stats image unavailable: surrounding README still communicates the profile and technologies.
- Mobile rendering: sections and image do not require horizontal scrolling.
- Low-signal public counts: stars/followers are not emphasized as achievement claims.
- Unverified profile fields: no placeholder education, contact, job, or impact claims remain.
- Existing project documentation: development instructions remain available outside the profile README.

---

### Task 1: Preserve the project guide and write the profile README

**Files:**
- Create: `docs/portfolio-project-guide.md` (preserve the current root README project-guide content)
- Modify: `README.md`
- Reference: `docs/superpowers/specs/2026-11-19-profile-readme-design.md`

**Interfaces:**
- Consumes: confirmed profile details and public account snapshot in the design spec.
- Produces: a root README that renders as a compact recruiter-facing profile, plus a preserved project guide.

- [x] **Step 1: Preserve the current repository guide**

Copy the existing `README.md` content verbatim to `docs/portfolio-project-guide.md` before replacing it. Keep its setup commands, routes, personalization instructions, stack, and implementation notes intact.

- [x] **Step 2: Replace the root README with the profile content**

Use this order: name and role; short focus statement; technology labels based on the current portfolio and verified repositories; one top-languages/activity card with descriptive alt text; featured portfolio/repository links. Link the source repository; do not include the homepage URL while it returns HTTP 404. Do not add placeholder work history, degree, résumé, email, or LinkedIn.

- [x] **Step 3: Review the resulting Markdown and diff**

Inspect the complete root README and preserved guide. Run `git diff --check` for whitespace errors, then confirm links point to real destinations and the profile remains understandable without loading the stats image. No test suite is needed for this content-only change.

### Follow-up: Add CV details, reference layout, and professional icons

The user supplied a CV and requested professional, simple, easy-to-understand profile icons. They selected `ChuBu0012` as the GitHub identity even though the CV links to `Pornput0012`.

- [x] Use the CV's name spelling, skills, selected experience, achievements, education, email, and LinkedIn details; omit the phone number and any dates not stated.
- [x] Add a minimal orbital banner and compact, labeled technology/contact icons using the existing portfolio's ink/periwinkle palette.
- [x] Group the full skills list into Languages, Frontend, Backend, Databases, DevOps, and practices.
- [x] Keep one GitHub top-languages card for `ChuBu0012` and preserve the old project guide.

### Follow-up 2: Apply the supplied editorial profile brief

- [x] Use the preferred name Most and concise software developer / IT student identity.
- [x] Connect UX research, product development, AI/LLM, architecture, and creative technology in natural copy.
- [x] Put QuantFlow first using only the user-provided capabilities; omit unverified stack and unavailable links.
- [x] Reduce badges/statistics, group verified skills, and retain only one language card.
- [x] Include supplied achievements, education, contact details, and source repository link; omit the broken live portfolio URL.

