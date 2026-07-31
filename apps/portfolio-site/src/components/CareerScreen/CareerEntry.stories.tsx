import type { Meta, StoryObj } from '@storybook/react-vite'
import { CareerEntry } from './CareerScreen'
import { roles } from '../../data/career'
import styles from './CareerScreen.module.css'

/** The rail only reads as a timeline inside the `<ol>` that spaces it. */
function InTimeline({ children }: { children: React.ReactNode }) {
  return <ol className={styles.timeline}>{children}</ol>
}

const meta = {
  title: 'Components/CareerEntry',
  component: CareerEntry,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'One role on the career timeline.',
          '',
          'The rail down the left is the only thing carrying chronology, so it does the',
          'work: the current role gets a solid gold dot and a tinted connecting line,',
          'everything earlier gets a hollow one.',
          '',
          '**`isLast` is not cosmetic.** It decides whether a connecting line is drawn',
          'below the dot at all — without it the timeline trails off past its final',
          'entry instead of stopping. See the `Last` story.',
          '',
          'Both the date gutter and the rail are `aria-hidden`. The dates they show are',
          'repeated in prose inside the entry body at every width, so announcing them',
          'here would read every year twice.',
          '',
          '`muted` dims a role that is on the record but not worth equal weight — it',
          'swaps both the company and the proof points to their quieter variants.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: false,
      description:
        'The record, from `data/career.ts`. `current`, `muted`, `dates`, `badge` and ' +
        '`title` each change what renders.',
      table: { type: { summary: 'Role' } },
    },
    isLast: {
      control: 'boolean',
      description:
        'Suppresses the connecting line and switches the dot to its terminal form. ' +
        'True only for the final entry in the list.',
      table: { type: { summary: 'boolean' } },
    },
  },
  decorators: [
    (Story) => (
      <InTimeline>
        <Story />
      </InTimeline>
    ),
  ],
} satisfies Meta<typeof CareerEntry>

export default meta
type Story = StoryObj<typeof meta>

/** The current role: solid gold dot, tinted line, NOW badge. */
export const Current: Story = {
  args: { role: roles[0], isLast: false },
}

/** A past role: hollow dot, plain line, tenure badge. */
export const Past: Story = {
  args: { role: roles[1], isLast: false },
}

/** The final entry. No line below the dot, so the timeline ends cleanly. */
export const Last: Story = {
  args: { role: roles[roles.length - 1], isLast: true },
}

/** The whole timeline, which is the only place the rail reads as continuous. */
export const FullTimeline: Story = {
  args: { role: roles[0], isLast: false },
  decorators: [],
  render: () => (
    <InTimeline>
      {roles.map((role, index) => (
        <CareerEntry key={role.company} role={role} isLast={index === roles.length - 1} />
      ))}
    </InTimeline>
  ),
}
