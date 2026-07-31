import { Button, Icon, LabeledNote, Tabs, Tag } from '@jonleibham/design-system'
import { profile } from '../../data/profile'
import { STACK_GROUP, stackGroups } from '../../data/stack'
import styles from './AboutScreen.module.css'

/**
 * The person, the stack and the way to reach him. Contact is the primary
 * action here because it is not a tab.
 */
export function AboutScreen() {
  return (
    <section id="about" data-screen="about" className={styles.screen} aria-label="About">
      <div className={styles.portraitRow}>
        <img
          className={styles.portrait}
          src={profile.portrait.src}
          srcSet={profile.portrait.srcSet}
          alt={profile.portrait.alt}
          width={104}
          height={130}
        />
        <div className={styles.identity}>
          <h2 className={styles.name}>
            {profile.firstName}
            <br />
            {profile.lastName}
          </h2>
          <p className={styles.role}>{profile.titleShort}</p>
          <p className={styles.location}>{profile.locationShort}</p>
        </div>
      </div>

      <div className={styles.bio}>
        {profile.bio.map((paragraph, index) => (
          <p key={paragraph} className={index === 0 ? styles.bioLead : styles.bioBody}>
            {paragraph}
          </p>
        ))}
      </div>

      {/*
       * The stack selector is a radio group; the rules in AboutScreen.module.css
       * show the matching panel with `:has()`. No JavaScript, and the panels are
       * all in the markup so they are all indexable.
       */}
      <div className={styles.stack}>
        <h3 className={styles.stackLabel}>Stack</h3>
        <Tabs
          name={STACK_GROUP}
          items={stackGroups.map((group) => group.name)}
          active={stackGroups[0].name}
          label="Choose a part of the stack"
          variant="underline"
        />
        {/*
         * The panels share one grid cell rather than replacing each other, so
         * the well is always as tall as the longest group and switching tabs
         * moves nothing below it. That is why they hide with `visibility`
         * rather than `display` — a `display: none` panel would not contribute
         * its height, which is the whole point.
         */}
        <div className={styles.panels}>
          {stackGroups.map((group) => (
            <div key={group.name} className={styles.panel} data-stack={group.name}>
              {group.items.map((item) => (
                <Tag key={item} size="md">
                  {item}
                </Tag>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.foot}>
        <LabeledNote label={<>Off&nbsp;clock</>} className={styles.offClock}>
          {profile.offClock}
        </LabeledNote>
        <div className={styles.actions}>
          <Button as="a" href={profile.links.email} size="md" className={styles.email}>
            Email me
          </Button>
          <Button
            as="a"
            href={profile.links.linkedin}
            variant="icon"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
          >
            <Icon name="linkedin" size={19} />
          </Button>
          <Button
            as="a"
            href={profile.links.github}
            variant="icon"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <Icon name="github" size={19} />
          </Button>
        </div>
      </div>
    </section>
  )
}
