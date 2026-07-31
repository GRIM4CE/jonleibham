import type { Meta, StoryObj } from '@storybook/react-vite'
import { Wordmark } from './Wordmark'

const meta = {
  title: 'Components/Wordmark',
  component: Wordmark,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A name, optionally over a role line.',
          '',
          '**There is no `size` prop.** The name sets no `font-size` or `letter-spacing`',
          'of its own — both inherit, so the container decides how large the mark reads.',
          'Scale it by styling the wrapper, as the `InheritedSizes` story does. The role',
          'line does set its own type: 9px uppercase mono, regardless of the name above it.',
          '',
          'Renders `<span>`s, so wrap it in a heading element if the page needs one there.',
          '',
          'No screen in the portfolio renders it today; it is kept for the next app that',
          'needs a masthead.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'The name. Renders at the inherited font size.',
      table: { type: { summary: 'string' } },
    },
    title: {
      control: 'text',
      description: 'An optional role line beneath, in 9px uppercase mono. Omit it for the mark alone.',
      table: { type: { summary: 'string' } },
    },
    className: {
      control: false,
      description: "Where the name's `font-size` and `letter-spacing` come from.",
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
  },
} satisfies Meta<typeof Wordmark>

export default meta
type Story = StoryObj<typeof meta>

/** The name alone, at the inherited font size. */
export const NameOnly: Story = { args: { name: 'Jon Leibham' } }

/** `title` stacks a role line underneath, which sets its own type. */
export const WithTitle: Story = {
  args: { name: 'Jon Leibham', title: 'Senior Software Engineer' },
}

/** The same component at two container sizes — 17px and 20px — to show the
 * name inheriting rather than taking a prop. */
export const InheritedSizes: Story = {
  args: { name: 'Jon Leibham', title: 'Senior Software Engineer' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40 }}>
      <span style={{ fontSize: 17, letterSpacing: '-0.02em' }}>
        <Wordmark name={args.name} />
      </span>
      <span style={{ fontSize: 20, letterSpacing: '-0.03em' }}>
        <Wordmark {...args} />
      </span>
    </div>
  ),
}
