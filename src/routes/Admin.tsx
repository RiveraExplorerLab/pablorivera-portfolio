// src/routes/Admin.tsx
import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../providers/AuthProvider'

type PostRow = {
  id: string
  slug: string
  title: string
  summary: string | null
  content_md: string
  cover_url: string | null
  cover_path: string | null
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  owner_id?: string
}

type ProjectRow = {
  id: string
  slug: string
  name: string
  one_liner: string | null
  details_md: string | null
  cover_url: string | null
  cover_path: string | null
  links: Record<string, string> | null
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  owner_id?: string
}

export default function Admin() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<'posts' | 'projects'>('posts')

  if (loading) return <div className="text-stone-400 text-sm">Checking session…</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-100">Admin</h1>
        <button
          className="text-sm underline decoration-emerald-500/50 underline-offset-4"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </header>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-stone-800 overflow-hidden">
        <button
          onClick={() => setTab('posts')}
          className={`px-3 py-1.5 text-sm ${tab==='posts' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Posts
        </button>
        <button
          onClick={() => setTab('projects')}
          className={`px-3 py-1.5 text-sm ${tab==='projects' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Projects
        </button>
      </div>

      {tab === 'posts' ? <PostsAdmin /> : <ProjectsAdmin />}
    </div>
  )
}

/* -------------------- POSTS -------------------- */

