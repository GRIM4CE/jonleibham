import { useCallback } from 'react'
import styles from './Contact.module.css'

// Email is split into parts and assembled at runtime
// so bots scraping static HTML can't harvest it
const user = 'jon'
const domain = 'jonleibham.com'

export function Contact() {
  const handleClick = useCallback(() => {
    window.location.href = `mailto:${user}@${domain}`
  }, [])

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.container}>
        <h2 className={styles.title}>Get In Touch</h2>
        <p className={styles.subtitle}>
          Have a question or want to work together? Drop me a message!
        </p>
        <div className={styles.ctaWrapper}>
          <button type="button" className={styles.ctaBtn} onClick={handleClick}>
            Send Me an Email
          </button>
        </div>
      </div>
    </section>
  )
}
