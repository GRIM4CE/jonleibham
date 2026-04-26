import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: tones },
    gradientTone: { control: 'select', options: tones },
    textTone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'gradient'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Solid: Story = {
  args: { tone: 'dustyGrape', variant: 'solid', size: 'md', children: 'View Projects' },
}

export const Outline: Story = {
  args: { tone: 'porcelain', variant: 'outline', size: 'md', textTone: 'dustyGrape', children: 'Contact Me' },
}

export const Ghost: Story = {
  args: { tone: 'magentaBloom', variant: 'ghost', size: 'md', children: 'Learn More' },
}

export const GradientWarm: Story = {
  args: {
    tone: 'magentaBloom',
    gradientTone: 'flagRed',
    variant: 'gradient',
    size: 'lg',
    children: 'Send Message',
  },
}

export const GradientHero: Story = {
  args: {
    tone: 'dustyGrape',
    gradientTone: 'midnightViolet',
    variant: 'gradient',
    size: 'lg',
    children: 'Get Started',
  },
}
