// src/routes/Post.tsx
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
      <motion.header 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          {post.title}
        </h1>
        <div className="text-sm text-stone-400 flex items-center gap-3">
          <span className="gradient-text">
            {publishedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="text-stone-600">•</span>
          <span>{readingTime} min read</span>
        </div>
        {post.coverImage && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={post.coverImage}
              alt=""
              className="max-h-[420px] object-cover w-full"
              loading="lazy"
            />
          </div>
        )}
      </motion.header>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full text-stone-300 glass"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {rendering ? (
        <div className="text-stone-400 text-sm">Rendering content…</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="prose prose-invert prose-pre:p-0 prose-pre:bg-transparent max-w-none
                     prose-headings:text-stone-100 prose-p:text-stone-300 prose-a:text-teal-400
                     prose-strong:text-stone-100 prose-code:text-teal-300
                     [&_.shiki]:rounded-xl [&_.shiki]:p-4 [&_.shiki]:text-sm [&_.shiki]:overflow-x-auto
                     [&_.shiki]:border [&_.shiki]:border-white/10 [&_.shiki]:glass
                     [&_code]:text-sm [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      )}
    </article>
  )
}
