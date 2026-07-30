import { Button, Icon } from '../../design-system'
import { metrics, profile } from '../../data/profile'
import styles from './HomeScreen.module.css'

/**
 * Who Jon is, three numbers that prove it, and two ways to act — the twenty
 * second read a hiring manager gives a portfolio.
 */
export function HomeScreen() {
  return (
    <section id="home" data-screen="home" className={styles.screen} aria-label="Home">
      <header className={styles.brandRow}>
        <span className={styles.wordmark}>{profile.name}</span>
        <span className={styles.availability}>
          <i className={styles.dot} aria-hidden="true" />
          <span className={styles.availabilityLabel}>{profile.availability}</span>
        </span>
      </header>

      <div className={styles.hero}>
        <h1 className={styles.title}>
          {profile.firstName}
          <br />
          {profile.lastName}
        </h1>
        <p className={styles.role}>{profile.title}</p>
        <p className={styles.location}>{profile.location}</p>
        <p className={styles.positioning}>{profile.positioning}</p>
      </div>

      <ul className={styles.employers}>
        {profile.employers.map((employer, index) => (
          <li key={employer} className={styles.employer}>
            {index > 0 && <i className={styles.separator} aria-hidden="true" />}
            {employer}
          </li>
        ))}
      </ul>

      {/* dt precedes dd so the list stays valid; the strip shows the number
          above its label via column-reverse. */}
      <dl className={styles.metrics}>
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.metric}>
            <dt className={styles.metricLabel}>{metric.label}</dt>
            <dd className={styles.metricValue}>
              {metric.value}
              <span className={styles.metricUnit}>{metric.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.actions}>
        <Button as="a" href="#work" size="xl" block>
          See the work
          <Icon name="arrowUpRight" size={17} />
        </Button>
        <Button as="a" href={profile.links.email} variant="outline" size="xl" block>
          Get in touch
        </Button>
      </div>

      <p className={styles.now}>
        <span className={styles.nowLabel}>Now</span>
        <span className={styles.nowText}>{profile.now}</span>
      </p>
    </section>
  )
}
