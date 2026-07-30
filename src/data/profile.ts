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
    'Ten years of frontend at national consumer scale. Design systems, monorepos, and the migrations nobody volunteers for.',
  now: 'Design systems at Songfinch. AI-native side projects on my own hardware.',
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
  },
} as const

/** The unit character carries the accent; the number stays porcelain. */
export const metrics = [
  { value: '7.6', unit: 'M', label: 'Users' },
  { value: '2', unit: 'x', label: 'Conversion' },
  { value: '100', unit: '%', label: 'Accessible' },
] as const
