import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabeledNote } from './LabeledNote'

const meta = {
  title: 'Design System/LabeledNote',
  component: LabeledNote,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
