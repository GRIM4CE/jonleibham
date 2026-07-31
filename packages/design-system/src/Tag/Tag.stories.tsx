import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'
import { tagVariantFor } from './tagVariant'

const meta = {
  title: 'Design System/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A small pill for a technology name.',
          '',
          'Static text — no dismiss control, no interactive state and no `href`. Nothing',
          'in the portfolio needs a clickable chip, so no variant of one exists here.',
          '',
          'Color is by category rather than by call site: pass names through',
          '`tagVariantFor(tech)` so the same technology reads the same everywhere. It',
          'matches cloud and infrastructure names to `cloud`, data stores to `data`, and',
          'leaves everything else `neutral`.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['neutral', 'cloud', 'data'],
      description:
        '`cloud` reads gold, `data` green, `neutral` everything else. Prefer ' +
        '`tagVariantFor(tech)` over picking one by hand.',
      table: {
        type: { summary: "'neutral' | 'cloud' | 'data'" },
        defaultValue: { summary: 'neutral' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: '`sm` for dense lists, `md` for chips that stand on their own.',
      table: { type: { summary: "'sm' | 'md'" }, defaultValue: { summary: 'sm' } },
    },
    children: {
      control: 'text',
      description: "The chip's label. Usually a technology name.",
      table: { type: { summary: 'ReactNode' } },
    },
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
