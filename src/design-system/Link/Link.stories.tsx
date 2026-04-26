import type { Meta, StoryObj } from '@storybook/react-vite'
import { Link } from './Link'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/Link',
  component: Link,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: tones },
    hoverTone: { control: 'select', options: tones },
    underline: { control: 'boolean' },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'semibold'] },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '#',
    tone: 'dustyGrape',
    hoverTone: 'magentaBloom',
    underline: true,
    weight: 'medium',
    children: 'Source Code',
  },
}

export const NavStyle: Story = {
  args: {
    href: '#',
    tone: 'midnightViolet',
    hoverTone: 'seaGreen',
    underline: false,
    weight: 'medium',
    children: 'About',
  },
}
