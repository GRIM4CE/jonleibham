import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { cards } from './entry-design'

const dsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'design-system')

/** Every component directory under design-system/, by name. */
function componentDirs(): string[] {
  return readdirSync(dsDir).filter((entry) => statSync(path.join(dsDir, entry)).isDirectory())
}

/**
 * A component with no card is invisible in Claude Design, and nothing else
 * fails — the bundle just silently ships one card fewer. This is the guard.
 */
describe('design cards', () => {
  it.each(componentDirs())('has a card for %s', (name) => {
    expect(cards.map((card) => card.name)).toContain(name)
  })

  it('gives every card a unique slug', () => {
    const slugs = cards.map((card) => card.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('puts every card in a group', () => {
    expect(cards.filter((card) => !card.group)).toEqual([])
  })

  /**
   * The `@dsCard` marker is an HTML comment holding quoted attributes, and the
   * app compiles `_ds_manifest.json` straight from it. A `"` or a `--` in a
   * subtitle would break that parse — and subtitles are prose.
   */
  it('keeps comment-breaking characters out of the marker attributes', () => {
    const bad = cards.filter((card) =>
      [card.group, card.name, card.subtitle ?? ''].some(
        (value) => value.includes('"') || value.includes('--'),
      ),
    )
    expect(bad.map((card) => card.slug)).toEqual([])
  })
})
