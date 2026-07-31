import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './Icon'
import { iconNames } from './icons'

const meta = {
  title: 'Design System/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Inlined Lucide paths, plus the LinkedIn and GitHub marks. The set is',
          'closed — `iconNames` in `icons.ts` is all of it.',
          '',
          'Color comes from `currentColor`, so set `color` on the parent. Every icon',
          'is `aria-hidden`, so an icon-only control needs its own `aria-label`.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  args: { name: 'home', size: 22 },
  argTypes: {
    name: {
      control: 'select',
      options: iconNames,
      description: 'Which glyph to draw. Limited to `iconNames`.',
      table: { type: { summary: 'IconName' } },
    },
    size: {
      control: { type: 'number', min: 8, max: 64, step: 1 },
      description:
        'Width and height in px. Set on the element, so it does not scale with ' +
        'surrounding text.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '22' } },
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/** One glyph. Use the controls to page through the set. */
export const Single: Story = {}

/** The whole set. The gold is the wrapper's `color`, not a prop. */
export const All: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 20,
        padding: 20,
        color: 'var(--accent)',
      }}
    >
      {iconNames.map((name) => (
        <Icon key={name} {...args} name={name} />
      ))}
    </div>
  ),
}

/** The sizes in use: 13px inside small buttons, up to 22px for navigation. */
export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        color: 'var(--text-primary)',
      }}
    >
      {[13, 17, 18, 19, 21, 22].map((size) => (
        <Icon key={size} name="arrowUpRight" size={size} />
      ))}
    </div>
  ),
}

/** Filled rather than stroked, so they hold up at small sizes. */
export const BrandMarks: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        color: 'var(--text-primary)',
      }}
    >
      <Icon name="linkedin" size={19} />
      <Icon name="github" size={19} />
    </div>
  ),
}
