import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { surfaces, tones } from './tokens'
import type { ToneSlot } from './tones'

const css = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'tones.module.css'),
  'utf8',
)

const slots: ToneSlot[] = ['accent', 'accent2', 'bg', 'text', 'hover']

/**
 * `toneClass()` looks classes up by string, so a missing rule fails silently:
 * the component renders `class="undefined"` and simply has no color. The
 * stylesheet has to cover the full cross product.
 */
describe('tones.module.css', () => {
  it.each(slots)('defines every tone for the %s slot', (slot) => {
    const missing = tones.filter((tone) => !css.includes(`.${slot}-${tone} {`))
    expect(missing).toEqual([])
  })

  it('defines every surface', () => {
    const missing = surfaces.filter((surface) => !css.includes(`.surface-${surface} {`))
    expect(missing).toEqual([])
  })

  it('sets the slot variable each class name promises', () => {
    const wrong: string[] = []
    for (const [, name, variable] of css.matchAll(/\.([a-z0-9-]+) \{ (--ds-[a-z0-9-]+):/gi)) {
      const slot = name.split('-')[0]
      const expected = slot === 'accent2' ? '--ds-accent-2' : `--ds-${slot}`
      if (slot !== 'surface' && variable !== expected) wrong.push(`${name} sets ${variable}`)
    }
    expect(wrong).toEqual([])
  })
})
