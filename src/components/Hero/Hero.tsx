import { Button } from '../../design-system'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Hi, I'm <span className={styles.name}>Jon Leibham</span>
        </h1>
        <p className={styles.subtitle}>Senior Software Engineer</p>
        <div className={styles.cta}>
          <Button as="a" href="#projects" variant="solid" tone="porcelain" textTone="dustyGrape" size="lg">
            View My Work
          </Button>
          <Button as="a" href="#contact" variant="outline" tone="porcelain" textTone="porcelain" size="lg">
            Get In Touch
          </Button>
        </div>
      </div>
    </section>
  )
}
