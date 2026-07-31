import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabeledNote } from './LabeledNote'

const meta = {
  title: 'Design System/LabeledNote',
  component: LabeledNote,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A short uppercase label and a line of text, as one `<p>`.',
          '',
          'For a single named aside. Once there is more than one pair the markup is',
          'wrong — use a `<dl>` instead, so the label and its value are related in the',
          'accessibility tree rather than only visually.',
          '',
          'Restyle the parts from a caller through the `data-note-label` and',
          "`data-note-text` attributes. A class scoped to this component's CSS module",
          "cannot be reached from the caller's.",
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description:
        'The leading label — "Now", "Why". Rendered uppercase. A `ReactNode` rather ' +
        'than a string so a two-word label can hold itself together with `&nbsp;`.',
      table: { type: { summary: 'ReactNode' } },
    },
    children: {
      control: 'text',
      description: 'The line of text the label introduces.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: false,
      description:
        'All spacing — the component sets none, so it sits flush against whatever ' +
        'precedes it without one.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
  },
} satisfies Meta<typeof LabeledNote>

export default meta
type Story = StoryObj<typeof meta>

/** Pass the label in ordinary case — `"Now"`, not `"NOW"`. */
export const Now: Story = {
  args: { label: 'Now', children: 'Building a design system for four apps to share.' },
}

/** The same shape with a different label. */
export const Why: Story = {
  args: { label: 'Why', children: 'Frontend that holds up under real traffic.' },
}

/** `<>Off&nbsp;clock</>` keeps a two-word label from wrapping. */
export const OffClock: Story = {
  args: { label: <>Off&nbsp;clock</>, children: 'Bouldering, and a stubborn sourdough starter.' },
}
