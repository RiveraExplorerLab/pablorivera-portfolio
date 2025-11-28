// src/routes/Projects.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import type { Project, ProjectStatus } from '../lib/types'

const statusConfig: Record<ProjectStatus, { bg: string; text: string; border: string; label: string }> = {
  'planned': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: '🔮 Planned' },
  'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: '🚧 In Progress' },
  'launched': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', label: '🚀 Launched' },
  'archived': { bg: 'bg-stone-500/10', text: 'text-stone-400', border: 'border-stone-500/20', label: '📦 Archived' },
}

function StatusBadge({ status }: { status?: ProjectStatus }) {
  if (!status) return null
  const c = statusConfig[status]
  if (!c) return null
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
      {c.label}
    </span>
  )
}

export default function Projects() {
  const { data: projects, loading, error } = useProjects()

  if (loading) return <p className="text-stone-400 text-sm">Loading projects…</p>
  if (error) return <p className="text-rose-400 text-sm">Error: {error}</p>

  // Separate featured and regular projects
  const featuredProjects = projects?.filter(p => p.featured) || []
  const regularProjects = projects?.filter(p => !p.featured) || []

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
            Projects
          </h1>
          <p className="text-stone-400 mt-2">A running log of what I've been building.</p>
        </header>
        <div className="card p-8 text-center">
          <p className="text-stone-400">No projects yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          Projects
        </h1>
        <p className="text-stone-400 mt-2">A running log of what I've been building.</p>
      </header>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section aria-label="Featured projects">
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4">
            Featured
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <FeaturedProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All Projects */}
      {regularProjects.length > 0 && (
        <section aria-label="All projects">
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-4">
            {featuredProjects.length > 0 ? 'All Projects' : 'Projects'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regularProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block card overflow-hidden h-full no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-teal-500/60"
    >
      {project.coverImage ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              Featured
            </span>
            <StatusBadge status={project.status} />
          </div>
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center relative">
          <span className="text-5xl text-teal-400/20">✦</span>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              Featured
            </span>
            <StatusBadge status={project.status} />
          </div>
        </div>
      )}
      <div className="p-5 space-y-3">
        <h3 className="text-xl font-semibold text-stone-100 group-hover:text-teal-300 transition-colors">
          {project.title}
        </h3>
        {project.summary && (
          <p className="text-sm text-stone-300 line-clamp-2">{project.summary}</p>
        )}
        
        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 text-stone-500">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-2 text-sm">
          {project.liveUrl && (
            <span className="text-teal-400 group-hover:text-teal-300 inline-flex items-center gap-1">
              Live Demo
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          )}
          {project.repoUrl && (
            <span className="text-stone-400 group-hover:text-stone-300 inline-flex items-center gap-1">
              Source
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block card overflow-hidden h-full no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-teal-500/60"
    >
      {project.coverImage ? (
        <div className="relative h-36 overflow-hidden">
          <img
            src={project.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-24 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 flex items-center justify-center">
          <span className="text-3xl text-teal-400/20">✦</span>
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-100 group-hover:text-teal-300 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>
        {project.summary && (
          <p className="text-sm text-stone-400 line-clamp-2">{project.summary}</p>
        )}
        
        {/* Tech Stack */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-stone-500 border border-white/10"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-stone-600">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