function PostsAdmin() {
  const [rows, setRows] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<PostRow | null>(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) setError(error.message)
    setRows((data as PostRow[]) || [])
    setLoading(false)
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  async function remove(id: string, cover_path?: string | null) {
    if (!confirm('Delete this post? This will also remove its cover image.')) return
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) return alert(error.message)
    // best-effort storage cleanup
    try { await storageRemove(cover_path) } catch {}
    setRows(r => r.filter(x => x.id !== id))
    if (editing?.id === id) setEditing(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-100">Your posts</h2>
          <button className="text-sm rounded-lg border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => setEditing(null)}>
            New
          </button>
        </div>

        {loading ? (
          <p className="text-stone-400 text-sm">Loading…</p>
        ) : error ? (
          <p className="text-rose-400 text-sm">Error: {error}</p>
        ) : rows.length === 0 ? (
          <p className="text-stone-400 text-sm">No posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map(p => (
              <li key={p.id} className="rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-stone-100 truncate">{p.title}</div>
                  <div className="text-xs text-stone-400">{p.is_published ? 'Published' : 'Draft'} • {p.slug}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => setEditing(p)}>
                    Edit
                  </button>
                  <button className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => window.open(`/blog/${p.slug}`, '_blank')}>
                    Preview
                  </button>
                  <button className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => remove(p.id, p.cover_path)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-stone-100">{editing ? 'Edit post' : 'New post'}</h2>
        <PostForm
          key={editing?.id || 'new'}
          initial={editing || null}
          onSaved={() => { setEditing(null); load() }}
        />
      </section>
    </div>
  )
}

function PostForm({ initial, onSaved }: { initial: PostRow | null; onSaved: () => void }) {
  const isEdit = Boolean(initial?.id)
  const [title, setTitle] = useState(initial?.title || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [summary, setSummary] = useState(initial?.summary || '')
  const [content, setContent] = useState(initial?.content_md || '')
  const [tags, setTags] = useState((initial?.tags || []).join(', '))
  const [publ, setPubl] = useState(initial?.is_published || false)
  const [coverPath, setCoverPath] = useState<string | null>(initial?.cover_path || null)
  const coverUrl = useMemo(() => storagePublicUrl(coverPath), [coverPath])
  const [msg, setMsg] = useState<string | null>(null)

  // auto-generate slug
  useEffect(() => { if (!isEdit && title && !slug) setSlug(slugify(title)) }, [title, slug, isEdit])

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const path = await storageUpload(f)
      // optional: delete old cover if replacing
      if (coverPath) { try { await storageRemove(coverPath) } catch {} }
      setCoverPath(path)
    } catch (err: any) {
      setMsg(err.message || 'Upload failed')
    }
  }

  function toTagArray(s: string) {
    return s.split(',').map(t => t.trim()).filter(Boolean)
  }

  async function isSlugTaken(s: string) {
    if (!s) return false
    const { data } = await supabase.from('posts').select('id,slug').ilike('slug', s).limit(1)
    return (data?.length || 0) > 0 && (!initial || s !== initial.slug)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (await isSlugTaken(slug)) return setMsg('Slug already in use.')

    const payload = {
      slug,
      title,
      summary,
      content_md: content,
      cover_path: coverPath,
      cover_url: coverUrl,
      tags: toTagArray(tags),
      is_published: publ,
      published_at: publ ? new Date().toISOString() : null,
    }

    const q = isEdit
      ? supabase.from('posts').update(payload).eq('id', initial!.id)
      : supabase.from('posts').insert(payload)

    const { error } = await q
    setMsg(error ? error.message : 'Saved!')
    if (!error) onSaved()
  }

  return (
    <form onSubmit={save} className="space-y-2">
      <Input placeholder="Title" value={title} onChange={setTitle} required />
      <Input placeholder="Slug (my-post)" value={slug} onChange={setSlug} required />
      <Input placeholder="Summary" value={summary} onChange={setSummary} />
      <Textarea placeholder="Markdown content" value={content} onChange={setContent} rows={8} />

      <div className="space-y-1">
        <label className="text-sm text-stone-300">Cover image</label>
        <input type="file" accept="image/*" onChange={onPickFile} />
        {coverUrl && <img src={coverUrl} alt="" className="mt-2 max-h-32 rounded border border-stone-800" />}
      </div>

      <Input placeholder="Tags (comma-separated)" value={tags} onChange={setTags} />
      <Toggle checked={publ} onChange={setPubl} label="Publish now" />

      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save</button>
        {msg && <p className="text-sm text-stone-300 self-center">{msg}</p>}
      </div>
    </form>
  )
}

/* -------------------- PROJECTS -------------------- */

function ProjectsAdmin() {
  const [rows, setRows] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<ProjectRow | null>(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) setError(error.message)
    setRows((data as ProjectRow[]) || [])
    setLoading(false)
  }
  useEffect(() => { load() }, []) // eslint-disable-line

  async function remove(id: string, cover_path?: string | null) {
    if (!confirm('Delete this project? This will also remove its cover image.')) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) return alert(error.message)
    try { await storageRemove(cover_path) } catch {}
    setRows(r => r.filter(x => x.id !== id))
    if (editing?.id === id) setEditing(null)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-100">Your projects</h2>
          <button className="text-sm rounded-lg border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => setEditing(null)}>
            New
          </button>
        </div>

        {loading ? (
          <p className="text-stone-400 text-sm">Loading…</p>
        ) : error ? (
          <p className="text-rose-400 text-sm">Error: {error}</p>
        ) : rows.length === 0 ? (
          <p className="text-stone-400 text-sm">No projects yet.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map(p => (
              <li key={p.id} className="rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-stone-100 truncate">{p.name}</div>
                  <div className="text-xs text-stone-400">{p.is_published ? 'Published' : 'Draft'} • {p.slug}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => setEditing(p)}>
                    Edit
                  </button>
                  <button className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => window.open(`/projects/${p.slug}`, '_blank')}>
                    Preview
                  </button>
                  <button className="text-xs rounded border border-stone-700 px-2 py-1 hover:bg-stone-900" onClick={() => remove(p.id, p.cover_path)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-stone-100">{editing ? 'Edit project' : 'New project'}</h2>
        <ProjectForm
          key={editing?.id || 'new'}
          initial={editing || null}
          onSaved={() => { setEditing(null); load() }}
        />
      </section>
    </div>
  )
}

function ProjectForm({ initial, onSaved }: { initial: ProjectRow | null; onSaved: () => void }) {
  const isEdit = Boolean(initial?.id)
  const [name, setName] = useState(initial?.name || '')
  const [slug, setSlug] = useState(initial?.slug || '')
  const [oneLiner, setOneLiner] = useState(initial?.one_liner || '')
  const [details, setDetails] = useState(initial?.details_md || '')
  const [linksLive, setLinksLive] = useState(initial?.links?.live || '')
  const [linksRepo, setLinksRepo] = useState(initial?.links?.repo || '')
  const [tags, setTags] = useState((initial?.tags || []).join(', '))
  const [publ, setPubl] = useState(initial?.is_published || false)
  const [coverPath, setCoverPath] = useState<string | null>(initial?.cover_path || null)
  const coverUrl = useMemo(() => storagePublicUrl(coverPath), [coverPath])
  const [msg, setMsg] = useState<string | null>(null)

  // auto-generate slug
  useEffect(() => { if (!isEdit && name && !slug) setSlug(slugify(name)) }, [name, slug, isEdit])

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const path = await storageUpload(f)
      if (coverPath) { try { await storageRemove(coverPath) } catch {} }
      setCoverPath(path)
    } catch (err: any) {
      setMsg(err.message || 'Upload failed')
    }
  }

  async function isSlugTaken(s: string) {
    if (!s) return false
    const { data } = await supabase.from('projects').select('id,slug').ilike('slug', s).limit(1)
    return (data?.length || 0) > 0 && (!initial || s !== initial.slug)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (await isSlugTaken(slug)) return setMsg('Slug already in use.')

    const links = {} as Record<string, string>
    if (linksLive) links.live = linksLive
    if (linksRepo) links.repo = linksRepo

    const payload = {
      slug,
      name,
      one_liner: oneLiner || null,
      details_md: details || null,
      cover_path: coverPath,
      cover_url: coverUrl,
      links,
      tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      is_published: publ,
      published_at: publ ? new Date().toISOString() : null,
    }

    const q = isEdit
      ? supabase.from('projects').update(payload).eq('id', initial!.id)
      : supabase.from('projects').insert(payload)

    const { error } = await q
    setMsg(error ? error.message : 'Saved!')
    if (!error) onSaved()
  }

  return (
    <form onSubmit={save} className="space-y-2">
      <Input placeholder="Name" value={name} onChange={setName} required />
      <Input placeholder="Slug (my-project)" value={slug} onChange={setSlug} required />
      <Input placeholder="One-liner" value={oneLiner} onChange={setOneLiner} />

      <label className="text-sm text-stone-300">Project details (Markdown)</label>
      <Textarea placeholder="Write details like a README…" value={details} onChange={setDetails} rows={8} />

      <div className="space-y-1">
        <label className="text-sm text-stone-300">Cover image</label>
        <input type="file" accept="image/*" onChange={onPickFile} />
        {coverUrl && <img src={coverUrl} alt="" className="mt-2 max-h-32 rounded border border-stone-800" />}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Live URL (optional)" value={linksLive} onChange={setLinksLive} />
        <Input placeholder="Repo URL (optional)" value={linksRepo} onChange={setLinksRepo} />
      </div>

      <Input placeholder="Tags (comma-separated)" value={tags} onChange={setTags} />
      <Toggle checked={publ} onChange={setPubl} label="Publish now" />

      <div className="flex gap-2">
        <button type="submit" className="btn-primary">Save</button>
        {msg && <p className="text-sm text-stone-300 self-center">{msg}</p>}
      </div>
    </form>
  )
}

