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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_LAST_UPDATED': JSON.stringify(lastCommitDate()),
  },
})
