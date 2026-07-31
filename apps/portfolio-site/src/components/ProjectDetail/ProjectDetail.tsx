import { Button, Icon, Tag, tagVariantFor } from '@jonleibham/design-system'
import { categoryLabel, projects, statusOf, utilities, type Project } from '../../data/projects'
import styles from './ProjectDetail.module.css'

interface ProjectDetailProps {
  project: Project
  /** Position within its own group, for the "03 OF 07" counter. */
  position: number
  total: number
}

/**
 * The case for one project.
 *
 * Rendered once per item and revealed by `:target`, so each project has a real,
 * shareable URL (`/#p-recipe-book`) and the browser's back button returns to
 * the index — all without a client bundle.
 */
export function ProjectDetail({ project, position, total }: ProjectDetailProps) {
  const status = statusOf(project)
  const counter = `${pad(position)} of ${pad(total)}`

  return (
    <section
      id={`p-${project.id}`}
      className={styles.screen}
      data-detail=""
      aria-label={project.title}
    >
      <div className={styles.nav}>
        <Button as="a" href="#work" variant="icon" size="md" aria-label="Back to selected work">
          <Icon name="arrowLeft" size={18} />
        </Button>
        <span className={styles.counter}>{counter}</span>
        {/*
         * Sharing a project means sharing its URL, and the page has no script to
         * call navigator.share, so this is a link to the project's own address.
         */}
        <Button
          as="a"
          href={`#p-${project.id}`}
          variant="icon"
          size="md"
          aria-label={`Link to ${project.title}`}
        >
          <Icon name="share" size={17} />
        </Button>
      </div>

      <div className={styles.head}>
        <span className={styles.category}>{categoryLabel(project)}</span>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.standfirst}>{project.standfirst}</p>
      </div>

      {/*
       * The hero well. Fixed height and flex:none — with no intrinsic content it
       * is the one child that would otherwise absorb the screen's overflow and
       * silently compress.
       */}
      <div className={styles.hero} aria-hidden="true" />

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>Role</dt>
          <dd className={styles.factValue}>{project.role}</dd>
        </div>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>Shipped</dt>
          <dd className={styles.factValue}>{project.shipped}</dd>
        </div>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>Status</dt>
          <dd className={`${styles.factValue} ${status.live ? styles.live : ''}`}>
            {status.label}
          </dd>
        </div>
      </dl>

      <div className={styles.body}>
        <h2 className={styles.bodyLabel}>What I built</h2>
        <p className={styles.bodyText}>{project.body}</p>
        <div className={styles.chips}>
          {project.stack.map((tech) => (
            <Tag key={tech} variant={tagVariantFor(tech)} size="sm">
              {tech}
            </Tag>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        {project.links.live && (
          <Button as="a" href={project.links.live} size="lg" block target="_blank" rel="noopener noreferrer">
            Live site
          </Button>
        )}
        {project.links.source && (
          <Button
            as="a"
            href={project.links.source}
            variant="outline"
            size="lg"
            block
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </Button>
        )}
        {!project.links.live && !project.links.source && (
          <p className={styles.privateNote}>Private build. Happy to walk through it.</p>
        )}
      </div>
    </section>
  )
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/**
 * Every item in the index gets a detail screen.
 *
 * The counter runs within a group — "03 of 07" across the projects, "01 of 05"
 * across the utilities — so it lines up with what the Work screen claims in its
 * meta line and its collapse label. Index row numbers deliberately renumber per
 * filter, so they are not stable enough to count against.
 */
export function ProjectDetails() {
  return (
    <>
      {projects.map((project, index) => (
        <ProjectDetail
          key={project.id}
          project={project}
          position={index + 1}
          total={projects.length}
        />
      ))}
      {utilities.map((utility, index) => (
        <ProjectDetail
          key={utility.id}
          project={utility}
          position={index + 1}
          total={utilities.length}
        />
      ))}
    </>
  )
}
