import type { Meta, StoryObj } from '@storybook/react-vite'
import { EducationCard } from './CareerScreen'
import styles from './CareerScreen.module.css'

const meta = {
  title: 'Components/EducationCard',
  component: EducationCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'The degree, under a filled gold cap.',
          '',
          'Takes no props. There is only ever one of these and its content is fixed in',
          '`data/career.ts`, so a prop would be a parameter with one possible value.',
          '',
          'The icon is `aria-hidden` — it is decoration, and the degree beside it already',
          'says what this is.',
          '',
          'It sits in the career screen’s `.foot` alongside the "Why" note. Below 768 the',
          'two are stacked blocks; from 768 up `display: contents` on the wrapper lets',
          'them share one tinted row split by a rule. The `InFoot` story shows the pair',
          'as they actually appear.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EducationCard>

export default meta
type Story = StoryObj<typeof meta>

/** The card on its own. */
export const Default: Story = {}

/** In the screen's foot, which is the only place it appears. */
export const InFoot: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={styles.foot}>
      <EducationCard />
    </div>
  ),
}
