import { Link } from '../../design-system'
import styles from './Footer.module.css'

export function Footer() {
  // Both of these are evaluated during the prerender, not in the browser, so
  // the year is frozen at whatever the last deploy was — and the address is
  // plainly in the HTML. The split below no longer obfuscates anything; the
  // `mailto:` href always gave it away to anything that parses links anyway.
  const currentYear = new Date().getFullYear()
  const email = ['jleibham', 'gmail.com'].join('@')

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.cta}>
          Have a role or project in mind?{' '}
          <Link
            href={`mailto:${email}`}
            tone="sunflowerGold"
            hoverTone="porcelain"
            aria-label="Get in touch — email Jon Leibham"
          >
            Get in touch
          </Link>
          .
        </p>
        <div className={styles.social}>
          <Link
            href={`mailto:${email}`}
            target="_self"
            tone="porcelain"
            hoverTone="sunflowerGold"
            underline={false}
            aria-label="Email"
          >
            Email
          </Link>
          <Link
            href="https://github.com/GRIM4CE"
            target="_blank"
            tone="porcelain"
            hoverTone="sunflowerGold"
            underline={false}
            aria-label="GitHub (opens in a new tab)"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/jonleibham/"
            target="_blank"
            tone="porcelain"
            hoverTone="sunflowerGold"
            underline={false}
            aria-label="LinkedIn (opens in a new tab)"
          >
            LinkedIn
          </Link>
        </div>
        <p className={styles.copyright}>
          &copy; {currentYear} Jon Leibham. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
