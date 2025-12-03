// src/routes/Blog.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePosts } from '../hooks/useBlogPosts'
import { estimateReadingTime } from '../lib/markdown'
import type { BlogPost } from '../lib/types'
import SEO from '../components/SEO'

export default function Blog() {
  const { data: posts, loading, error } = usePosts(30)

  if (loading) return <p className="text-[#9d99a9] text-sm">Loading…</p>
  if (error) return <p className="text-rose-400 text-sm">Error: {error}</p>
  if (!posts?.length) return (
    <div className="card p-8 text-center">
      <p className="text-[#9d99a9]">Nothing here yet.</p>
      <div className="mt-4">
        <Link to="/projects" className="btn-primary">
          See projects instead →
        </Link>
      </div>
    </div>
  )

  // Split into featured (first) and rest
  const [featured, ...rest] = posts

  return (
    <>
      <SEO 
        title="Blog" 
        description="Thoughts on development, systems thinking, and building software that matters. Written by Pablo Rivera."
      />
      <div className="space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#e8e6f0] flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-[#f0b429] to-[#fbbf24]" />
          Blog
        </h1>
        <p className="text-[#9d99a9]">Notes, ideas, and progress logs.</p>
      </header>

      {/* Featured Post */}
      {featured && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          aria-label="Featured post"
        >
          <Link
            to={`/blog/${featured.slug}`}
            className="group block card overflow-hidden no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[#f0b429]/60"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {featured.coverImage ? (
                <div className="img-container img-glow h-56 md:h-72 rounded-none">
                  <img
                    src={featured.coverImage}
                    alt=""
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#13111a]/80 md:block hidden pointer-events-none" />
                </div>
              ) : (
                <div className="h-56 md:h-72 img-placeholder">
                  <span className="img-placeholder-icon text-6xl">✦</span>
                </div>
              )}
              <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2 py-1 rounded-full bg-[#f0b429]/10 text-[#f0b429] border border-[#f0b429]/20">
                    Latest
                  </span>
                  <span className="text-[#9d99a9]">
                    {estimateReadingTime(featured.markdown || '')} min read
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#e8e6f0] group-hover:text-[#f0b429] transition-colors">
                  {featured.title}
                </h2>
                {featured.summary && (
                  <p className="text-[#9d99a9] line-clamp-2">{featured.summary}</p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <time className="text-sm text-[#9d99a9]">
                    {formatDate(featured.publishedAt?.toDate() || featured.createdAt.toDate())}
                  </time>
                  {featured.tags && featured.tags.length > 0 && (
                    <div className="flex gap-2">
                      {featured.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-xs text-[#9d99a9]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.section>
      )}

      {/* Rest of Posts */}
      {rest.length > 0 && (
        <section aria-label="All posts">
          <h2 className="text-sm font-medium text-[#9d99a9] uppercase tracking-wider mb-4">
            All Posts
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post: BlogPost, i: number) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
              >
                <PostCard post={post} />
              </motion.li>
            ))}
          </ul>
        </section>
      )}
      </div>
    </>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  const readingTime = estimateReadingTime(post.markdown || '')
  const date = post.publishedAt?.toDate() || post.createdAt.toDate()

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block card overflow-hidden h-full no-underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[#f0b429]/60"
    >
      {post.coverImage ? (
        <div className="img-container img-glow aspect-video rounded-t-2xl rounded-b-none">
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-video img-placeholder rounded-t-2xl">
          <span className="img-placeholder-icon">✦</span>
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-[#9d99a9]">
          <time>{formatDateShort(date)}</time>
          <span>•</span>
          <span>{readingTime} min</span>
        </div>
        <h3 className="font-semibold text-[#e8e6f0] group-hover:text-[#f0b429] transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.summary && (
          <p className="text-sm text-[#9d99a9] line-clamp-2">{post.summary}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#9d99a9] border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
