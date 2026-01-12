import styles from './Footer.module.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.social}>
          <a target="_blank" href="https://github.com/GRIM4CE" className={styles.socialLink} aria-label="GitHub">
            GitHub
          </a>
          <a target="_blank" href="https://www.linkedin.com/in/jonleibham/" className={styles.socialLink} aria-label="LinkedIn">
            LinkedIn
          </a>
        </div>
        <p className={styles.copyright}>
          &copy; {currentYear} Jon Leibham. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
