import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvailabilityPill } from './AvailabilityPill'

const meta = {
  title: 'Design System/AvailabilityPill',
  component: AvailabilityPill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AvailabilityPill>

export default meta
type Story = StoryObj<typeof meta>

/** The label must say the status on its own — "Open to roles", not "Open". */
export const Default: Story = { args: { children: 'Open to roles' } }

/** No truncation: a longer label just makes the pill wider. */
export const LongerLabel: Story = { args: { children: 'Available from March 2027' } }
