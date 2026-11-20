import type { Meta, StoryObj } from '@storybook/react-vite'
import { CoursesCard, EducationCard } from './CareerScreen'
import styles from './CareerScreen.module.css'

const meta = {
  title: 'Components/CoursesCard',
  component: CoursesCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A short list of recent courses, with one link out to the full master.dev',
          'profile.',
          '',
          'Takes no props. The list is hand-picked in `data/courses.ts` — the profile',
          'itself lists everything ever opened — so the order and the cut are both',
          'editorial. Title and instructor only: no progress, no dates.',
          '',
          'It sits in the career screen’s `.foot` after the degree. Below 768 the two',
          'are separate tinted cards; from 768 up they share one, split by a rule. The',
          '`InFoot` story shows the pair as they actually appear.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CoursesCard>

export default meta
type Story = StoryObj<typeof meta>

/** The card on its own. */
export const Default: Story = {}

/** In the screen's foot beside the degree, which is the only place it appears. */
export const InFoot: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={styles.foot}>
      <EducationCard />
      <CoursesCard />
    </div>
  ),
}
