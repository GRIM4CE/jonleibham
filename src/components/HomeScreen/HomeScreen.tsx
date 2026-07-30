import { AvailabilityPill, Button, Icon, LabeledNote, Wordmark } from '../../design-system'
import { metrics, profile } from '../../data/profile'
import { projects } from '../../data/projects'
import styles from './HomeScreen.module.css'

/**
 * The featured project, which is also what the Work index puts first. Taken
 * from the data rather than named here, so promoting a different project moves
 * this card with it.
 */
const latest = projects.find((project) => project.featured) ?? projects[0]

/**
 * Who Jon is, three numbers that prove it, and two ways to act — the twenty
 * second read a hiring manager gives a portfolio.
 */
export function HomeScreen() {
  return (
    <section id="home" data-screen="home" className={styles.screen} aria-label="Home">
      <header className={styles.brandRow}>
        <Wordmark name={profile.name} className={styles.wordmark} />
        <AvailabilityPill className={styles.availability}>{profile.availability}</AvailabilityPill>
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

      {/*
       * Desktop only. The mobile screen has no room for it and reaches the
       * same project through the Work tab; here the column is tall enough that
       * the space below the actions would otherwise just be empty.
       */}
      <a className={styles.latest} href={`#p-${latest.id}`}>
        <span className={styles.latestMeta}>
          <span className={styles.latestLabel}>Latest</span>
          <span className={styles.latestDate}>{latest.shipped}</span>
        </span>
        <span className={styles.latestBody}>
          <span className={styles.latestTitle}>{latest.title}</span>
          <span className={styles.latestBlurb}>{latest.blurb}</span>
        </span>
        <Icon name="chevronRight" size={18} className={styles.latestChevron} />
      </a>

      <LabeledNote label="Now" className={styles.now}>
        {profile.now}
      </LabeledNote>
    </section>
  )
}
