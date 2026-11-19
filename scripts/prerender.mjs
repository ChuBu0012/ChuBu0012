import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '')
const routes = ['/', '/about', '/projects', '/experience', '/contact']

const vite = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
})

try {
  const [{ default: App, pageTitle, pageDescription }, { profile, projects }] = await Promise.all([
    vite.ssrLoadModule('/src/App.jsx'),
    vite.ssrLoadModule('/src/data.js'),
  ])
  const template = await readFile(path.join(dist, 'index.html'), 'utf8')
  routes.push(...projects.map((project) => `/projects/${project.id}`))

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

  for (const route of routes) {
    const normalized = route.replace(/\/$/, '') || '/'
    const slug = normalized.startsWith('/projects/') ? normalized.split('/')[2] : null
    const project = projects.find((item) => item.id === slug)
    const title = pageTitle(normalized, project)
    const description = pageDescription(normalized, project)
    const content = renderToString(React.createElement(App, { initialPath: normalized }))
    const encodedTitle = escapeHtml(title)
    const encodedDescription = escapeHtml(description)
    let html = template
      .replace('<div id="root"></div>', `<div id="root">${content}</div>`)
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${encodedTitle}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${encodedDescription}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${encodedTitle}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${encodedDescription}" />`)

    if (siteUrl) {
      const canonicalUrl = `${siteUrl}${normalized === '/' ? '/' : normalized}`
      html = html.replace('</head>', `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />\n  </head>`)
    }

    const output = normalized === '/' ? path.join(dist, 'index.html') : path.join(dist, normalized.slice(1), 'index.html')
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, html)
  }

  if (siteUrl) {
    const sitemapEntries = routes.map((route) => `  <url><loc>${escapeHtml(`${siteUrl}${route === '/' ? '/' : route}`)}</loc></url>`).join('\n')
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
    await writeFile(path.join(dist, 'sitemap.xml'), sitemap)
    await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
  }

  console.info(`Pre-rendered ${routes.length} routes${siteUrl ? ' with canonical URLs and sitemap' : ''}.`)
} finally {
  await vite.close()
}
