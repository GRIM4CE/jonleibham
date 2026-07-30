import styles from './Wordmark.module.css'

export interface WordmarkProps {
  name: string
  /** The role line beneath. Rail only — Home shows the name alone. */
  title?: string
  className?: string
}

/**
 * The name, optionally over a role line.
 *
 * Home shows it in the brand row below 768 at 17px; the rail shows it with the
 * title from 768 up at 20px. Those two declarations — and the letter-spacing
 * that goes with them — stay on the screens' own `.wordmark` classes and
 * inherit down, so the name span deliberately sets neither.
 */
export function Wordmark({ name, title, className = '' }: WordmarkProps) {
  return (
    <span className={[styles.wordmark, className].filter(Boolean).join(' ')}>
      <span className={styles.name}>{name}</span>
      {title && <span className={styles.title}>{title}</span>}
    </span>
  )
}
