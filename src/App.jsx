import { lazy, Suspense, useEffect } from 'react'
import { experience, expertise, highlights, profile, projects } from './data.js'
import { usePortfolioStore } from './store/usePortfolioStore.js'
import AbstractOrbitFallback from './components/AbstractOrbitFallback.jsx'

const OrbitScene = lazy(() => import('./components/OrbitScene.jsx'))

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

function Arrow({ diagonal = false }) {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className={diagonal ? 'arrow arrow-diagonal' : 'arrow'}><path d={diagonal ? 'M5 15 15 5M6 5h9v9' : 'M3 10h13M11 4l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SiteHeader({ path }) {
  return <header className="site-header">
    <a className="brand" href="/" aria-label="MOST. — Home">{profile.monogram}<span className="brand-caption">SOFTWARE DEVELOPER</span></a>
    <nav aria-label="Main navigation">{navItems.map((item) => <a href={item.href} key={item.href} aria-current={(path === item.href || (item.href === '/projects' && path.startsWith('/projects/'))) ? 'page' : undefined}>{item.label}</a>)}</nav>
  </header>
}

function SiteFooter() {
  return <footer className="site-footer">
    <a className="footer-brand" href="/">MOST.<span>↗</span></a>
    <p>DESIGNED WITH CARE. BUILT WITH CURIOSITY.<br/>© {new Date().getFullYear()} {profile.name}</p>
    <div className="footer-socials">{profile.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer">{social.label}<Arrow diagonal/></a>)}</div>
  </footer>
}

function PageIntro({ eyebrow, title, children }) {
  return <section className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children && <div className="page-intro-copy">{children}</div>}</section>
}

function ProjectArtwork({ project }) {
  return <div className={`project-art project-art-${project.theme}`} aria-hidden="true">
    <div className="project-art-top"><span>MOST. / LAB</span><span>{project.number}</span></div>
    {project.theme === 'platform' && <div className="platform-window"><div className="window-top"><i/><i/><i/><span>app.interface</span></div><div className="window-layout"><div className="window-sidebar"><b/><i/><i/><i/><i/></div><div className="window-main"><span className="code-kicker">SYSTEM / OVERVIEW</span><b/><b/><div className="window-chart"><i/><i/><i/><i/><i/><i/><i/></div><div className="window-row"><i/><i/><i/></div></div></div></div>}
    {project.theme === 'signal' && <div className="signal-panel"><span className="code-kicker">SIGNAL / LIVE VIEW</span><div className="signal-head"><b>Activity</b><span>↗ 24.8%</span></div><div className="signal-chart"><svg viewBox="0 0 400 150" preserveAspectRatio="none"><path className="chart-fill" d="M0 120 C40 116 48 78 88 92 S139 131 175 76 S231 90 260 56 S305 82 330 37 S369 44 400 8V150H0Z"/><path className="chart-line" d="M0 120 C40 116 48 78 88 92 S139 131 175 76 S231 90 260 56 S305 82 330 37 S369 44 400 8"/></svg></div><div className="signal-legend"><i/>RESPONSE TIME <span>142 MS</span></div></div>}
    {project.theme === 'motion' && <div className="motion-panel"><div className="motion-orbit orbit-a"/><div className="motion-orbit orbit-b"/><div className="motion-cursor">&lt;/&gt;</div><span className="motion-label label-a">INPUT</span><span className="motion-label label-b">RESPONSE</span></div>}
    <div className="project-art-bottom"><span>INTERACTIVE CASE STUDY</span><span>SCROLL TO EXPLORE ↓</span></div>
  </div>
}

function ProjectCard({ project }) {
  return <article className="project-card reveal">
    <a className="project-link" href={`/projects/${project.id}`} aria-label={`Read the ${project.title} case study`}>
      <ProjectArtwork project={project}/>
      <div className="project-meta"><div><p className="eyebrow">{project.number} / {project.category} <span>· {project.year}</span></p><h3>{project.title}</h3><p className="project-description">{project.description}</p><ul className="stack-tags">{project.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul><span className="sample-note">STARTER CASE STUDY · REPLACE WITH YOUR WORK</span></div><span className="project-open"><Arrow diagonal/></span></div>
    </a>
  </article>
}

function EducationCard() {
  return <article className="education-card"><div className="education-logo" aria-hidden="true">K</div><div><p className="eyebrow">EDUCATION</p><h3>{profile.education.school}</h3><p>{profile.education.program}</p><span>{profile.education.years}</span></div><b className="kmutt-mark">{profile.education.shortName}</b></article>
}

function HomePage() {
  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero) return
    const portrait = hero.querySelector('.portrait-wrap')
    const halo = hero.querySelector('.portrait-halo')
    const lines = [...hero.querySelectorAll('[data-hero-line]')]
    const web = hero.querySelector('.hero-web')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    let raf = 0
    let pointerX = 0
    let pointerY = 0
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const progress = reduced.matches ? 0 : clamp(window.scrollY / (hero.offsetHeight * 0.82), 0, 1)
        const px = reduced.matches || !finePointer.matches ? 0 : pointerX
        const py = reduced.matches || !finePointer.matches ? 0 : pointerY
        const viewportScale = window.innerWidth < 700 ? 0.62 : window.innerWidth < 1000 ? 0.8 : 1
        portrait.style.setProperty('--portrait-scroll-y', `${-progress * 64 * viewportScale}px`)
        portrait.style.setProperty('--portrait-scroll-x', `${progress * 18 * viewportScale}px`)
        portrait.style.setProperty('--portrait-scale', String(1 - progress * 0.012))
        portrait.style.setProperty('--portrait-tilt-x', `${py * -2}deg`)
        portrait.style.setProperty('--portrait-tilt-y', `${px * 2.8}deg`)
        portrait.style.setProperty('--portrait-tilt-roll', `${px * 1.25}deg`)
        halo.style.setProperty('--halo-scroll-y', `${-progress * 18 * viewportScale}px`)
        halo.style.setProperty('--halo-scale', `${1 + progress * 0.06}`)
        halo.style.setProperty('--halo-opacity', String(1 - progress * 0.06))
        lines.forEach((line) => {
          const key = line.dataset.heroLine
          const speed = { hello: 96, name: 66, build: 42, web: 28 }[key] || 0
          const fadeStart = { hello: 0.54, name: 0.63, build: 0.72, web: 0.4 }[key] ?? 0.6
          const fadeAmount = { hello: 0.5, name: 0.4, build: 0.32, web: 0.58 }[key] ?? 0.3
          const opacity = 1 - clamp((progress - fadeStart) / (1 - fadeStart), 0, 1) * fadeAmount
          line.style.setProperty('--line-y', `${-progress * speed * viewportScale}px`)
          line.style.setProperty('--line-opacity', String(opacity))
          if (key === 'web') line.style.setProperty('--web-scale', String(1 - progress * 0.1))
        })
        web?.style.setProperty('--web-color-progress', `${clamp((progress - 0.08) / 0.48, 0, 1) * 100}%`)
      })
    }
    const onPointerMove = (event) => {
      if (!finePointer.matches || reduced.matches) return
      const bounds = hero.getBoundingClientRect()
      pointerX = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1)
      pointerY = clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1)
      update()
    }
    const onPointerLeave = () => { pointerX = 0; pointerY = 0; update() }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    hero.addEventListener('pointermove', onPointerMove, { passive: true })
    hero.addEventListener('pointerleave', onPointerLeave)
    reduced.addEventListener?.('change', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      hero.removeEventListener('pointermove', onPointerMove)
      hero.removeEventListener('pointerleave', onPointerLeave)
      reduced.removeEventListener?.('change', update)
    }
  }, [])

  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span>SOFTWARE DEVELOPER</span><span>KMUTT ALUMNUS · BUILDER</span></p>
        <h1 id="hero-title"><span className="hero-line" data-hero-line="hello">Hello,</span><span className="hero-line" data-hero-line="name">I’m <em>Pornput.</em></span><span className="hero-line hero-build-line" data-hero-line="build">I build for<span className="hero-build-the"> the</span></span><span className="hero-line hero-web-line" data-hero-line="web"><span className="hero-mobile-the">the </span><span className="hero-web">web<span className="period">.</span></span></span></h1>
        <div className="hero-bottom"><p>{profile.intro}</p><a className="explore-link" href="#selected-work"><span>EXPLORE<br/>MY WORK</span><Arrow/></a></div>
      </div>
      <div className="hero-stage" role="group" aria-label="Portrait and interactive developer visual">
        <div className="portrait-halo" aria-hidden="true"/>
        <div className="portrait-wrap"><img src={profile.portrait} alt={`Portrait of ${profile.name}`} width="1086" height="1448" fetchPriority="high"/></div>
        <div className="dev-visual" aria-hidden="true"><Suspense fallback={<div className="orbit-scene"><AbstractOrbitFallback/></div>}><OrbitScene/></Suspense></div>
      </div>
      <a className="scroll-cue" href="#selected-work"><span>SCROLL TO EXPLORE</span><i/></a>
    </section>

    <section className="intro-band" aria-labelledby="intro-band-title"><div className="intro-band-label"><span className="eyebrow">A BIT ABOUT ME</span><span className="band-spark" aria-hidden="true">✳</span></div><div className="intro-band-content reveal reveal-from-left"><h2 id="intro-band-title">I care how it works.<br/>And how it <em>feels.</em></h2><p>{profile.about}</p><a className="text-link text-link-light" href="/about">A little more about me <Arrow/></a></div></section>

    <section className="featured section-shell" id="selected-work" aria-labelledby="featured-title">
      <div className="section-heading reveal"><div><p className="eyebrow">A FEW THINGS I LIKE TO BUILD</p><h2 id="featured-title">Selected work<span className="period">.</span></h2></div><a className="text-link" href="/projects">All projects <Arrow/></a></div>
      <div className="project-grid">{projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project}/>)}</div>
    </section>

    <section className="expertise section-shell" aria-labelledby="expertise-title"><div className="section-heading reveal"><div><p className="eyebrow">HOW I CAN CONTRIBUTE</p><h2 id="expertise-title">What I do<span className="period">.</span></h2></div></div><div className="expertise-list">{expertise.map((item) => <article className="expertise-item reveal" key={item.number}><span className="eyebrow">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><Arrow diagonal/></article>)}</div></section>

    <section className="highlights section-shell"><div className="highlights-heading reveal"><div><p className="eyebrow">A FOUNDATION FOR WHAT'S NEXT</p><h2>Highlights<span className="period">.</span></h2></div><a className="text-link" href="/experience">Experience & background <Arrow/></a></div><EducationCard/></section>
    <ContactBanner/>
  </>
}

