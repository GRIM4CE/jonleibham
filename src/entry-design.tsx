import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  AvailabilityPill,
  Button,
  Icon,
  LabeledNote,
  Tabs,
  Tag,
  toneClass,
  tones,
  Wordmark,
} from './design-system'
import type { IconName } from './design-system'
import { Section } from './designCardChrome'

/**
 * A card in the Claude Design pane.
 *
 * Everything the pane displays comes from the `@dsCard` marker that
 * `scripts/build-design-bundle.mjs` writes on line 1 of each file — the app
 * compiles `_ds_manifest.json` from those markers, so a field missing here is
 * a field missing in the pane.
 */
export interface DesignCard {
  /** Written to design-bundle/cards/<slug>.html. Must be unique. */
  slug: string
  /** Component directory name, or the foundation's name. */
  name: string
  /** Section label in the Design System pane. */
  group: string
  subtitle?: string
  /** Serialized into the marker as a `WxH` string. */
  viewport: { width: number; height?: number }
  render: () => ReactElement
}

const ICON_NAMES: IconName[] = [
  'home',
  'layoutGrid',
  'briefcase',
  'user',
  'search',
  'arrowLeft',
  'arrowUpRight',
  'chevronRight',
  'download',
  'share',
  'graduationCap',
  'linkedin',
  'github',
]

export const cards: DesignCard[] = [
  {
    slug: 'colors',
    name: 'Colors',
    group: 'Foundations',
    subtitle: 'Ten source tones, applied through the bg slot',
    viewport: { width: 900, height: 300 },
    render: () => (
      <div className="dsc-swatches">
        {tones.map((tone) => (
          <div key={tone} className="dsc-swatch">
            <div className={`dsc-chip ${toneClass('bg', tone)}`} />
            <span className="dsc-name">{tone}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    slug: 'button',
    name: 'Button',
    group: 'Components',
    subtitle: 'Solid / outline / ghost / icon, four sizes',
    viewport: { width: 720, height: 410 },
    render: () => (
      <>
        <Section label="Variants">
          <Button size="lg">Solid</Button>
          <Button size="lg" variant="outline">
            Outline
          </Button>
          <Button size="lg" variant="ghost">
            Ghost
          </Button>
          <Button size="md" variant="icon" aria-label="Back">
            <Icon name="arrowLeft" size={18} />
          </Button>
        </Section>
        <Section label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra large</Button>
        </Section>
        <Section label="With an icon, and block">
          <div className="dsc-pane">
            <Button size="xl" block>
              See the work
              <Icon name="arrowUpRight" size={17} />
            </Button>
          </div>
        </Section>
      </>
    ),
  },
  {
    slug: 'tag',
    name: 'Tag',
    group: 'Components',
    subtitle: 'Neutral / cloud / data, two sizes',
    viewport: { width: 640, height: 230 },
    render: () => (
      <>
        <Section label="Variants">
          <Tag variant="neutral">TypeScript</Tag>
          <Tag variant="cloud">AWS Amplify</Tag>
          <Tag variant="data">Turso</Tag>
        </Section>
        <Section label="Sizes">
          <Tag size="sm">Small</Tag>
          <Tag size="md">Medium</Tag>
        </Section>
      </>
    ),
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'Components',
    subtitle: 'Chips and underline, backed by a radio group rather than script',
    viewport: { width: 720, height: 240 },
    render: () => (
      <>
        <Section label="Chips">
          <Tabs
            name="ds-card-chips"
            items={['All', 'Web', 'AI', 'Utilities']}
            active="All"
            label="Filter work by category"
            variant="chips"
          />
        </Section>
        <Section label="Underline">
          <Tabs
            name="ds-card-underline"
            items={['Frontend', 'Backend', 'Tooling']}
            active="Frontend"
            label="Choose a part of the stack"
            variant="underline"
          />
        </Section>
      </>
    ),
  },
  {
    slug: 'wordmark',
    name: 'Wordmark',
    group: 'Brand',
    subtitle: 'Name alone, and name over a role line',
    viewport: { width: 520, height: 190 },
    render: () => (
      <div className="dsc-col">
        <Wordmark name="Jon Leibham" />
        <Wordmark name="Jon Leibham" title="Senior Software Engineer" />
      </div>
    ),
  },
  {
    slug: 'availability-pill',
    name: 'AvailabilityPill',
    group: 'Components',
    subtitle: 'Status dot and label',
    viewport: { width: 520, height: 170 },
    render: () => (
      <div className="dsc-col">
        <AvailabilityPill>Open to roles</AvailabilityPill>
        <AvailabilityPill>Available from March 2027</AvailabilityPill>
      </div>
    ),
  },
  {
    slug: 'labeled-note',
    name: 'LabeledNote',
    group: 'Components',
    subtitle: 'A small label and a line of text',
    viewport: { width: 640, height: 220 },
    render: () => (
      <div className="dsc-col">
        <LabeledNote label="Now">Building a design system for four apps to share.</LabeledNote>
        <LabeledNote label="Why">Frontend that holds up under real traffic.</LabeledNote>
        <LabeledNote label={<>Off&nbsp;clock</>}>
          Bouldering, and a stubborn sourdough starter.
        </LabeledNote>
      </div>
    ),
  },
  {
    slug: 'icon',
    name: 'Icon',
    group: 'Components',
    subtitle: 'The full inlined Lucide set plus two brand marks',
    viewport: { width: 720, height: 150 },
    render: () => (
      <Section label="All icons">
        {ICON_NAMES.map((name) => (
          <Icon key={name} name={name} size={24} />
        ))}
      </Section>
    ),
  },
]

/** Called by scripts/build-design-bundle.mjs. */
export function renderCard(card: DesignCard): string {
  return renderToStaticMarkup(card.render())
}
