import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'
import { tagVariantFor } from './tagVariant'

const meta = {
  title: 'Design System/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['neutral', 'cloud', 'data'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

/** The default — languages, frameworks, anything the other two don't claim. */
export const Neutral: Story = {
  args: { variant: 'neutral', size: 'sm', children: 'TypeScript' },
}

/** Cloud and infrastructure. */
export const Cloud: Story = {
  args: { variant: 'cloud', size: 'sm', children: 'AWS Lambda' },
}

/** Data stores. */
export const Data: Story = {
  args: { variant: 'data', size: 'sm', children: 'Turso (libSQL)' },
}

/** The larger step, for chips that stand on their own. */
export const Medium: Story = {
  args: { variant: 'neutral', size: 'md', children: 'Design Systems' },
}

/** The intended usage: colors come from `tagVariantFor`, not the call site. */
export const Stack: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 340 }}>
      {['React 19', 'TypeScript', 'Express 5', 'AWS Lambda', 'Turso (libSQL)', 'AWS Cognito'].map(
        (tech) => (
          <Tag key={tech} variant={tagVariantFor(tech)}>
            {tech}
          </Tag>
        ),
      )}
    </div>
  ),
}
