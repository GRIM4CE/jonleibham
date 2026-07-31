import styles from './Wordmark.module.css'

export interface WordmarkProps {
  name: string
  /** The role line beneath. Omit it for the name alone. */
  title?: string
  className?: string
}

/**
 * The name, optionally over a role line.
 *
 * No screen in the portfolio renders it today — Home's hero says the name at
 * hero size and the rail no longer repeats it — so the component is kept for
 * the next app that needs a masthead. Size and letter-spacing stay on the call
 * site's own `.wordmark` class and inherit down, which is why the name span
 * deliberately sets neither.
 */
export function Wordmark({ name, title, className = '' }: WordmarkProps) {
  return (
    <span className={[styles.wordmark, className].filter(Boolean).join(' ')}>
      <span className={styles.name}>{name}</span>
      {title && <span className={styles.title}>{title}</span>}
    </span>
  )
}
