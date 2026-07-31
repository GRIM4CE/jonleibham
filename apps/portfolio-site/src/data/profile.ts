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
    '10+ years of frontend engineering at national consumer scale. I like turning complicated systems into simple ones.',
  now: 'Frontend architecture at Songfinch. AI-native side projects on my own hardware.',
  offClock: 'Woodworking, synth building, cooking, my wife and son.',
  bio: [
    "Greenfield builds, legacy rebuilds, startups, national platforms. I build the monorepos and design systems that hold teams together, and I'm often the one prototyping an idea with product before anyone knows what the answer is.",
    // Renders in --text-secondary via `.bioBody`, so it reads as the quieter
    // half of the pair. Deliberately names no frameworks — the stack tabs
    // directly below already list them.
    "I don't stay in one lane. I've owned the design file, the component library, the API behind it and the pipeline that ships it. I work AI-natively, with Claude Code in the loop daily, which puts my time into the decisions instead of the typing.",
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
 * Four numbers, each tied to where it happened. A bare "7.6M / USERS" made the
 * reader guess whose users, and "100% ACCESSIBLE" was a self-assessment sitting
 * among measured results.
 *
 * Order matters: the grid is 2×2, so the two RE/MAX figures share the top row
 * and the two Songfinch ones the bottom. Reordering this array regroups the
 * card — check it still pairs by company.
 *
 * Every figure here is also in `career.ts`, so the Career screen backs up what
 * the hero claims. Keep them in step.
 */
export const metrics = [
  { value: '1.7', unit: 'M', label: 'Daily page views — RE/MAX' },
  { value: '80', unit: '%', label: 'Smaller bundle size — RE/MAX' },
  { value: '2', unit: 'x', label: 'Product conversion — Songfinch' },
  { value: '66', unit: '%', label: 'Higher AOV — Songfinch' },
] as const
