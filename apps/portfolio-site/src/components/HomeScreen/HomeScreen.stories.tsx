import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomeScreen } from './HomeScreen'

const meta = {
  title: 'Screens/HomeScreen',
  component: HomeScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Who Jon is, three numbers that prove it, and two ways to act — the twenty',
          'second read a hiring manager gives a portfolio.',
          '',
          'Labelled Overview in the nav, but its id, hash and `data-screen` are all still',
          '`home`: every `:target` rule in `App.module.css` is written against that, and',
          'only the visitor-facing label changed.',
          '',
          'No wordmark in the brand row. The hero underneath *is* the name at sixty-odd',
          'pixels, so a 17px copy directly above only said it twice — the row is left to',
          'the availability pill, which has nowhere else to sit below 1024.',
          '',
          'The latest-project card reads `projects.find(p => p.featured)` rather than',
          'naming a project, so promoting a different one in the data moves this card',
          'with it — and moves what the Work index puts first, together.',
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
} satisfies Meta<typeof HomeScreen>

export default meta
type Story = StoryObj<typeof meta>

/** Availability, hero, the three metrics, both actions and the latest card. */
export const Default: Story = {}

export const Desktop: Story = {
  globals: { viewport: { value: 'desk' } },
}

export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
}
