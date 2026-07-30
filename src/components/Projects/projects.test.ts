import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  PROJECT_FILTER_GROUP,
  UTILITY_FILTER_GROUP,
  canonicalTech,
  projectFilters,
  projects,
  techFilterValue,
  tintFor,
  tintNames,
  utilities,
  utilityFilters,
} from './projects.data'

const css = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'Projects.module.css'),
  'utf8',
)

/**
 * Filtering happens in CSS, and the filter list is derived from the project
 * data at runtime — so adding a project can introduce a filter that no rule
 * covers. That fails quietly: the tab appears and clicking it does nothing.
 */
describe('filter rules', () => {
  it.each([
    [PROJECT_FILTER_GROUP, projectFilters],
    [UTILITY_FILTER_GROUP, utilityFilters],
  ])('%s has a rule for every derived filter', (group, filters) => {
    const missing = filters.filter(
      (filter) =>
        !css.includes(`input[name='${group}'][value='${filter}']`) ||
        !css.includes(`[data-tech*='|${filter}|']`),
    )
    expect(missing).toEqual([])
  })

  it('has no rules for filters that are no longer derived', () => {
    const derived = new Set([...projectFilters, ...utilityFilters])
    const inCss = [...css.matchAll(/\[data-tech\*='\|([^|]+)\|'\]/g)].map((m) => m[1])
    const stale = [...new Set(inCss)].filter((filter) => !derived.has(filter))
    expect(stale).toEqual([])
  })

  it('matches every card that a filter claims', () => {
    // The `*=` substring match has to line up with what techFilterValue writes.
    for (const filter of projectFilters) {
      const matched = projects.filter((project) =>
        techFilterValue(project.technologies).includes(`|${filter}|`),
      )
      expect(matched.length, `${filter} matches no project`).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('tints', () => {
  it('defines a rule for every tint name', () => {
    const missing = tintNames.filter((name) => !css.includes(`[data-tint='${name}']`))
    expect(missing).toEqual([])
  })

  it('gives every item a tint that exists', () => {
    for (const item of [...projects, ...utilities]) {
      expect(tintNames).toContain(tintFor(item.technologies))
    }
  })
})

describe('techFilterValue', () => {
  it('delimits families so a substring match cannot straddle two of them', () => {
    const value = techFilterValue(['React', 'React Three Fiber'])
    expect(value).toBe('|React|React Three Fiber|')
    expect(value.includes('|React|')).toBe(true)
    expect(techFilterValue(['React Three Fiber']).includes('|React|')).toBe(false)
  })

  it('collapses version variants and meta-frameworks onto the family', () => {
    expect(canonicalTech('React 19')).toBe('React')
    expect(canonicalTech('Next.js')).toBe('React')
    expect(canonicalTech('Tailwind CSS v4')).toBe('Tailwind CSS')
    expect(techFilterValue(['React 19', 'Next.js'])).toBe('|React|')
  })
})
