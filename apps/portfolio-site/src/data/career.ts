/**
 * Employment history and education. Two proof points per role, never more —
 * the screen is meant to be scanned, not read.
 */

export interface Role {
  company: string
  title: string
  /** Rendered after the title in the mono meta line. */
  dates: string
  /** Right-aligned badge: "NOW" for the current role, tenure otherwise. */
  badge: string
  current?: boolean
  proofPoints: string[]
  /** The last entry drops to tertiary text and gets no rail line. */
  muted?: boolean
}

export const roles: Role[] = [
  {
    company: 'Songfinch',
    title: 'Senior Software Engineer',
    dates: '2024',
    badge: 'NOW',
    current: true,
    proofPoints: [
      'One Storybook design system replacing 4 styling paradigms across 5+ apps, cutting UI integration time 30%.',
      'Shipped the Vue 3 video feed in the purchase funnel: 1.2M views, conversion 3.5% to 7%.',
    ],
  },
  {
    company: 'RE/MAX',
    title: 'Senior Software Engineer',
    dates: '2018 to 2024',
    badge: '5 yrs',
    proofPoints: [
      'Primary engineer on the Vue/Nuxt to Next.js migration across 1.5M+ listings for 7.6M monthly users, rebuilding the component library in React.',
      'Led 15+ engineers onto a shared design system. Load time 2s to 0.5s, bundles 80% smaller.',
    ],
  },
  {
    company: 'Freelance',
    title: '',
    dates: '',
    badge: '2015 to 2018',
    muted: true,
    proofPoints: [
      '50+ projects for 20+ international clients across finance, crypto, ecommerce and legal.',
    ],
  },
]

export const education = {
  degree: 'BFA, Graphic Design',
  school: 'American Academy of Art, Chicago',
}
