import { HomeScreen } from './components/HomeScreen'
import { WorkScreen } from './components/WorkScreen'
import { ProjectDetails } from './components/ProjectDetail'
import { CareerScreen } from './components/CareerScreen'
import { AboutScreen } from './components/AboutScreen'
import { TabBar } from './components/TabBar'
import styles from './App.module.css'

/**
 * Five screens plus a detail screen per project, all in one document.
 *
 * The site prerenders to static HTML with no client bundle, so which screen is
 * showing is decided by `:target` in App.module.css rather than by state. Every
 * screen therefore has a real URL and the browser's own history works.
 *
 * There is no skip link: the tab bar comes after the content in source order,
 * so there is no repeated block to skip past, and any anchor to a non-screen id
 * would knock `:target` back to Home.
 */
function App() {
  return (
    <div className={styles.app}>
      <main className={styles.viewport}>
        <HomeScreen />
        <WorkScreen />
        <ProjectDetails />
        <CareerScreen />
        <AboutScreen />
      </main>
      <TabBar />
    </div>
  )
}

export default App
