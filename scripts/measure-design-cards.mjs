/**
 * Reports how tall each design card's content actually is at its declared
 * width, so the `viewport` in `src/entry-design.tsx` can be sized to the
 * content rather than guessed.
 *
 * A card that declares far more height than it uses renders as a mostly-empty
 * box in the Design System pane — the `thin` condition the upload path counts.
 * Every card was over-declared on the first pass, one of them by nearly 2x.
 *
 * Run `npm run build:design` first, then `node scripts/measure-design-cards.mjs`.
 * Reads the cards straight off disk over file://, so it needs no server.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bundle = path.join(root, 'design-bundle')

const cards = JSON.parse(await readFile(path.join(bundle, 'cards.json'), 'utf8'))
const browser = await chromium.launch()
const rows = []

for (const card of cards) {
  const page = await browser.newPage({
    viewport: { width: card.viewport.width, height: card.viewport.height ?? 600 },
  })
  await page.goto(`file://${path.join(bundle, card.path)}`, { waitUntil: 'load' })

  // The wrapper is `min-height: 100vh`, so measuring it would just report the
  // viewport back. The content's real extent is its last child's bottom edge
  // plus the wrapper's bottom padding.
  const needed = await page.evaluate(() => {
    const el = document.querySelector('.dsc-body')
    const pad = parseFloat(getComputedStyle(el).paddingBottom)
    return Math.ceil(el.lastElementChild.getBoundingClientRect().bottom + pad)
  })

  const declared = card.viewport.height
  rows.push({
    slug: card.slug,
    width: card.viewport.width,
    declared,
    needed,
    waste: declared ? `${Math.round((1 - needed / declared) * 100)}%` : '—',
  })
  await page.close()
}

await browser.close()
console.table(rows)

const slack = rows.filter((row) => row.declared && row.declared - row.needed > 40)
if (slack.length > 0) {
  console.log(
    `\n${slack.length} card(s) declare more than 40px of unused height — ` +
      `retune their viewport in src/entry-design.tsx: ${slack.map((r) => r.slug).join(', ')}`,
  )
}
