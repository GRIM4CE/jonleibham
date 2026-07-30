import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { WORK_FILTER_GROUP, allWork, filters, projects, utilities } from './projects'

const dir = path.dirname(fileURLToPath(import.meta.url))
const workCss = readFileSync(
  path.join(dir, '../components/WorkScreen/WorkScreen.module.css'),
  'utf8',
)

/**
 * The Work screen filters with CSS, not JavaScript: a radio group plus one
 * `:has()` rule per chip. Nothing links the chip list to those rules at build
 * time, so a chip added here without a rule there would simply do nothing when
 * clicked. These tests are that link.
 */
describe('work filters', () => {
  it('uses the radio group name the stylesheet keys off', () => {
    expect(workCss).toContain(`input[name='${WORK_FILTER_GROUP}']`)
  })

  it.each(filters.filter((filter) => filter !== 'All'))('has a rule for the %s chip', (filter) => {
    expect(workCss).toContain(`input[name='${WORK_FILTER_GROUP}'][value='${filter}']:checked`)
  })

  it('leaves All without a rule, since it hides nothing', () => {
    expect(workCss).not.toContain(`[value='All']`)
  })
})

describe('work data', () => {
  it('gives every item a unique id, which its detail screen is addressed by', () => {
    const ids = allWork.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('produces ids that are safe in a URL fragment', () => {
    for (const item of allWork) {
      expect(item.id).toMatch(/^[a-z0-9-]+$/)
    }
  })

  it('marks exactly one project as featured', () => {
    expect(projects.filter((project) => project.featured)).toHaveLength(1)
  })

  it('tags every utility as a utility and no project as one', () => {
    expect(utilities.every((utility) => utility.categories.includes('utility'))).toBe(true)
    expect(projects.some((project) => project.categories.includes('utility'))).toBe(false)
  })

  /**
   * Each non-"All" chip must match something, or it filters the index down to
   * an empty screen.
   */
  it.each(['product', 'utility', 'ai'] as const)('has at least one %s item', (category) => {
    expect(allWork.some((item) => item.categories.includes(category))).toBe(true)
  })

  it('only uses accents the stylesheet defines', () => {
    for (const item of allWork) {
      expect(workCss).toContain(`.accent-${item.accent}`)
    }
  })

  it('gives the featured project the gold accent', () => {
    expect(projects.find((project) => project.featured)?.accent).toBe('gold')
  })

  it('never repeats an accent on adjacent rows', () => {
    for (let i = 1; i < projects.length; i += 1) {
      expect(projects[i].accent).not.toBe(projects[i - 1].accent)
    }
  })

  it('has copy for every field the detail screen renders', () => {
    for (const item of allWork) {
      expect(item.title).not.toBe('')
      expect(item.blurb).not.toBe('')
      expect(item.standfirst).not.toBe('')
      expect(item.body).not.toBe('')
      expect(item.stack.length).toBeGreaterThan(0)
      expect(item.stackLine.length).toBeGreaterThan(0)
    }
  })
})
