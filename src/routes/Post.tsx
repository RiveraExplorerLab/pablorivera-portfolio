// src/routes/Post.tsx
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { usePost, usePosts } from '../hooks/useBlogPosts'
import { renderMarkdownAsync, estimateReadingTime } from '../lib/markdown'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function Post() {
  const { slug = '' } = useParams()
  const { data: post, loading, error } = usePost(slug)
  const { data: allPosts } = usePosts(10)
  const [renderedContent, setRenderedContent] = useState<string>('')
  const [rendering, setRendering] = useState(true)
  const [toc, setToc] = useState<TOCItem[]>([])
  const [copied, setCopied] = useState(false)

  // Extract table of contents from markdown
  const extractTOC = (markdown: string): TOCItem[] => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const items: TOCItem[] = []
    let match

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      items.push({ id, text, level })
    }

    return items
  }

  // Render markdown with syntax highlighting
  useEffect(() => {
    if (!post?.markdown) {
      setRenderedContent('')
      setRendering(false)
      setToc([])
      return
    }

    // Extract TOC
    setToc(extractTOC(post.markdown))

    setRendering(true)
    renderMarkdownAsync(post.markdown)
      .then((html) => {
        // Add IDs to headings for anchor links
        const withIds = html.replace(
          /<(h[23])>(.+?)<\/h[23]>/g,
          (_, tag, content) => {
            const id = content
              .replace(/<[^>]+>/g, '') // Remove HTML tags
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
            return `<${tag} id="${id}">${content}</${tag}>`
          }
        )
        setRenderedContent(withIds)
      })
      .finally(() => setRendering(false))
  }, [post?.markdown])

  // Get related posts (same tags, excluding current)
  const relatedPosts = useMemo(() => {
    if (!allPosts || !post) return []
    
    return allPosts
      .filter(p => p.id !== post.id)
      .filter(p => {
        if (!post.tags?.length || !p.tags?.length) return false
        return post.tags.some(tag => p.tags.includes(tag))
      })
      .slice(0, 3)
  }, [allPosts, post])

  // Copy link handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) return <p className="text-stone-400 text-sm">Loading…</p>
  if (error || !post) return <p className="text-rose-400 text-sm">Not found.</p>

  const publishedDate = post.publishedAt?.toDate() || post.createdAt.toDate()
  const readingTime = estimateReadingTime(post.markdown || '')

  return (
    <article className="space-y-8">
      {/* Back link */}
      <Link
        to="/blog"
        className="text-teal-400 hover:text-teal-300 transition-colors text-sm inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </Link>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-stone-400">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time className="gradient-text font-medium">
              {publishedDate.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-2 text-stone-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{readingTime} min read</span>
          </div>
          <span className="text-stone-700">•</span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-stone-400 hover:text-teal-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full glass text-stone-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.coverImage && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src={post.coverImage}
              alt=""
              className="w-full max-h-[480px] object-cover"
              loading="lazy"
            />
          </motion.div>
        )}
      </motion.header>

      {/* Content with TOC */}
      <div className="grid lg:grid-cols-[1fr,220px] gap-8">
        {/* Main Content */}
        <div className="min-w-0">
          {rendering ? (
            <div className="text-stone-400 text-sm">Rendering content…</div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg prose-invert prose-pre:p-0 prose-pre:bg-transparent max-w-none
                         prose-headings:text-stone-100 prose-headings:scroll-mt-20
                         prose-p:text-stone-300 prose-p:leading-relaxed
                         prose-a:text-teal-400 prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-stone-100 prose-code:text-teal-300
                         prose-li:text-stone-300
                         prose-blockquote:border-teal-500 prose-blockquote:text-stone-400
                         prose-hr:border-white/10
                         [&_.shiki]:rounded-xl [&_.shiki]:p-4 [&_.shiki]:text-sm [&_.shiki]:overflow-x-auto
                         [&_.shiki]:border [&_.shiki]:border-white/10 [&_.shiki]:my-6
                         [&_code]:text-sm [&_code]:font-mono
                         [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-white/10
                         [&_h3]:mt-8 [&_h3]:mb-3"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          )}
        </div>

        {/* Table of Contents (Desktop) */}
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <nav className="card p-4 space-y-3">
                <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                  On this page
                </h4>
                <ul className="space-y-2">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors hover:text-teal-400 ${
                          item.level === 2 
                            ? 'text-stone-300' 
                            : 'text-stone-500 pl-3'
                        }`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-white/10">
          <h2 className="text-lg font-semibold text-stone-100 mb-4">Related Posts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.slug}`}
                className="card p-4 group no-underline hover:no-underline hover:border-teal-500/30 transition-colors"
              >
                <h3 className="font-medium text-stone-100 group-hover:text-teal-400 transition-colors line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  {estimateReadingTime(relatedPost.markdown || '')} min read
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="pt-8 border-t border-white/10 flex items-center justify-between">
        <Link
          to="/blog"
          className="text-teal-400 hover:text-teal-300 transition-colors text-sm inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-stone-500 hover:text-stone-300 transition-colors text-sm inline-flex items-center gap-1"
        >
          Back to top
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </footer>
    </article>
  )
}
