import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './Icon'
import { iconNames } from './icons'

const meta = {
  title: 'Design System/Icon',
  component: Icon,
  args: { name: 'home', size: 22 },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {}

/** Every icon at tab-bar size, on the app's ground. */
export const All: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        padding: 20,
        background: '#1a0f16',
        color: '#ffc145',
      }}
    >
      {iconNames.map((name) => (
        <Icon key={name} {...args} name={name} />
      ))}
    </div>
  ),
}

/** Interface sizes the design calls for. */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        background: '#1a0f16',
        color: '#fffffb',
      }}
    >
      {[13, 16, 18, 21, 22].map((size) => (
        <Icon key={size} name="arrowUpRight" size={size} />
      ))}
    </div>
  ),
}
