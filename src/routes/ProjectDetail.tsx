// src/routes/ProjectDetail.tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProject } from '../hooks/useProjects'
import { renderMarkdownAsync } from '../lib/markdown'
import { createAccessRequest, hasPendingRequest } from '../lib/accessRequests'
import type { Project } from '../lib/types'

type Tab = 'overview' | 'changelog' | 'docs'

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  const { data: project, loading, error } = useProject(slug)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

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
        <Link to="/projects" className="text-emerald-400 hover:text-emerald-300 transition-colors">
          ← Back to Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm inline-flex items-center gap-1"
        to="/projects"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All projects
      </Link>

      {/* Hero Section */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-3">
              <span className="inline-block size-2 rounded-full bg-emerald-400" />
              {project.title}
            </h1>
            {project.summary && (
              <p className="text-lg text-stone-300 max-w-2xl">{project.summary}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 text-black px-4 py-2 text-sm font-medium hover:bg-emerald-300 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 hover:border-emerald-500/50 hover:bg-stone-900 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Cover Image */}
        {project.coverImage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden border border-stone-800"
          >
            <img
              src={project.coverImage}
              alt={`${project.title} screenshot`}
              className="w-full max-h-96 object-cover"
              loading="lazy"
            />
          </motion.div>
        )}

        {/* Meta Info Bar */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-stone-400 pt-2">
          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-md bg-stone-800 text-stone-400 border border-stone-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-stone-800">
        <nav className="flex gap-1" aria-label="Project sections">
          {(['overview', 'changelog', 'docs'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-stone-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'overview' && <OverviewTab project={project} />}
          {activeTab === 'changelog' && <ChangelogTab project={project} />}
          {activeTab === 'docs' && <DocsTab project={project} />}
        </motion.div>
      </AnimatePresence>

      {/* Request Access Section */}
      {project.requiresAuth && project.accessRequestEnabled && (
        <RequestAccessForm project={project} />
      )}
    </div>
  )
}

/* ==================== TAB COMPONENTS ==================== */

function OverviewTab({ project }: { project: Project }) {
  const [renderedContent, setRenderedContent] = useState<string>('')
  const [rendering, setRendering] = useState(true)

  useEffect(() => {
    // For now, show a placeholder. In the future, this could be project.description markdown
    const placeholderMd = `
## About This Project

${project.summary || 'No description available yet.'}

### Features

- Feature highlights will go here
- Add project documentation to see more

### Getting Started

Check out the **Live Demo** or **Source Code** using the buttons above.
    `.trim()

    renderMarkdownAsync(placeholderMd)
      .then(setRenderedContent)
      .finally(() => setRendering(false))
  }, [project])

  if (rendering) {
    return <div className="text-stone-400 text-sm">Loading…</div>
  }

  return (
    <div
      className="prose prose-invert prose-pre:p-0 prose-pre:bg-transparent max-w-none
                 [&_.shiki]:rounded-lg [&_.shiki]:p-4 [&_.shiki]:text-sm [&_.shiki]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}

function ChangelogTab({ project }: { project: Project }) {
  // Placeholder changelog - in the future this would come from project.docs subcollection
  const changelog = [
    { version: '1.0.0', date: 'Coming soon', changes: ['Initial release'] },
  ]

  return (
    <div className="space-y-6">
      <p className="text-stone-400 text-sm">
        Track updates and improvements to {project.title}.
      </p>

      <div className="space-y-4">
        {changelog.map((release, i) => (
          <div key={i} className="relative pl-6 pb-6 border-l border-stone-800 last:pb-0">
            {/* Timeline dot */}
            <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400 border-2 border-stone-900" />
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-stone-100">v{release.version}</span>
                <span className="text-xs text-stone-500">{release.date}</span>
              </div>
              <ul className="space-y-1">
                {release.changes.map((change, j) => (
                  <li key={j} className="text-sm text-stone-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <p className="text-stone-500 text-xs italic">
        More changelog entries will appear as the project evolves.
      </p>
    </div>
  )
}

function DocsTab({ project }: { project: Project }) {
  // Placeholder docs - in the future this would come from project.docs subcollection
  return (
    <div className="space-y-6">
      <p className="text-stone-400 text-sm">
        Technical documentation for {project.title}.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <DocCard
          title="Getting Started"
          description="Quick start guide and installation instructions"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          comingSoon
        />
        <DocCard
          title="API Reference"
          description="Complete API documentation and examples"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          }
          comingSoon
        />
        <DocCard
          title="Configuration"
          description="Environment variables and settings"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          comingSoon
        />
        <DocCard
          title="Troubleshooting"
          description="Common issues and solutions"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          comingSoon
        />
      </div>
    </div>
  )
}

function DocCard({ 
  title, 
  description, 
  icon, 
  comingSoon = false 
}: { 
  title: string
  description: string
  icon: React.ReactNode
  comingSoon?: boolean 
}) {
  return (
    <div className={`rounded-xl border p-4 transition ${
      comingSoon 
        ? 'border-stone-800 bg-stone-900/30 opacity-60' 
        : 'border-stone-800 bg-stone-900/50 hover:border-emerald-500/30 cursor-pointer'
    }`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-stone-100 flex items-center gap-2">
            {title}
            {comingSoon && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-500">
                Coming Soon
              </span>
            )}
          </h3>
          <p className="text-sm text-stone-400 mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  )
}

/* ==================== REQUEST ACCESS FORM ==================== */

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

    if (!trimmedEmail || !trimmedName || !trimmedMessage) {
      setStatus('error')
      setErrorMsg('All fields are required')
      return
    }

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
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6"
      >
        <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Request Submitted
        </h3>
        <p className="text-sm text-stone-300 mt-2">
          Thanks for your interest! I'll review your request and get back to you soon.
        </p>
      </motion.div>
    )
  }

  if (status === 'duplicate') {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
        <h3 className="font-semibold text-amber-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Request Already Pending
        </h3>
        <p className="text-sm text-stone-300 mt-2">
          You already have a pending access request for this project. I'll review it soon.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6 space-y-4">
      <div>
        <h3 className="font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-400" />
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
            placeholder="Tell me a bit about why you're interested…"
            rows={3}
            className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                       placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'checking' || status === 'submitting'}
          className="rounded-lg bg-emerald-400 text-black px-4 py-2 text-sm font-medium 
                     hover:bg-emerald-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
