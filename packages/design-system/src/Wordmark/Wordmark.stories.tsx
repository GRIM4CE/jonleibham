import type { Meta, StoryObj } from '@storybook/react-vite'
import { Wordmark } from './Wordmark'

const meta = {
  title: 'Design System/Wordmark',
  component: Wordmark,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Wordmark>

export default meta
type Story = StoryObj<typeof meta>

/** Home's brand row: the name alone. */
export const NameOnly: Story = { args: { name: 'Jon Leibham' } }

/** The rail's head, from 768 up. */
export const WithTitle: Story = {
  args: { name: 'Jon Leibham', title: 'Senior Software Engineer' },
}
