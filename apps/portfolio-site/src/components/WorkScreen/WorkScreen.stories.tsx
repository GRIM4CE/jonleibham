import type { Meta, StoryObj } from '@storybook/react-vite'
import { WorkScreen } from './WorkScreen'

const meta = {
  title: 'Screens/WorkScreen',
  component: WorkScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The ranked, numbered, filterable work index.',
          '',
          'The reason the redesign exists: the old card grid gave every project identical',
          'weight. Here the featured project carries a flat gold tint and the rest are',
          'ranked beneath it.',
          '',
          '**This screen is interactive in Storybook** — unusually for this codebase, all',
          'of its behaviour lives in its own stylesheet rather than in `App.module.css`.',
          'Click a filter chip and the rows re-filter; click "5 more utilities" and the',
          'collapse opens. No JavaScript is involved in either.',
          '',
          'The filter is a `<Tabs>` radio group, and `WorkScreen.module.css` writes one',
          '`:has(input[value="…"]:checked)` rule per filter. Because CSS cannot compare',
          'two attribute values, those rules cannot be generalised — which is why',
          '`data/projects.test.ts` fails when the rules and the data drift apart.',
          '',
          'The collapse is a checkbox rather than a `<details>`, because selecting',
          '"Utilities" or "AI" has to force it open regardless of the toggle, and CSS',
          "cannot reach into a `<details>` element's open state.",
          '',
          'Row numbers renumber per filter, so they are deliberately not stable — the',
          "detail screens' counters run within a group instead.",
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        phone: { name: 'Phone', styles: { width: '390px', height: '840px' } },
        desk: { name: 'Desktop (768+)', styles: { width: '1100px', height: '900px' } },
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WorkScreen>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The index as it loads: "All" selected, utilities collapsed behind their
 * preview line. Try the chips and the collapse — both work here.
 */
export const Default: Story = {}

/**
 * From 768 up the rows become four columns under real column heads, and the
 * filter chips move up beside the heading.
 */
export const Desktop: Story = {
  globals: { viewport: { value: 'desk' } },
}

/** Below 768 each row is a stack and the column heads are hidden. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
}
