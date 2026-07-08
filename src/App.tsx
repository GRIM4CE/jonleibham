import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Footer } from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
      </main>
      <Footer />
    </>
  )
}

export default App
