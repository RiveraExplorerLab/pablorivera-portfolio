// src/routes/Admin.tsx
import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
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
import type { BlogPost, Project } from '../lib/types'
import { Timestamp } from 'firebase/firestore'

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth()
  const [tab, setTab] = useState<'posts' | 'projects'>('posts')

  if (loading) return <div className="text-stone-400 text-sm">Checking session…</div>
  if (!user || !isAdmin) return <Navigate to="/login" replace />

  return (
    <div className="space-y-8 max-w-5xl">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-100">Admin</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/community"
            className="text-sm text-stone-300 hover:text-stone-100 underline decoration-stone-600 underline-offset-4 hover:decoration-emerald-500/50"
          >
            Community
          </Link>
          <Link
            to="/admin/access"
            className="text-sm text-stone-300 hover:text-stone-100 underline decoration-stone-600 underline-offset-4 hover:decoration-emerald-500/50"
          >
            Access Requests
          </Link>
          <button
            className="text-sm underline decoration-emerald-500/50 underline-offset-4"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-stone-800 overflow-hidden">
        <button
          onClick={() => setTab('posts')}
          className={`px-3 py-1.5 text-sm ${tab === 'posts' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Posts
        </button>
        <button
          onClick={() => setTab('projects')}
          className={`px-3 py-1.5 text-sm ${tab === 'projects' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Projects
        </button>
      </div>

      {tab === 'posts' ? <PostsAdmin /> : <ProjectsAdmin />}
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
      // Delete cover image if exists
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

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-100">Your posts</h2>
          <button 
            className="text-sm rounded-lg border border-stone-700 px-2 py-1 hover:bg-stone-900" 
            onClick={handleNew}
          >
            New
          </button>
        </div>

        {loading ? (
          <p className="text-stone-400 text-sm">Loading…</p>
        ) : error ? (
          <p className="text-rose-400 text-sm">Error: {error}</p>
        ) : !posts?.length ? (
          <p className="text-stone-400 text-sm">No posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map(post => (
              <li key={post.id} className="rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-stone-100 truncate">{post.title}</div>
                  <div className="text-xs text-stone-400">
                    {post.draft ? 'Draft' : 'Published'} • {post.slug}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button 
                    className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" 
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" 
                    onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                  >
                    Preview
                  </button>
                  <button 
                    className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900 text-rose-400" 
                    onClick={() => handleDelete(post)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        {(editing || isNew) && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-100">
                {editing ? 'Edit post' : 'New post'}
              </h2>
              <button 
                className="text-xs text-stone-400 hover:text-stone-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <PostForm
              key={editing?.id || 'new'}
              initial={editing}
              onSaved={handleSaved}
            />
          </>
        )}
        {!editing && !isNew && (
          <div className="text-stone-400 text-sm">
            Select a post to edit or create a new one.
          </div>
        )}
      </section>
    </div>
  )
}

/* ==================== POST FORM ==================== */

function PostForm({ initial, onSaved }: { initial: BlogPost | null; onSaved: () => void }) {
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

  // Auto-generate slug from title (only for new posts)
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
      // Delete old image if replacing
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
      // Validate slug uniqueness
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input 
        placeholder="Title" 
        value={title} 
        onChange={handleTitleChange} 
        required 
      />
      <Input 
        placeholder="Slug (my-post)" 
        value={slug} 
        onChange={setSlug} 
        required 
      />
      <Input 
        placeholder="Summary" 
        value={summary} 
        onChange={setSummary} 
      />
      <Textarea 
        placeholder="Markdown content" 
        value={markdown} 
        onChange={setMarkdown} 
        rows={10} 
      />

      <div className="space-y-2">
        <label className="text-sm text-stone-300">Cover image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          disabled={uploading}
          className="text-sm text-stone-400"
        />
        {uploading && <p className="text-xs text-stone-400">Uploading…</p>}
        {coverImage && (
          <div className="relative inline-block">
            <img 
              src={coverImage} 
              alt="" 
              className="mt-2 max-h-32 rounded border border-stone-800" 
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-3 right-1 bg-black/70 rounded px-1.5 py-0.5 text-xs text-rose-400 hover:text-rose-300"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <Input 
        placeholder="Tags (comma-separated)" 
        value={tags} 
        onChange={setTags} 
      />
      
      <Toggle 
        checked={!draft} 
        onChange={(checked) => setDraft(!checked)} 
        label="Publish now" 
      />

      <div className="flex items-center gap-3">
        <button 
          type="submit" 
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {msg && (
          <p className={`text-sm ${msg.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {msg.text}
          </p>
        )}
      </div>
    </form>
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

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-100">Your projects</h2>
          <button 
            className="text-sm rounded-lg border border-stone-700 px-2 py-1 hover:bg-stone-900" 
            onClick={handleNew}
          >
            New
          </button>
        </div>

        {loading ? (
          <p className="text-stone-400 text-sm">Loading…</p>
        ) : error ? (
          <p className="text-rose-400 text-sm">Error: {error}</p>
        ) : !projects?.length ? (
          <p className="text-stone-400 text-sm">No projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map(project => (
              <li key={project.id} className="rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-stone-100 truncate flex items-center gap-2">
                    {project.title}
                    {project.featured && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-400">
                    {project.draft ? 'Draft' : 'Published'} • {project.slug}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button 
                    className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" 
                    onClick={() => handleEdit(project)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" 
                    onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                  >
                    Preview
                  </button>
                  <button 
                    className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900 text-rose-400" 
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        {(editing || isNew) && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-100">
                {editing ? 'Edit project' : 'New project'}
              </h2>
              <button 
                className="text-xs text-stone-400 hover:text-stone-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            <ProjectForm
              key={editing?.id || 'new'}
              initial={editing}
              onSaved={handleSaved}
            />
          </>
        )}
        {!editing && !isNew && (
          <div className="text-stone-400 text-sm">
            Select a project to edit or create a new one.
          </div>
        )}
      </section>
    </div>
  )
}

/* ==================== PROJECT FORM ==================== */

function ProjectForm({ initial, onSaved }: { initial: Project | null; onSaved: () => void }) {
  const isEdit = Boolean(initial?.id)
  
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [summary, setSummary] = useState(initial?.summary || '')
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl || '')
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl || '')
  const [techStack, setTechStack] = useState((initial?.techStack || []).join(', '))
  const [tags, setTags] = useState((initial?.tags || []).join(', '))
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [draft, setDraft] = useState(initial?.draft ?? true)
  const [requiresAuth, setRequiresAuth] = useState(initial?.requiresAuth ?? false)
  const [accessRequestEnabled, setAccessRequestEnabled] = useState(initial?.accessRequestEnabled ?? false)
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
        coverImage,
        liveUrl: liveUrl || null,
        repoUrl: repoUrl || null,
        techStack: parseListInput(techStack),
        tags: parseListInput(tags),
        featured,
        draft,
        requiresAuth,
        accessRequestEnabled: requiresAuth ? accessRequestEnabled : false,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input 
        placeholder="Title" 
        value={title} 
        onChange={handleTitleChange} 
        required 
      />
      <Input 
        placeholder="Slug (my-project)" 
        value={slug} 
        onChange={setSlug} 
        required 
      />
      <Input 
        placeholder="Summary (one-liner)" 
        value={summary} 
        onChange={setSummary} 
      />

      <div className="grid grid-cols-2 gap-2">
        <Input 
          placeholder="Live URL (optional)" 
          value={liveUrl} 
          onChange={setLiveUrl} 
        />
        <Input 
          placeholder="Repo URL (optional)" 
          value={repoUrl} 
          onChange={setRepoUrl} 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-stone-300">Cover image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          disabled={uploading}
          className="text-sm text-stone-400"
        />
        {uploading && <p className="text-xs text-stone-400">Uploading…</p>}
        {coverImage && (
          <div className="relative inline-block">
            <img 
              src={coverImage} 
              alt="" 
              className="mt-2 max-h-32 rounded border border-stone-800" 
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-3 right-1 bg-black/70 rounded px-1.5 py-0.5 text-xs text-rose-400 hover:text-rose-300"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <Input 
        placeholder="Tech stack (comma-separated: React, TypeScript, Firebase)" 
        value={techStack} 
        onChange={setTechStack} 
      />
      <Input 
        placeholder="Tags (comma-separated: side-project, AI, web-app)" 
        value={tags} 
        onChange={setTags} 
      />
      
      <div className="space-y-2 pt-2 border-t border-stone-800">
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

      <div className="space-y-2 pt-2 border-t border-stone-800">
        <p className="text-xs text-stone-500">Access Control</p>
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

      <div className="flex items-center gap-3 pt-2">
        <button 
          type="submit" 
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {msg && (
          <p className={`text-sm ${msg.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {msg.text}
          </p>
        )}
      </div>
    </form>
  )
}

/* ==================== UI COMPONENTS ==================== */

function Input({ 
  placeholder, 
  value, 
  onChange, 
  required 
}: { 
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean 
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    />
  )
}

function Textarea({ 
  placeholder, 
  value, 
  rows = 4, 
  onChange 
}: { 
  placeholder?: string
  value: string
  rows?: number
  onChange: (value: string) => void 
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    />
  )
}

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
    <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-stone-600 bg-stone-800 text-emerald-500 focus:ring-emerald-500/60"
      />
      {label}
    </label>
  )
}
