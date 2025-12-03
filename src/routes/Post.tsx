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
  const [tocOpen, setTocOpen] = useState(false)

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

  // Share handler - uses native share on mobile, copy on desktop
  const handleShare = async () => {
    const shareData = {
      title: post?.title,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      // User cancelled share or error - try clipboard fallback
      if ((err as Error).name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          console.error('Failed to share:', err)
        }
      }
    }
  }

  if (loading) return <p className="text-[#9d99a9] text-sm">Loading…</p>
  if (error || !post) return <p className="text-rose-400 text-sm">Not found.</p>

  const publishedDate = post.publishedAt?.toDate() || post.createdAt.toDate()
  const readingTime = estimateReadingTime(post.markdown || '')

  return (
    <article className="space-y-8">
      {/* Back link */}
      <Link
        to="/blog"
        className="text-[#f0b429] hover:text-[#fbbf24] transition-colors text-sm inline-flex items-center gap-1"
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
        className={`relative rounded-2xl overflow-hidden ${post.coverImage ? 'py-12 px-6 md:px-10' : ''}`}
      >
        {/* Background Image */}
        {post.coverImage && (
          <>
            <div className="absolute inset-0">
              <img
                src={post.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#13111a] via-[#13111a]/90 to-[#13111a]/70" />
          </>
        )}

        {/* Content */}
        <div className={`relative space-y-4 ${post.coverImage ? 'z-10' : ''}`}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#e8e6f0]">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-[#9d99a9]">
              <svg className="w-4 h-4 text-[#f0b429]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <span className="text-[#9d99a9]/50">•</span>
            <div className="flex items-center gap-2 text-[#9d99a9]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readingTime} min read</span>
            </div>
            <span className="text-[#9d99a9]/50">•</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-[#9d99a9] hover:text-[#f0b429] transition-colors"
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
                  className="text-xs px-3 py-1 rounded-full glass text-[#9d99a9]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.header>

      {/* TOC (collapsible on all screens) */}
      {toc.length > 0 && (
        <div>
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className={`w-full card p-4 flex items-center justify-between text-left ${tocOpen ? 'rounded-b-none border-b-0' : ''}`}
          >
            <span className="text-sm font-medium text-[#9d99a9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#f0b429] to-[#fbbf24]" />
              On this page
            </span>
            <svg 
              className={`w-4 h-4 text-[#9d99a9] transition-transform ${tocOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {tocOpen && (
            <nav className="card rounded-t-none p-4 -mt-px border-t-0 space-y-2">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setTocOpen(false)}
                  className={`block text-sm transition-colors hover:text-[#f0b429] ${
                    item.level === 2 
                      ? 'text-[#9d99a9] font-medium' 
                      : 'text-[#9d99a9]/60 pl-3'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Content */}
      <div className="min-w-0">
        {rendering ? (
          <div className="text-[#9d99a9] text-sm">Rendering content…</div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="prose prose-lg prose-invert prose-pre:p-0 prose-pre:bg-transparent max-w-none
                       prose-headings:text-[#e8e6f0] prose-headings:scroll-mt-20
                       prose-p:text-[#9d99a9] prose-p:leading-relaxed
                       prose-a:text-[#f0b429] prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-[#e8e6f0] prose-code:text-[#fbbf24]
                       prose-li:text-[#9d99a9]
                       prose-blockquote:border-[#f0b429] prose-blockquote:text-[#9d99a9]
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

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-[#e8e6f0] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#f0b429] to-[#fbbf24]" />
            Related Posts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.slug}`}
                className="card p-4 group no-underline hover:no-underline hover:border-[#f0b429]/30 transition-all"
              >
                <h3 className="font-medium text-[#e8e6f0] group-hover:text-[#f0b429] transition-colors line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-[#9d99a9] mt-2">
                  {estimateReadingTime(relatedPost.markdown || '')} min read
                </p>
                {relatedPost.tags && relatedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {relatedPost.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full glass text-[#9d99a9]/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="pt-8 border-t border-white/10 flex items-center justify-between">
        <Link
          to="/blog"
          className="text-[#f0b429] hover:text-[#fbbf24] transition-colors text-sm inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-[#9d99a9] hover:text-[#e8e6f0] transition-colors text-sm inline-flex items-center gap-1"
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
