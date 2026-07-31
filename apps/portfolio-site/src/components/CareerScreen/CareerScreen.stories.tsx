import type { Meta, StoryObj } from '@storybook/react-vite'
import { CareerScreen } from './CareerScreen'

const meta = {
  title: 'Portfolio/Screens/CareerScreen',
  component: CareerScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The scannable employment history.',
          '',
          'The rail down the left is the only thing carrying chronology, so it does the',
          "work: the current role's dot is solid gold, everything before it is hollow, and",
          'the connecting line is tinted only along the current entry. The last role',
          'draws no line below it.',
          '',
          'Ordered as an `<ol>`, because the sequence is the meaning. Each entry pairs a',
          'date range with a tenure length — "2018 to 2024" and "5 yrs" — and both are',
          '`aria-hidden` in the rail, since the entry body repeats them in prose.',
          '',
          'Everything comes from `data/career.ts`. The education block and the closing',
          '`<LabeledNote>` are fixed furniture below the timeline.',
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
} satisfies Meta<typeof CareerScreen>

export default meta
type Story = StoryObj<typeof meta>

/** The full timeline, plus the education card and the closing note. */
export const Default: Story = {}

/** Wider measure: the date rail gets its own column rather than stacking. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desk' } },
}

export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
}
