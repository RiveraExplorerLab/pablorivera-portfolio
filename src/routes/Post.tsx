// src/routes/Post.tsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { usePost } from '../hooks/useBlogPosts'
import { renderMarkdownAsync, estimateReadingTime } from '../lib/markdown'

export default function Post() {
  const { slug = '' } = useParams()
  const { data: post, loading, error } = usePost(slug)
  const [renderedContent, setRenderedContent] = useState<string>('')
  const [rendering, setRendering] = useState(true)

  // Render markdown with syntax highlighting
  useEffect(() => {
    if (!post?.markdown) {
      setRenderedContent('')
      setRendering(false)
      return
    }

    setRendering(true)
    renderMarkdownAsync(post.markdown)
      .then(setRenderedContent)
      .finally(() => setRendering(false))
  }, [post?.markdown])

  if (loading) return <p className="text-stone-400 text-sm">Loading…</p>
  if (error || !post) return <p className="text-rose-400 text-sm">Not found.</p>

  const publishedDate = post.publishedAt?.toDate() || post.createdAt.toDate()
  const readingTime = estimateReadingTime(post.markdown || '')

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          {post.title}
        </h1>
        <div className="text-xs text-stone-400 flex items-center gap-3">
          <span className="text-teal-400/80">
            {publishedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>
        {post.coverImage && (
          <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
            <img
              src={post.coverImage}
              alt=""
              className="max-h-[420px] object-cover w-full"
              loading="lazy"
            />
          </div>
        )}
      </header>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full text-stone-300"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {rendering ? (
        <div className="text-stone-400 text-sm">Rendering content…</div>
      ) : (
        <div
          className="prose prose-invert prose-pre:p-0 prose-pre:bg-transparent max-w-none
                     [&_.shiki]:rounded-lg [&_.shiki]:p-4 [&_.shiki]:text-sm [&_.shiki]:overflow-x-auto
                     [&_code]:text-sm [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      )}
    </article>
  )
}