/* -------------------- inline helpers (no extra files) -------------------- */

/** Minimal slugify (lowercase, ascii-ish, spaces->dashes) */
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Storage helpers for covers (bucket must be named 'covers' and public) */
const BUCKET = 'covers'

async function storageUpload(file: File) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const name = `${crypto.randomUUID()}.${ext}`
  // upload at bucket root (not nested)
  const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return `${BUCKET}/${name}` // cover_path
}

function storagePublicUrl(cover_path?: string | null) {
  if (!cover_path) return null
  const [bucket, ...rest] = cover_path.split('/')
  const key = rest.join('/')
  const { data } = supabase.storage.from(bucket).getPublicUrl(key)
  return data.publicUrl
}

async function storageRemove(cover_path?: string | null) {
  if (!cover_path) return
  const [bucket, ...rest] = cover_path.split('/')
  const key = rest.join('/')
  await supabase.storage.from(bucket).remove([key])
}

/* -------------------- tiny UI atoms -------------------- */

function Input(props: { placeholder?: string; value: string; onChange: (v: string)=>void; required?: boolean }) {
  return (
    <input
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
      className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    />
  )
}
function Textarea(props: { placeholder?: string; value: string; rows?: number; onChange: (v: string)=>void }) {
  return (
    <textarea
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
      className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    />
  )
}
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v:boolean)=>void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-stone-300">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      {label}
    </label>
  )
}

/* Tailwind-friendly primary button class (inline here for convenience) */
declare global {
  interface HTMLElementTagNameMap {
    // no-op, keep TS happy if needed
  }
}
// If you prefer a class, replace all "btn-primary" usages with the below:
// .btn-primary { @apply rounded-lg bg-emerald-400 text-black px-4 py-2 text-sm font-medium hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/60; }