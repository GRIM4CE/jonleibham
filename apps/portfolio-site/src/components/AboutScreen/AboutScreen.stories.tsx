import type { Meta, StoryObj } from '@storybook/react-vite'
import { AboutScreen } from './AboutScreen'

const meta = {
  title: 'Portfolio/Screens/AboutScreen',
  component: AboutScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The person, the stack and the way to reach him.',
          '',
          'Contact is the primary action on this screen precisely because it is not a',
          'tab — there is no contact destination in the nav, and no form anywhere, so',
          'this and the Overview secondary action are the two places it lives.',
          '',
          '**The stack selector works in Storybook.** It is a `<Tabs variant="underline">`',
          'radio group, and the reveal rules live in `AboutScreen.module.css` rather than',
          'in `App.module.css`, so switching groups filters the tags here. One rule per',
          'group, which is what `data/stack.test.ts` guards.',
          '',
          'The portrait ships `srcSet` at a fixed 104×130 so it never reflows the',
          'identity block beside it.',
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        phone: { name: 'Phone', styles: { width: '390px', height: '900px' } },
        desk: { name: 'Desktop (768+)', styles: { width: '1100px', height: '900px' } },
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutScreen>

export default meta
type Story = StoryObj<typeof meta>

/** Portrait, identity, the stack selector and the contact actions. */
export const Default: Story = {}

export const Desktop: Story = {
  globals: { viewport: { value: 'desk' } },
}

export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
}
