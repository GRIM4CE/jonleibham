import { Button, Icon } from '../../design-system'
import { education, roles } from '../../data/career'
import { profile } from '../../data/profile'
import styles from './CareerScreen.module.css'

/**
 * The scannable employment history. The rail on the left is the only thing
 * carrying chronology, so the current role's dot is solid gold and everything
 * before it is hollow.
 */
export function CareerScreen() {
  const lastIndex = roles.length - 1

  return (
    <section id="career" data-screen="career" className={styles.screen} aria-label="Career">
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Career</h2>
          <p className={styles.meta}>2015 to now · Frontend</p>
        </div>
        <Button
          as="a"
          href={profile.resume}
          variant="outline"
          size="sm"
          download
          aria-label="Download resume (PDF)"
        >
          Resume
          <Icon name="download" size={13} />
        </Button>
      </div>

      <ol className={styles.timeline}>
        {roles.map((role, index) => (
          <li key={role.company} className={styles.entry}>
            {/*
             * The desktop gutter. Hidden below 768, where the same dates read
             * off the mono line under the company instead — and `aria-hidden`
             * because that line is still in the document at every width, so
             * without it the years would be announced twice.
             *
             * Roles that carry a tenure badge put their range on top and the
             * tenure beneath; Freelance has only the range, in `badge`.
             */}
            <span className={styles.dates} aria-hidden="true">
              <span className={role.current ? styles.datesRangeCurrent : styles.datesRange}>
                {role.dates || role.badge}
              </span>
              {role.dates && <span className={styles.datesTenure}>{role.badge}</span>}
            </span>

            <span className={styles.rail} aria-hidden="true">
              <i
                className={[
                  styles.dot,
                  role.current ? styles.dotCurrent : styles.dotPast,
                  index === lastIndex ? styles.dotLast : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
              {index !== lastIndex && (
                <i className={`${styles.line} ${role.current ? styles.lineCurrent : ''}`} />
              )}
            </span>

            <div className={styles.entryBody}>
              <div className={styles.entryHead}>
                <h3 className={role.muted ? styles.companyMuted : styles.company}>
                  {role.company}
                </h3>
                <span className={role.current ? styles.badgeNow : styles.badge}>{role.badge}</span>
              </div>
              {role.title && (
                <p className={styles.role}>
                  {role.title}
                  {/* Folded away on desktop, where the gutter has the years. */}
                  <span className={styles.roleDates}> · {role.dates}</span>
                </p>
              )}
              {role.proofPoints.map((point) => (
                <p key={point} className={role.muted ? styles.proofMuted : styles.proof}>
                  {point}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {/*
       * Two stacked blocks on mobile — `display: contents` keeps them that way
       * — and a single pinned card on desktop, where the degree and the "why"
       * line share one tinted row separated by a rule.
       */}
      <div className={styles.foot}>
        <div className={styles.education}>
          <span className={styles.educationIcon} aria-hidden="true">
            <Icon name="graduationCap" size={19} />
          </span>
          <div>
            <p className={styles.degree}>{education.degree}</p>
            <p className={styles.school}>{education.school}</p>
          </div>
        </div>

        <p className={styles.footer}>
          <span className={styles.footerLabel}>Why</span>
          <span className={styles.footerText}>{profile.why}</span>
        </p>
      </div>
    </section>
  )
}
