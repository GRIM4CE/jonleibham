import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section } from './Section'
import { surfaces } from '../tokens'

const meta = {
  title: 'Design System/Section',
  component: Section,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    surface: { control: 'select', options: surfaces },
    paddingY: { control: 'select', options: ['sm', 'md', 'lg'] },
    maxWidth: { control: { type: 'number', min: 600, max: 1600, step: 50 } },
  },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Porcelain: Story = {
  args: {
    surface: 'porcelain',
    paddingY: 'lg',
    children: <p>Section content goes here.</p>,
  },
}

export const PaleSlate90: Story = {
  args: {
    surface: 'paleSlate90',
    paddingY: 'lg',
    children: <p>Section content goes here.</p>,
  },
}

export const DustyGrape90: Story = {
  args: {
    surface: 'dustyGrape90',
    paddingY: 'lg',
    children: <p>Section content goes here.</p>,
  },
}
