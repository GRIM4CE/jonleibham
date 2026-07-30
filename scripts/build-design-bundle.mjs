/**
 * Renders each design card to standalone HTML for Claude Design.
 *
 * Runs after two passes, both driven by `npm run build:design`:
 *   1. `npm run build`                  → dist/assets/*.css
 *   2. `vite build --ssr entry-design`  → dist-design/entry-design.js
 *
 * The markup and the stylesheet come from two different Vite builds, which is
 * only safe because `vite.config.ts` pins `generateScopedName` — both passes
 * therefore agree on every scoped class name.
 *
 * Inline styles would be fine here (the `style-src 'self'` CSP governs the
 * deployed portfolio, not files hosted on claude.ai), but one shared
 * `styles.css` linked by every card beats inlining the whole stylesheet
 * thirteen times. That is also the convention the app's own cards use.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const out = path.join(root, 'design-bundle')

const FONTS =
  'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900' +
  '&family=JetBrains+Mono:wght@400;500;700&display=swap'

const assets = path.join(dist, 'assets')
const cssFile = (await readdir(assets).catch(() => [])).find((file) => file.endsWith('.css'))
if (!cssFile) {
  throw new Error('design-bundle: no stylesheet in dist/assets — run `npm run build` first')
}

const appCss = await readFile(path.join(assets, cssFile), 'utf8')
const cardCss = await readFile(path.join(root, 'scripts', 'design-card.css'), 'utf8')
const css = `${appCss}\n${cardCss}`

const { cards, renderCard } = await import(
  new URL(`file://${path.join(root, 'dist-design', 'entry-design.js')}`).href
)

await rm(out, { recursive: true, force: true })
await mkdir(path.join(out, 'cards'), { recursive: true })

// One shared stylesheet at the bundle root, linked by every card as
// `../styles.css`. Cards therefore live one directory deep so the relative
// link resolves.
await writeFile(path.join(out, 'styles.css'), css)

for (const card of cards) {
  const markup = renderCard(card)
  assertStyled(card, markup, css)
  await writeFile(path.join(out, 'cards', `${card.slug}.html`), page(card, markup))
}

await writeFile(path.join(out, 'cards.json'), `${JSON.stringify(cards.map(meta), null, 2)}\n`)

console.log(`design-bundle: ${cards.length} card(s) written to design-bundle/`)

/** Card metadata for the upload step. `render` is a function and cannot serialize. */
function meta(card) {
  return {
    slug: card.slug,
    name: card.name,
    group: card.group,
    subtitle: card.subtitle,
    viewport: card.viewport,
    path: `cards/${card.slug}.html`,
  }
}

/**
 * The `@dsCard` marker has to be the very first line — the app compiles
 * `_ds_manifest.json` from it, so everything the pane shows on a card comes
 * from these four attributes. Emitting only `group` would lose the card's
 * name, subtitle and dimensions.
 *
 * `viewport` is a `WxH` string, not two numbers. Format verified against
 * `guidelines/brand-mark.html` in the existing Dossier project.
 */
function page(card, markup) {
  const { width, height } = card.viewport
  const viewport = height ? `${width}x${height}` : `${width}`

  return `<!-- @dsCard group="${attr(card.group)}" viewport="${viewport}" name="${attr(card.name)}" subtitle="${attr(card.subtitle ?? '')}" -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${attr(card.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
</head>
<body>
<div class="dsc-body">
${markup}
</div>
</body>
</html>
`
}

/**
 * The marker is an HTML comment holding quoted attributes, so a stray `"` or
 * `--` would break the parse. Subtitles are prose, so this is not theoretical.
 * `src/entry-design.test.ts` also rejects both at the source.
 */
function attr(value) {
  return String(value).replace(/"/g, '&quot;').replace(/--/g, '—')
}

/**
 * A card whose classes are missing from the stylesheet renders as unstyled
 * markup on a dark ground — which reads as an empty card, not as an error.
 * This is the local equivalent of `assertStatic` in prerender.mjs: catch it at
 * build time rather than discovering it in the pane.
 *
 * Both sources are concatenated into `css`, so this covers the scoped module
 * classes and the `dsc-` chrome alike.
 */
function assertStyled(card, markup, styles) {
  const used = new Set()
  for (const [, attrValue] of markup.matchAll(/class="([^"]+)"/g)) {
    for (const name of attrValue.split(/\s+/).filter(Boolean)) used.add(name)
  }

  const missing = [...used].filter((name) => !styles.includes(`.${name}`))
  if (missing.length > 0) {
    throw new Error(
      `design-bundle: card "${card.slug}" uses class(es) with no rule: ${missing.join(', ')}. ` +
        'A component not reachable from App is not in dist/assets/*.css.',
    )
  }
}
