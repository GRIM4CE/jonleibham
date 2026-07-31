import type { Meta, StoryObj } from '@storybook/react-vite'
import { TabBar } from './TabBar'

const meta = {
  title: 'Components/TabBar',
  component: TabBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Primary navigation, in three states: a bottom tab bar on a phone, a narrow',
          'icon-only rail from 768, and a full rail with labels and contact actions from',
          '1024.',
          '',
          '| Width | Layout | Labels | Foot |',
          '| --- | --- | --- | --- |',
          '| `< 768` | bottom tab bar | visible | hidden |',
          '| `768–1023` | 72px icon rail | hidden (still in the a11y tree) | hidden |',
          '| `≥ 1024` | full rail | restored | visible |',
          '',
          '**One component, not three.** A separate rail would put a second `nav` landmark',
          'carrying the same links into the static HTML, and both would ship on every',
          'screen — there is no JavaScript to choose between them. So the rail furniture',
          '(availability pill, contact actions) lives here and is hidden until 1024.',
          '',
          'In the middle band the label is clipped rather than removed, so the rail stays',
          'icon-only visually while screen readers still announce each destination.',
          '',
          'Each tab is a plain anchor to a screen id. Which one reads as active is decided',
          'in `App.module.css` from the `data-tab` attribute, since only the URL knows',
          'where we are — **so nothing highlights on click here.** `aria-current` is set',
          'statically on Overview: with no client bundle it cannot follow the hash, and a',
          'wrong-but-changing value would be worse than an honest fixed one.',
          '',
          'Contact is deliberately not a tab — it is the secondary action on Overview and',
          "the primary action on About. The Storybook link is outbound and carries no",
          '`data-tab`, so it never reads as active.',
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        phone: { name: 'Phone (<768)', styles: { width: '390px', height: '760px' } },
        railIcons: { name: 'Icon rail (768)', styles: { width: '900px', height: '760px' } },
        railFull: { name: 'Full rail (1024+)', styles: { width: '1200px', height: '820px' } },
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabBar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Below 768: four destinations plus the outbound Storybook link, pinned to the
 * bottom edge with their labels. The foot is hidden here.
 */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
}

/**
 * 768 to 1023 — the awkward middle. The bar becomes a 72px rail with room for
 * glyphs but not text, so the labels are clipped out. They stay in the document
 * for assistive tech, and the foot is still hidden.
 */
export const IconRail: Story = {
  globals: { viewport: { value: 'railIcons' } },
}

/**
 * From 1024 the rail earns its width: labels come back, and the foot appears
 * with the availability pill, an email button and the two profile links. This
 * is what finally makes contact reachable from every screen.
 */
export const FullRail: Story = {
  globals: { viewport: { value: 'railFull' } },
}
