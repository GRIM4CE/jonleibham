import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionTitle } from './SectionTitle'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/SectionTitle',
  component: SectionTitle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    accent: { control: 'select', options: tones },
    align: { control: 'inline-radio', options: ['left', 'center'] },
    size: { control: 'inline-radio', options: ['md', 'lg'] },
    as: { control: 'inline-radio', options: ['h2', 'h3'] },
  },
} satisfies Meta<typeof SectionTitle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { accent: 'sunflowerGold', align: 'center', size: 'lg', children: 'About Me' },
}

export const SeaGreenLeftAligned: Story = {
  args: { accent: 'seaGreen', align: 'left', size: 'lg', children: 'My Projects' },
}

export const MagentaSmall: Story = {
  args: { accent: 'magentaBloom', align: 'center', size: 'md', children: 'Get In Touch' },
}
