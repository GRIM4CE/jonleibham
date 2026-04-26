import { LogoMark, Link } from '../../design-system'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <LogoMark text="Jon Leibham" accent="sunflowerGold" href="#" />
        <ul className={styles.navLinks}>
          <li>
            <Link href="#about" tone="midnightViolet" hoverTone="seaGreen" underline={false}>
              About
            </Link>
          </li>
          <li>
            <Link href="#projects" tone="midnightViolet" hoverTone="magentaBloom" underline={false}>
              Projects
            </Link>
          </li>
          <li>
            <Link href="#contact" tone="midnightViolet" hoverTone="grapefruitPink" underline={false}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
