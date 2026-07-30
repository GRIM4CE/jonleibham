import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabeledNote } from './LabeledNote'

const meta = {
  title: 'Design System/LabeledNote',
  component: LabeledNote,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LabeledNote>

export default meta
type Story = StoryObj<typeof meta>

/** Home's "Now" line. */
export const Now: Story = {
  args: { label: 'Now', children: 'Building a design system for four apps to share.' },
}

/** Career's "Why" line, pinned under the timeline. */
export const Why: Story = {
  args: { label: 'Why', children: 'Frontend that holds up under real traffic.' },
}

/** About's "Off clock" line — the label carries a non-breaking space. */
export const OffClock: Story = {
  args: { label: <>Off&nbsp;clock</>, children: 'Bouldering, and a stubborn sourdough starter.' },
}
