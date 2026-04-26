import { Link } from '../../design-system'
import styles from './Footer.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.social}>
          <Link
            href="https://github.com/GRIM4CE"
            target="_blank"
            tone="porcelain"
            hoverTone="sunflowerGold"
            underline={false}
            aria-label="GitHub"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/jonleibham/"
            target="_blank"
            tone="porcelain"
            hoverTone="seaGreen"
            underline={false}
            aria-label="LinkedIn"
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
