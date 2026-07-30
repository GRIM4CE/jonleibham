import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { STACK_GROUP, stackGroups } from './stack'

const dir = path.dirname(fileURLToPath(import.meta.url))
const aboutCss = readFileSync(
  path.join(dir, '../components/AboutScreen/AboutScreen.module.css'),
  'utf8',
)

/**
 * The About screen's stack selector pairs a radio value with a panel's
 * `data-stack` attribute in CSS. Renaming a group here without updating that
 * stylesheet would leave the tab selectable but its panel permanently hidden.
 */
describe('stack groups', () => {
  it('uses the radio group name the stylesheet keys off', () => {
    expect(aboutCss).toContain(`input[name='${STACK_GROUP}']`)
  })

  it.each(stackGroups.map((group) => group.name))('shows the %s panel when selected', (name) => {
    expect(aboutCss).toContain(`input[name='${STACK_GROUP}'][value='${name}']:checked`)
    expect(aboutCss).toContain(`.panel[data-stack='${name}']`)
  })

  it('has chips in every group, so no tab opens an empty panel', () => {
    for (const group of stackGroups) {
      expect(group.items.length).toBeGreaterThan(0)
    }
  })

  it('has a default group to render on load', () => {
    expect(stackGroups.length).toBeGreaterThan(0)
  })
})
