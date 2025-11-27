// src/routes/Projects.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import type { Project } from '../lib/types'

export default function Projects() {
  const { data: projects, loading, error } = useProjects()

  if (loading) return <p className="text-stone-400 text-sm">Loading projects…</p>
  if (error) return <p className="text-rose-400 text-sm">Error: {error}</p>

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-stone-100">Projects</h1>
        <p className="text-stone-300">A running log of what I've been building.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {projects?.map((project: Project, i: number) => (
          <motion.li
            key={project.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="rounded-xl border border-stone-800 bg-stone-900/40 p-4"
          >
            <div className="flex gap-3">
              <div className="w-24 h-16 rounded-md overflow-hidden bg-stone-800 shrink-0">
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={`${project.title} cover`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-stone-100">
                  <Link to={`/projects/${project.slug}`} className="hover:underline">
                    {project.title}
                  </Link>
                </h2>
                {project.summary && (
                  <p className="text-sm text-stone-300 mt-1 line-clamp-2">{project.summary}</p>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline underline-offset-2 text-sm mt-2 block"
                  >
                    Try it Live
                  </a>
                )}
              </div>
            </div>
            
            {/* Tech stack tags */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-stone-700 text-stone-400"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="text-[10px] px-2 py-0.5 text-stone-500">
                    +{project.techStack.length - 4} more
                  </span>
                )}
              </div>
            )}
          </motion.li>
        ))}
      </ul>

      {(!projects || projects.length === 0) && (
        <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
          <p className="text-stone-300">No projects yet.</p>
        </div>
      )}
    </div>
  )
}
