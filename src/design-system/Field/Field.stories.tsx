import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './Field'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/Field',
  component: Field,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: tones },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const TextInput: Story = {
  args: {
    tone: 'magentaBloom',
    children: (
      <>
        <Field.Label htmlFor="name">Name</Field.Label>
        <Field.Input id="name" placeholder="Jane Doe" />
      </>
    ),
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Field {...args} />
    </div>
  ),
}

export const Textarea: Story = {
  args: {
    tone: 'dustyGrape',
    children: (
      <>
        <Field.Label htmlFor="msg">Message</Field.Label>
        <Field.Textarea id="msg" placeholder="What's on your mind?" />
      </>
    ),
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Field {...args} />
    </div>
  ),
}
