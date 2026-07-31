import type { Meta, StoryObj } from '@storybook/react-vite'
import { IndexRow } from './WorkScreen'
import { findWork, projects, type Project } from '../../data/projects'
import styles from './WorkScreen.module.css'

/**
 * The number is drawn by a CSS counter that `.counterScope` resets and each row
 * increments — so a row rendered outside that scope has no number at all. Every
 * story here supplies the same two wrappers the screen does.
 */
function InIndex({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.counterScope}>
      <ul className={styles.rows}>{children}</ul>
    </div>
  )
}

const meta = {
  title: 'Portfolio/IndexRow',
  component: IndexRow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'A single row in the work index.',
          '',
          '**The number is not in the markup.** It comes from a CSS counter, so hiding',
          'rows with a filter renumbers whatever is left — 01, 02, 03 with no gaps. The',
          'cost is that a row outside a `.counterScope` renders numberless, which is why',
          'every story below wraps it in one.',
          '',
          'One counter spans both lists, so the utilities continue the projects’',
          'numbering rather than restarting.',
          '',
          '`data-cat` carries the categories, and is what the filter rules in',
          '`WorkScreen.module.css` match on.',
          '',
          'The row is one grid across both designs — mobile puts title and year on a',
          'shared baseline with the blurb beneath, desktop spreads the same cells into',
          'No / Project / Stack / Year columns. That only works if every cell is a direct',
          'child of the grid, so the two wrappers that group them for reading order are',
          '`display: contents`: they exist for the markup, not the layout.',
          '',
          '**The stack is in the markup twice** — one mono line for mobile, real chips for',
          'desktop. Whichever is not in play is `display: none`, so it is out of the',
          'accessibility tree too and exactly one of the two is ever announced.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    project: {
      control: false,
      description:
        'The record to render. Its `accent`, `featured`, `categories` and `stackLine` ' +
        'all drive presentation.',
      table: { type: { summary: 'Project' } },
    },
  },
  decorators: [
    (Story) => (
      <InIndex>
        <Story />
      </InIndex>
    ),
  ],
} satisfies Meta<typeof IndexRow>

export default meta
type Story = StoryObj<typeof meta>

/** The featured project: a flat gold tint across the whole row. */
export const Featured: Story = {
  args: { project: findWork('recipe-book')! },
}

/** Everything else — no tint, accent only on the spine. */
export const Standard: Story = {
  args: { project: projects.find((p) => !p.featured)! },
}

/** A utility. Same row, same counter, shorter blurb. */
export const Utility: Story = {
  args: { project: findWork('transcribe')! },
}

/**
 * The three spine accents. `tagVariantFor` does not decide these — `accent` is
 * a field on the project.
 */
export const Accents: Story = {
  args: { project: projects[0] },
  decorators: [],
  render: () => {
    const byAccent = (['gold', 'green', 'grape'] as const)
      .map((accent) => projects.find((p) => p.accent === accent))
      .filter((p): p is Project => Boolean(p))
    return (
      <InIndex>
        {byAccent.map((project) => (
          <IndexRow key={project.id} project={project} />
        ))}
      </InIndex>
    )
  },
}

/**
 * Four rows in one scope, to show the counter doing the numbering. Remove a row
 * and the rest renumber; that is the whole reason it is not markup.
 */
export const Numbering: Story = {
  args: { project: projects[0] },
  decorators: [],
  render: () => (
    <InIndex>
      {projects.slice(0, 4).map((project) => (
        <IndexRow key={project.id} project={project} />
      ))}
    </InIndex>
  ),
}
