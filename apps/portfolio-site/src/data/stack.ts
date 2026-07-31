/**
 * The About screen's stack selector. Group names double as the radio values the
 * `:has()` rules in AboutScreen.module.css match on, so renaming one means
 * updating that stylesheet too.
 */

export const STACK_GROUP = 'stack-tab'

export interface StackGroup {
  name: string
  items: string[]
}

/*
 * Five groups, and the labels have to stay short: the underline Tabs variant
 * does not scroll, so the whole bar has to fit. At 375px it has 323px and these
 * five use about 308 — a longer label than "Platform" will overflow rather than
 * wrap. Give `Tabs` an `overflow-x` before adding a sixth.
 */
export const stackGroups: StackGroup[] = [
  {
    name: 'Frontend',
    items: [
      'TypeScript',
      'React',
      'Vue 2/3',
      'Next.js',
      'Nuxt',
      'Vite',
      'Sass',
      'CSS Modules',
      'CSS Variables',
    ],
  },
  {
    name: 'Systems',
    items: ['Design Systems', 'Storybook', 'Figma', 'Design Tokens'],
  },
  {
    // Not "Testing": Chromatic is visual regression, and jsx-a11y and Lighthouse
    // are accessibility and performance gates. They are all the same job — proving
    // a change did not break something — so they sit together.
    name: 'Quality',
    items: [
      'Vitest',
      'Jest',
      'React Testing Library',
      'Playwright',
      'Cypress',
      'Chromatic',
      'eslint-plugin-jsx-a11y',
      'Lighthouse',
    ],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Nest.js', 'Rails', 'PostgreSQL', 'GraphQL'],
  },
  {
    name: 'Platform',
    items: ['AWS', 'Docker', 'Kubernetes', 'Helm 3', 'Sentry', 'Datadog'],
  },
]
