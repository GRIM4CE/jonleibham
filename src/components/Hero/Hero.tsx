import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Hi, I'm <span className={styles.name}>Jon Leibham</span>
        </h1>
        <p className={styles.subtitle}>
          Senior Software Engineer
        </p>
        <div className={styles.cta}>
          <a href="#projects" className={styles.primaryBtn}>View My Work</a>
          <a href="#contact" className={styles.secondaryBtn}>Get In Touch</a>
        </div>
      </div>
    </section>
  )
}
