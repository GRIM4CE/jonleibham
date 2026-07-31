import { Button, Icon } from '@jonleibham/design-system'
import { education, roles, type Role } from '../../data/career'
import { profile } from '../../data/profile'
import styles from './CareerScreen.module.css'

/**
 * One role on the timeline: the desktop date gutter, the rail that carries the
 * chronology, and the entry body.
 *
 * `isLast` is not cosmetic — it decides whether a connecting line is drawn
 * below the dot at all, so the timeline stops rather than trailing off.
 *
 * Both the gutter and the rail are `aria-hidden`. The dates they show are
 * repeated in prose inside the body at every width, so announcing them here
 * would say every year twice.
 */
export function CareerEntry({ role, isLast }: { role: Role; isLast: boolean }) {
  return (
    <li className={styles.entry}>
      {/*
       * The desktop gutter. Hidden below 768, where the same dates read off the
       * mono line under the company instead.
       *
       * Roles that carry a tenure badge put their range on top and the tenure
       * beneath; Freelance has only the range, in `badge`.
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
            isLast ? styles.dotLast : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
        {!isLast && <i className={`${styles.line} ${role.current ? styles.lineCurrent : ''}`} />}
      </span>

      <div className={styles.entryBody}>
        <div className={styles.entryHead}>
          <h3 className={role.muted ? styles.companyMuted : styles.company}>{role.company}</h3>
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
  )
}

/**
 * The degree, under a filled gold cap. Fixed content from `data/career.ts` —
 * there is only ever one of these, so it takes no props.
 */
export function EducationCard() {
  return (
    <div className={styles.education}>
      <span className={styles.educationIcon} aria-hidden="true">
        <Icon name="graduationCap" size={19} />
      </span>
      <div>
        <p className={styles.degree}>{education.degree}</p>
        <p className={styles.school}>{education.school}</p>
      </div>
    </div>
  )
}

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
          <CareerEntry key={role.company} role={role} isLast={index === lastIndex} />
        ))}
      </ol>

      {/*
       * Holds only the degree. A "why" line used to sit beside it across a
       * rule, which is why the card styling is on this wrapper rather than on
       * EducationCard itself.
       */}
      <div className={styles.foot}>
        <EducationCard />
      </div>
    </section>
  )
}
