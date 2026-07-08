import { LogoMark, Link } from '../../design-system'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <LogoMark text="Jon Leibham" accent="sunflowerGold" href="#" />
        <ul className={styles.navLinks}>
          <li>
            <Link href="#about" tone="midnightViolet" hoverTone="dustyGrape" underline={false}>
              About
            </Link>
          </li>
          <li>
            <Link href="#projects" tone="midnightViolet" hoverTone="dustyGrape" underline={false}>
              Projects
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
