// src/routes/ProjectDetail.tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProject } from '../hooks/useProjects'
import { renderMarkdown } from '../lib/markdown'
import { createAccessRequest, hasPendingRequest } from '../lib/accessRequests'
import type { Project } from '../lib/types'

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  const { data: project, loading, error } = useProject(slug)

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (loading) return <p className="text-stone-400 text-sm">Loading project…</p>
  if (error) return <p className="text-rose-400 text-sm">Error: {error}</p>

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

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-stone-100">{project.title}</h1>

        {project.summary && (
          <p className="text-stone-300">{project.summary}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          <Link
            className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
            to="/projects"
          >
            ← All projects
          </Link>
          {project.liveUrl && (
            <a
              className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live
            </a>
          )}
          {project.repoUrl && (
            <a
              className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Repo
            </a>
          )}
        </div>
      </header>

      {project.coverImage && (
        <img
          src={project.coverImage}
          alt=""
          className="w-full max-h-80 object-cover rounded-lg border border-stone-800"
          loading="lazy"
        />
      )}

      {/* Tech Stack */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-stone-400">Built with</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full border border-stone-700 text-stone-300 bg-stone-900/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Request Access Section */}
      {project.requiresAuth && project.accessRequestEnabled && (
        <RequestAccessForm project={project} />
      )}

      {/* Project Description */}
      {project.summary ? (
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(project.summary || '') }}
        />
      ) : (
        <p className="text-stone-400 text-sm">No details yet.</p>
      )}
    </div>
  )
}

// Request Access Form Component
function RequestAccessForm({ project }: { project: Project }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'submitting' | 'success' | 'duplicate' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setStatus('checking')

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    // Validate
    if (!trimmedEmail || !trimmedName || !trimmedMessage) {
      setStatus('error')
      setErrorMsg('All fields are required')
      return
    }

    // Check for existing pending request
    try {
      const hasPending = await hasPendingRequest(trimmedEmail, project.id)
      if (hasPending) {
        setStatus('duplicate')
        return
      }
    } catch {
      setStatus('error')
      setErrorMsg('Failed to check request status')
      return
    }

    // Submit request
    setStatus('submitting')
    try {
      await createAccessRequest(
        trimmedEmail,
        trimmedName,
        trimmedMessage,
        project.id,
        project.slug,
        project.title,
        navigator.userAgent
      )
      setStatus('success')
      setEmail('')
      setName('')
      setMessage('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit request')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          Request Submitted
        </h3>
        <p className="text-sm text-stone-300 mt-2">
          Thanks for your interest! I'll review your request and get back to you soon.
        </p>
      </div>
    )
  }

  if (status === 'duplicate') {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
        <h3 className="font-semibold text-amber-400 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-amber-400" />
          Request Already Pending
        </h3>
        <p className="text-sm text-stone-300 mt-2">
          You already have a pending access request for this project. I'll review it soon.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          Request Access
        </h3>
        <p className="text-sm text-stone-400 mt-1">
          This project requires approval. Fill out the form below to request access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="ra-email" className="text-sm text-stone-300 block mb-1">
            Email <span className="text-rose-400">*</span>
          </label>
          <input
            id="ra-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                       placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>

        <div>
          <label htmlFor="ra-name" className="text-sm text-stone-300 block mb-1">
            Name <span className="text-rose-400">*</span>
          </label>
          <input
            id="ra-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                       placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>

        <div>
          <label htmlFor="ra-message" className="text-sm text-stone-300 block mb-1">
            Why do you want access? <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="ra-message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me a bit about why you're interested in this project…"
            rows={3}
            className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                       placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'checking' || status === 'submitting'}
          className="rounded-lg bg-emerald-400 text-black px-4 py-2 text-sm font-medium 
                     hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'checking' ? 'Checking…' : status === 'submitting' ? 'Submitting…' : 'Submit Request'}
        </button>

        {status === 'error' && errorMsg && (
          <p className="text-sm text-rose-400">{errorMsg}</p>
        )}
      </form>
    </div>
  )
}
