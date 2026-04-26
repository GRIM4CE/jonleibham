import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: tones },
    textTone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['soft', 'solid', 'outline'] },
    interactive: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Soft: Story = {
  args: { tone: 'dustyGrape', variant: 'soft', children: 'TypeScript' },
}

export const Solid: Story = {
  args: { tone: 'sunflowerGold', variant: 'solid', textTone: 'midnightViolet', children: 'AI' },
}

export const Outline: Story = {
  args: { tone: 'seaGreen', variant: 'outline', children: 'Vue 3' },
}

export const InteractiveTab: Story = {
  args: { tone: 'magentaBloom', interactive: true, selected: true, children: 'Testing' },
}

export const InteractiveTabIdle: Story = {
  args: { tone: 'magentaBloom', interactive: true, selected: false, children: 'Testing' },
}
