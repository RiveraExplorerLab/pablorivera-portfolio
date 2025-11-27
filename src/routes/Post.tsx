// src/routes/Post.tsx
import { useParams } from 'react-router-dom'
import { usePost } from '../hooks/useBlogPosts'
import { renderMarkdown } from '../lib/markdown'

export default function Post() {
  const { slug = '' } = useParams()
  const { data: post, loading, error } = usePost(slug)

  if (loading) return <p className="text-stone-400 text-sm">Loading…</p>
  if (error || !post) return <p className="text-rose-400 text-sm">Not found.</p>

  const publishedDate = post.publishedAt?.toDate() || post.createdAt.toDate()

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100">
          {post.title}
        </h1>
        <div className="text-xs text-stone-400">
          {publishedDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="mt-3 rounded-md ring-1 ring-stone-800 max-h-[420px] object-cover w-full"
            loading="lazy"
          />
        )}
      </header>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full border border-stone-700 text-stone-300 bg-stone-900/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.markdown || '') }}
      />
    </article>
  )
}
