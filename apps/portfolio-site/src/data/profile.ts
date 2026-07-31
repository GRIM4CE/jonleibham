/**
 * Everything the Home and About screens say about Jon. Kept here so copy edits
 * never require touching a component.
 */

export const profile = {
  name: 'Jon Leibham',
  firstName: 'Jon',
  lastName: 'Leibham',
  /** Standardized across the hero, About and the document title. */
  title: 'Senior Software Engineer',
  titleShort: 'Sr. Software Engineer',
  location: 'Milwaukee, WI · Remote',
  locationShort: 'Milwaukee, WI',
  availability: 'Open to roles',
  positioning:
    'Ten years of frontend engineering at national consumer scale. I like turning complicated systems into simple ones.',
  now: 'Frontend architecture at Songfinch. AI-native side projects on my own hardware.',
  offClock: 'Woodworking, synth building, cooking, my wife and son.',
  why: "A designer's eye, an engineer's discipline. It is why the systems get adopted.",
  bio: [
    'I build the design systems and monorepos that let teams ship consistent experiences at scale, with accessibility enforced structurally and visual regression guarding every component.',
    'I ship in both Vue and React, work AI-natively with Claude Code and Cursor, and bring a BFA in graphic design to the table when I sit down with product designers.',
  ],
  /** All three read at the same weight on purpose — the row scans as one unit. */
  employers: ['Songfinch', 'RE/MAX', '20+ clients'],
  portrait: {
    src: '/jon-leibham.jpg',
    srcSet: '/jon-leibham.jpg 1x, /jon-leibham@2x.jpg 2x',
    alt: 'Jon Leibham',
  },
  resume: '/jon-leibham-resume.pdf',
  links: {
    email: 'mailto:jleibham@gmail.com',
    linkedin: 'https://www.linkedin.com/in/jonleibham',
    github: 'https://github.com/GRIM4CE',
    /** The design system's own Storybook, deployed from apps/storybook. */
    storybook: 'https://storybook.jonleibham.com/',
  },
} as const

/** The unit character carries the accent; the number stays porcelain. */
/**
 * Three numbers, each tied to where it happened. A bare "7.6M / USERS" made the
 * reader guess whose users, and "100% ACCESSIBLE" was a self-assessment sitting
 * beside two measured results — both are replaced by measured ones.
 *
 * Every figure here is also in `career.ts`, so the Career screen backs up what
 * the hero claims. Keep them in step.
 */
export const metrics = [
  { value: '1.7', unit: 'M', label: 'Daily page views at RE/MAX' },
  { value: '2', unit: 'x', label: 'Product conversion at Songfinch' },
  { value: '80', unit: '%', label: 'Smaller bundles at RE/MAX' },
] as const
