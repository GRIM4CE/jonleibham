import type { Meta, StoryObj } from '@storybook/react-vite'
import { Wordmark } from './Wordmark'

const meta = {
  title: 'Design System/Wordmark',
  component: Wordmark,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Wordmark>

export default meta
type Story = StoryObj<typeof meta>

/** The name alone, at the inherited font size. */
export const NameOnly: Story = { args: { name: 'Jon Leibham' } }

/** `title` stacks a role line underneath, which sets its own type. */
export const WithTitle: Story = {
  args: { name: 'Jon Leibham', title: 'Senior Software Engineer' },
}

/** The name inheriting its size from the container: 17px, then 20px. */
export const InheritedSizes: Story = {
  args: { name: 'Jon Leibham', title: 'Senior Software Engineer' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
      <span style={{ fontSize: 17, letterSpacing: '-0.02em' }}>
        <Wordmark name={args.name} />
      </span>
      <span style={{ fontSize: 20, letterSpacing: '-0.03em' }}>
        <Wordmark {...args} />
      </span>
    </div>
  ),
}
