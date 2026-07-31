import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvailabilityPill } from './AvailabilityPill'

const meta = {
  title: 'Design System/AvailabilityPill',
  component: AvailabilityPill,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AvailabilityPill>

export default meta
type Story = StoryObj<typeof meta>

/** As it reads in Home's brand row below 768. */
export const Default: Story = { args: { children: 'Open to roles' } }

export const LongerLabel: Story = { args: { children: 'Available from March 2027' } }
