import { Icon, Tabs } from '@jonleibham/design-system'
import { WORK_FILTER_GROUP, filters, projects, utilities, type Project } from '../../data/projects'
import styles from './WorkScreen.module.css'

/**
 * A row in the index. The displayed number is not in the markup: it comes from
 * a CSS counter, so hiding rows with a filter renumbers what is left to stay
 * sequential (01, 02, 03) instead of leaving gaps.
 *
 * `data-cat` is what the filter rules in WorkScreen.module.css match on.
 *
 * The row is one grid across both designs. Mobile sets the title and year on a
 * shared baseline with the blurb and stack line beneath; desktop spreads the
 * same five cells into No / Project / Stack / Year columns. That only works if
 * every cell is a direct child of the grid, so the two wrappers that group them
 * for reading order are `display: contents` — they exist for the markup's sake,
 * not the layout's.
 *
 * The stack appears twice because the two designs want different things from
 * it: one mono line on mobile, real chips in a column on desktop. Whichever is
 * not in play is `display: none` and so is out of the accessibility tree too —
 * exactly one of the two is ever read.
 */
export function IndexRow({ project }: { project: Project }) {
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
          <span className={styles.stackChips}>
            {project.stackLine.map((item) => (
              <span key={item} className={styles.stackChip}>
                {item}
              </span>
            ))}
          </span>
        </div>
      </a>
    </li>
  )
}

/**
 * The five utilities, behind a collapse.
 *
 * A checkbox rather than a `<details>`, because the filters have to be able to
 * force it open — selecting "Utilities" or "AI" reveals these rows regardless
 * of the toggle, and CSS cannot reach into a `<details>` element's open state.
 *
 * The summary lines are the preview shown while it is shut, and are
 * `aria-hidden`: the same titles are in the rows below at every state, so
 * without it each utility would be announced twice.
 */
export function UtilitiesCollapse() {
  return (
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
      {/*
       * Everything here reacts to the checked radio in this group. The filter
       * scope has to wrap both the chips and the rows for the `:has()` rules to
       * see the selection — which is why the heading sits inside it too: the
       * desktop design sets the chips beside the heading, and `.topRow` can
       * only pair them if both are already in scope.
       */}
      <div className={styles.filterScope}>
        {/* `display: contents` on mobile, a flex row from 768 up. */}
        <div className={styles.topRow}>
          <div className={styles.header}>
            <h2 className={styles.heading}>Selected work</h2>
            <p className={styles.meta}>
              {projects.length} projects · {span}
            </p>
          </div>

          <div className={styles.filters}>
            <Tabs
              name={WORK_FILTER_GROUP}
              items={[...filters]}
              active="All"
              label="Filter work by category"
              variant="chips"
            />
          </div>
        </div>

        <div className={styles.counterScope}>
          {/*
           * Column headings for the desktop index, hidden below 768 where the
           * row is a stack rather than four columns. Decorative: the rows are
           * a list of links, not a table, so there is nothing for these to
           * label and announcing them would only add noise.
           */}
          <div className={styles.columnHeads} aria-hidden="true">
            <span className={styles.columnHead}>No.</span>
            <span className={styles.columnHead}>Project</span>
            <span className={styles.columnHead}>Stack</span>
            <span className={styles.columnHead}>Year</span>
          </div>

          <ul className={styles.rows}>
            {projects.map((project) => (
              <IndexRow key={project.id} project={project} />
            ))}
          </ul>

          <UtilitiesCollapse />
        </div>
      </div>
    </section>
  )
}
