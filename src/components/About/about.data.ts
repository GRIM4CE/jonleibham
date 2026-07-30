export const skillCategories = {
  'Languages & Frameworks': ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Ruby', 'Python', 'Vue', 'React', 'Nuxt', 'Next.js', 'Node.js', 'Nest.js', 'Ruby on Rails', 'Storybook'],
  Testing: ['Jest', 'Vitest', 'Cypress', 'K6', 'Chromatic', 'A11y'],
  'Data & APIs': ['GraphQL', 'MySQL', 'NoSQL', 'MongoDB'],
  'DevOps & Tools': ['Git', 'Docker', 'Kubernetes', 'Helm3', 'AWS', 'Vite', 'TurboRepo'],
  AI: ['Claude', 'ChatGPT', 'Copilot', 'Cursor'],
}

export type Category = keyof typeof skillCategories

export const categoryLabels: Record<Category, string> = {
  'Languages & Frameworks': 'Languages',
  Testing: 'Testing',
  'Data & APIs': 'Data & APIs',
  'DevOps & Tools': 'DevOps',
  AI: 'AI',
}

export const skillCategoryNames = Object.keys(skillCategories) as Category[]

/** Radio group name. About.module.css keys its `:has()` rules off this. */
export const SKILLS_GROUP = 'skill-category'

export const DEFAULT_CATEGORY: Category = 'Languages & Frameworks'
