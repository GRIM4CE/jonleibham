import { Icon, Tabs } from '../../design-system'
import { WORK_FILTER_GROUP, filters, projects, utilities, type Project } from '../../data/projects'
import styles from './WorkScreen.module.css'

/**
 * A row in the index. The displayed number is not in the markup: it comes from
 * a CSS counter, so hiding rows with a filter renumbers what is left to stay
 * sequential (01, 02, 03) instead of leaving gaps.
 *
 * `data-cat` is what the filter rules in WorkScreen.module.css match on.
 */
function IndexRow({ project }: { project: Project }) {
  const className = [
    styles.row,
    styles[`accent-${project.accent}`],
    project.featured ? styles.featured : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={styles.rowItem} data-cat={project.categories.join(' ')}>
      <a className={className} href={`#p-${project.id}`}>
        <span className={styles.spine} aria-hidden="true">
          <span className={styles.index} />
          <i className={styles.bar} />
        </span>
        <div className={styles.content}>
          <div className={styles.head}>
            <h3 className={styles.rowTitle}>{project.title}</h3>
            <span className={styles.year}>{project.year}</span>
          </div>
          <p className={styles.blurb}>{project.blurb}</p>
          <p className={styles.stackLine}>{project.stackLine.join(' · ')}</p>
        </div>
      </a>
    </li>
  )
}

/**
 * The reason the redesign exists: the old card grid gave every project
 * identical weight. Here the work is ranked, numbered and filterable, with the
 * featured project carrying a flat gold tint.
 */
export function WorkScreen() {
  const years = [...projects, ...utilities].map((item) => Number(item.year))
  const span = `${Math.min(...years)} to ${Math.max(...years)}`

  return (
    <section id="work" data-screen="work" className={styles.screen} aria-label="Selected work">
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading}>Selected work</h2>
          <Icon name="search" size={21} className={styles.search} />
        </div>
        <p className={styles.meta}>
          {projects.length} projects · {span}
        </p>
      </div>

      {/*
       * Everything below reacts to the checked radio in this group. The filter
       * scope has to wrap both the chips and the rows for the `:has()` rules to
       * see the selection.
       */}
      <div className={styles.filterScope}>
        <div className={styles.filters}>
          <Tabs
            name={WORK_FILTER_GROUP}
            items={[...filters]}
            active="All"
            label="Filter work by category"
            variant="chips"
          />
        </div>

        <div className={styles.counterScope}>
          <ul className={styles.rows}>
            {projects.map((project) => (
              <IndexRow key={project.id} project={project} />
            ))}
          </ul>

          {/*
           * The utilities collapse. A checkbox rather than <details> because the
           * filters need to be able to force it open — selecting "Utilities" or
           * "AI" reveals these rows regardless of the toggle, which CSS cannot
           * do to a <details> element's open state.
           */}
          <div className={styles.collapse}>
            <input
              type="checkbox"
              id="utilities-toggle"
              className={styles.toggle}
              aria-controls="utility-rows"
            />
            <label className={styles.collapseHeader} htmlFor="utilities-toggle">
              <span className={styles.collapseLabel}>{utilities.length} more utilities</span>
              <Icon name="chevronRight" size={18} className={styles.chevron} />
            </label>

            {/* The preview shown while the collapse is shut. */}
            <div className={styles.summary} aria-hidden="true">
              <span className={styles.summaryLine}>
                {utilities
                  .slice(0, 3)
                  .map((utility) => utility.title)
                  .join(' · ')}
              </span>
              <span className={styles.summaryLine}>
                {utilities
                  .slice(3)
                  .map((utility) => utility.title)
                  .join(' · ')}
              </span>
            </div>

            <ul className={styles.utilityRows} id="utility-rows">
              {utilities.map((utility) => (
                <IndexRow key={utility.id} project={utility} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
