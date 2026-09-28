import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import en from './src/data/locales/en.js'
import { ROUTES, SITE_NAME, SITE_URL, pageMeta, personJsonLd } from './src/data/seo.js'

// Datum posledního commitu (např. "27.9.2026") pro „Last updated“ v patičce.
// Když git není k dispozici, použije se datum buildu.
function lastCommitDate() {
  let date = new Date()
  try {
    const iso = execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim()
    if (iso) date = new Date(iso)
  } catch {
    // git není dostupný → zůstane datum buildu
  }
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

// `npm run dev:mock` – /api/portfolio vrací ukázková data, aby šlo vidět,
// jak okno s výnosností vypadá (Netlify funkce při `npm run dev` neběží)
const portfolioMock = {
  name: 'portfolio-mock',
  apply: 'serve',
  configureServer(server) {
    if (!process.env.PORTFOLIO_MOCK) return
    server.middlewares.use('/api/portfolio', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          available: true,
          returns: {
            threeMonths: { value: 0.0412, from: '2026-06-27', complete: true },
            ytd: { value: -0.0135, from: '2025-12-31', complete: true },
            oneYear: { value: 0.0873, from: '2026-01-15', complete: false },
          },
          updatedAt: new Date().toISOString(),
          trackingSince: '2026-01-15',
        }),
      )
    })
  },
}

// SEO při buildu: každá stránka dostane vlastní HTML se správným titulkem,
// popisem a canonical odkazem + vznikne sitemap.xml.
// Domovská stránka přebírá title a description z index.html.
// Adresa webu je SITE_URL v src/data/seo.js.
const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const seoPages = {
  name: 'seo-pages',
  apply: 'build',
  closeBundle() {
    const siteUrl = SITE_URL.replace(/\/+$/, '')

    const dist = join(process.cwd(), 'dist')
    // Open Graph z index.html se nahradí verzí pro konkrétní stránku (ať nejsou dvakrát)
    const template = readFileSync(join(dist, 'index.html'), 'utf8')
      .replace(/\n\s*<!-- Open Graph[^>]*-->/, '')
      .replace(/\n\s*<meta property="og:[^>]*>/g, '')
    const lastmod = new Date().toISOString().slice(0, 10)

    // Domovská stránka: texty přímo z index.html
    const homeMeta = {
      title: template.match(/<title>([^<]*)<\/title>/)[1],
      description: template.match(/<meta name="description" content="([^"]*)"/)[1],
    }

    for (const route of ROUTES) {
      const meta = pageMeta(route, en)
      const title = meta ? escapeHtml(meta.title) : homeMeta.title
      const description = meta ? escapeHtml(meta.description) : homeMeta.description
      const url = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`
      const tags = [
        `<link rel="canonical" href="${url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta property="og:image" content="${siteUrl}/favicon.png" />`,
        `<meta name="twitter:card" content="summary" />`,
      ]
      if (route === '/') {
        tags.push(`<script type="application/ld+json">${JSON.stringify(personJsonLd(siteUrl))}</script>`)
      }

      const html = template
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
        .replace('</head>', `  ${tags.join('\n    ')}\n  </head>`)

      const dir = join(dist, route)
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'index.html'), html)
    }

    // 404.html – Netlify ji vrací pro neexistující adresy se stavem 404 (viz public/_redirects),
    // React pak vykreslí stránku NotFound. noindex, ať ji Google neindexuje.
    const notFound = pageMeta('/404', en)
    const notFoundHtml = template
      .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(notFound.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(notFound.description)}" />`)
      .replace('</head>', `  <meta name="robots" content="noindex" />\n  </head>`)
    writeFileSync(join(dist, '404.html'), notFoundHtml)

    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...ROUTES.map((route) =>
        `  <url><loc>${siteUrl}${route === '/' ? '/' : route}</loc><lastmod>${lastmod}</lastmod></url>`,
      ),
      '</urlset>',
      '',
    ].join('\n')
    writeFileSync(join(dist, 'sitemap.xml'), sitemap)
    // robots.txt je v public/robots.txt
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), portfolioMock, seoPages],
  define: {
    'import.meta.env.VITE_LAST_UPDATED': JSON.stringify(lastCommitDate()),
  },
})
