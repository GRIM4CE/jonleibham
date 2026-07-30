import { AvailabilityPill, Button, Icon, type IconName } from '../../design-system'
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
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'work', label: 'Work', icon: 'layoutGrid' },
  { id: 'career', label: 'Career', icon: 'briefcase' },
  { id: 'about', label: 'About', icon: 'user' },
]

/**
 * Primary navigation: a bottom tab bar on mobile, a left rail from 768 up.
 *
 * One component rather than two. A separate rail would put a second `nav`
 * landmark carrying the same four links into the static HTML, and both would
 * be present on every screen — there is no JavaScript to choose between them.
 * So the rail furniture (wordmark, availability pill, contact actions) lives
 * here and is simply hidden below 768.
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
      {/* Rail only. Home carries the same name and pill in its brand row, so
          that row hides at this breakpoint rather than saying it twice. */}
      <div className={styles.brand}>
        <span className={styles.wordmark}>{profile.name}</span>
        <span className={styles.wordmarkTitle}>{profile.title}</span>
      </div>

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