function AboutPage() {
  useEffect(() => {
    const story = document.querySelector('.about-story')
    const portrait = story?.querySelector('.about-photo')
    if (!story || !portrait || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const bounds = story.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.88 - bounds.top) / (window.innerHeight * 0.82)))
        portrait.style.setProperty('--about-shift', `${progress * 34}px`)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return <div className="page-shell about-page">
    <PageIntro eyebrow="A LITTLE ABOUT ME" title={<>Curious by<br/><em>default.</em></>}><p>{profile.about}</p></PageIntro>
    <section className="about-story"><div className="about-photo"><img src={profile.portrait} alt={`Portrait of ${profile.name}`} width="1086" height="1448"/><span className="eyebrow">{profile.name.toUpperCase()} / DEVELOPER</span></div><div className="about-story-copy reveal reveal-from-left"><p className="eyebrow">HOW I THINK ABOUT BUILDING</p><h2>Thoughtful systems.<br/>Useful details.</h2>{profile.aboutStory.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a className="text-link" href="/projects">See what I’m building <Arrow/></a></div></section>
    <section className="about-education"><p className="eyebrow">EDUCATION</p><EducationCard/></section>
    <section className="about-values"><p className="eyebrow">WHAT I VALUE</p><div className="values-grid">{profile.values.map((value, index) => <article key={value.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></section>
    <ContactBanner/>
  </div>
}

function ProjectsPage() {
  return <div className="page-shell projects-page"><PageIntro eyebrow="THE THINGS I MAKE" title={<>Selected<br/><em>work.</em></>}><p>A collection of software and experiments. The examples below are starter case studies — swap in your real projects, decisions, and outcomes.</p></PageIntro><div className="project-grid project-grid-page" data-work-parallax>{projects.map((project) => <ProjectCard key={project.id} project={project}/>)}</div><ContactBanner/></div>
}

function ProjectPage({ project }) {
  if (!project) return <NotFoundPage/>
  return <div className="page-shell case-study-page"><a href="/projects" className="back-link"><Arrow diagonal={false}/> ALL PROJECTS</a><PageIntro eyebrow={`${project.number} / ${project.category} · ${project.year}`} title={<>{project.title.split(' ')[0]}<br/><em>{project.title.split(' ').slice(1).join(' ') || 'Case study'}.</em></>}><p>{project.description}</p></PageIntro>
    <div className="case-study-warning">STARTER CONTENT — REPLACE THIS EXAMPLE WITH YOUR OWN PROJECT BEFORE PUBLISHING.</div><div className="case-study-art"><ProjectArtwork project={project}/></div>
    <div className="case-study-meta"><div><span className="eyebrow">ROLE</span><p>Add your role and contribution</p></div><div><span className="eyebrow">TECHNOLOGY</span><ul className="stack-tags">{project.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul></div><div><span className="eyebrow">YEAR</span><p>{project.year}</p></div></div>
    <div className="case-study-sections">{[['Overview', project.overview], ['The challenge', project.challenge], ['The approach', project.approach], ['Outcome', project.outcome]].map(([title, copy], index) => <section key={title}><span className="eyebrow">0{index + 1} /</span><div><h2>{title}</h2><p>{copy}</p></div></section>)}</div>
    <div className="case-study-next"><span className="eyebrow">WANT TO BUILD SOMETHING LIKE THIS?</span><a className="text-link" href="/contact">Let’s talk <Arrow diagonal/></a></div><ContactBanner/>
  </div>
}

function ExperiencePage() {
  return <div className="page-shell experience-page"><PageIntro eyebrow="THE PATH SO FAR" title={<>Experience &<br/><em>highlights.</em></>}><p>A home for the work, learning, and milestones behind the code. Add your roles and achievements here as you shape the story.</p></PageIntro>
    <section className="timeline-section"><div className="timeline-heading"><p className="eyebrow">EXPERIENCE</p><span>WORK THAT SHAPED HOW I BUILD</span></div>{experience.length ? <div className="timeline">{experience.map((item) => <article key={item.company}><span>{item.years}</span><div><h3>{item.role}</h3><p>{item.company}</p><p>{item.description}</p></div></article>)}</div> : <div className="empty-entry"><span className="empty-entry-symbol">+</span><div><h3>Your experience goes here.</h3><p>Add a role, the problem you helped solve, and a specific result or lesson. Keep the story focused on your contribution.</p></div><span className="eyebrow">EDIT src/data.js</span></div>}</section>
    <section className="experience-education"><p className="eyebrow">EDUCATION</p><EducationCard/></section>
    <section className="timeline-section"><div className="timeline-heading"><p className="eyebrow">HIGHLIGHTS</p><span>AWARDS · COMMUNITY · MOMENTS WORTH SHARING</span></div>{highlights.length ? <div className="highlight-list">{highlights.map((item) => <article key={item.title}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div> : <div className="empty-entry"><span className="empty-entry-symbol">✳</span><div><h3>Add the moments that matter to you.</h3><p>Academic achievements, hackathons, open-source contributions, talks, or awards — add only what supports the story you want to tell.</p></div><span className="eyebrow">EDIT src/data.js</span></div>}</section><ContactBanner/></div>
}

function ContactPage() {
  const copied = usePortfolioStore((state) => state.copied)
  const markCopied = usePortfolioStore((state) => state.markCopied)
  async function copyEmail() {
    try { await navigator.clipboard.writeText(profile.email); markCopied() }
    catch { window.location.href = `mailto:${profile.email}` }
  }
  return <div className="page-shell contact-page"><PageIntro eyebrow="SAY HELLO" title={<>Let’s make<br/><em>something useful.</em></>}><p>Have an idea, an interesting problem, or a good opportunity? I’d be glad to hear from you.</p></PageIntro><section className="contact-card"><p className="eyebrow">EMAIL IS THE BEST WAY TO REACH ME</p><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<Arrow diagonal/></a><button className="copy-button" onClick={copyEmail} aria-live="polite">{copied ? 'COPIED' : 'COPY EMAIL'} <span>{copied ? '✓' : '↗'}</span></button><p className="email-placeholder-note">Replace the email placeholder in <code>src/data.js</code> before publishing.</p></section><div className="contact-socials"><p className="eyebrow">FIND ME AROUND THE WEB</p>{profile.socials.map((social) => <a key={social.label} href={social.href} target="_blank" rel="noreferrer"><span>{social.label}</span><span className="social-placeholder">ADD YOUR PROFILE LINK</span><Arrow diagonal/></a>)}</div>{profile.resumeUrl && <a className="resume-link" href={profile.resumeUrl} download>Download my résumé <Arrow diagonal/></a>}</div>
}

function ContactBanner() {
  return <section className="contact-banner" data-contact-climax><p className="eyebrow">HAVE A GOOD ONE IN MIND?</p><h2>Let’s build<br/><em>something useful.</em></h2><a className="contact-banner-link" href="/contact">Get in touch <Arrow diagonal/></a></section>
}

function NotFoundPage() {
  return <div className="page-shell not-found"><PageIntro eyebrow="404 / NOTHING HERE" title={<>Wrong<br/><em>turn.</em></>}><p>That page has moved, or it never existed. Let's get you back to the work.</p></PageIntro><a className="text-link" href="/">Back home <Arrow/></a></div>
}

export function pageTitle(path, project) {
  if (project) return `${project.title} — ${profile.name}`
  const titles = { '/': `${profile.name} — Software Developer`, '/about': `About — ${profile.name}`, '/projects': `Projects — ${profile.name}`, '/experience': `Experience — ${profile.name}`, '/contact': `Contact — ${profile.name}` }
  return titles[path] || `Page not found — ${profile.name}`
}

export function pageDescription(path, project) {
  if (project) return `${project.title}: a starter software-development case study by ${profile.name}. Replace the example with your real project details.`
  const descriptions = {
    '/': `${profile.name} is a software developer and KMUTT alumnus. Explore selected work, background, and contact details.`,
    '/about': `Learn about ${profile.name}, a software developer who enjoys building clear, thoughtful web applications.`,
    '/projects': `Explore software-development project examples, technologies, and case-study templates by ${profile.name}.`,
    '/experience': `Explore the experience, education, and highlights of ${profile.name}, software developer and KMUTT alumnus.`,
    '/contact': `Contact ${profile.name} about software development opportunities, projects, and collaboration.`,
  }
  return descriptions[path] || `Page not found. Explore the portfolio of ${profile.name}.`
}

export default function App({ initialPath } = {}) {
  const path = initialPath || (window.location.pathname.replace(/\/$/, '') || '/')
  const projectSlug = path.startsWith('/projects/') ? path.split('/')[2] : null
  const project = projectSlug ? projects.find((item) => item.id === projectSlug) : null

  useEffect(() => {
    document.title = pageTitle(path, project)
    const descriptionText = pageDescription(path, project)
    const description = document.querySelector('meta[name="description"]')
    if (description) description.content = descriptionText
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogTitle) ogTitle.content = document.title
    if (ogDescription) ogDescription.content = descriptionText
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
    }
  }, [path, project])

  useEffect(() => {
    const grid = document.querySelector('[data-work-parallax]')
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = [...grid.querySelectorAll('.project-card')]
    const desktop = window.matchMedia('(min-width: 701px)')
    let raf = 0
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const center = window.innerHeight * 0.54
        cards.forEach((card, index) => {
          const bounds = card.getBoundingClientRect()
          const direction = index % 2 === 0 ? 1 : -1
          const delta = center - (bounds.top + bounds.height * 0.5)
          const offset = desktop.matches ? Math.max(-28, Math.min(28, delta * 0.035 * direction)) : 0
          card.style.setProperty('--card-scroll-x', `${offset}px`)
          card.style.setProperty('--preview-scroll-x', `${-offset * 0.32}px`)
        })
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    desktop.addEventListener?.('change', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      desktop.removeEventListener?.('change', update)
    }
  }, [path])

  useEffect(() => {
    const stage = document.querySelector('[data-contact-climax]')
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const bounds = stage.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.88 - bounds.top) / (bounds.height * 0.78)))
        stage.style.setProperty('--contact-progress', String(progress))
        stage.style.setProperty('--contact-heading-scale', String(1 + progress * 0.055))
        stage.style.setProperty('--contact-action-opacity', String(1 - progress * 0.42))
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [path])

  let page
  if (path === '/') page = <HomePage/>
  else if (path === '/about') page = <AboutPage/>
  else if (path === '/projects') page = <ProjectsPage/>
  else if (path === '/experience') page = <ExperiencePage/>
  else if (path === '/contact') page = <ContactPage/>
  else if (path.startsWith('/projects/')) page = <ProjectPage project={project}/>
  else page = <NotFoundPage/>

  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader path={path}/><main id="main">{page}</main><SiteFooter/><a className="floating-contact" href="/contact"><span className="status-dot"/> LET’S TALK <Arrow diagonal/></a></>
}
