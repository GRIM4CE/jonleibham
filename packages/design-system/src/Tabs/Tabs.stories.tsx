import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs } from './Tabs'
import styles from './Tabs.stories.module.css'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          'A tab bar with no JavaScript behind it.',
          '',
          'Selection lives in a native radio group, not in state — each item renders a',
          'visually hidden `<input type="radio">` and a `<label>` styled as the tab. The',
          'bar styles its own checked item; **revealing the matching content is the',
          "consumer's job**, in the consumer's stylesheet:",
          '',
          '```css',
          ".panel { display: none; }",
          ".wrapper:has(input[value='Stack']:checked) [data-panel='Stack'] { display: block; }",
          '```',
          '',
          'CSS cannot compare one attribute value against another, so every item needs',
          'its own rule. See the `Reveal` story, and `WorkScreen.module.css` /',
          '`AboutScreen.module.css` in the portfolio.',
          '',
          '`name` must be unique on the page — two bars sharing one name share one',
          'selection. Arrow keys move between items, and the focus ring is drawn on the',
          'label since the input itself is invisible.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description:
        'Radio group name, and the prefix for each input id. Must be unique within ' +
        'the page — it is what keeps two bars from sharing a selection, and what the ' +
        'consuming stylesheet keys its `:has()` rules off.',
      table: { type: { summary: 'string' } },
    },
    items: {
      control: 'object',
      description: 'The tab values, in order. Also the `value` each `:has()` rule matches.',
      table: { type: { summary: 'string[]' } },
    },
    active: {
      control: 'text',
      description:
        'The item checked on load. Must be one of `items`; nothing is selected if it ' +
        'is not.',
      table: { type: { summary: 'string' } },
    },
    label: {
      control: 'text',
      description:
        'Accessible name for the group. Rendered as a `<legend>` and hidden visually, ' +
        'so it can read as a full instruction.',
      table: { type: { summary: 'string' } },
    },
    variant: {
      control: 'inline-radio',
      options: ['chips', 'underline'],
      description:
        '`chips` is the gold-filled filter row on Work — it scrolls horizontally and ' +
        'bleeds to the gutters. `underline` is the segmented stack selector on About, ' +
        'sitting on a hairline.',
      table: {
        type: { summary: "'chips' | 'underline'" },
        defaultValue: { summary: 'underline' },
      },
    },
    align: {
      control: 'inline-radio',
      options: ['left', 'center'],
      description: 'Where the row sits in its container.',
      table: { type: { summary: "'left' | 'center'" }, defaultValue: { summary: 'left' } },
    },
    renderLabel: {
      control: false,
      description:
        'Maps an item to its display text. Use it when the value has to stay ' +
        'machine-shaped — a slug, a category key — while the tab reads in prose. The ' +
        '`:has()` rules still match the value, not the label.',
      table: { type: { summary: '(item: string) => string' } },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/*
 * Every story below needs its own `name`: autodocs renders them all on one page,
 * and two bars sharing a name share a radio group. The one unavoidable overlap is
 * the first story, which the docs page draws twice — once in the Primary block and
 * once in its own section. Those two copies do share a group, so they move
 * together. Same story, same args, so it reads as consistent rather than broken.
 */

/** The About stack selector: a hairline with the active tab's rule flush to it. */
export const Underline: Story = {
  args: {
    name: 'tabs-underline',
    items: ['Frontend', 'Backend', 'Tooling'],
    active: 'Frontend',
    label: 'Choose a part of the stack',
    variant: 'underline',
  },
}

/**
 * The Work filter row. The row scrolls rather than wraps, so a long set stays
 * one line on a phone.
 */
export const Chips: Story = {
  args: {
    name: 'tabs-chips',
    items: ['All', 'Web', 'AI', 'Utilities'],
    active: 'All',
    label: 'Filter work by category',
    variant: 'chips',
  },
}

/** `align="center"` for a bar that sits under a centered heading. */
export const Centered: Story = {
  args: {
    name: 'tabs-centered',
    items: ['All', 'Web', 'AI'],
    active: 'All',
    label: 'Filter work by category',
    variant: 'chips',
    align: 'center',
  },
}

/** Values stay slugs for the CSS to match; `renderLabel` supplies the prose. */
export const CustomLabels: Story = {
  args: {
    name: 'tabs-custom-labels',
    items: ['ai-ml', 'web-app', 'dev-tools'],
    active: 'ai-ml',
    label: 'Filter work by category',
    variant: 'chips',
    renderLabel: (item) =>
      ({ 'ai-ml': 'AI & ML', 'web-app': 'Web apps', 'dev-tools': 'Dev tools' })[item] ?? item,
  },
}

/**
 * The whole pattern, working. Click a tab and the panel below changes — with no
 * JavaScript on the page. The `:has()` rules doing it live in
 * `Tabs.stories.module.css`, which is the file a consumer writes.
 */
export const Reveal: Story = {
  args: {
    name: 'tabs-reveal',
    items: ['Overview', 'Stack', 'Notes'],
    active: 'Overview',
    label: 'Choose a section',
    variant: 'underline',
  },
  render: (args) => (
    <div className={styles.demo}>
      <Tabs {...args} />
      <p className={styles.panel} data-panel="Overview">
        The bar above carries no state. Each tab is a hidden radio input and a label;
        checking one is what the stylesheet reacts to.
      </p>
      <p className={styles.panel} data-panel="Stack">
        React 19 and TypeScript, compiled from source by each app&rsquo;s Vite. The
        rendered page ships no client bundle at all.
      </p>
      <p className={styles.panel} data-panel="Notes">
        Every panel needs its own rule. CSS cannot compare the checked value against
        this element&rsquo;s <code>data-panel</code>, so the pairing is written out.
      </p>
    </div>
  ),
}

/**
 * Two bars on one page, each with its own `name`. Give them the same `name` and
 * they merge into a single radio group — selecting in one clears the other.
 */
export const IndependentGroups: Story = {
  args: {
    name: 'tabs-independent-a',
    items: ['All', 'Web', 'AI'],
    active: 'All',
    label: 'Filter work by category',
    variant: 'chips',
  },
  render: (args) => (
    <div className={styles.demo}>
      <Tabs {...args} />
      <Tabs
        name="tabs-independent-b"
        items={['Frontend', 'Backend', 'Tooling']}
        active="Frontend"
        label="Choose a part of the stack"
        variant="underline"
      />
    </div>
  ),
}
