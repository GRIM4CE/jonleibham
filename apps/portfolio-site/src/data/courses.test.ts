import { describe, expect, it } from 'vitest'
import { courses } from './courses'
import { profile } from './profile'

/**
 * The list is edited by hand, so the mistakes worth catching are the
 * hand-editing ones: a pasted link to the wrong site, a duplicate, or a list
 * that has grown past what the Career foot was laid out for.
 */
describe('courses', () => {
  it('has something to show, and no more than the card holds', () => {
    expect(courses.length).toBeGreaterThan(0)
    expect(courses.length).toBeLessThanOrEqual(4)
  })

  it.each(courses)('$title links to its master.dev course page', ({ url }) => {
    expect(url).toMatch(/^https:\/\/master\.dev\/courses\/[a-z0-9-]+\/$/)
  })

  it.each(courses)('$title names its instructor', ({ title, instructor }) => {
    expect(title.trim()).not.toBe('')
    expect(instructor.trim()).not.toBe('')
  })

  it('lists each course once', () => {
    expect(new Set(courses.map((course) => course.url)).size).toBe(courses.length)
  })

  it('points the profile link at master.dev too', () => {
    expect(profile.links.masterdev).toMatch(/^https:\/\/master\.dev\/u\/[^/]+\/$/)
  })
})
