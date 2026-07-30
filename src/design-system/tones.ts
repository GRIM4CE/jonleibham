import type { Surface, Tone } from './tokens'
import styles from './tones.module.css'

/**
 * A CSS custom property a component colors itself with. Slots are shared across
 * the design system rather than namespaced per component, so one table of
 * classes in `tones.module.css` covers every component.
 */
export type ToneSlot = 'accent' | 'accent2' | 'bg' | 'text' | 'hover'

/**
 * Class that sets the given slot to the given tone. Use this instead of an
 * inline `style` attribute — the deployed CSP (`style-src 'self'`) drops style
 * attributes, so anything set that way never reaches the rendered page.
 */
export function toneClass(slot: ToneSlot, tone: Tone): string {
  return styles[`${slot}-${tone}`]
}

/** Class that sets `--ds-bg` from the Surface scale. */
export function surfaceClass(surface: Surface): string {
  return styles[`surface-${surface}`]
}

/** Every class the module defines, for the coverage test. */
export const toneClassNames: Record<string, string> = styles
