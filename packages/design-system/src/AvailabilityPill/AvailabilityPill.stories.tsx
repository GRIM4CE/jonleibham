import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvailabilityPill } from './AvailabilityPill'

const meta = {
  title: 'Design System/AvailabilityPill',
  component: AvailabilityPill,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A status dot and a short label, in a pill.',
          '',
          'The dot is `aria-hidden` and its color is fixed to the success tone — there is',
          'no `status` prop and no red or amber variant. **The label has to carry the',
          'meaning on its own**, both for assistive tech and for anyone who reads the',
          'green as decoration.',
          '',
          'No max width and no truncation: a longer label just makes the pill wider.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The status text. Rendered uppercase, so pass it in ordinary case.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: false,
      description:
        'Placement, and overrides for the default gap and padding. The pill sets no ' +
        'margin of its own.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } },
    },
  },
} satisfies Meta<typeof AvailabilityPill>

export default meta
type Story = StoryObj<typeof meta>

/** The label must say the status on its own — "Open to roles", not "Open". */
export const Default: Story = { args: { children: 'Open to roles' } }

/** No truncation: a longer label just makes the pill wider. */
export const LongerLabel: Story = { args: { children: 'Available from March 2027' } }
