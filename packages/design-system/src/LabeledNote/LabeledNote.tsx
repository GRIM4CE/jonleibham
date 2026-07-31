import type { ReactNode } from 'react'
import styles from './LabeledNote.module.css'

export interface LabeledNoteProps {
  /**
   * The leading label — "Now", "Why". Rendered uppercase. A `ReactNode` rather
   * than a string so a two-word label can hold itself together with `&nbsp;`.
   */
  label: ReactNode
  /** The line of text the label introduces. */
  children: ReactNode
  /** All spacing — the component sets none, so it sits flush without one. */
  className?: string
}

/**
 * A short uppercase label and a line of text, as one `<p>`.
 *
 * For a single named aside. Use a `<dl>` once there is more than one pair.
 * Restyle the parts through `data-note-label` and `data-note-text` — a caller's
 * CSS module cannot reach a class scoped to this one.
 */
export function LabeledNote({ label, children, className = '' }: LabeledNoteProps) {
  return (
    <p className={[styles.note, className].filter(Boolean).join(' ')}>
      <span className={styles.label} data-note-label="">
        {label}
      </span>
      <span className={styles.text} data-note-text="">
        {children}
      </span>
    </p>
  )
}
