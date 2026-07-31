import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectDetail } from './ProjectDetail'
import { findWork, projects, utilities } from '../../data/projects'

const meta = {
  title: 'Screens/ProjectDetail',
  component: ProjectDetail,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'The case for one project.',
          '',
          'One of these is rendered for every item in the index, all into the same',
          'document, and `:target` reveals whichever the URL names. That is what gives',
          'each project a real, shareable address (`/#p-recipe-book`) and makes the',
          "browser's back button return to the index — with no client bundle.",
          '',
          '**The links do not navigate here.** Back, share and the tab bar all point at',
          'hashes that `App.module.css` resolves, and those rules are not in Storybook.',
          'Clicking them in isolation does nothing. That is the isolation, not a bug.',
          '',
          'The three facts and the action row are all data-driven: a project with',
          'neither a live nor a source link renders a standing note instead of buttons.',
          'See the `PrivateBuild` story.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    project: {
      control: false,
      description:
        'The record to render, straight from `data/projects.ts`. Its `links`, ' +
        '`stack` and category all drive what appears.',
      table: { type: { summary: 'Project' } },
    },
    position: {
      control: { type: 'number', min: 1 },
      description:
        'Position **within its own group** — projects and utilities are counted ' +
        'separately, so this matches what the Work screen claims. Rendered ' +
        'zero-padded.',
      table: { type: { summary: 'number' } },
    },
    total: {
      control: { type: 'number', min: 1 },
      description: 'Size of that same group. The counter reads "03 of 07".',
      table: { type: { summary: 'number' } },
    },
  },
} satisfies Meta<typeof ProjectDetail>

export default meta
type Story = StoryObj<typeof meta>

/** A full record: both links present, so the action row shows both buttons. */
export const Default: Story = {
  args: {
    project: findWork('recipe-book')!,
    position: 1,
    total: projects.length,
  },
}

/**
 * `links: {}` — no live site and no source. The action row collapses to a note
 * rather than rendering an empty well.
 */
export const PrivateBuild: Story = {
  args: {
    project: findWork('stonk')!,
    position: 2,
    total: projects.length,
  },
}

/**
 * A utility. The counter runs within the utilities group — "01 of 05", not its
 * position across all twelve items.
 */
export const Utility: Story = {
  args: {
    project: findWork('transcribe')!,
    position: 1,
    total: utilities.length,
  },
}

/** The last item in its group, which is where the padded counter reads widest. */
export const LastInGroup: Story = {
  args: {
    project: projects[projects.length - 1],
    position: projects.length,
    total: projects.length,
  },
}
