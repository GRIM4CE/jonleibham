/**
 * Turns the built SPA shell into a static page.
 *
 * Runs after both Vite passes:
 *   1. `vite build`                    → dist/index.html + hashed CSS/assets
 *   2. `vite build --ssr entry-server` → dist-ssr/entry-server.js
 *
 * It renders the app to markup, injects it into the shell, removes the module
 * script and the now-orphaned JS chunks, and asserts the result really is
 * script-free and inline-style-free — the two things the deployed
 * Content-Security-Policy refuses to run.
 */
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-ssr')
const ROOT_MARKER = '<div id="root"></div>'

const { render } = await import(pathToFileUrl(path.join(serverDir, 'entry-server.js')))

let html = await readFile(path.join(dist, 'index.html'), 'utf8')

if (!html.includes(ROOT_MARKER)) {
  throw new Error(`Could not find ${ROOT_MARKER} in dist/index.html — did index.html change?`)
}
html = html.replace(ROOT_MARKER, `<div id="root">${render()}</div>`)

// Drop the module script and remember what it pointed at, so we can delete the
// chunk itself rather than leaving an unreachable bundle in the artifact.
const removed = []
html = html.replace(/\s*<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g, (_match, src) => {
  removed.push(src)
  return ''
})

// Vite emits built JS only under dist/assets, so this can't reach a hand-placed
// script in public/.
const assetsDir = path.join(dist, 'assets')
const orphanedJs = (await readdir(assetsDir).catch(() => [])).filter((file) =>
  /\.(js|js\.map)$/.test(file),
)
await Promise.all(orphanedJs.map((file) => rm(path.join(assetsDir, file))))

await writeFile(path.join(dist, 'index.html'), html)
await rm(serverDir, { recursive: true, force: true })

assertStatic(html)

console.log(
  `prerender: ${formatKb(html)} of HTML, ` +
    `${removed.length} script tag(s) and ${orphanedJs.length} JS chunk(s) removed`,
)

/**
 * The CSP sets `script-src 'self'` and `style-src 'self'` with no
 * `'unsafe-inline'`, so an inline handler or a `style` attribute silently does
 * nothing in production. Fail the build instead of shipping that.
 */
function assertStatic(output) {
  const problems = []

  if (/<script\b(?![^>]*type="application\/ld\+json")/.test(output)) {
    problems.push('an executable <script> tag survived')
  }
  if (/\sstyle="/.test(output)) {
    problems.push('an inline style attribute survived (use a tone class — see tones.ts)')
  }
  if (/\son[a-z]+="/.test(output)) {
    problems.push('an inline event handler survived')
  }

  if (problems.length > 0) {
    throw new Error(`prerender: ${problems.join('; ')}`)
  }
}

function formatKb(text) {
  return `${(Buffer.byteLength(text) / 1024).toFixed(1)} kB`
}

function pathToFileUrl(filePath) {
  return new URL(`file://${filePath}`).href
}
