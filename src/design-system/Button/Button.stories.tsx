import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Icon } from '../Icon'
import { tones } from '../tokens'

const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'ground', values: [{ name: 'ground', value: '#1a0f16' }] },
  },
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: tones },
    textTone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost', 'icon'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** The primary action: a gold pill at the Home screen's 56px height. */
export const Solid: Story = {
  args: { variant: 'solid', size: 'xl', children: 'See the work' },
}

export const WithIcon: Story = {
  args: {
    variant: 'solid',
    size: 'xl',
    children: (
      <>
        See the work
        <Icon name="arrowUpRight" size={17} />
      </>
    ),
  },
}

export const Outline: Story = {
  args: { variant: 'outline', size: 'xl', children: 'Get in touch' },
}

/** The Career screen's "Résumé" pill. */
export const Small: Story = {
  args: {
    variant: 'outline',
    size: 'sm',
    children: (
      <>
        Résumé
        <Icon name="download" size={13} />
      </>
    ),
  },
}

/** Circular icon buttons: 38px on the detail nav, 50px for the social marks. */
export const IconButtons: Story = {
  args: { variant: 'icon', size: 'md', children: <Icon name="arrowLeft" size={18} /> },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button {...args} aria-label="Back" />
      <Button variant="icon" size="md" aria-label="Share">
        <Icon name="share" size={17} />
      </Button>
      <Button variant="icon" size="lg" aria-label="GitHub">
        <Icon name="github" size={19} />
      </Button>
    </div>
  ),
}

/** Every size, stacked, so the 50/52/56 steps are comparable at a glance. */
export const Sizes: Story = {
  args: { children: 'Email me' },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
      <Button {...args} size="xl" />
    </div>
  ),
}
