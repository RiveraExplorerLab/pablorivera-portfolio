// src/routes/ProjectDetail.tsx
import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProject } from '../lib/useSupabase'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  const { data: project, loading, error } = useProject(slug)

  // Scroll to top on slug change (mirrors your other detail pages)
  useEffect(() => { window.scrollTo({ top: 0 }) }, [slug])

  if (loading) return <p className="text-stone-400 text-sm">Loading project…</p>
  if (error)   return <p className="text-rose-400 text-sm">Error: {error}</p>

  if (!project) {
    return (
      <div className="space-y-3">
        <p className="text-stone-300">Project not found.</p>
        <Link to="/projects" className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400">
          Back to Projects
        </Link>
      </div>
    )
  }

  // Render Markdown → HTML safely
  const raw = project.details_md || ''
  const html = DOMPurify.sanitize(marked.parse(raw) as string)

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-stone-100">{project.name}</h1>

        {project.one_liner && (
          <p className="text-stone-300">{project.one_liner}</p>
        )}

        <div className="flex gap-4 text-sm">
          <Link
            className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
            to="/projects"
          >
            ← All projects
          </Link>
          {project.links?.live && (
            <a
              className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
            >
              Live
            </a>
          )}
          {project.links?.repo && (
            <a
              className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
            >
              Repo
            </a>
          )}
        </div>
      </header>

      {project.cover_url && (
        <img
          src={project.cover_url}
          alt=""
          className="w-full max-h-80 object-cover rounded-lg border border-stone-800"
          loading="lazy"
        />
      )}

      {raw.trim()
        ? (
          <article
            className="prose prose-invert max-w-none"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
        : (
          <p className="text-stone-400 text-sm">No details yet.</p>
        )
      }
    </div>
  )
}