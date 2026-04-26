import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'
import { Tag } from '../Tag'
import { Link } from '../Link'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    accent: { control: 'select', options: tones },
    bg: { control: 'select', options: tones },
    textTone: { control: 'select', options: tones },
    accentSide: { control: 'inline-radio', options: ['top', 'left', 'none'] },
    hoverable: { control: 'boolean' },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

const sample = (
  <div style={{ padding: '1.5rem', maxWidth: 360 }}>
    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Project Title</h3>
    <p style={{ margin: 0, marginBottom: '1rem' }}>
      Short description of what this project does and why it&apos;s interesting.
    </p>
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      <Tag tone="dustyGrape" variant="soft">
        TypeScript
      </Tag>
      <Tag tone="seaGreen" variant="soft">
        Vue 3
      </Tag>
    </div>
    <Link href="#" tone="dustyGrape" hoverTone="magentaBloom">
      Source Code
    </Link>
  </div>
)

export const TopAccent: Story = {
  args: { accent: 'dustyGrape', accentSide: 'top', bg: 'porcelain', children: sample },
}

export const LeftAccent: Story = {
  args: { accent: 'sunflowerGold', accentSide: 'left', bg: 'porcelain', children: sample },
}

export const SeaGreenTop: Story = {
  args: { accent: 'seaGreen', accentSide: 'top', bg: 'porcelain', children: sample },
}

export const MagentaTop: Story = {
  args: { accent: 'magentaBloom', accentSide: 'top', bg: 'porcelain', children: sample },
}
