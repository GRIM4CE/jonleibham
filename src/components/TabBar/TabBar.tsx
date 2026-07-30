import { Icon, type IconName } from '../../design-system'
import styles from './TabBar.module.css'

interface Destination {
  id: string
  label: string
  icon: IconName
}

/**
 * Contact is deliberately not a tab. It lives as the secondary action on Home
 * and the primary action on About, which is two screens out of four.
 */
const destinations: Destination[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'work', label: 'Work', icon: 'layoutGrid' },
  { id: 'career', label: 'Career', icon: 'briefcase' },
  { id: 'about', label: 'About', icon: 'user' },
]

/**
 * Persistent bottom navigation.
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
      {destinations.map((destination) => (
        <a
          key={destination.id}
          className={styles.tab}
          href={`#${destination.id}`}
          data-tab={destination.id}
          aria-current={destination.id === 'home' ? 'page' : undefined}
        >
          <Icon name={destination.icon} size={22} />
          <span className={styles.label}>{destination.label}</span>
        </a>
      ))}
    </nav>
  )
}
