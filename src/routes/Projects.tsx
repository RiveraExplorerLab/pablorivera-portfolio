import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-neutral-300">
          Useful tools and playful experiments. Each project has a clear “why.”
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
