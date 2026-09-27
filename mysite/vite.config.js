import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), portfolioMock],
  define: {
    'import.meta.env.VITE_LAST_UPDATED': JSON.stringify(lastCommitDate()),
  },
})
