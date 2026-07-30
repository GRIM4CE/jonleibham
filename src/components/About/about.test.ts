import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { DEFAULT_CATEGORY, SKILLS_GROUP, categoryLabels, skillCategoryNames } from './about.data'

const css = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'About.module.css'),
  'utf8',
)

/**
 * Every skill list ships in the markup and CSS reveals the checked one. A
 * category with no rule would render a tab that shows nothing at all.
 */
describe('skill category rules', () => {
  it('has a rule for every category', () => {
    const missing = skillCategoryNames.filter(
      (category) =>
        !css.includes(`input[name='${SKILLS_GROUP}'][value='${category}']`) ||
        !css.includes(`[data-category='${category}']`),
    )
    expect(missing).toEqual([])
  })

  it('has no rules for categories that no longer exist', () => {
    const known = new Set<string>(skillCategoryNames)
    const inCss = [...css.matchAll(/\[data-category='([^']+)'\]/g)].map((m) => m[1])
    expect([...new Set(inCss)].filter((c) => !known.has(c))).toEqual([])
  })

  it('labels every category and defaults to one that exists', () => {
    expect(Object.keys(categoryLabels).sort()).toEqual([...skillCategoryNames].sort())
    expect(skillCategoryNames).toContain(DEFAULT_CATEGORY)
  })
})
