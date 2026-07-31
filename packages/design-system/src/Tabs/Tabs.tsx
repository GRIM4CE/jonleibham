import { Fragment } from 'react'
import styles from './Tabs.module.css'

export interface TabsProps {
  /**
   * Radio group name. Must be unique within the page — it is what the
   * consuming stylesheet keys its `:has()` rules off, and what keeps two tab
   * bars on the same page from sharing a selection.
   */
  name: string
  items: string[]
  /** Item selected on load. */
  active: string
  /** Accessible name for the group. */
  label: string
  /** Optional map from item value to display text. */
  renderLabel?: (item: string) => string
  align?: 'left' | 'center'
  /**
   * `chips` is the gold-filled filter row on Work; `underline` is the
   * segmented stack selector on About.
   */
  variant?: TabsVariant
}

export type TabsVariant = 'chips' | 'underline'

/**
 * A tab bar with no JavaScript behind it.
 *
 * The site prerenders to static HTML and ships no client bundle, so selection
 * state lives in a native radio group rather than in React. Each item renders a
 * visually hidden `<input type="radio">` plus a `<label>` styled as the tab;
 * clicking the label checks the input, and the consuming component's stylesheet
 * reveals the matching content with `:has(input[value="…"]:checked)`.
 *
 * Because CSS cannot compare one attribute value against another, each item
 * needs its own rule in the consumer's stylesheet. See `WorkScreen.module.css`
 * and `AboutScreen.module.css`.
 */
export function Tabs({
  name,
  items,
  active,
  label,
  renderLabel,
  align = 'left',
  variant = 'underline',
}: TabsProps) {
  const className = [
    styles.tabs,
    styles[`variant-${variant}`],
    align === 'center' ? styles.center : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <fieldset className={className}>
      <legend className={styles.legend}>{label}</legend>
      {items.map((item) => {
        const id = `${name}-${slugify(item)}`
        return (
          <Fragment key={item}>
            <input
              type="radio"
              className={styles.input}
              id={id}
              name={name}
              value={item}
              defaultChecked={item === active}
            />
            <label className={styles.tab} htmlFor={id}>
              {renderLabel ? renderLabel(item) : item}
            </label>
          </Fragment>
        )
      })}
    </fieldset>
  )
}

/** Turns an item value into an id-safe token. Only used for input/label pairing. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
