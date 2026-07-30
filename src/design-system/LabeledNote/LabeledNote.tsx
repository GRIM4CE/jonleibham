import type { ReactNode } from 'react'
import styles from './LabeledNote.module.css'

export interface LabeledNoteProps {
  /**
   * The small leading label — "Now", "Why", "Off clock". `ReactNode` so a
   * caller can pass text containing a non-breaking space.
   */
  label: ReactNode
  children: ReactNode
  /**
   * The call site's own positioning class. Never omit it at a call site that
   * had one: margins, padding and borders stay in the screen module.
   */
  className?: string
}

/**
 * A small label followed by a line of text.
 *
 * Home's "Now", Career's "Why" and About's "Off clock" share this shape at
 * mobile widths — the label and text rules were byte-identical across all
 * three — but they diverge above 768: Career drops the label entirely and
 * recolors its text, and the three settle on different type sizes.
 *
 * So this owns the mobile base and nothing else. `data-note-label` and
 * `data-note-text` are the hooks screens override those parts through, the
 * same cross-module device `data-screen` and `data-tab` use — a screen module
 * cannot reach a class scoped to this one.
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
