import { AvailabilityPill, Button, Icon, type IconName } from '@jonleibham/design-system'
import { profile } from '../../data/profile'
import styles from './TabBar.module.css'

interface Destination {
  id: string
  label: string
  icon: IconName
}

/**
 * Contact is deliberately not a tab. It lives as the secondary action on Home
 * and the primary action on About — and, from 768 up, in the rail's foot,
 * which is what finally makes it reachable from every screen.
 */
const destinations: Destination[] = [
  // The id stays `home`: it is the screen's element id, the URL hash and the
  // key every `:target` rule in App.module.css is written against. Only the
  // label the visitor reads says Overview.
  { id: 'home', label: 'Overview', icon: 'home' },
  { id: 'work', label: 'Work', icon: 'layoutGrid' },
  { id: 'career', label: 'Career', icon: 'briefcase' },
  { id: 'about', label: 'About', icon: 'user' },
]

/**
 * Primary navigation: a bottom tab bar on mobile, a left rail from 768 up.
 *
 * One component rather than two. A separate rail would put a second `nav`
 * landmark carrying the same links into the static HTML, and both would be
 * present on every screen — there is no JavaScript to choose between them. So
 * the rail furniture (availability pill, contact actions) lives here and is
 * simply hidden below 768.
 *
 * Each tab is a plain anchor to a screen's id — the whole routing story with no
 * JavaScript. Which tab reads as active is decided in App.module.css from the
 * `data-tab` attribute, since only the URL knows where we are.
 *
 * `aria-current` is set statically on Home: without a client bundle it cannot
 * follow the hash, and a wrong-but-changing value would be worse than an
 * honest one for the document's initial state.
 */
export function TabBar() {
  return (
    <nav className={styles.tabs} aria-label="Primary">
      {/* `display: contents` on mobile, so the four anchors stay the tab bar's
          own grid cells; a real flex column once it becomes the rail. */}
      <div className={styles.destinations}>
        {destinations.map((destination) => (
          <a
            key={destination.id}
            className={styles.tab}
            href={`#${destination.id}`}
            data-tab={destination.id}
            aria-current={destination.id === 'home' ? 'page' : undefined}
          >
            <Icon name={destination.icon} size={22} className={styles.icon} />
            <span className={styles.label}>{destination.label}</span>
          </a>
        ))}

        {/* Not a screen — the design system's own Storybook, on its own
            domain. It rides with the destinations rather than sitting in the
            rail's foot, which is where the other outbound links live: the foot
            only exists from 1024 up, and this has to be reachable from the
            phone tab bar too. No `data-tab`, so it never reads as active. */}
        <a
          className={styles.tab}
          href={profile.links.storybook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Storybook (opens in a new tab)"
        >
          <Icon name="storybook" size={20} className={styles.icon} />
          <span className={styles.label}>Storybook</span>
        </a>
      </div>

      {/* Rail only, pinned to the bottom edge. */}
      <div className={styles.foot}>
        <AvailabilityPill className={styles.availability}>{profile.availability}</AvailabilityPill>
        <div className={styles.contact}>
          <Button
            as="a"
            href={profile.links.email}
            variant="outline"
            size="md"
            className={styles.contactAction}
          >
            Email
          </Button>
          <Button
            as="a"
            href={profile.links.linkedin}
            variant="icon"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
            className={styles.contactAction}
          >
            <Icon name="linkedin" size={17} />
          </Button>
          <Button
            as="a"
            href={profile.links.github}
            variant="icon"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            className={styles.contactAction}
          >
            <Icon name="github" size={17} />
          </Button>
        </div>
      </div>
    </nav>
  )
}
