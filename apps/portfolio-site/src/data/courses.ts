/**
 * The courses shown on the Career screen, newest first.
 *
 * Hand-picked, not scraped. The master.dev profile lists every course ever
 * opened along with how far each one got, and most of that is noise on a
 * portfolio — so what appears here is a decision, and so is the order. Adding
 * or dropping a course is a data edit and nothing more.
 *
 * No progress and no dates on purpose: the profile exposes no per-course
 * dates, and a percentage reads as "unfinished" rather than "still learning".
 */

export interface Course {
  title: string
  instructor: string
  /** The course's own page on master.dev. */
  url: string
}

export const courses: Course[] = [
  {
    title: 'Practical AI Agent Workflows',
    instructor: 'Sabrina Goldfarb',
    url: 'https://master.dev/courses/ai-agent-workflows/',
  },
  {
    title: 'Own Your AI Stack with Local Models',
    instructor: 'Web Dev Simplified',
    url: 'https://master.dev/courses/local-ai/',
  },
  {
    title: 'Applied AI Engineering Fundamentals',
    instructor: 'Scott Moss',
    url: 'https://master.dev/courses/ai-engineering/',
  },
  {
    title: 'Claude Code',
    instructor: 'Lydia Hallie',
    url: 'https://master.dev/courses/claude-code/',
  },
]
