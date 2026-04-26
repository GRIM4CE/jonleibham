import type { Meta, StoryObj } from '@storybook/react-vite'
import { LogoMark } from './LogoMark'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/LogoMark',
  component: LogoMark,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    accent: { control: 'select', options: tones },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof LogoMark>

export default meta
type Story = StoryObj<typeof meta>

export const Gold: Story = {
  args: { text: 'Jon Leibham', accent: 'sunflowerGold', size: 'md' },
}

export const Magenta: Story = {
  args: { text: 'Jon Leibham', accent: 'magentaBloom', size: 'md' },
}

export const SeaGreenLarge: Story = {
  args: { text: 'Jon Leibham', accent: 'seaGreen', size: 'lg' },
}
