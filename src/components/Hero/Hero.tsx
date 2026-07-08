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
        <p className={styles.tagline}>
          I build fast, accessible, polished web interfaces with Vue, React, and
          TypeScript, from design systems and component libraries to complete,
          AI-native production apps I ship end to end.
        </p>
        <div className={styles.cta}>
          <Button as="a" href="#projects" variant="solid" tone="porcelain" textTone="dustyGrape" size="lg">
            View My Work
          </Button>
          <Button
            as="a"
            href="https://www.linkedin.com/in/jonleibham/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect on LinkedIn (opens in a new tab)"
            variant="outline"
            tone="porcelain"
            textTone="dustyGrape"
            size="lg"
          >
            Connect on LinkedIn
          </Button>
        </div>
      </div>
    </section>
  )
}
