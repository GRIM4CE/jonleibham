import { Link } from '../../design-system'
import styles from './Footer.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()
  // Obfuscated at runtime to keep the address away from naive scrapers.
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
            aria-label="Email Jon Leibham"
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
