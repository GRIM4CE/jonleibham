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

export const stackGroups: StackGroup[] = [
  {
    name: 'Frontend',
    items: ['TypeScript', 'React', 'Vue 2/3', 'Next.js', 'Nuxt', 'RSC', 'Tailwind', 'Vite'],
  },
  {
    name: 'Systems',
    items: [
      'Design Systems',
      'Storybook',
      'Chromatic',
      'Figma',
      'eslint-plugin-jsx-a11y',
      'Lighthouse',
    ],
  },
  {
    name: 'Testing',
    items: ['Vitest', 'Jest', 'React Testing Library', 'Playwright', 'Cypress'],
  },
  {
    name: 'Platform',
    items: [
      'AWS',
      'Docker',
      'Node.js',
      'Nest.js',
      'Rails',
      'PostgreSQL',
      'GraphQL',
      'Sentry',
      'Datadog',
    ],
  },
]
