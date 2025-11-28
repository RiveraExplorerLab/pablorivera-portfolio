// src/routes/Admin.tsx
import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../providers/AuthProvider'
import { useAllPosts } from '../hooks/useBlogPosts'
import { useAllProjects } from '../hooks/useProjects'
import { 
  createPost, 
  updatePost, 
  deletePost, 
  isSlugAvailable 
} from '../lib/blogPosts'
import { 
  createProject, 
  updateProject, 
  deleteProject, 
  isProjectSlugAvailable 
} from '../lib/projects'
import { uploadCoverImage, deleteCoverImage, validateImageFile } from '../lib/storage'
import { slugify } from '../lib/slugify'
import type { BlogPost, Project, ChangelogEntry, ProjectDocs, ProjectStatus } from '../lib/types'
import { Timestamp } from 'firebase/firestore'

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [tab, setTab] = useState<'posts' | 'projects'>('posts')

  if (loading) return <div className="text-stone-400 text-sm">Checking session…</div>
  if (!user || !isAdmin) return <Navigate to="/login" replace />

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/community" className="btn-secondary text-xs py-1.5">
            Community
          </Link>
          <Link to="/admin/access" className="btn-secondary text-xs py-1.5">
            Access Requests
          </Link>
          <button
            className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {(['posts', 'projects'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
              tab === t
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-white/20'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'posts' ? <PostsAdmin /> : <ProjectsAdmin />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ==================== POSTS ADMIN ==================== */

function PostsAdmin() {
  const { data: posts, loading, error, reload } = useAllPosts()
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isNew, setIsNew] = useState(false)

  async function handleDelete(post: BlogPost) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return
    
    try {
      if (post.coverImage) {
        await deleteCoverImage(post.coverImage)
      }
      await deletePost(post.id)
      if (editing?.id === post.id) {
        setEditing(null)
        setIsNew(false)
      }
      reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  function handleNew() {
    setEditing(null)
    setIsNew(true)
  }

  function handleEdit(post: BlogPost) {
    setEditing(post)
    setIsNew(false)
  }

  function handleCancel() {
    setEditing(null)
    setIsNew(false)
  }

  function handleSaved() {
    setEditing(null)
    setIsNew(false)
    reload()
  }

  // Full-page editor mode
  if (editing || isNew) {
    return (
      <PostForm
        key={editing?.id || 'new'}
        initial={editing}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-100">Your Posts</h2>
        <button className="btn-primary text-xs py-1.5" onClick={handleNew}>
          + New Post
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !posts?.length ? (
        <div className="card p-8 text-center">
          <p className="text-stone-400">No posts yet.</p>
          <button className="btn-primary mt-4" onClick={handleNew}>
            Create your first post
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-stone-100 truncate flex items-center gap-2">
                  {post.title}
                  {post.draft && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  /{post.slug}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="btn-secondary text-xs py-1" 
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                <button 
                  className="btn-secondary text-xs py-1" 
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                >
                  Preview
                </button>
                <button 
                  className="text-xs px-2 py-1 rounded text-rose-400 hover:bg-rose-500/10 transition-colors" 
                  onClick={() => handleDelete(post)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==================== POST FORM ==================== */

function PostForm({ 
  initial, 
  onSaved, 
  onCancel 
}: { 
  initial: BlogPost | null
  onSaved: () => void
  onCancel: () => void 
}) {
  const isEdit = Boolean(initial?.id)
  
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [summary, setSummary] = useState(initial?.summary || '')
  const [markdown, setMarkdown] = useState(initial?.markdown || '')
  const [tags, setTags] = useState((initial?.tags || []).join(', '))
  const [draft, setDraft] = useState(initial?.draft ?? true)
  const [coverImage, setCoverImage] = useState<string | null>(initial?.coverImage || null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit && value && !slug) {
      setSlug(slugify(value))
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setMsg({ type: 'error', text: validation.error! })
      return
    }

    setUploading(true)
    setMsg(null)

    try {
      if (coverImage) {
        await deleteCoverImage(coverImage)
      }
      const url = await uploadCoverImage(file, 'posts')
      setCoverImage(url)
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveImage() {
    if (!coverImage) return
    try {
      await deleteCoverImage(coverImage)
      setCoverImage(null)
    } catch (err) {
      console.warn('Failed to delete image:', err)
      setCoverImage(null)
    }
  }

  function parseTagsInput(input: string): string[] {
    return input.split(',').map(t => t.trim()).filter(Boolean)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setSaving(true)

    try {
      const slugAvailable = await isSlugAvailable(slug, initial?.id)
      if (!slugAvailable) {
        setMsg({ type: 'error', text: 'Slug is already in use' })
        setSaving(false)
        return
      }

      const payload = {
        title,
        slug,
        summary,
        markdown,
        coverImage,
        tags: parseTagsInput(tags),
        draft,
        publishedAt: draft ? null : (initial?.publishedAt || Timestamp.now()),
      }

      if (isEdit && initial) {
        await updatePost(initial.id, payload)
      } else {
        await createPost(payload as any)
      }

      setMsg({ type: 'success', text: 'Saved!' })
      setTimeout(() => onSaved(), 500)
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-100">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h2>
        <button 
          className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
          onClick={onCancel}
        >
          ← Back to list
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-5 space-y-4">
          <h3 className="font-medium text-stone-200 text-sm">Basic Info</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs text-stone-400">Title *</label>
              <input 
                className="input"
                placeholder="My Awesome Post" 
                value={title} 
                onChange={(e) => handleTitleChange(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-stone-400">Slug *</label>
              <input 
                className="input"
                placeholder="my-awesome-post" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-400">Summary</label>
            <input 
              className="input"
              placeholder="A brief description of the post" 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-stone-400">Tags (comma-separated)</label>
            <input 
              className="input"
              placeholder="react, typescript, firebase" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-xs text-stone-400">Cover Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              disabled={uploading}
              className="text-sm text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                         file:text-sm file:font-medium file:bg-teal-500/10 file:text-teal-400
                         hover:file:bg-teal-500/20 file:cursor-pointer file:transition-colors"
            />
            {uploading && <p className="text-xs text-stone-400">Uploading…</p>}
            {coverImage && (
              <div className="relative inline-block mt-2">
                <img 
                  src={coverImage} 
                  alt="" 
                  className="max-h-32 rounded-lg border border-white/10" 
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="card p-5 space-y-4">
          <h3 className="font-medium text-stone-200 text-sm">Content (Markdown)</h3>
          <textarea 
            className="input font-mono text-sm"
            placeholder="Write your post content in markdown..." 
            value={markdown} 
            onChange={(e) => setMarkdown(e.target.value)} 
            rows={16} 
          />
        </div>

        {/* Settings */}
        <div className="card p-5 space-y-4">
          <h3 className="font-medium text-stone-200 text-sm">Settings</h3>
          <Toggle 
            checked={!draft} 
            onChange={(checked) => setDraft(!checked)} 
            label="Publish now" 
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Post'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          {msg && (
            <p className={`text-sm ${msg.type === 'error' ? 'text-rose-400' : 'text-teal-400'}`}>
              {msg.text}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

/* ==================== PROJECTS ADMIN ==================== */

function ProjectsAdmin() {
  const { data: projects, loading, error, reload } = useAllProjects()
  const [editing, setEditing] = useState<Project | null>(null)
  const [isNew, setIsNew] = useState(false)

  async function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    
    try {
      if (project.coverImage) {
        await deleteCoverImage(project.coverImage)
      }
      await deleteProject(project.id)
      if (editing?.id === project.id) {
        setEditing(null)
        setIsNew(false)
      }
      reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  function handleNew() {
    setEditing(null)
    setIsNew(true)
  }

  function handleEdit(project: Project) {
    setEditing(project)
    setIsNew(false)
  }

  function handleCancel() {
    setEditing(null)
    setIsNew(false)
  }

  function handleSaved() {
    setEditing(null)
    setIsNew(false)
    reload()
  }

  // Full-page editor mode
  if (editing || isNew) {
    return (
      <ProjectForm
        key={editing?.id || 'new'}
        initial={editing}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-100">Your Projects</h2>
        <button className="btn-primary text-xs py-1.5" onClick={handleNew}>
          + New Project
        </button>
      </div>

      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !projects?.length ? (
        <div className="card p-8 text-center">
          <p className="text-stone-400">No projects yet.</p>
          <button className="btn-primary mt-4" onClick={handleNew}>
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map(project => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-stone-100 truncate flex items-center gap-2">
                  {project.title}
                  <ProjectStatusBadge status={project.status} />
                  {project.featured && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400">
                      Featured
                    </span>
                  )}
                  {project.draft && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      Draft
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  /{project.slug}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="btn-secondary text-xs py-1" 
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </button>
                <button 
                  className="btn-secondary text-xs py-1" 
                  onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                >
                  Preview
                </button>
                <button 
                  className="text-xs px-2 py-1 rounded text-rose-400 hover:bg-rose-500/10 transition-colors" 
                  onClick={() => handleDelete(project)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==================== PROJECT FORM ==================== */

type ProjectFormTab = 'basic' | 'overview' | 'changelog' | 'docs'

const emptyDocs: ProjectDocs = {
  gettingStarted: null,
  apiReference: null,
  configuration: null,
  troubleshooting: null,
}

function ProjectForm({ 
  initial, 
  onSaved, 
  onCancel 
}: { 
  initial: Project | null
  onSaved: () => void
  onCancel: () => void 
}) {
  const isEdit = Boolean(initial?.id)
  const [formTab, setFormTab] = useState<ProjectFormTab>('basic')
  
  // Basic Info
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [summary, setSummary] = useState(initial?.summary || '')
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl || '')
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl || '')
  const [techStack, setTechStack] = useState((initial?.techStack || []).join(', '))
  const [tags, setTags] = useState((initial?.tags || []).join(', '))
  const [status, setStatus] = useState<ProjectStatus>(initial?.status || 'planned')
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [draft, setDraft] = useState(initial?.draft ?? true)
  const [requiresAuth, setRequiresAuth] = useState(initial?.requiresAuth ?? false)
  const [accessRequestEnabled, setAccessRequestEnabled] = useState(initial?.accessRequestEnabled ?? false)
  const [coverImage, setCoverImage] = useState<string | null>(initial?.coverImage || null)
  
  // Overview (Description)
  const [description, setDescription] = useState(initial?.description || '')
  
  // Changelog
  const [changelog, setChangelog] = useState<ChangelogEntry[]>(initial?.changelog || [])
  
  // Docs
  const [docs, setDocs] = useState<ProjectDocs>(initial?.docs || emptyDocs)
  
  // UI State
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit && value && !slug) {
      setSlug(slugify(value))
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setMsg({ type: 'error', text: validation.error! })
      return
    }

    setUploading(true)
    setMsg(null)

    try {
      if (coverImage) {
        await deleteCoverImage(coverImage)
      }
      const url = await uploadCoverImage(file, 'projects')
      setCoverImage(url)
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveImage() {
    if (!coverImage) return
    try {
      await deleteCoverImage(coverImage)
      setCoverImage(null)
    } catch (err) {
      console.warn('Failed to delete image:', err)
      setCoverImage(null)
    }
  }

  function parseListInput(input: string): string[] {
    return input.split(',').map(t => t.trim()).filter(Boolean)
  }

  // Changelog handlers
  function addChangelogEntry() {
    setChangelog([
      { version: '', date: new Date().toISOString().split('T')[0], content: '' },
      ...changelog,
    ])
  }

  function updateChangelogEntry(index: number, field: keyof ChangelogEntry, value: string) {
    const updated = [...changelog]
    updated[index] = { ...updated[index], [field]: value }
    setChangelog(updated)
  }

  function removeChangelogEntry(index: number) {
    setChangelog(changelog.filter((_, i) => i !== index))
  }

  // Docs handler
  function updateDoc(field: keyof ProjectDocs, value: string) {
    setDocs({ ...docs, [field]: value || null })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setSaving(true)

    try {
      const slugAvailable = await isProjectSlugAvailable(slug, initial?.id)
      if (!slugAvailable) {
        setMsg({ type: 'error', text: 'Slug is already in use' })
        setSaving(false)
        return
      }

      const payload = {
        title,
        slug,
        summary,
        description: description || null,
        coverImage,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        techStack: parseListInput(techStack),
        tags: parseListInput(tags),
        status,
        featured,
        draft,
        requiresAuth,
        accessRequestEnabled: requiresAuth ? accessRequestEnabled : false,
        changelog: changelog.filter(c => c.version && c.content), // Remove empty entries
        docs,
        publishedAt: draft ? null : (initial?.publishedAt || Timestamp.now()),
      }

      if (isEdit && initial) {
        await updateProject(initial.id, payload)
      } else {
        await createProject(payload as any)
      }

      setMsg({ type: 'success', text: 'Saved!' })
      setTimeout(() => onSaved(), 500)
    } catch (err) {
      setMsg({ type: 'error', text: err instanceof Error ? err.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const formTabs: { key: ProjectFormTab; label: string }[] = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'overview', label: 'Overview' },
    { key: 'changelog', label: 'Changelog' },
    { key: 'docs', label: 'Documentation' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-100">
          {isEdit ? 'Edit Project' : 'New Project'}
        </h2>
        <button 
          className="text-sm text-stone-400 hover:text-stone-200 transition-colors"
          onClick={onCancel}
        >
          ← Back to list
        </button>
      </div>

      {/* Form Tabs */}
      <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
        {formTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFormTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 whitespace-nowrap ${
              formTab === tab.key
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          <motion.div
            key={formTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {formTab === 'basic' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="card p-5 space-y-4">
                  <h3 className="font-medium text-stone-200 text-sm">Project Details</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs text-stone-400">Title *</label>
                      <input 
                        className="input"
                        placeholder="My Awesome Project" 
                        value={title} 
                        onChange={(e) => handleTitleChange(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-stone-400">Slug *</label>
                      <input 
                        className="input"
                        placeholder="my-awesome-project" 
                        value={slug} 
                        onChange={(e) => setSlug(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-400">Summary (one-liner)</label>
                    <input 
                      className="input"
                      placeholder="A brief description of the project" 
                      value={summary} 
                      onChange={(e) => setSummary(e.target.value)} 
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs text-stone-400">Live URL</label>
                      <input 
                        className="input"
                        placeholder="https://myproject.com" 
                        value={liveUrl} 
                        onChange={(e) => setLiveUrl(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-stone-400">Repository URL</label>
                      <input 
                        className="input"
                        placeholder="https://github.com/..." 
                        value={repoUrl} 
                        onChange={(e) => setRepoUrl(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-400">Tech Stack (comma-separated)</label>
                    <input 
                      className="input"
                      placeholder="React, TypeScript, Firebase" 
                      value={techStack} 
                      onChange={(e) => setTechStack(e.target.value)} 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-stone-400">Tags (comma-separated)</label>
                    <input 
                      className="input"
                      placeholder="side-project, AI, web-app" 
                      value={tags} 
                      onChange={(e) => setTags(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div className="card p-5 space-y-4">
                  <h3 className="font-medium text-stone-200 text-sm">Cover Image</h3>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="text-sm text-stone-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                               file:text-sm file:font-medium file:bg-teal-500/10 file:text-teal-400
                               hover:file:bg-teal-500/20 file:cursor-pointer file:transition-colors"
                  />
                  {uploading && <p className="text-xs text-stone-400">Uploading…</p>}
                  {coverImage && (
                    <div className="relative inline-block mt-2">
                      <img 
                        src={coverImage} 
                        alt="" 
                        className="max-h-40 rounded-lg border border-white/10" 
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-black/70 rounded px-2 py-1 text-xs text-rose-400 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Settings */}
                <div className="card p-5 space-y-4">
                  <h3 className="font-medium text-stone-200 text-sm">Settings</h3>
                  
                  <div className="space-y-1">
                    <label className="text-xs text-stone-400">Project Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                      className="input w-full appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2357534e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.75rem center',
                        backgroundSize: '1rem',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="planned">🔮 Planned</option>
                      <option value="in-progress">🚧 In Progress</option>
                      <option value="launched">🚀 Launched</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Toggle 
                      checked={featured} 
                      onChange={setFeatured} 
                      label="Featured on homepage" 
                    />
                    <Toggle 
                      checked={!draft} 
                      onChange={(checked) => setDraft(!checked)} 
                      label="Publish now" 
                    />
                  </div>
                </div>

                {/* Access Control */}
                <div className="card p-5 space-y-4">
                  <h3 className="font-medium text-stone-200 text-sm">Access Control</h3>
                  <div className="space-y-3">
                    <Toggle 
                      checked={requiresAuth} 
                      onChange={setRequiresAuth} 
                      label="Requires authentication" 
                    />
                    {requiresAuth && (
                      <Toggle 
                        checked={accessRequestEnabled} 
                        onChange={setAccessRequestEnabled} 
                        label="Enable access request form" 
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {formTab === 'overview' && (
              <div className="card p-5 space-y-4">
                <h3 className="font-medium text-stone-200 text-sm">Project Overview</h3>
                <p className="text-xs text-stone-500">
                  This content appears on the Overview tab of the project page. Use Markdown.
                </p>
                <textarea 
                  className="input font-mono text-sm"
                  placeholder="## About This Project&#10;&#10;Describe your project in detail..."
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={20} 
                />
              </div>
            )}

            {formTab === 'changelog' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-stone-500">
                    Track version history and updates. Newest first.
                  </p>
                  <button
                    type="button"
                    onClick={addChangelogEntry}
                    className="btn-secondary text-xs py-1.5"
                  >
                    + Add Entry
                  </button>
                </div>

                {changelog.length === 0 ? (
                  <div className="card p-8 text-center">
                    <p className="text-stone-400 text-sm">No changelog entries yet.</p>
                    <button
                      type="button"
                      onClick={addChangelogEntry}
                      className="btn-primary mt-4 text-sm"
                    >
                      Add your first entry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {changelog.map((entry, index) => (
                      <div key={index} className="card p-5 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="grid gap-4 sm:grid-cols-2 flex-1">
                            <div className="space-y-1">
                              <label className="text-xs text-stone-400">Version *</label>
                              <input 
                                className="input"
                                placeholder="1.0.0" 
                                value={entry.version} 
                                onChange={(e) => updateChangelogEntry(index, 'version', e.target.value)} 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-stone-400">Date</label>
                              <input 
                                type="date"
                                className="input"
                                value={entry.date} 
                                onChange={(e) => updateChangelogEntry(index, 'date', e.target.value)} 
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeChangelogEntry(index)}
                            className="text-xs text-rose-400 hover:text-rose-300 mt-5"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-stone-400">Changes (Markdown)</label>
                          <textarea 
                            className="input font-mono text-sm"
                            placeholder="- Added new feature&#10;- Fixed bug&#10;- Improved performance"
                            value={entry.content} 
                            onChange={(e) => updateChangelogEntry(index, 'content', e.target.value)} 
                            rows={6} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {formTab === 'docs' && (
              <div className="space-y-6">
                <p className="text-xs text-stone-500">
                  Add documentation for each section. All fields support Markdown.
                </p>

                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 className="font-medium text-stone-200 text-sm">Getting Started</h3>
                  </div>
                  <textarea 
                    className="input font-mono text-sm"
                    placeholder="## Installation&#10;&#10;```bash&#10;npm install my-project&#10;```"
                    value={docs.gettingStarted || ''} 
                    onChange={(e) => updateDoc('gettingStarted', e.target.value)} 
                    rows={10} 
                  />
                </div>

                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <h3 className="font-medium text-stone-200 text-sm">API Reference</h3>
                  </div>
                  <textarea 
                    className="input font-mono text-sm"
                    placeholder="## Endpoints&#10;&#10;### GET /api/items&#10;Returns all items..."
                    value={docs.apiReference || ''} 
                    onChange={(e) => updateDoc('apiReference', e.target.value)} 
                    rows={10} 
                  />
                </div>

                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="font-medium text-stone-200 text-sm">Configuration</h3>
                  </div>
                  <textarea 
                    className="input font-mono text-sm"
                    placeholder="## Environment Variables&#10;&#10;| Variable | Description |&#10;|----------|-------------|&#10;| API_KEY | Your API key |"
                    value={docs.configuration || ''} 
                    onChange={(e) => updateDoc('configuration', e.target.value)} 
                    rows={10} 
                  />
                </div>

                <div className="card p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-medium text-stone-200 text-sm">Troubleshooting</h3>
                  </div>
                  <textarea 
                    className="input font-mono text-sm"
                    placeholder="## Common Issues&#10;&#10;### Error: Module not found&#10;Try running `npm install`..."
                    value={docs.troubleshooting || ''} 
                    onChange={(e) => updateDoc('troubleshooting', e.target.value)} 
                    rows={10} 
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions - Always visible */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Project'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          {msg && (
            <p className={`text-sm ${msg.type === 'error' ? 'text-rose-400' : 'text-teal-400'}`}>
              {msg.text}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

/* ==================== UI COMPONENTS ==================== */

function Toggle({ 
  checked, 
  onChange, 
  label 
}: { 
  checked: boolean
  onChange: (checked: boolean) => void
  label: string 
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div 
        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
          checked ? 'bg-teal-500' : 'bg-stone-700'
        }`}
        onClick={() => onChange(!checked)}
      >
        <div 
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="text-sm text-stone-300 group-hover:text-stone-100 transition-colors">
        {label}
      </span>
    </label>
  )
}

function ProjectStatusBadge({ status }: { status?: ProjectStatus }) {
  if (!status) return null
  
  const config = {
    'planned': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: '🔮 Planned' },
    'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '🚧 In Progress' },
    'launched': { bg: 'bg-teal-500/20', text: 'text-teal-400', label: '🚀 Launched' },
    'archived': { bg: 'bg-stone-500/20', text: 'text-stone-400', label: '📦 Archived' },
  }
  
  const c = config[status]
  if (!c) return null
  
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}
