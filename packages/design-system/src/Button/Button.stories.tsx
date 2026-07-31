import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Icon } from '../Icon'
import { tones } from '../tokens'

/*
 * react-docgen cannot resolve descriptions or defaults through `ButtonProps`,
 * which is a union — `as="a"` and `as="button"` carry different HTML attributes.
 * So these argTypes are the prop table. Keep them in step with `Button.tsx`.
 */
const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'Text buttons and circular icon buttons.',
          '',
          'Renders a `<button>`, or an `<a>` with `as="a" href="…"` — use the anchor',
          'form when the action navigates. No `disabled` or loading state: the site',
          'ships no JavaScript to toggle them.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost', 'icon'],
      description:
        '`solid` filled, `outline` bordered, `ghost` text-only, `icon` a circle for ' +
        'a single glyph.',
      table: {
        type: { summary: "'solid' | 'outline' | 'ghost' | 'icon'" },
        defaultValue: { summary: 'solid' },
      },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg', 'xl'],
      description:
        'Height: `sm` 32px, `md` 38px, `lg` 44px, `xl` 52px. `lg` and up meet the ' +
        '44px hit target. For `icon`, the circle diameter.',
      table: {
        type: { summary: "'sm' | 'md' | 'lg' | 'xl'" },
        defaultValue: { summary: 'lg' },
      },
    },
    block: {
      control: 'boolean',
      description: 'Fill the container width instead of shrinking to the label.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    tone: {
      control: 'select',
      options: tones,
      description:
        'Fill color for `solid`, text color for `ghost`. `outline` and `icon` ignore ' +
        'it.',
      table: { type: { summary: 'Tone' }, defaultValue: { summary: 'sunflowerGold' } },
    },
    textTone: {
      control: 'select',
      options: tones,
      description: 'Label color on `solid`. No effect on the other variants.',
      table: { type: { summary: 'Tone' }, defaultValue: { summary: 'midnightViolet' } },
    },
    as: {
      control: false,
      description:
        "`'a'` renders an anchor and requires `href`. Remaining props spread onto the " +
        'element, so `target`, `rel` and `download` pass through.',
      table: { type: { summary: "'button' | 'a'" }, defaultValue: { summary: 'button' } },
    },
    children: {
      control: false,
      description:
        'The label. For `variant="icon"` pass an `<Icon>` alone and add an ' +
        '`aria-label` — icons are `aria-hidden`.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** The primary action. */
export const Solid: Story = {
  args: { variant: 'solid', size: 'xl', children: 'See the work' },
}

/** A trailing glyph, for actions that navigate. */
export const WithIcon: Story = {
  args: {
    variant: 'solid',
    size: 'xl',
    children: (
      <>
        See the work
        <Icon name="arrowUpRight" size={17} />
      </>
    ),
  },
}

/** The secondary action. Same footprint as `Solid`, so the two stack evenly. */
export const Outline: Story = {
  args: { variant: 'outline', size: 'xl', children: 'Get in touch' },
}

/** `sm` is 32px, under the hit target — for asides beside a heading. */
export const Small: Story = {
  args: {
    variant: 'outline',
    size: 'sm',
    children: (
      <>
        Resume
        <Icon name="download" size={13} />
      </>
    ),
  },
}

/**
 * A circle at its size's height — `md` 38px, `lg` 44px. Each needs an
 * `aria-label`; the glyph inside is `aria-hidden`.
 */
export const IconButtons: Story = {
  args: { variant: 'icon', size: 'md', children: <Icon name="arrowLeft" size={18} /> },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button {...args} aria-label="Back" />
      <Button variant="icon" size="md" aria-label="Share">
        <Icon name="share" size={17} />
      </Button>
      <Button variant="icon" size="lg" aria-label="GitHub">
        <Icon name="github" size={19} />
      </Button>
    </div>
  ),
}

/** The four steps: 32 / 38 / 44 / 52px. */
export const Sizes: Story = {
  args: { children: 'Email me' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
      <Button {...args} size="xl" />
    </div>
  ),
}

/** Full-width, for a stacked pair of page actions. */
export const Block: Story = {
  args: { size: 'xl', block: true, children: 'See the work' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Button {...args} />
      <Button variant="outline" size="xl" block>
        Get in touch
      </Button>
    </div>
  ),
}
