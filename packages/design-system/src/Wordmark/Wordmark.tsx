import styles from './Wordmark.module.css'

export interface WordmarkProps {
  /** The name. Renders at the inherited font size. */
  name: string
  /** An optional role line beneath, in 9px uppercase mono. */
  title?: string
  /** Where the name's `font-size` and `letter-spacing` come from. */
  className?: string
}

/**
 * A name, optionally over a role line.
 *
 * Sets no `font-size` or `letter-spacing` on the name — it inherits, so the
 * container decides the size and there is no `size` prop. Renders `<span>`s, so
 * wrap it in a heading if the page needs one.
 */
export function Wordmark({ name, title, className = '' }: WordmarkProps) {
  return (
    <span className={[styles.wordmark, className].filter(Boolean).join(' ')}>
      <span className={styles.name}>{name}</span>
      {title && <span className={styles.title}>{title}</span>}
    </span>
  )
}
