import type { Meta, StoryObj } from '@storybook/react-vite'
import { UtilitiesCollapse } from './WorkScreen'
import styles from './WorkScreen.module.css'

const meta = {
  title: 'Components/UtilitiesCollapse',
  component: UtilitiesCollapse,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The five utilities, folded behind a summary line.',
          '',
          '**Click the header — it opens, with no JavaScript.** The state is a checkbox,',
          'and `WorkScreen.module.css` reveals the rows from `:checked`.',
          '',
          'A checkbox rather than a `<details>`, and that is the whole design. The work',
          'filters have to be able to force this open — selecting "Utilities" or "AI"',
          'shows these rows regardless of the toggle — and CSS cannot reach into a',
          "`<details>` element's open state to do that. A checkbox it can.",
          '',
          'The two summary lines are the preview shown while it is shut, and they are',
          '`aria-hidden`: the same titles sit in the rows below at every state, so',
          'without it each utility would be announced twice.',
          '',
          'The rows carry no numbers here. They are `IndexRow`s, and their counter is',
          "reset by the screen's `.counterScope` — in isolation there is nothing to count",
          'from. In the app they continue the projects’ numbering rather than restarting.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UtilitiesCollapse>

export default meta
type Story = StoryObj<typeof meta>

/** As it loads: shut, showing the two preview lines. Click to open. */
export const Default: Story = {}

/**
 * Inside a `.counterScope`, which is how the screen renders it — the rows pick
 * up numbers instead of showing an empty spine.
 */
export const Numbered: Story = {
  render: () => (
    <div className={styles.counterScope}>
      <UtilitiesCollapse />
    </div>
  ),
}
