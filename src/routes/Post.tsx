import { useParams } from 'react-router-dom'
import { usePost } from '../lib/useSupabase'
import { renderHtmlFromMd } from '../lib/renderMd'

export default function Post() {
  const { slug = '' } = useParams()
  const { data: post, loading, error } = usePost(slug)

  if (loading) return <p className="text-stone-400 text-sm">Loading…</p>
  if (error || !post) return <p className="text-rose-400 text-sm">Not found.</p>

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100">{post.title}</h1>
        <div className="text-xs text-stone-400">
          {new Date(post.published_at || post.created_at).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </div>
        {post.cover_url && (
          <img
            src={post.cover_url}
            alt=""
            className="mt-3 rounded-md ring-1 ring-stone-800 max-h-[420px] object-cover w-full"
            loading="lazy"
          />
        )}
      </header>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderHtmlFromMd(post.content_md || '') }}
      />
    </article>
  )
}