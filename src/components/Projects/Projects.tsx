import { Section, SectionTitle, Card, Tag, Tabs, Link } from '../../design-system'
import {
  ALL_FILTER,
  PROJECT_FILTER_GROUP,
  UTILITY_FILTER_GROUP,
  cardAccent,
  projectFilters,
  projects,
  techFilterValue,
  tintFor,
  toneForTech,
  utilities,
  utilityFilters,
  type Project,
  type Utility,
} from './projects.data'
import styles from './Projects.module.css'

/**
 * Every card is always in the markup. The filter bars are radio groups and the
 * stylesheet hides the cards whose `data-tech` doesn't contain the checked
 * family, so filtering costs no JavaScript — see the `:has()` block in
 * Projects.module.css.
 */
function ItemCard({ item }: { item: Project | Utility }) {
  const screenshot = 'screenshot' in item ? item.screenshot : undefined
  const liveUrl = 'liveUrl' in item ? item.liveUrl : undefined

  return (
    <Card
      accent={cardAccent}
      accentSide="top"
      bg="porcelain"
      textTone="midnightViolet"
      data-tech={techFilterValue(item.technologies)}
      data-tint={tintFor(item.technologies)}
    >
      <div className={styles.accentRule} aria-hidden="true" />
      {screenshot && (
        <a
          href={liveUrl ?? item.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.title} screenshot (opens in a new tab)`}
        >
          <img src={screenshot} alt={`${item.title} screenshot`} className={styles.screenshot} />
        </a>
      )}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <span className={styles.built}>{item.built}</span>
        </div>
        <p className={styles.cardDescription}>{item.description}</p>
        <div className={styles.technologies}>
          {item.technologies.map((tech) => (
            <Tag key={tech} tone={toneForTech(tech, item.technologies)} variant="soft">
              {tech}
            </Tag>
          ))}
        </div>
        {(liveUrl || item.repoUrl) && (
          <div className={styles.links}>
            {liveUrl && (
              <Link
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} live site (opens in a new tab)`}
              >
                Live Site
              </Link>
            )}
            {item.repoUrl && (
              <Link
                href={item.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} source code (opens in a new tab)`}
              >
                Source Code
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

export function Projects() {
  return (
    <>
      <Section id="projects" surface="porcelain">
        <SectionTitle accent="sunflowerGold">My Projects</SectionTitle>
        {/* The filter radios and the grid need a shared ancestor for `:has()`. */}
        <div className={styles.filterScope}>
          <Tabs
            name={PROJECT_FILTER_GROUP}
            items={[ALL_FILTER, ...projectFilters]}
            active={ALL_FILTER}
            label="Filter projects by technology"
            align="center"
          />
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <ItemCard key={project.title} item={project} />
            ))}
          </div>
        </div>
      </Section>

      <Section id="utilities" surface="paleSlate90">
        <SectionTitle accent="sunflowerGold">Utilities</SectionTitle>
        <div className={styles.filterScope}>
          <Tabs
            name={UTILITY_FILTER_GROUP}
            items={[ALL_FILTER, ...utilityFilters]}
            active={ALL_FILTER}
            label="Filter utilities by technology"
            align="center"
          />
          <div className={styles.projectsGrid}>
            {utilities.map((utility) => (
              <ItemCard key={utility.title} item={utility} />
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
