import styles from './Projects.module.css'

// interface Project {
//   title: string
//   description: string
//   technologies: string[]
//   liveUrl?: string
//   repoUrl?: string
// }

// const projects: Project[] = [
//   {
//     title: 'Project One',
//     description: 'A brief description of this amazing project and what problems it solves.',
//     technologies: ['React', 'TypeScript', 'Node.js'],
//     liveUrl: '#',
//     repoUrl: '#',
//   },
//   {
//     title: 'Project Two',
//     description: 'Another great project showcasing different skills and technologies.',
//     technologies: ['Python', 'FastAPI', 'PostgreSQL'],
//     liveUrl: '#',
//     repoUrl: '#',
//   },
//   {
//     title: 'Project Three',
//     description: 'A third project demonstrating versatility and problem-solving abilities.',
//     technologies: ['React Native', 'Firebase', 'Redux'],
//     liveUrl: '#',
//     repoUrl: '#',
//   },
// ]

export function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <h2 className={styles.title}>My Projects</h2>
        <p className={styles.comingSoon}>Coming Soon</p>
        {/* <div className={styles.grid}>
          {projects.map((project, index) => (
            <article key={index} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.description}</p>
                <div className={styles.technologies}>
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.tech}>{tech}</span>
                  ))}
                </div>
                <div className={styles.links}>
                  {project.liveUrl && (
                    <a href={project.liveUrl} className={styles.link}>Live Demo</a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} className={styles.link}>Source Code</a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div> */}
      </div>
    </section>
  )
}
